var ObjectID = require('mongodb').ObjectID;

const rs = require("./../commons/responses");
const utils = require("./../commons/utils");
let producer = require('./../commons/kafkarpc');
producer = producer.getInstance();
let questionModel = require("../models/questionmodel")
let answerModel = require("../models/answermodel")
let userModel = require("../models/usermodel")
let topicModel = require("../models/topicmodel")
let answerUpvotesModel = require("../models/answerupvotesmodel")
let answerDownvotesModel = require("../models/answerdownvotesmodel")
let answerBookmarkModel = require("../models/answerbookmarkmodel")
let questionFollowModel = require("../models/questionfollowmodel")
let userFollowModel = require("../models/followmodel")


let questionCommonAttributes = (_session,questionObj) => {
    return new Promise(async function (resolve, reject) {
        let temp = {}
        temp["questionId"] = questionObj.questionId
        temp["questionText"] = questionObj.questionText
        temp['userIsFollowingTheQuestion'] = false
        temp["createdAt"] = questionObj.createdAt
        temp["updatedAt"] = questionObj.updatedAt
        temp["followers"] = questionObj.followers
        await questionFollowModel.findOne({userId:_session.userId,questionId:questionObj.questionId}).then((questionFollowObj) => {
            if(questionFollowObj !== null){
                temp['userIsFollowingTheQuestion'] = true
            }
        })
        temp["noOfAnswers"] = 0
        await answerModel.find({questionId:questionObj.questionId}).then((response) => {
            temp["noOfAnswers"] = response.length
        })
        return resolve(temp)
    });
}

let answerCommonAttributes = (_session,answerObj) => {
    return new Promise(async function (resolve, reject) {
        let temp_answer = {}
        temp_answer['answerId'] = answerObj.answerId
        temp_answer['answerText'] = answerObj.answerText
        temp_answer['answererId'] = answerObj.userId
        temp_answer['isAnonymous'] = answerObj.isAnonymous
        temp_answer['createdAt'] = answerObj.createdAt
        temp_answer['upvotes'] = answerObj.upvotes
        temp_answer['downvotes'] = answerObj.downvotes
        temp_answer['noOfTimesViewed'] = answerObj.noOfTimesviewed
        temp_answer['answererName'] = null
        temp_answer['profileCredential'] = null
        temp_answer['userUpvoted'] = false
        temp_answer['userDownvoted'] = false
        temp_answer['userBookmarked'] = false
        temp_answer['comments'] = answerObj.comments
        temp_answer['userIsFollowingAnswerer'] = false

        await userFollowModel.findOne({userId:_session.userId,following:answerObj.userId}).then((userFollowObj)=>{
            if(userFollowObj !== null){
                temp_answer['userIsFollowingAnswerer'] = true
            }
        });
        await answerUpvotesModel.findOne({userId:_session.userId,answerId:answerObj.answerId}).then((answerUpvoteObj)=>{
            if(answerUpvoteObj !== null){
                temp_answer['userUpvoted'] = true
            }
        });
        await answerDownvotesModel.findOne({userId:_session.userId,answerId:answerObj.answerId}).then((answerDownvoteObj)=>{
            if(answerDownvoteObj !== null){
                temp_answer['userDownvoted'] = true
            }
        });
        await answerBookmarkModel.findOne({userId:_session.userId,answerId:answerObj.answerId}).then((answerBookmarkObj)=>{
            if(answerBookmarkObj !== null){
                temp_answer['userBookmarked'] = true
            }
        });
        await userModel.findOne({userId:answerObj.userId}).then((answererObj)=>{
            // console.log("answerObj\n",answererObj)
            if (answererObj !== null){
                temp_answer['answererName'] = answererObj.firstName + " "+answererObj.lastName
                temp_answer['profileCredential'] = answererObj.profileCredential
            }
        })
        return resolve(temp_answer)
    });
}

