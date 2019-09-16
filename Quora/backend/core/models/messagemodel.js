var uuid = require('uuid');
let mongoose = require('mongoose')
let messageSchema = new mongoose.Schema({
    conversationId: {
        type: String,
        required: true,
        default : uuid.v1,
        trim: true,
        unique: true,
    },
    from: {
        type: String,
        required: true,
        trim: true,
    },
    to: {
        type: String,
        required: true,
        trim: true,
    },
    message: {
        type: String,
        required: true,
        trim: true,
    },
    createdAt: {
        type: Date,
    },
    updatedAt: {
        type: Date,
    }
});
messageSchema.pre('save', function (next) {
    let now = Date.now()
    this.updatedAt = now
    if (!this.createdAt) {
        this.createdAt = now
    }
    next()
})

module.exports = mongoose.model('message', messageSchema)