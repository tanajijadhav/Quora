var uuid = require('uuid');
const utils = require("./../commons/utils");
let mongoose = require('mongoose')
let userSchema = require('./usermodel')

let answerSchema = new mongoose.Schema({
    answerId : {
        type: String,
        required: true,
        trim :true,
        default : uuid.v1,
        unique: true,
    },
    answerText: {
        type: String,
        required: true,
        trim :true,
    },
    userId : {
        type: String,
        required: true,
        trim :true,
    },
    questionId : {
        type: String,
        required: true,
        trim :true,
    },
    isAnonymous : {
        type: Boolean,
        default:false
    },
    upvotes : {
        type : Number,
        default : 0
    },
    downvotes : {
        type : Number,
        default : 0
    },
    bookmarkedBy : {
        type : Number,
        default : 0
    },
    noOfTimesviewed : {
        type : Number,
        default : 0
    },
    comments : {
        type : Object,
        default : {}
    }
},
{
    timestamps: true
});

module.exports = mongoose.model('answer', answerSchema)
