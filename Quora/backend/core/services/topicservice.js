const rs = require("./../commons/responses");
const utils = require("./../commons/utils");
const topicModel = require("../models/topicmodel");
let userModel = require('./../models/usermodel');
let service = {
    create: (...args) => {
        return new Promise(function (resolve, reject) {
            try {
                let _session = args[0] || {};
                let body = args[1] || {};
                // body.topicId = body.topicId || utils.getUniqueId();
                let topicObj = new topicModel(body);
                topicObj.save().then(response => {
                    return resolve(response);
                }).catch(reject);
            } catch (e) {
                console.error(e)
                reject(e);
            }
        });
    },
    read: (...args) => {
        return new Promise(function (resolve, reject) {
            try {
                let _session = args[0] || {};
                let topicId = args[1].topicId || {};
                let userId = _session.userId || {};
                let topicsObj = null
                topicModel.findOne({
                    topicId : topicId
                }).select({
                    topicId: 1,
                    topicText: 1,
                    _id: 0
                }).then((dbObj) => {
                    if(!!dbObj){
                        topicsObj = JSON.parse(JSON.stringify(dbObj));
                        return userModel.findOne({
                            userId : userId
                        })
                    }else{
                        return Promise.reject(rs.notfound)
                    }
                
                }).then((dbObj)=>{
                    if(!!dbObj){
                        let topics = dbObj.topic || [];
                        topicsObj.following = false;
                        for (let index = 0; index < topics.length; index++) {
                            const element = topics[index];
                            if(element.topicId === topicsObj.topicId){
                                topicsObj.following = true;
                            }
                        }
                        console.log(topicsObj)
                        return Promise.resolve(topicsObj)
                    }else{
                        return Promise.reject(rs.notfound)
                    }
                }).then(resolve).catch(reject);
            } catch (e) {
                console.error(e)
                reject(e);
            }
        });
    },
    readMany: (...args) => {
        return new Promise(function (resolve, reject) {
            try {
                let _session = args[0] || {};
                let query = args[1] || {};
                query.q = query.q || "";
                let search = {};
                if (!!query.q) {
                    query.q = query.q.toLowerCase();
                    // search = {
                    //     "topicText": 
                    //         { $regex: `/${query.q}/`,}
                    // };
                    search = {
                        "topicText": {
                            $regex: ".*" + query.q + ".*"
                        }
                    }
                }
                topicModel.find(search).select({
                    topicId: 1,
                    topicText: 1,
                    _id: 0
                }).then((topicsObj) => {
                    return resolve(topicsObj);
                })
            } catch (e) {
                console.error(e)
                reject(e);
            }
        });
    },
    update: (...args) => {
        return new Promise(function (resolve, reject) {

        });
    },
    delete: (...args) => {
        return new Promise(function (resolve, reject) {

        });
    }
}
let router = {
    create: (req, res, next) => {
        let successCB = (data) => {
            res.json({
                result: "success",
                response: [{
                    message: "Topic Created Successfully",
                    code: "CREATED"
                }]
            })
        };
        service.create(req.user, req.body).then(successCB, next);
    },
    read: (req, res, next) => {
        let successCB = (data) => {
            res.json({
                result: "success",
                response: [{
                    message: "Topic Read Successfully",
                    code: "READ"
                }],
                topic: data
            })
        };
        service.read(req.user, req.params).then(successCB, next);
    },
    readMany: (req, res, next) => {
        let successCB = (data) => {
            res.json({
                result: "success",
                response: [{
                    message: "Topics Read Successfully",
                    code: "READ"
                }],
                data: data
            })
        };
        service.readMany(req.user, req.query).then(successCB, next);
    },
    update: (req, res, next) => {
        let successCB = (data) => {
            res.json({
                result: "success",
                response: [{
                    message: "Topic Updated Successfully",
                    code: "UPDATED"
                }]
            })
        };
        service.update(req.user, req.params.topicId, req.body).then(successCB, next);
    },
    delete: (req, res, next) => {
        let successCB = (data) => {
            res.json({
                result: "success",
                response: [{
                    message: "Topic deleted Successfully",
                    code: "Deleted"
                }]
            })
        };
        service.delete(req.user, req.params.topicId, req.body).then(successCB, next);
    }
};
module.exports.service = service;
module.exports.router = router;