const mongoose = require("mongoose");

const {Schema} = mongoose;
const boardSchema = new Schema({
    boardId:{
        type : Number,
        required : true,
        unique : true
    },
    title : {
        type: String, 
    },
    date : {
        type: Number
    },
    memo : {
        type: String
    },
    name :{
        type: String,
    },
    password : {
        type: String,
    },
    date : {
        type: Date
    }
})

module.exports = mongoose.model("Boards", boardSchema)