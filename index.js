const express = require('express');
const app = express();
const nunjucks = require("nunjucks");
const bodyParser = require('body-parser')
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const { User } = require("./models/User");
const { auth } = require("./middleware/auth");
const { Board } = require('./models/Board');
const cors = require("cors");
const ejs = require('ejs');
const port = 8080;


// allows you to ejs view engine.
app.set('view engine', 'ejs');
app.set('views', './views');

nunjucks.configure('views',{
  express:app,
})

app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
app.use(cookieParser());

app.use(express.static(__dirname + ''));

app.use(
  cors({
    origin: 'http://localhost:8080',
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true, //도메인이 다른경우 서로 쿠키등을 주고받을때 허용해준다고 한다
  })
);

mongoose.set('strictQuery', true);
mongoose
  .connect(
    "mongodb+srv://skm99086:rmsdud13@cluster0.adhcz0o.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
    }
  )
  .then(() => console.log("DB connected"))
  .catch((err) => console.log(err));

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

app.get('/index', auth, (req, res) => {
  if(req.token) {
    return res.render('index', req.body);
} else {
    return res.sendFile(__dirname + '/index.html');
}
});

app.get('/howto', auth, async (req, res) => {
  const result = req.body
  if(req.token) {
      return res.render('howto', {list: result});
  }
})
app.get('/login', function(req, res) {
  res.sendFile(__dirname + '/login.html')
});


app.get('/signup', function (req, res) {
  res.sendFile(__dirname + '/signup.html')
})

app.get('/newquestion', auth, (req, res)=>{
  const user = req.body
  if(req.token) {
    return res.render('newquestion', {user:user});
} else {
    return res.sendFile(__dirname + '/login.html');
}
})

app.get('/question', auth, (req, res)=>{
  const user = req.body
  if(req.token) {
    return res.render('question', {user:user});
} else {
    return res.sendFile(__dirname + '/login.html');
}
})

app.use('/css', express.static('css'));

app.post("/add", (req, res) => {
  //회원가입을 할때 필요한것
  //post로 넘어온 데이터를 받아서 DB에 저장해준다
  const user = new User(req.body);
  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err });
    return res.redirect('/login.html');
  });
});

app.post("/logintry", (req, res) => {
  //로그인을할때 아이디와 비밀번호를 받는다
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) {
      return res.json({
        loginSuccess: false,
        message: "존재하지 않는 아이디입니다.",
      });
    }
    user
    .comparePassword(req.body.password)
    .then((isMatch) => {
      if (!isMatch) {
        return res.json({
          loginSuccess: false,
          message: "비밀번호가 일치하지 않습니다",
        });
      }
    //비밀번호가 일치하면 토큰을 생성한다
    //jwt 토큰 생성하는 메소드 작성
        user
          .generateToken()
          .then((user) => {
            res
              .cookie("x_auth", user.token)
              .render('index', req.body)
          })
          .catch((err) => {
            res.status(400).send(err);
          });
      })
      .catch((err) => res.json({ loginSuccess: false, err }));

  });

});

//auth 미들웨어를 가져온다
//auth 미들웨어에서 필요한것 : Token을 찾아서 검증하기
app.get("/auth", auth, (req, res) => {
  //auth 미들웨어를 통과한 상태 이므로
  //req.user에 user값을 넣어줬으므로
  res.status(200).json({
    _id: req._id,
    isAdmin: req.user.role === 09 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    nickName: req.user.nickName,
    role: req.user.role,
    image: req.user.image,
  });
});

//user_id를 찾아서(auth를 통해 user의 정보에 들어있다) db에있는 토큰값을 비워준다
app.get("/logout", auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
    if (err) return res.json({ success: false, err });
    res.clearCookie("x_auth");
    return res.redirect("index.html");
  });
});

app.post("/write", (req, res) => {
  const board = new Board(req.body);
  board.save((err, BoardInfo) => {
    if (err) return res.json({ success: false, err });
    return res.render('howto');
  });
});

app.post('/comment', async (req, res) => {
	let user = await User.findOne({ token: req.body.token }); // 댓글 작성할 유저
	let notice = await Board.findOne({ noticeToken: req.body.noticeToken });

	notice.comment.push({
		// 가져온 notice 객체 ( find로 찾은 notice는 _id가 존재하며, 스키마의 객체입니다. )
		// 따라서 이러한 문법을 복잡한 update query 없이 사용할 수 있습니다.
		username: user.name,
		content: req.body.content,
	});
	try {
		await notice.save(); // 가져오고 수정한 notice를 다시 save합니다.
		return res.status(200).json({ message: 'success!' });
	} catch (e) {
		return res.status(500).json({ message: 'Save Fail!' });
	}
});