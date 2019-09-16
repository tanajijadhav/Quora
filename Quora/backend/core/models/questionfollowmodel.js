var uuid = require('uuid');
const utils = require("./../commons/utils");
let mongoose = require('mongoose')

let questionFollowSchema = new mongoose.Schema({
    questionFollowId : {
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
    questionId : {
        type: String,
        required: true,
        trim :true,
    },
},
{
    timestamps: true
});

module.exports = mongoose.model('questionfollow', questionFollowSchema)
