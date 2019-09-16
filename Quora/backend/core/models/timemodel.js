let mongoose = require('mongoose')
let timeSchema = new mongoose.Schema({
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
})
timeSchema.pre('save', function (next) {
    let now = Date.now()
    this.updatedAt = now
    if (!this.createdAt) {
        this.createdAt = now
    }
    next()
})
module.exports = mongoose.model('timeanalysis', timeSchema)