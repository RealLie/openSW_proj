const { User } = require("../models/User");

let auth = (req, res, next) => {
    let token = req.cookies.x_auth;

    User.findByToken(token)
        .then((user) => {
            if (!user) {
                return res.redirect('/');
            }
            req.token = token;
            req.user = user;
            next();
        })
        .catch((err) => {
            // 인증 실패
            // 유효시간이 초과된 경우
            if (error.name === "TokenExpiredError") {
                return res.status(419).json({
                    code: 419,
                    message: "토큰이 만료되었습니다.",
                });
            }
            // 토큰의 비밀키가 일치하지 않는 경우
            if (error.name === "JsonWebTokenError") {
                return res.status(401).json({
                    code: 401,
                    message: "유효하지 않은 토큰입니다.",
                });
            }
        });
};
  

module.exports = { auth };