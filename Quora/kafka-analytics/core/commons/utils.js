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
    return uuid.v1();
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
        mkdirp(foldername, function(err) {
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

service.getAnalyticsTimestamps = (ts) => {
    let min = new Date(ts).setSeconds(0, 0);
    let hour = new Date(ts).setMinutes(0, 0, 0);
    let day = new Date(ts).setHours(0, 0, 0, 0);
    let week = new Date(ts).setHours(0, 0, 0, 0);
    let dayOfWeek = new Date(week).getDay();
    week = week - (dayOfWeek * 24 * 60 * 60 * 1000);
    let month = new Date(ts).setHours(0, 0, 0, 0)
    month = new Date(month).setDate(1);
    let year = new Date(ts).setHours(0, 0, 0, 0)
    year = new Date(year).setDate(1);
    year = new Date(year).setMonth(0);
    console.log(new Date(min));
    console.log(new Date(hour));
    console.log(new Date(day));
    console.log(new Date(week));
    console.log(new Date(month));
    console.log(new Date(year));
    return [{
        frequency: "min",
        timestamp: min
    }, {
        frequency: "hour",
        timestamp: hour
    }, {
        frequency: "day",
        timestamp: day
    }, {
        frequency: "week",
        timestamp: week
    }, {
        frequency: "month",
        timestamp: month
    }, {
        frequency: "year",
        timestamp: year
    }]
}
module.exports = service;
