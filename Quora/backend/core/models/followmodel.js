var uuid = require('uuid');
let mongoose = require('mongoose')
let followSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        default : uuid.v1,
    },
    following: {
        type: String,
        required: true,
        trim: true,
    },
    followingBack: {
        type: Boolean,
        required: true,
        trim: true,
        default : false
    },
    createdAt: {
        type: Date,
    },
    updatedAt: {
        type: Date,
    }
});
followSchema.pre('save', function (next) {
    let now = Date.now()
    this.updatedAt = now
    if (!this.createdAt) {
        this.createdAt = now
    }
    next()
})

module.exports = mongoose.model('follow', followSchema)