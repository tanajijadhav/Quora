const rs = require("../commons/responses");
const utils = require("../commons/utils");
const _ = require("lodash");
let pv = require("../commons/passwordVerification");
let followModel = require('../models/followmodel');
let service = {
    markFollow: (...args) => {
        return new Promise(function (resolve, reject) {
            try {
                let _session = args[0] || {};
                let userId = _session.userId || null;
                let toFollow = args[1] || null;
                let btoa = false;
                if (!userId || !toFollow) {
                    reject(rs.invalidrequest);
                    return;
                }
                let userservice = require('./userservice').service;

                userservice.read(_session, userId)
                    .then((dbObj) => {
                        return userservice.read(_session, toFollow)
                    })
                    .then((dbObj) => {
                        return followModel.findOne({
                            userId: userId,
                            following: toFollow
                        })
                    })
                    .then((dbObj) => {
                        if (!!dbObj) {
                            return Promise.reject({
                                code: "FOLLOWERROR",
                                message: "You are already following this user"
                            });
                        } else {
                            return followModel.create({
                                userId: userId,
                                following: toFollow,
                                followingBack: false,
                            })
                        }
                    })
                    .then((dbObj) => {
                        return followModel.findOne({
                            userId: toFollow,
                            following: userId
                        })
                    })
                    .then((dbObj) => {
                        if (!!dbObj) {
                            btoa = true;
                        }
                        return userservice.update(_session, userId, {
                            "$inc": {
                                "following": 1
                            }
                        });
                    })
                    .then((dbObj) => {
                        return userservice.update(_session, toFollow, {
                            "$inc": {
                                "followers": 1
                            }
                        });
                    })
                    .then((dbObj) => {
                        if (!!btoa) {
                            return followModel.updateMany({
                                $or: [{
                                    userId: toFollow,
                                    following: userId,
                                }, {
                                    userId: userId,
                                    following: toFollow,
                                }]
                            }, {
                                followingBack: true
                            });
                        } else {
                            return Promise.resolve({});
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
    getFollowers: (...args) => {
        return new Promise(function (resolve, reject) {
            try {
                let _session = args[0] || {};
                let userId = args[1] || null;
                let userservice = require('./userservice').service;
                let myFollowers = {};
                userservice.read(_session, userId)
                    .then((userObj) => {
                        return followModel.find({
                            following: userId
                        }).select({
                            userId: 1,
                            followingBack: 1
                        })
                    })
                    .then((followers) => {
                        if (!!followers || !!followers.length) {
                            let f = [];
                            for (let i = 0; i < followers.length; i++) {
                                myFollowers[followers[i].userId] = followers[i].followingBack || false;
                                f.push(followers[i].userId);
                            }
                            let userModel = require('../models/usermodel');
                            return userModel.find({
                                userId: {
                                    $in: f
                                }
                            }).select({
                                userId: 1,
                                firstName: 1,
                                lastName: 1,
                                profileCredential: 1,
                                followers: 1,
                                following: 1
                            })
                        } else {
                            return resolve([])
                        }
                    }).then((result) => {
                        result = JSON.parse(JSON.stringify(result));
                        for (let i = 0; i < result.length; i++) {
                            result[i].followingBack = myFollowers[result[i].userId];
                        }
                        resolve(result);
                    })
                    .then(resolve, reject)
                    .catch(reject)
            } catch (e) {
                console.error(e)
                reject(e);
            }
        });
    },
    getFollowing: (...args) => {
        return new Promise(function (resolve, reject) {
            try {
                let _session = args[0] || {};
                let userId = args[1] || null;
                let userservice = require('./userservice').service;
                let myFollowing = {};
                userservice.read(_session, userId)
                    .then((userObj) => {

                        return followModel.find({
                            userId: userId
                        }).select({
                            following: 1,
                            followingBack: 1
                        })
                    })
                    .then((followings) => {
                        if (!!followings || !!followings.length) {
                            let f = [];
                            for (let i = 0; i < followings.length; i++) {
                                f.push(followings[i].following);
                                myFollowing[followings[i].following] = followings[i].followingBack;
                            }
                            let userModel = require('../models/usermodel');
                            return userModel.find({
                                userId: {
                                    $in: f
                                }
                            }).select({
                                userId: 1,
                                firstName: 1,
                                lastName: 1,
                                profileCredential: 1,
                                followers: 1,
                                following: 1
                            })
                        } else {
                            return resolve([])
                        }
                    }).then((result) => {
                        result = JSON.parse(JSON.stringify(result));
                        for (let i = 0; i < result.length; i++) {
                            result[i].followingBack = myFollowing[result[i].userId];
                        }
                        resolve(result);
                    })
                    .then(resolve, reject)
                    .catch(reject)
            } catch (e) {
                console.error(e)
                reject(e);
            }
        });
    },
    markUnfollow: (...args) => {
        return new Promise(function (resolve, reject) {
            try {
                let _session = args[0] || {};
                let userId = _session.userId || null;
                let toUnFollow = args[1] || null;
                if (!userId || !toUnFollow) {
                    reject(rs.invalidrequest);
                    return;
                }
                let userservice = require('./userservice').service;

                userservice.read(_session, userId)
                    .then((dbObj) => {
                        return userservice.read(_session, toUnFollow)
                    })
                    .then((dbObj) => {
                        return followModel.findOne({
                            userId: userId,
                            following: toUnFollow
                        })
                    })
                    .then((dbObj) => {
                        if (!!dbObj) {
                            return followModel.remove({
                                userId: userId,
                                following: toUnFollow
                            })
                        } else {
                            return Promise.reject({
                                code: "FOLLOWERROR",
                                message: "You are not following this user"
                            });
                        }
                    })
                    .then((dbObj) => {
                        return userservice.update(_session, userId, {
                            "$inc": {
                                "following": -1
                            }
                        });
                    })
                    .then((dbObj) => {
                        return userservice.update(_session, toUnFollow, {
                            "$inc": {
                                "followers": -1
                            }
                        });
                    })
                    .then((dbObj) => {
                        return followModel.updateMany({
                            $or: [{
                                userId: toUnFollow,
                                following: userId,
                            }, {
                                userId: userId,
                                following: toUnFollow,
                            }]
                        }, {
                            followingBack: false
                        });
                    })
                    .then(resolve, reject)
                    .catch(reject)
            } catch (e) {
                console.error(e)
                reject(e);
            }
        });
    }
}
let router = {
    markFollow: (req, res, next) => {
        let successCB = (data) => {
            res.json({
                result: "success",
                response: [{
                    message: "Follow Request Successfully",
                    code: "FOLLOW"
                }]
            })
        };
        service.markFollow(req.user, req.params.userId).then(successCB, next);
    },
    getFollowers: (req, res, next) => {
        let successCB = (data) => {
            res.json({
                result: "success",
                response: [{
                    message: "Followers Read Successfully",
                    code: "FOLLOW"
                }],
                followers: data || []
            })
        };
        service.getFollowers(req.user, req.params.userId).then(successCB, next);
    },
    getFollowing: (req, res, next) => {
        let successCB = (data) => {
            res.json({
                result: "success",
                response: [{
                    message: "Following Read Successfully",
                    code: "FOLLOW"
                }],
                following: data || []
            })
        };
        service.getFollowing(req.user, req.params.userId).then(successCB, next);
    },
    markUnfollow: (req, res, next) => {
        let successCB = (data) => {
            res.json({
                result: "success",
                response: [{
                    message: "Unfollow Request Successfully",
                    code: "FOLLOW"
                }]
            })
        };
        service.markUnfollow(req.user, req.params.userId).then(successCB, next);
    },
};
module.exports.service = service;
module.exports.router = router;