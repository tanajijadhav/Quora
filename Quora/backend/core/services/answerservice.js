var ObjectID = require('mongodb').ObjectID;

const rs = require("./../commons/responses");
const utils = require("./../commons/utils");
let producer = require('./../commons/kafkarpc');
producer = producer.getInstance();
let questionModel = require("../models/questionmodel")
let answerModel = require("../models/answermodel")
let topicModel = require("../models/topicmodel")
let userModel = require("../models/usermodel")
let upvoteModel = require("../models/answerupvotesmodel")
let downvoteModel = require("../models/answerdownvotesmodel")
let answerBookmarkModel = require("../models/answerbookmarkmodel")

let service = {
    create: (...args) => {
        return new Promise(function (resolve, reject) {
            try {
                let _session = args[0] || {};
                let body = args[1] || {};
                // console.log("Body\n",body)
                answerModel.findOne({userId:_session.userId,questionId:body.questionId})
                .then((response) => {
                    if (response === null){
                        let answerCreationParams = {}
                        answerCreationParams.userId = _session.userId
                        answerCreationParams.questionId = body.questionId
                        answerCreationParams.answerText = body.answerText
                        answerCreationParams.isAnonymous = body.isAnonymous
                        let creationAnswerQuery = new answerModel(answerCreationParams)
                        creationAnswerQuery.save().then(response => {
                            return resolve(response);
                        }).catch(reject);
                    }
                    else{
                        return reject({
                            message: "User has already answered the same question.",
                            code: "USER_HAS_ANWSERED_SAME_QUESTION"
                        })
                    }
                }).catch(reject);
            } catch (e) {
                console.error(e)
                reject(e);
            }
        });
    },
    upordownvote : (...args) => {
        console.log("Idar")
        return new Promise(function (resolve, reject) {
            try {
                let _session = args[0] || {};
                let body = args[1] || {};
                let answerId = body.answerId
                
                answerModel.findOne({answerId:answerId}).then(async (answerObj) => {
                    if ("isUpvote" in body){
                        let isUpvote = body.isUpvote
                        console.log("Upvote k if me")
                        if(isUpvote) {
                            let upvoteObj = new upvoteModel({userId:_session.userId,answerId:answerId})
                            upvoteObj.save().then(async (response) => {
                                answerObj.upvotes += 1
                                console.log("upated the upvote",answerObj.upvotes)
                                answerObj.save().then((response) =>{
                                    console.log("returning")
                                    return resolve(response);
                                }).catch(reject);
                            }).catch(reject);
                        }
                        else{
                            console.log("Upvote k else me")
                            upvoteModel.remove({userId:_session.userId,answerId:answerId}).then(async (response) => {
                                if(answerObj.upvotes > 0){
                                    console.log("reducing upvotes",answerObj.upvotes)
                                    answerObj.upvotes -= 1
                                    console.log("upated the upvote",answerObj.upvotes)
                                }
                                answerObj.save().then((response) =>{
                                    console.log("returning")
                                    return resolve(response);
                                }).catch(reject);
                            }).catch(reject);
                        }
                    }
                    else{
                        let isDownvote = body.isDownvote
                        if(isDownvote){
                            console.log("downvote k if me")
                            let downvoteObj = new downvoteModel({userId:_session.userId,answerId:answerId})
                            downvoteObj.save().then(async (response) => {
                                answerObj.downvotes += 1
                                console.log("upated the downvote",answerObj.downvotes)
                                answerObj.save().then((response) =>{
                                    console.log("returning")
                                    return resolve(response);
                                }).catch(reject);
                            }).catch(reject);
                        }
                        else{
                            console.log("downvote k else me")
                            downvoteModel.remove({userId:_session.userId,answerId:answerId}).then(async (response) => {
                                if(answerObj.downvotes > 0){
                                    answerObj.downvotes -= 1
                                    console.log("upated the downvote",answerObj.downvotes)
                                }
                                answerObj.save().then((response) =>{
                                    console.log("returning")
                                    return resolve(response);
                                }).catch(reject);
                            }).catch(reject);
                        }
                    }
                }).catch(reject);
            } catch (e) {
                console.error(e)
                reject(e);
            }
        });
    },
    answerBookmark : (...args) => {
        return new Promise(function (resolve, reject) {
            try {
                let _session = args[0] || {};
                let body = args[1] || {};
                let isBookmark = body.isBookmark
                let answerId = body.answerId
                if(isBookmark) {
                    answerModel.findOne({answerId:answerId}).then((answerObj) => {
                        let answerBookmarkObj = new answerBookmarkModel({userId:_session.userId,answerId:answerId})
                        answerBookmarkObj.save().then(response => {
                            answerObj.bookmarkedBy += 1
                            answerObj.save().then(response => {
                                return resolve(response);
                            }).catch(reject);
                        }).catch(reject);
                    }).catch(reject);
                }
                else{
                    answerModel.findOne({answerId:answerId}).then((answerObj) => {
                        let answerBookmarkObj = answerBookmarkModel.remove({userId:_session.userId,answerId:answerId}).then((response) =>{
                            if(answerObj.bookmarkedBy > 0){
                                answerObj.bookmarkedBy -= 1
                            }
                            answerObj.save().then(response => {
                                return resolve(response);
                            }).catch(reject);
                        }).catch(reject);
                    }).catch(reject);
                }
            } catch (e) {
                console.error(e)
                reject(e);
            }
        });
    },
    answerComments : (...args) => {
        return new Promise(function (resolve, reject) {
            try {
                let _session = args[0] || {};
                let body = args[1] || {};
                let answerId = body.answerId
                let comments = body.comments
                answerModel.findOne({answerId:answerId}).then((answerObj) => {
                    answerObj.comments = comments
                    answerObj.save().then((response) => {
                        console.log(response);
                        return resolve(response);
                    }).catch(reject);
                }).catch(reject);
            }
            catch (e) {
                console.error(e)
                reject(e);
            }
        });
    },
    read: (...args) => {
        return new Promise(function (resolve, reject) {
        
        });
    },
    update: (...args) => {
        return new Promise(function (resolve, reject) {
            let _session = args[0] || {};
            let body = args[1] || {};
            console.log("body",body)
            let answerId = body.answerId
            let answerText = body.answerText || null;
            let isAnonymous = body.isAnonymous || false
            answerModel.findOneAndUpdate({answerId:answerId},{answerText:answerText,isAnonymous:isAnonymous})
            .then((answerObj) => {
                return resolve(answerObj)
            }).catch(reject);
        });
    },
    delete: (...args) => {
        return new Promise(function(resolve, reject) {
            
        });
    }
}
let router = {
    create: (req, res, next) => {
        let successCB = (data) => {
            res.json({
                result: "success",
                response: [{
                    message: "Answer Created Successfully",
                    code: "CREATED"
                }]
            });
            producer.fire({
                topic: 'counts',
                type: 'newanswer',
                payload: {
                    createdAt: Date.now()
                },
                partition: 0
            })
        };
        service.create(req.user, req.body).then(successCB, next);
    },
    upordownvote : (req, res, next) => {
        let successCB = (data) => {
            res.json({
                result: "success",
                response: [{
                    message: "Answer upvoted or downvoted",
                    code: "UPDATED"
                }]
            })
        };
        service.upordownvote(req.user, req.body).then(successCB, next);
    },
    answerBookmark : (req, res, next) => {
        let successCB = (data) => {
            res.json({
                result: "success",
                response: [{
                    message: "Answer bookmarked or unbookmarked",
                    code: "UPDATED"
                }]
            })
        };
        service.answerBookmark(req.user, req.body).then(successCB, next);
    },
    answerComments : (req, res, next) => {
        let successCB = (data) => {
            res.json({
                result: "success",
                response: [{
                    message: "Commented in Answer",
                    code: "UPDATED"
                }]
            })
            producer.fire({
                topic: 'counts',
                type: 'newcomment',
                payload: {
                    createdAt: Date.now()
                },
                partition: 0
            })
        };
        service.answerComments(req.user, req.body).then(successCB, next);
    },
    read: (req, res, next) => {
        let successCB = (data) => {
            res.json({
                result: "success",
                response: [{
                    message: "Answer Read Successfully",
                    code: "READ"
                }],
                data: data
            })
        };
        service.read(req.user, req.params.questionId).then(successCB, next);
    },
    update: (req, res, next) => {
        let successCB = (data) => {
            res.json({
                result: "success",
                response: [{
                    message: "Answer Updated Successfully",
                    code: "UPDATED"
                }]
            })
        };
        service.update(req.user,req.body).then(successCB, next);
    },
    delete: (req, res, next) => {
        let successCB = (data) => {
            res.json({
                result: "success",
                response: [{
                    message: "Answer deleted Successfully",
                    code: "Deleted"
                }]
            })
        };
        service.delete(req.user, req.params.userId, req.body).then(successCB, next);
    }
};
module.exports.service = service;
module.exports.router = router;