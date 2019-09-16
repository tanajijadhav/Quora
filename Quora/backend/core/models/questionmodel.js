var uuid = require('uuid');
const utils = require("./../commons/utils");
let mongoose = require('mongoose')
let topicSchema = require('./topicmodel');
let userSchema = require('./usermodel')

let questionSchema = new mongoose.Schema({
    questionId : {
        type: String,
        required: true,
        trim :true,
        default : uuid.v1,
        unique: true,
    },
    questionText: {
        type: String,
        required: true,
        trim :true,
    },
    userId : {
        type: String,
        required: true,
        trim :true,
    },
    followers : {
        type : Number,
        default : 0
    },
    topicsId : [String],
},
{
    timestamps: true
});

module.exports = mongoose.model('question', questionSchema)