let answersPerQuestion = async (_session,questionId,single=false) => {
    return new Promise(function (resolve, reject) {
        let answer_output = []
        answerModel.find({questionId:questionId}).sort('-createdAt').then(async (answerObjs) =>{
            if(answerObjs.length > 0){  
                let answerObjLength = answerObjs.length;    
                if(single){
                    answerObjLength = 1; // to handle single answer and question for UserFeed API
                }          
                for(let index=0;index<answerObjLength;index++){
                    let temp_answer = await answerCommonAttributes(_session,answerObjs[index])
                    answer_output.push(temp_answer)
                    answerObjs[index].noOfTimesviewed += 1;
                    await answerObjs[index].save();
                }
                resolve(answer_output);
            }   
            else{
                resolve(answer_output);
            }
        }).catch((errors) => {
            return reject(errors);
        })
    })
}

let service = {
    create: (...args) => {
        return new Promise(async function (resolve, reject) {
            try {
                let _session = args[0] || {};
                let body = args[1] || {};
                let question_body = {}
                let questionText = body.questionText || "";
                let topics = body.topics || [];
                let questionObjQuery = new questionModel({userId:_session.userId,questionText:questionText,topicsId:topics});
                questionObjQuery.save().then(questionObj => {
                    let questionFollowObj = new questionFollowModel({userId:_session.userId,questionId:questionObj.questionId})
                    questionFollowObj.save().then(response => {
                        questionObj.followers += 1
                        questionObj.save().then(response => {
                            return resolve(response.questionId);
                        }).catch(reject);
                    }).catch(reject);
                }).catch(reject);
                
            } catch (e) {
                console.error(e)
                return reject(e);
            }
        });
    },
    read: (...args) => {
        return new Promise(function (resolve, reject) {
            try {
                let output = {}
                let answer = []
                let _session = args[0] || {};
                let questionId = args[1] || null;
                let body = {};
                // body.questionId = mongoose.Types.ObjectId(questionId);
                body.questionId = questionId;
                // console.log("----body----",_session);

                questionModel.findOne(body).then(async (questionObj) => {
                    if (!!questionObj){
                        output['userId'] = _session.userId
                        output['userName'] = null
                        output['profileCredential'] = null
                        output['questionId'] = questionObj.questionId
                        output['questionText'] = questionObj.questionText
                        output['followersCount'] = questionObj.followers
                        output['questionerId'] = questionObj.userId
                        output['topics'] = []
                        output['userIsFollowingTheQuestion'] = false

                        await userModel.findOne({userId:_session.userId}).then((userObj)=>{
                            // console.log("answerObj\n",answererObj)
                            if (userObj !== null){
                                output['userName'] =userObj.firstName + " "+userObj.lastName 
                                output['profileCredential'] = userObj.profileCredential
                            }
                        })

                        if (questionObj.topicsId.length > 0){
                            for (let topicIndex=0;topicIndex<questionObj.topicsId.length;topicIndex++){
                                await topicModel.findOne({topicId:questionObj.topicsId[topicIndex]}).then((topicObj) =>{
                                    output['topics'].push({"topicId":topicObj.topicId,"topicText":topicObj.topicText})
                                })
                            }
                        }
                        await questionFollowModel.findOne({userId:_session.userId,questionId:questionObj.questionId}).then((questionFollowObj) => {
                            if(questionFollowObj !== null){
                                output['userIsFollowingTheQuestion'] = true
                            }
                        })

                        //checking if user has awered the question
                        await answerModel.findOne({questionId:questionId,userId:_session.userId}).then(async (answerObj)=>{
                            output['userHasAnswered'] = true
                            if (answerObj === null){
                                output['userHasAnswered'] = false
                            }
                        }).catch((errors) => {
                            console.error(errors)
                            return reject(errors);
                        })
                        output['answers'] = await answersPerQuestion(_session,questionId)
                        return resolve(output);
                    }
                    else{
                        return reject(rs.notfound);
                    }
                }).catch((errors) => {
                    console.error(errors)
                    return reject(errors);
                })

            } catch (e) {
                console.error(e)
                return reject(e);
            }
        });
    },
    questionFollow : (...args) => {
        return new Promise(function (resolve, reject) {
            try {
                let _session = args[0] || {};
                let body = args[1] || {};
                let isFollow = body.isFollow
                let questionId = body.questionId
                if(isFollow) {
                    questionModel.findOne({questionId:questionId}).then((questionObj) => {
                        let questionFollowObj = new questionFollowModel({userId:_session.userId,questionId:questionId})
                        questionFollowObj.save().then(response => {
                            questionObj.followers += 1
                            questionObj.save().then(response => {
                                return resolve(response);
                            }).catch(reject);
                        }).catch(reject);
                    }).catch(reject);
                }
                else{
                    questionModel.findOne({questionId:questionId}).then((questionObj) => {
                        let questionFollowObj = questionFollowModel.remove({userId:_session.userId,questionId:questionId}).then((response) =>{
                            if(questionObj.followers > 0){
                                questionObj.followers -= 1
                            }
                            questionObj.save().then(response => {
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
    userFeedList : (...args) => {
        return new Promise(async function (resolve, reject) {
            try {
                let output = []
                let _session = args[0] || {};
                console.log("User id\n",_session.userId)
                let params = args[1] || 1;
                let page_number = params['page']
                let topic = params['topic']
                let page_limit = 20
                let pagination_end_index = page_number * page_limit
                let pagination_start_index = pagination_end_index - page_limit
                /* pagination logic */
                
                let topicIdList = []
                if(topic === null){
                    await userModel.findOne({userId:_session.userId})
                    .then((userObj) => {
                        console.log("---user topics---\n",userObj) //vinit fix
                        for(let index=0;index<userObj.topic.length;index++){
                            console.log(userObj.topic[index])
                            topicIdList.push(userObj.topic[index].topicId)
                        }
                    }).catch(reject);
                }
                else{
                    topicIdList.push(topic)
                }

                console.log("List of topic ids---\n",topicIdList)

                let dbQuery = {}
                if(topicIdList.length > 0 ){
                    dbQuery['topicsId'] = {"$in":topicIdList}
                }   

                questionModel.find(dbQuery).sort('-createdAt').skip(pagination_start_index).limit(page_limit)
                .then(async (questionObjs) => {
                    console.log("Lit of questionObjs-------\n",questionObjs)
                    for(let index=0;index<questionObjs.length;index++){
                        let answerObj = await answersPerQuestion(_session,questionObjs[index].questionId,true)
                        if(answerObj.length > 0){
                            let temp = {}
                            temp["questionId"] = questionObjs[index].questionId
                            temp["questionText"] = questionObjs[index].questionText
                            await answerModel.findOne({questionId:questionObjs[index].questionId,userId:_session.userId}).then(async (answerObj)=>{
                                temp['userHasAnswered'] = true
                                if (answerObj === null){
                                    temp['userHasAnswered'] = false
                                }
                            }).catch((errors) => {
                                console.error(errors)
                                return reject(errors);
                            })
                            let answer = answerObj[0];
                            temp = Object.assign(temp,answer)
                            output.push(temp)
                        }
                    }
                    return resolve(output)
                }).catch(reject);
            }catch (e) {
                console.error(e)
                return reject(e);
            }
        })
    },
    userQuestionList : (...args) => {
        return new Promise(function (resolve, reject) {
            try {
                let output = []
                let _session = args[0] || {};
                let params = args[1] || {};
                let page_number = params['page']
                let page_limit = 20
                let pagination_end_index = page_number * page_limit
                let pagination_start_index = pagination_end_index - page_limit

                questionModel.find({userId:_session.userId}).sort('-createdAt').select({_id:0,"__v":0,topicsId:0}).skip(pagination_start_index).limit(page_limit)
                .then(async (questionObjs) => {
                    // console.log(questionObjs)
                    // output["noOfQuestions"] = questionObjs.length;
                    for(let index=0;index<questionObjs.length;index++){
                        let questionObj = questionObjs[index]
                        let temp = await questionCommonAttributes(_session,questionObj)
                        console.log(temp)
                        output.push(temp)
                    }
                    return resolve(output)
                }).catch(reject);
            }
            catch (e) {
                console.error(e)
                return reject(e);
            }
        });
    },
    userAnswerList : (...args) => {
        return new Promise(function (resolve, reject) {
            try {
                let output = []
                let _session = args[0] || {};
                let params = args[1] || {};
                let page_number = params['page']
                let page_limit = 20
                let pagination_end_index = page_number * page_limit
                let pagination_start_index = pagination_end_index - page_limit

                answerModel.find({userId:_session.userId}).sort('-createdAt').skip(pagination_start_index).limit(page_limit)
                .then(async (answerObjs) => {
                    for(let index=0;index<answerObjs.length;index++){
                        let temp = await answerCommonAttributes(_session,answerObjs[index])
                        await questionModel.findOne({questionId:answerObjs[index].questionId})
                        .then((questionObj) => {
                            temp["questionId"] = questionObj.questionId
                            temp["questionText"] = questionObj.questionText
                        }).catch(reject);
                        output.push(temp)
                    }
                    return resolve(output)
                }).catch(reject);
            }
            catch (e) {
                console.error(e)
                return reject(e);
            }
        });
    },
    userContentGet : (...args) => {
        return new Promise(async function (resolve, reject) {
            try {
                let output = []
                let _session = args[0] || {};
                let filters = args[1] || {};
                
                /* based on filters */
                let questionIds = [];
                let dbQuery = {}
                let sortBy = ""
                /* based on filters */

                // all the filters
                let content_types = filters["content_types"]
                let year = filters["year"]
                let order_direction = filters["order_direction"]
                
                /* all types filter logic */
                let questionsAsked = []
                let questionsFollowed = []
                let questionsAnswered = []
                if(content_types == "questions_asked" || content_types == "all_types"){
                    await questionModel.find({userId:_session.userId}).select({questionId:1,_id:0})
                    .then((questionIds) => {
                        for(let index=0;index<questionIds.length;index++){
                            questionsAsked.push(questionIds[index].questionId)
                        }
                    }).catch(reject);
                }
                if(content_types == "questions_followed" || content_types == "all_types"){
                    await questionFollowModel.find({userId:_session.userId}).select({questionId:1,_id:0})
                    .then((questionIds) => {
                        for(let index=0;index<questionIds.length;index++){
                            questionsFollowed.push(questionIds[index].questionId)
                        }
                    }).catch(reject);
                }
                if(content_types == "answers" || content_types == "all_types"){
                    await answerModel.find({userId:_session.userId}).select({questionId:1,_id:0})
                    .then((questionIds) => {
                        for(let index=0;index<questionIds.length;index++){
                            questionsAnswered.push(questionIds[index].questionId)
                        }
                    }).catch(reject);
                }
                /* all types filter logic */

                questionIds = questionsAsked.concat(questionsFollowed).concat(questionsAnswered)
                questionIds = Array.from(new Set(questionIds));
                dbQuery["questionId"] = {"$in":questionIds}
                
                /* year filter logic*/
                if (year != "all_time"){
                    dbQuery["createdAt"] = {"$gte" : new Date(parseInt(year),0,1),"$lt": new Date(parseInt(year)+1,0,1)}
                }   
                /* year filter logic*/

                /* order direction logic*/
                if(order_direction == "newest_first"){
                    sortBy = "-createdAt"
                }
                else{
                    sortBy = "createdAt"
                }
                /* order direction logic*/

                questionModel.find(dbQuery).sort(sortBy).select({questionId:1,questionText:1,createdAt:1,_id:0})
                .then(async (questionObjs) => {
                    for (let index=0;index<questionObjs.length;index++){
                        if (questionsAnswered.includes(questionObjs[index].questionId)){
                            let temp = Object.assign({answered:true},questionObjs[index]._doc)
                            await answerModel.findOne({userId:_session.userId,questionId:questionObjs[index].questionId}).select({createdAt:1})
                            .then((answerObj) => {
                                temp["createdAt"] = answerObj.createdAt
                                output.push(temp)
                            }).catch(reject);
                        }
                        else{
                            let temp = Object.assign({answered:false},questionObjs[index]._doc)
                            output.push(temp)
                        }
                    }
                    return resolve(output)
                }).catch(reject);
            }
            catch (e) {
                console.error(e)
                return reject(e);
            }
        });
    },
    questionsRelatedToTopic : (...args) => {
        return new Promise(async function (resolve, reject) {
            try {
                let output = []
                let _session = args[0] || {};
                let params = args[1] || 1;
                let page_number = params['page']
                let topic = params['topic']
                let page_limit = 10
                let pagination_end_index = page_number * page_limit
                let pagination_start_index = pagination_end_index - page_limit

                let topicIdList = []
                if(topic === null){
                    await userModel.findOne({userId:_session.userId})
                    .then((userObj) => {
                        console.log("---user topics---\n",userObj) //vinit fix
                        for(let index=0;index<userObj.topic.length;index++){
                            console.log(userObj.topic[index])
                            topicIdList.push(userObj.topic[index].topicId)
                        }
                    }).catch(reject);
                }
                else{
                    topicIdList.push(topic)
                }
                
                console.log("List of topics---\n",topicIdList)

                let dbQuery = {}
                if(topicIdList.length > 0 ){
                    dbQuery['topicsId'] = {"$in":topicIdList}
                }   

                //get list of questions answered by user
                let userAnsweredQuestionList = []
                await answerModel.find({userId:_session.userId}).distinct('questionId')
                .then((questionIds) => {
                    userAnsweredQuestionList = questionIds
                }).catch(reject);

                console.log("Lits of questions----\n",userAnsweredQuestionList)

                if(userAnsweredQuestionList.length > 0){
                    dbQuery['questionId'] = {"$nin":userAnsweredQuestionList}
                }

                console.log("-----dbQuery---",dbQuery)

                await questionModel.find(dbQuery).sort('-createdAt').skip(pagination_start_index).limit(page_limit)
                .then(async (questionObjs) => {
                    for(let index=0;index<questionObjs.length;index++){
                        let questionObj = questionObjs[index]
                        let temp = await questionCommonAttributes(_session,questionObj)
                        console.log(temp)
                        temp['topics'] = []
                        if (questionObj.topicsId.length > 0){
                            for (let topicIndex=0;topicIndex<questionObj.topicsId.length;topicIndex++){
                                await topicModel.findOne({topicId:questionObj.topicsId[topicIndex]}).then((topicObj) =>{
                                    temp['topics'].push({"topicId":topicObj.topicId,"topicText":topicObj.topicText})
                                })
                            }
                        }
                        output.push(temp)
                    }
                    return resolve(output)
                }).catch(reject);
            }
            catch (e) {
                console.error(e)
                return reject(e);
            }
        });
    },
    userBookmarkedAnswers : (...args) => {
        return new Promise(function (resolve, reject) {
            try {
                let output = []
                let _session = args[0] || {};
                let params = args[1] || {};
                let page_number = params['page']
                let page_limit = 20
                let pagination_end_index = page_number * page_limit
                let pagination_start_index = pagination_end_index - page_limit

                answerBookmarkModel.find({userId:_session.userId}).skip(pagination_start_index).limit(page_limit)
                .then(async (answerBookmarkObjs) => {
                    console.log("----answerBookmarkObjs----\n",answerBookmarkObjs)
                    for(let index=0;index<answerBookmarkObjs.length;index++){
                        let temp = {}
                        await answerModel.findOne({answerId:answerBookmarkObjs[index].answerId})
                        .then(async (answerObj) => {
                            temp = await answerCommonAttributes(_session,answerObj)
                            await questionModel.findOne({questionId:answerObj.questionId})
                            .then((questionObj) => {
                                temp["questionId"] = questionObj.questionId
                                temp["questionText"] = questionObj.questionText
                            }).catch(reject);
                        }).catch(reject);
                        console.log(temp);
                        output.push(temp)
                    }
                    return resolve(output);
                }).catch(reject);
            }
            catch (e) {
                console.error(e)
                return reject(e);
            }
        });
    },
    update: (...args) => {
        return new Promise(function (resolve, reject) {
            
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
                    message: "Question Created Successfully",
                    code: "CREATED"
                }],
                data: data
            })
            producer.fire({
                topic: 'counts',
                type: 'newquestion',
                payload: {
                    createdAt: Date.now()
                },
                partition: 0
            })
        };
        service.create(req.user, req.body).then(successCB, next);
    },
    read: (req, res, next) => {
        let successCB = (data) => {
            res.json({
                result: "success",
                response: [{
                    message: "Question Read Successfully",
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
                    message: "Question Updated Successfully",
                    code: "UPDATED"
                }]
            })
        };
        service.update(req.user, req.params.questionId, req.body).then(successCB, next);
    },
    delete: (req, res, next) => {
        let successCB = (data) => {
            res.json({
                result: "success",
                response: [{
                    message: "Question deleted Successfully",
                    code: "Deleted"
                }]
            })
        };
        service.delete(req.user, req.params.questionId, req.body).then(successCB, next);
    },
    questionFollow : (req, res, next) => {
        let successCB = (data) => {
            res.json({
                result: "success",
                response: [{
                    message: "Question follow or unfollow",
                    code: "UPDATED"
                }]
            })
        };
        service.questionFollow(req.user, req.body).then(successCB, next);
    },
    userFeedList : (req, res, next) => {
        let successCB = (data) => {
            res.json({
                result: "success",
                response: [{
                    message: "Question and its single answer listing for user feeds",
                    code: "READ"
                }],
                data: data
            })
        };
        let params = {}
        params['page'] = req.param('page') || 1;
        params['topic'] = req.param('topic') || null
        service.userFeedList(req.user,params).then(successCB, next);
    },
    userQuestionList : (req, res, next) => {
        let successCB = (data) => {
            res.json({
                result: "success",
                response: [{
                    message: "List of user asked questions",
                    code: "READ"
                }],
                data: data
            })
        };
        let params = {}
        params['page'] = req.param('page') || 1;
        service.userQuestionList(req.user, params, req.body).then(successCB, next);
    },
    userAnswerList : (req, res, next) => {
        let successCB = (data) => {
            res.json({
                result: "success",
                response: [{
                    message: "List of user answered answers",
                    code: "READ"
                }],
                data: data
            })
        };
        let params = {}
        params['page'] = req.param('page') || 1;
        service.userAnswerList(req.user,params,req.body).then(successCB, next);
    },
    userContentGet : (req, res, next) => {
        let successCB = (data) => {
            res.json({
                result: "success",
                response: [{
                    message: "User content questions - filter based",
                    code: "READ"
                }],
                data: data
            })
        };
        let filters = {}
        filters["content_types"] = req.param('content_types') ||  "all_types";
        filters["year"] = req.param('year') ||  "all_time";
        filters["order_direction"] = req.param('order_direction') ||  "newest_first";
        console.log(filters)
        service.userContentGet(req.user,filters).then(successCB, next);
    },
    questionsRelatedToTopic : (req, res, next) => {
        let successCB = (data) => {
            res.json({
                result: "success",
                response: [{
                    message: "Questions related to topic",
                    code: "READ"
                }],
                data: data
            })
        };
        let params = {}
        params['page'] = req.param('page') || 1;
        params['topic'] = req.param('topic') || null
        service.questionsRelatedToTopic(req.user,params).then(successCB, next);
    },
    userBookmarkedAnswers :(req, res, next) => {
        let successCB = (data) => {
            res.json({
                result: "success",
                response: [{
                    message: "User bookmarked questions",
                    code: "READ"
                }],
                data: data
            })
        };
        let params = {}
        params['page'] = req.param('page') || 1;
        service.userBookmarkedAnswers(req.user,params,req.body).then(successCB, next);
    },
};
module.exports.service = service;
module.exports.router = router;