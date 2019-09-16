var uuid = require('uuid');
const utils = require("./../commons/utils");
let mongoose = require('mongoose')
let userSchema = require('./usermodel')

let answerDownvoteSchema = new mongoose.Schema({
    answerdownvoteId : {
        type: String,
        required: true,
        trim :true,
        default : uuid.v1,
        unique: true,
    },
    userId : {
        type: String,
        required: true,
        trim :true,
    },
    answerId : {
        type: String,
        required: true,
        trim :true,
    },
},
{
    timestamps: true
});

module.exports = mongoose.model('answerdownvote', answerDownvoteSchema)
