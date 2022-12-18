const mongoose = require("mongoose");

const boardSchema = mongoose.Schema({
    title: {
        type: String,
    },
    tag: {
        type: String,
    },
    author: {
        type: String,
    },
    contents: {
        type: String,
    },
    board_date: {
         type: Date, 
         default: Date.now() 
    },
    noticeToken: {
        type:String,
    }, // 글 고유 값
    comment: [
		{
			username: String, // 댓글 작성자 이름
			content: String, // 댓글 내용
			date: { type: Date, default: new Date() }, // 작성 시간
		},
	], // 댓글
});

const Board = mongoose.model("Board", boardSchema);
module.exports = { Board }