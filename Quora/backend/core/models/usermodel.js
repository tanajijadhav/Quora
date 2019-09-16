var uuid = require('uuid');
let mongoose = require('mongoose')
var educationSchema = new mongoose.Schema({
    school: 'string',
    concentration: 'string',
    secondaryConcentration: 'string',
    degreeType: 'string',
    graduationYear: {
        type: String,
        minlength: 4,
        maxlength: 4,
    }

});
var employmentSchema = new mongoose.Schema({
    position: 'string',
    company: 'string',
    startYear: {
        type: String,
        minlength: 4,
        maxlength: 4,
    },
    endYear: {
        type: String,
        minlength: 4,
        maxlength: 4,
    },
    current: 'boolean'

});
var locationSchema = new mongoose.Schema({
    location: 'string',
    startYear: {
        type: String,
        minlength: 4,
        maxlength: 4,
    },
    endYear: {
        type: String,
        minlength: 4,
        maxlength: 4,
    },
    current: 'boolean'

});
var topicSchema = new mongoose.Schema({
    topicId : 'string',
    topicText: 'string',
});
var languageSchema = new mongoose.Schema({
    language: 'string',
});
let userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    createdAt: {
        type: Date,
    },
    updatedAt: {
        type: Date,
    },
    userId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    displayId: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    profileCredential: {
        type: String,
        trim: true,
        default : null,
    },
    description: {
        type: String,
        trim: true,
    },
    followers: {
        type: Number,
    },
    following: {
        type: Number,
    },
    employment: [employmentSchema],
    education: [educationSchema],
    location: [locationSchema],
    topic: [topicSchema],
    language: [languageSchema]
})
userSchema.pre('save', function (next) {
    let now = Date.now()
    this.updatedAt = now
    if (!this.createdAt) {
        this.createdAt = now
    }
    next()
})
module.exports = mongoose.model('user', userSchema)