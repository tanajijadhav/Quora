let AWS = require('aws-sdk');
const rs = require("./../commons/responses");
const utils = require("./../commons/utils");
const log = require("./../commons/logger");
const config = require("./../configs/config");
let fs = require('fs');
let path = require('path');
let service = {};
service.upCustom = (s3Params, s3Config) => {
    return new Promise(function (resolve, reject) {
        // do not require endpoints
        delete s3Config.s3BucketEndpoint;
        delete s3Config.endpoint;
        console.log(s3Params,s3Config)
        let AWS = require('aws-sdk');
        AWS.config.update(s3Config);
        let s3obj = new AWS.S3();
        s3obj.upload(s3Params, function (err, data) {
            if (!!err) {
                console.error(err);
                reject([rs.s3error]);
                return;
            } else {
                resolve(data);
                return;
            }
        });
    });
};
service.up = (source, destination, options) => {
    try {
        return new Promise((resolve, reject) => {
            const s3Conf = config.s3;
            //if source is not a file path but a bosy of data : options must contain sendbody:true
            let defaultOptions = {
                ContentType: null,
                ACL: null,
                ContentDisposition: "inline"
            };
            options = options || {};
            let keys = Object.keys(defaultOptions);
            for (var i = 0; i < keys.length; i++) {
                if (options.hasOwnProperty(keys[i])) {
                    defaultOptions[keys[i]] = options[keys[i]];
                }
                if (defaultOptions[keys[i]] === null || typeof defaultOptions[keys[i]] === "undefined") {
                    delete defaultOptions[keys[i]];
                }
            };
            if (!!options.sendbody) {
                // object <buffer> is sent instead of file Path
                if (!source) {
                    console.error("Source Not Mentioned");
                    reject([rs.invalidrequest]);
                    return;
                }
            } else {
                if (!source || typeof source !== "string") {
                    console.error("Source Not Mentioned");
                    reject([rs.invalidrequest]);
                    return;
                }
                source = path.normalize(source);
                source = fs.createReadStream(source)
            }

            if (!destination || typeof destination !== "string") {
                console.error("Destination Not Mentioned");
                reject([rs.invalidrequest]);
                return;
            }
            destination = path.normalize(destination);
            const s3Config = s3Conf || {};
            const s3Params = {
                Bucket: "quoradotcom",
                Key: destination,
                Body: source
            };
            keys = Object.keys(defaultOptions);
            for (var i = 0; i < keys.length; i++) {
                s3Params[keys[i]] = defaultOptions[keys[i]];
            };
            service.upCustom(s3Params, s3Config)
                .then((data) => {
                    if (!!data) {
                        resolve(true);
                        return;
                    } else {
                        reject(err);
                        return;
                    }
                }).catch((err) => {
                    reject(err);
                    return;
                });
        });
    } catch (e) {
        log.error(JSON.stringify(e));
    }

}
module.exports = service;