var uuid = require('uuid');
let mongoose = require('mongoose')
var questionNotificationSchema = new mongoose.Schema({
    userId: 'string',
    firstName: 'string',
    lastName: 'string',
    question: 'string',
    questionId: 'string'

});
let notificationModel = new mongoose.Schema({
    notificationId: {
        type: String,
        required: true,
        default : uuid.v1,
        trim: true,
        unique: true,
    },
    notification: {
        type: String,
        required: true,
        trim: true,
    },
    userId : {
        type: String,
        required: true,
        trim: true,
    },
    read : {
        type: Boolean,
        required: true,
    },
    question: {
        type: questionNotificationSchema,
    },
    createdAt: {
        type: Date,
    },
    updatedAt: {
        type: Date,
    }
});
notificationModel.pre('save', function (next) {
    let now = Date.now()
    this.updatedAt = now
    if (!this.createdAt) {
        this.createdAt = now
    }
    next()
});
module.exports = mongoose.model('notification', notificationModel)