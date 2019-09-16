const jwt = require('jsonwebtoken');
const rs = require("./responses");
const secretKey = "u37xrn732tnr7191lawhco8313rvJYRW3UBTURCC8ednfje";
const defaultOptions = {
    algorithm: 'HS256',
    noTimestamp: false,
    expiresIn: '30d'
};
let service = {}
service.generate = (payload, signOptions) => {
    payload.created_at = new Date().getTime()
    return jwt.sign(payload || {}, secretKey, Object.assign({}, defaultOptions, signOptions));
};
service.validate = (token) => {
    return new Promise(function (resolve, reject) {
        try {
            let result = jwt.verify(token, secretKey);
            resolve(result);
        } catch (e) {
            reject(rs.tokenerror);
        }
    });
};
service.verifyRequest = (req, res, next) => {
    let token = (req.headers['authorization'] || "").split('Bearer ')[1] || req.query.token || "";
    service.validate(token).then((payload) => {
        req.user = payload;
        let userservice = require('./../services/userservice').service;
        return userservice.read(req.user, payload.userId)
    }).then((dbObj) => {
        if (!!dbObj) {
            next();
        } else {
            throw rs.tokenerror;
        }
    }).catch(e => next(rs.tokenerror));
};
module.exports = service;


// const jwt = require('jsonwebtoken');
// const rs = require("./responses");
// const utils = require("./utils");
// const secretKey = "u37xrn732tnr7191lawhco8313rvJYRW3UBTURCC8ednfje";
// const defaultOptions = {
//     algorithm: 'HS256',
//     noTimestamp: false,
//     expiresIn: '30d'
// };
// let service = {}
// service.generate = (payload, signOptions) => {
//     payload.created_at = new Date().getTime()
//     return jwt.sign(payload || {}, secretKey, Object.assign({}, defaultOptions, signOptions));
// };