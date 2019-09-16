const rs = require("./../commons/responses");
const utils = require("./../commons/utils");
const _ = require("lodash");
let pv = require("./../commons/passwordVerification");
let jwt = require("./../commons/jwt");
let producer = require('./../commons/kafkarpc');
producer = producer.getInstance();
let service = {
    signup: (...args) => {
        return new Promise(function (resolve, reject) {
            try {
                let _session = args[0] || {};
                let body = args[1] || {};
                let userservice = require('./userservice').service;
                userservice.create(_session, body).then(resolve, reject);
            } catch (e) {
                console.error(e)
                reject(e);
            }
        });
    },
    signin: (...args) => {
        return new Promise(function (resolve, reject) {
            try {
                let _session = args[0] || {};
                let body = args[1] || {};
                let userservice = require('./userservice').service;
                let userModel = require('./../models/usermodel');
                let userId = null;
                userModel.findOne({
                    email: body.email
                }).select({
                    password: 1,
                    userId: 1
                }).then((dbObj) => {
                    console.log("dchdfgi", dbObj);
                    if (!!dbObj) {
                        userId = dbObj.userId;
                        return pv.verify(body.password, dbObj.password);
                    } else {
                        throw rs.signin;
                    }
                }).then((result) => {
                    console.log("dchdfgi", result);
                    if (!!result) {
                        let userservice = require('./userservice').service;
                        return userservice.read(_session, userId);
                    } else {
                        throw rs.signin;
                    }
                }).then(resolve, reject).catch(e => reject(e));
            } catch (e) {
                console.error(e)
                reject(e);
            }
        });
    },

}
let router = {
    signup: (req, res, next) => {
        let successCB = (data) => {
            producer.fire({
                topic: 'counts',
                type: 'signup',
                payload: {
                    createdAt: Date.now()
                },
                partition: 0
            })
            res.json({
                result: "success",
                response: [{
                    message: "User Signed Up Successfully",
                    code: "SIGNUP"
                }]
            })
        };
        service.signup(req.user, req.body).then(successCB, next);
    },
    signin: (req, res, next) => {
        let successCB = (data) => {
            producer.fire({
                topic: 'counts',
                type: 'signin',
                payload: {
                    createdAt: Date.now()
                },
                partition: 0
            })
            res.json({
                result: "success",
                response: [{
                    message: "User Signed In Successfully",
                    code: "SIGNIN"
                }],
                user: data,
                token: jwt.generate({
                    userId: data.userId,
                })
            })
        };
        service.signin(req.user, req.body).then(successCB, next);
    },
};
module.exports.service = service;
module.exports.router = router;