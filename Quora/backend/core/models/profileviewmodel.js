let mongoose = require('mongoose')
let profileViewSchema = new mongoose.Schema({
    feature: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    timestamp: {
        type: Date,
        required: true,
    },
    count: {
        type: Number,
        required: true,
        default: 0,
    },
    frequency: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    userId: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
})
profileViewSchema.pre('save', function (next) {
    let now = Date.now()
    this.updatedAt = now
    if (!this.createdAt) {
        this.createdAt = now
    }
    next()
})
module.exports = mongoose.model('profileview', profileViewSchema)