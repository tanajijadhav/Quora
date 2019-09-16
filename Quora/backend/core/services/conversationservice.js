const rs = require("./../commons/responses");
const utils = require("./../commons/utils");
const _ = require("lodash");
let pv = require("./../commons/passwordVerification");
let service = {
    sendMessage: (...args) => {
        return new Promise(function (resolve, reject) {
            try {
                let _session = args[0] || {};
                let body = args[1] || {};
                let from = _session.userId || null;
                let to = body.to || null;
                if (!body.message || !to || !from) {
                    throw rs.invalidrequest;
                }
                let fromUser = null;
                let toUser = null;
                let conversationId = null;
                let userservice = require('./userservice').service;
                let conversationModel = require('./../models/conversationmodel');
                let messageModel = require('./../models/messagemodel');
                userservice.read(_session, from)
                    .then((dbObj) => {
                        fromUser = dbObj;
                        return userservice.read(_session, to)
                    })
                    .then((dbObj) => {
                        toUser = dbObj;
                        return conversationModel.findOne({
                            users: {
                                $all: [from, to]
                            }
                        });
                    })
                    .then((dbObj) => {
                        if (!!dbObj) {
                            // update
                            conversationId = (dbObj || {}).conversationId;
                            return conversationModel.findOneAndUpdate({
                                conversationId: conversationId,
                            }, {
                                "$inc": {
                                    "messages": 1
                                }
                            })

                        } else {
                            // create New
                            conversationId = utils.getUniqueId();
                            return conversationModel.create({
                                conversationId: conversationId,
                                messages: 1,
                                users: [from, to],
                            })
                        }
                    })
                    .then((dbObj) => {
                        if (!!dbObj) {
                            return messageModel.create({
                                conversationId: conversationId,
                                from: from,
                                to: to,
                                message: body.message
                            })
                        } else {
                            return Promise.reject(rs.invalidrequest)
                        }
                    })
                    .then(resolve, reject)
                    .catch(reject)
            } catch (e) {
                console.error(e)
                reject(e);
            }
        });
    },
    getOneConversation: (...args) => {
        return new Promise(function (resolve, reject) {
            try {
                let _session = args[0] || {};
                let params = args[1] || {};
                let query = args[2] || {};
                let userId = _session.userId || null;
                let limit = query.limit || 100;
                let conversationId = params.conversationId;
                if (!conversationId || !limit || !userId) {
                    throw rs.invalidrequest;
                }
                let conversationModel = require('./../models/conversationmodel');
                let messageModel = require('./../models/messagemodel');
                let userservice = require('./userservice').service;
                let userOne = null;
                let userTwo = null;
                let obj = {};
                let messageList = [];
                conversationModel.findOne({
                        conversationId: conversationId
                    }).select({
                        _id: 0,
                        __v: 0
                    })
                    .then((dbObj) => {
                        if (!!dbObj && ((dbObj || {}).users || []).indexOf(userId) >= 0) {
                            userOne = ((dbObj || {}).users || [])[0];
                            userTwo = ((dbObj || {}).users || [])[1];
                            obj = dbObj || {};

                            return messageModel.find({
                                $or: [{
                                    from: userOne,
                                    to: userTwo
                                }, {
                                    from: userTwo,
                                    to: userOne
                                }]
                            }).select({
                                from: 1,
                                to: 1,
                                message: 1,
                                createdAt: 1
                            }).sort({
                                updatedAt: 1
                            }).limit(limit)
                        } else {
                            return Promise.reject(rs.notfound);
                        }
                    })
                    .then((dbObj) => {
                        messageList = dbObj || [];
                        return userservice.read(_session, userOne)
                    })
                    .then((dbObj) => {
                        if (dbObj.userId === userId) {
                            obj.self = {
                                firstName: dbObj.firstName,
                                lastName: dbObj.lastName,
                                userId: dbObj.userId
                            }
                        } else {
                            obj.conversationWith = {
                                firstName: dbObj.firstName,
                                lastName: dbObj.lastName,
                                userId: dbObj.userId
                            }
                        }
                        return userservice.read(_session, userTwo)
                    })
                    .then(dbObj => {
                        if (dbObj.userId === userId) {
                            obj.self = {
                                firstName: dbObj.firstName,
                                lastName: dbObj.lastName,
                                userId: dbObj.userId
                            }
                        } else {
                            obj.conversationWith = {
                                firstName: dbObj.firstName,
                                lastName: dbObj.lastName,
                                userId: dbObj.userId
                            }
                        }
                        return Promise.resolve(Object.assign({}, {
                            ...obj._doc
                        }, {
                            ...obj.self
                        }, {
                            conversationWith: obj.conversationWith
                        }, {
                            messageList
                        }))
                    })
                    .then(resolve, reject)
                    .catch(reject);
            } catch (e) {
                console.error(e)
                reject(e);
            }
        });
    },
    getConversations: (...args) => {
        return new Promise(function (resolve, reject) {
            try {
                let _session = args[0] || {};
                let params = args[1] || {};
                let query = args[2] || {};
                let userId = _session.userId || null;
                let limit = query.limit || 10;
                if (!limit || !userId) {
                    throw rs.invalidrequest;
                }
                let conversationModel = require('./../models/conversationmodel');
                let messageModel = require('./../models/messagemodel');
                let userservice = require('./userservice').service;
                let userObj = {}
                let user = {};
                let response = [];
                conversationModel.find({
                        users: userId
                    })
                    .sort({
                        updatedAt: -1
                    })
                    .limit(limit)
                    .then(async (dbObj) => {
                        if (!!dbObj) {
                            for (let i = 0; i < dbObj.length; i++) {
                                const element = dbObj[i];
                                let u = element.users || [];
                                let other = u[0] == userId ? u[1] : u[0]
                                let message = await messageModel.findOne({
                                    $or: [{
                                        from: userId,
                                        to: other
                                    }, {
                                        from: other,
                                        to: userId
                                    }]
                                }).select({
                                    from: 1,
                                    to: 1,
                                    message: 1,
                                    createdAt: 1,
                                }).sort({
                                    updatedAt: -1
                                });
                                let {
                                    users,
                                    _id,
                                    __v,
                                    ...o
                                } = element._doc;
                                o.lastMessage = message;
                                o.conversationWith = await userservice.read(_session, other, {
                                    filter: "firstName,lastName,userId"
                                });
                                response.push(o);
                            }
                            return Promise.resolve(response)
                        } else {
                            return Promise.reject(rs.invalidrequest)
                        }
                    }).then(resolve, reject).catch(reject)
            } catch (e) {
                console.error(e)
                reject(e);
            }
        });
    },
    searchUsers: (...args) => {
        return new Promise(function (resolve, reject) {
            try {
                let _session = args[0] || {};
                let query = args[1] || {};
                let userId = _session.userId || null;
                let limit = (query.limit || 10) > 10 ? 10 : (query.limit || 10);
                let q = query.q || "";
                if (!limit || !userId || !q || q.length < 3) {
                    throw rs.invalidrequest;
                };
                let userModel = require('../models/usermodel');
                userModel.find({
                    $or: [{
                        "firstName": {
                            $regex: ".*" + q + ".*"
                        }
                    }, {
                        "lastName": {
                            $regex: ".*" + q + ".*"
                        }
                    }]
                }).select({
                    firstName: 1,
                    lastName: 1,
                    userId: 1
                }).then(resolve).catch(reject);
            } catch (e) {
                console.error(e)
                reject(e);
            }
        });
    },
}
let router = {
    sendMessage: (req, res, next) => {
        let successCB = (data) => {
            res.json({
                result: "success",
                response: [{
                    message: "Message Sent Successfully",
                    code: "MESSAGE"
                }],
                conversation: data || {}
            })
        };
        service.sendMessage(req.user, req.body).then(successCB, next);
    },
    getOneConversation: (req, res, next) => {
        let successCB = (data) => {
            res.json({
                result: "success",
                response: [{
                    message: "Conversation Read Successfully",
                    code: "MESSAGE"
                }],
                conversation: data
            })
        };
        service.getOneConversation(req.user, req.params, req.query).then(successCB, next);
    },
    getConversations: (req, res, next) => {
        let successCB = (data) => {
            res.json({
                result: "success",
                response: [{
                    message: "Conversations Read Successfully",
                    code: "MESSAGE"
                }],
                conversations: data
            })
        };
        service.getConversations(req.user, req.params, req.query).then(successCB, next);
    },
    searchUsers: (req, res, next) => {
        let successCB = (data) => {
            res.json({
                result: "success",
                response: [{
                    message: "Users Read Successfully",
                    code: "MESSAGE"
                }],
                users: data
            })
        };
        service.searchUsers(req.user, req.query).then(successCB, next);
    }
};
module.exports.service = service;
module.exports.router = router;