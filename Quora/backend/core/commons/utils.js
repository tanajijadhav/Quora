const _ = require("lodash");
const uuid = require('uuid');
let service = {};
service.clone = (o) => {
    if (typeof o === "object") {
        return _.clone(o)
    } else {
        return o;
    }
};
service.titleCase = (str) => {
    return _.startCase(_.toLower(str));
};
service.getUniqueId = () => {
    return uuid.v4();
};
service.isEmail = (email) => {
    email = email || "";
    var regex = /^[\w\.=-]+@[\w\.-]+\.[\w]{2,3}$/
    return regex.test(email);
}
service.isMobile = (mobile) => {
    mobile = mobile || "";
    var regex = /^[987]\d{9}$/
    return regex.test(mobile);
}
service.isPassword = (pass) => {
    pass = pass || ""
    return (pass.length >= 6 && pass.length <= 14);
}
service.isGender = (gender) => {
    gender = gender || "";
    var regex = /^Male$|^Female$|^Other$/
    return regex.test(gender);
}
service.makeDirectory = (foldername) => {
    var mkdirp = require('mkdirp');
    return new Promise((resolve, reject) => {
        mkdirp(foldername, function (err) {
            if (err) {
                reject([{
                    title: "ERROR",
                    message: "Error Making the Directory :: " + JSON.stringify(err),
                    code: "MKDIRP"
                }]);
                return;
            } else {
                resolve();
            };
        });
    })
};
service.writeFileIntoLocal = (filePath, data) => {
    return new Promise((resolve, reject) => {
        require('fs').writeFile(filePath, data, (err) => {
            if (err) {
                reject([{
                    title: "ERROR",
                    message: "Error Writing into File " + filePath,
                    code: "FSWRITE"
                }]);
                return;
            } else {
                resolve(true);
            }
        });
    });
};
module.exports = service;