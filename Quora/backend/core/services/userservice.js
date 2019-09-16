const rs = require("./../commons/responses");
const utils = require("./../commons/utils");
const _ = require("lodash");
let pv = require("./../commons/passwordVerification");
let s3 = require('./../commons/s3');
const redis = require("./../commons/redis");
const topicModel = require("../models/topicmodel");
let producer = require('./../commons/kafkarpc');
producer = producer.getInstance();
let service = {
    create: (...args) => {
        return new Promise(function (resolve, reject) {
            try {
                let _session = args[0] || {};
                let body = args[1] || {};
                let userModel = require('./../models/usermodel');
                body.firstName = utils.titleCase(body.firstName || "");
                body.lastName = utils.titleCase(body.lastName || "");
                body.userId = body.userId || utils.getUniqueId();
                if (!body.password) {
                    throw rs.invalidrequest;
                }
                pv.create(body.password).then((hashedPassword) => {
                    body.password = hashedPassword;
                    userModel.find({
                            email: body.email
                        })
                        .then((response) => {
                            if (!!response && !!response.length) {
                                reject({
                                    message: "User Exists",
                                    code: "USEREXISTS"
                                });
                            } else {
                                return userModel.find({
                                    firstName: body.firstName,
                                    lastName: body.lastName,
                                });
                            }
                        })
                        .then((dbObj) => {
                            let c = 0;
                            body.displayId = body.firstName + "-" + body.lastName;
                            if (!!dbObj && !!dbObj.length) {
                                body.displayId = body.displayId + "-" + dbObj.length;
                            }
                            body.displayId = body.displayId.split(" ").join("-");
                            s3.up(process.cwd() + `/uploads/profiles/mydefaultimage.png`, `profiles/${body.userId}`, {
                                "ACL": "public-read"
                            }).then((d) => {
                                console.log(d)
                            }, (e) => {
                                console.log("err", e)
                            });
                            return userModel.create(body)
                        })
                        .then(resolve, reject)
                        .catch(reject);
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
                let userId = args[1] || null;
                let query = args[2] || {};
                let userModel = require('./../models/usermodel');
                let body = {};
                body.userId = userId || null;
                let select = {
                    "password": 0,
                    "__v": 0,
                    "_id": 0
                };
                if(!!query.profile){
                    producer.fire({
                        topic: 'api',
                        type: 'profileview',
                        payload: {
                            createdAt: Date.now(),
                            viewedAt: Date.now(),
                            feature : "profileview",
                            id : body.userId
                        },
                        partition: 0
                    })
                }
                let foundUser = (dbObj) => {
                    if (!!dbObj) {
                        redis.hset("USERS", userId, dbObj).then(() => {}).catch(() => {});
                        resolve(dbObj);
                    } else {
                        reject(rs.notfound);
                    }
                    return;
                }
                redis.hget("USERS", userId)
                    .then(foundUser)
                    .catch(e => {
                        userModel.findOne(body).select(select)
                            .then(foundUser)
                            .catch((errors) => {
                                reject(errors);
                                return;
                            })
                    });

            } catch (e) {
                console.error(e)
                reject(e);
            }
        });
    },
    readProfileImage: (...args) => {
        return new Promise(function (resolve, reject) {
            try {
                let _session = args[0] || {};
                let userId = args[1] || null;
                resolve();
            } catch (e) {
                console.error(e)
                reject(e);
            }
        });
    },
    update: (...args) => {
        return new Promise(function (resolve, reject) {
            try {
                let _session = args[0] || {};
                let userId = args[1] || null;
                let updateObj = args[2] || {};
                let userModel = require('./../models/usermodel');
                let body = {};
                body.userId = userId || null;
                delete(updateObj || {}).password
                userModel.findOneAndUpdate(body, updateObj, {
                    new: true,
                    runValidators: true
                }).select({
                    "password": 0,
                    "__v": 0,
                    "_id": 0
                }).then((dbObj) => {
                    if (!!dbObj) {
                        let objKeys = Object.keys(updateObj);
                        for (let i = 0; i < objKeys.length; i++) {
                            if (!!dbObj[objKeys[i]]) {
                                updateObj[objKeys[i]] = dbObj[objKeys[i]];
                            }
                        }
                        redis.hdel("USERS", userId).then(() => {}).catch(() => {})
                        resolve(updateObj);
                    } else {
                        reject(rs.notfound);
                    }
                    return;
                }).catch((errors) => {
                    reject(errors);
                    return;
                })
            } catch (e) {
                console.error(e)
                reject(e);
            }
        });
    },
    followTopic: (...args) => {
        return new Promise(function (resolve, reject) {
            try {
                let _session = args[0] || {};
                let userId = args[1] || null;
                let updateObj = args[2] || {};
                let userModel = require('./../models/usermodel');
                let body = {};
                body.userId = userId || null;
                userModel.findOne({
                    userId: userId
                }).then((dbObj) => {
                    if (!!dbObj) {
                        body = dbObj || {};
                        return topicModel.findOne({
                            topicId: updateObj.topicId
                        });
                    } else {
                        return reject(rs.notfound)
                    }

                }).then((dbObj) => {
                    if (!!dbObj) {
                        let _topics = body.topic || [];
                        let push = 1;
                        for (let i = 0; i < _topics.length; i++) {
                            const element = _topics[i];
                            if (element.topicId === updateObj.topicId) {
                                push = 0;
                            }
                        }
                        if (push) {
                            _topics.push(dbObj)
                        }
                        redis.hdel("USERS", userId).then(() => {}).catch(() => {})
                        return userModel.findOneAndUpdate({
                            userId: userId
                        }, {
                            topic: _topics
                        });
                    } else {
                        return reject(rs.notfound)
                    }
                }).then(resolve).catch((err) => {
                    reject(err);
                })
            } catch (e) {
                console.error(e)
                reject(e);
            }
        });
    },
    unFollowTopic: (...args) => {
        return new Promise(function (resolve, reject) {
            try {
                let _session = args[0] || {};
                let userId = args[1] || null;
                let updateObj = args[2] || {};
                let userModel = require('./../models/usermodel');
                let body = {};
                body.userId = userId || null;
                userModel.findOne({
                    userId: userId
                }).then((dbObj) => {
                    if (!!dbObj) {
                        body = dbObj || {};
                        return topicModel.findOne({
                            topicId: updateObj.topicId
                        });
                    } else {
                        return reject(rs.notfound)
                    }

                }).then((dbObj) => {
                    if (!!dbObj) {
                        let _topics = body.topic || [];
                        let _f = null;
                        for (let i = 0; i < _topics.length; i++) {
                            const element = _topics[i];
                            if (element.topicId === updateObj.topicId) {
                                _f = i;
                            }
                        }
                        if (_f >= 0) {
                            _topics.splice(_f,1)
                        }
                        redis.hdel("USERS", userId).then(() => {}).catch(() => {})
                        return userModel.findOneAndUpdate({
                            userId: userId
                        }, {
                            topic: _topics
                        });
                    } else {
                        return reject(rs.notfound)
                    }
                }).then(resolve).catch((err) => {
                    reject(err);
                })
            } catch (e) {
                console.error(e)
                reject(e);
            }
        });
    },
    uploadImage: (...args) => {
        return new Promise(function (resolve, reject) {
            try {
                let _session = args[0] || {};
                let userId = args[1] || null;
                let file = args[2] || {};
                let userModel = require('./../models/usermodel');
                let body = {};
                body.userId = userId || null;
                resolve({});
                s3.up(process.cwd() + `/uploads/profiles/File_${userId}`, `profiles/${userId}`, {
                    "ACL": "public-read"
                }).then((d) => {
                    console.log(d)
                }, (e) => {
                    console.log("err", e)
                });
            } catch (e) {
                console.error(e)
                reject(e);
            }
        });
    },
    delete: (...args) => {
        return new Promise(function (resolve, reject) {
            try {
                let _session = args[0] || {};
                let userId = args[1] || null;
                let userModel = require('./../models/usermodel');
                let body = {};
                body.userId = userId || null;
                userModel.remove(body).then((dbObj) => {
                    if (!!dbObj.deletedCount) {
                        redis.hdel("USERS", userId).then(() => {}).catch(() => {})
                        resolve({});
                    } else {
                        reject(rs.notfound);
                    }
                    return;
                }).catch((errors) => {
                    reject(errors);
                    return;
                })
            } catch (e) {
                console.error(e)
                reject(e);
            }
        });
    }
}
let router = {
    create: (req, res, next) => {
        let successCB = (data) => {
            res.json({
                result: "success",
                response: [{
                    message: "User Created Successfully",
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
                    message: "User Read Successfully",
                    code: "READ"
                }],
                user: data
            })
        };
        service.read(req.user, req.params.userId,req.query).then(successCB, next);
    },
    readProfileImage: (req, res, next) => {
        let successCB = (data) => {
            res.sendFile(process.cwd() + '/profiles/default.png');
        };
        service.readProfileImage(req.user, req.params.userId).then(successCB, next);
    },
    update: (req, res, next) => {
        let successCB = (data) => {
            res.json({
                result: "success",
                response: [{
                    message: "User Updated Successfully",
                    code: "UPDATED"
                }],
                user: data || {}
            })
        };
        service.update(req.user, req.params.userId, req.body).then(successCB, next);
    },
    followTopic: (req, res, next) => {
        let successCB = (data) => {
            res.json({
                result: "success",
                response: [{
                    message: "User Updated Successfully",
                    code: "UPDATED"
                }]
            })
        };
        service.followTopic(req.user, req.params.userId, req.body).then(successCB, next);
    },
    unFollowTopic: (req, res, next) => {
        let successCB = (data) => {
            res.json({
                result: "success",
                response: [{
                    message: "User Updated Successfully",
                    code: "UPDATED"
                }]
            })
        };
        service.unFollowTopic(req.user, req.params.userId, req.body).then(successCB, next);
    },
    delete: (req, res, next) => {
        let successCB = (data) => {
            res.json({
                result: "success",
                response: [{
                    message: "User deleted Successfully",
                    code: "Deleted"
                }]
            })
        };
        service.delete(req.user, req.params.userId, req.body).then(successCB, next);
    },
    uploadImage: (req, res, next) => {
        let successCB = (data) => {
            res.json({
                result: "success",
                response: [{
                    message: "User Updated Successfully",
                    code: "UPDATED"
                }]
            })
        };
        service.uploadImage(req.user, req.params.userId, req.file).then(successCB, next);
    }
};
module.exports.service = service;
module.exports.router = router;