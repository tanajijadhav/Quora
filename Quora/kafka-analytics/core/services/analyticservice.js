let log = require('./../commons/logger');
let utils = require('./../commons/utils');
var timeModel = require('./../models/timemodel');
var profileViewModel = require('./../models/profileviewmodel');
module.exports = {
    signup: (payload) => {
        return new Promise((resolve, reject) => {
            let promiseToCall = (obj) => {
                return new Promise((resolve2, reject2) => {
                    timeModel.findOneAndUpdate({
                        feature: "signup",
                        timestamp: obj.timestamp,
                        frequency: obj.frequency,
                    }, {
                        feature: "signup",
                        timestamp: obj.timestamp,
                        frequency: obj.frequency,
                        $inc: {
                            count: 1
                        }
                    }, {
                        upsert: true,
                        new: true,
                    }).then(resolve2, reject2)
                })
            }
            let timestamps = utils.getAnalyticsTimestamps(payload.createdAt || new Date());
            return Promise.all([promiseToCall(timestamps[0]), promiseToCall(timestamps[1]), promiseToCall(timestamps[2]), promiseToCall(timestamps[3]), promiseToCall(timestamps[4]), promiseToCall(timestamps[5])]).then(resolve, reject);

        });
    },
    signin: (payload) => {
        return new Promise((resolve, reject) => {
            let promiseToCall = (obj) => {
                return new Promise((resolve2, reject2) => {
                    timeModel.findOneAndUpdate({
                        feature: "signin",
                        timestamp: obj.timestamp,
                        frequency: obj.frequency,
                    }, {
                        feature: "signin",
                        timestamp: obj.timestamp,
                        frequency: obj.frequency,
                        $inc: {
                            count: 1
                        }
                    }, {
                        upsert: true,
                        new: true,
                    }).then(resolve2, reject2)
                })
            }
            let timestamps = utils.getAnalyticsTimestamps(payload.createdAt || new Date());
            return Promise.all([promiseToCall(timestamps[0]), promiseToCall(timestamps[1]), promiseToCall(timestamps[2]), promiseToCall(timestamps[3]), promiseToCall(timestamps[4]), promiseToCall(timestamps[5])]).then(resolve, reject);

        });
    },
    newquestion: (payload) => {
        return new Promise((resolve, reject) => {
            let promiseToCall = (obj) => {
                return new Promise((resolve2, reject2) => {
                    timeModel.findOneAndUpdate({
                        feature: "newquestion",
                        timestamp: obj.timestamp,
                        frequency: obj.frequency,
                    }, {
                        feature: "newquestion",
                        timestamp: obj.timestamp,
                        frequency: obj.frequency,
                        $inc: {
                            count: 1
                        }
                    }, {
                        upsert: true,
                        new: true,
                    }).then(resolve2, reject2)
                })
            }
            let timestamps = utils.getAnalyticsTimestamps(payload.createdAt || new Date());
            return Promise.all([promiseToCall(timestamps[0]), promiseToCall(timestamps[1]), promiseToCall(timestamps[2]), promiseToCall(timestamps[3]), promiseToCall(timestamps[4]), promiseToCall(timestamps[5])]).then(resolve, reject);
        });
    },
    newanswer: (payload) => {
        return new Promise((resolve, reject) => {
            let promiseToCall = (obj) => {
                return new Promise((resolve2, reject2) => {
                    timeModel.findOneAndUpdate({
                        feature: "newanswer",
                        timestamp: obj.timestamp,
                        frequency: obj.frequency,
                    }, {
                        feature: "newanswer",
                        timestamp: obj.timestamp,
                        frequency: obj.frequency,
                        $inc: {
                            count: 1
                        }
                    }, {
                        upsert: true,
                        new: true,
                    }).then(resolve2, reject2)
                })
            }
            let timestamps = utils.getAnalyticsTimestamps(payload.createdAt || new Date());
            return Promise.all([promiseToCall(timestamps[0]), promiseToCall(timestamps[1]), promiseToCall(timestamps[2]), promiseToCall(timestamps[3]), promiseToCall(timestamps[4]), promiseToCall(timestamps[5])]).then(resolve, reject);
        });
    },
    newcomment: (payload) => {
        return new Promise((resolve, reject) => {
            let promiseToCall = (obj) => {
                return new Promise((resolve2, reject2) => {
                    timeModel.findOneAndUpdate({
                        feature: "newcomment",
                        timestamp: obj.timestamp,
                        frequency: obj.frequency,
                    }, {
                        feature: "newcomment",
                        timestamp: obj.timestamp,
                        frequency: obj.frequency,
                        $inc: {
                            count: 1
                        }
                    }, {
                        upsert: true,
                        new: true,
                    }).then(resolve2, reject2)
                })
            }
            let timestamps = utils.getAnalyticsTimestamps(payload.createdAt || new Date());
            return Promise.all([promiseToCall(timestamps[0]), promiseToCall(timestamps[1]), promiseToCall(timestamps[2]), promiseToCall(timestamps[3]), promiseToCall(timestamps[4]), promiseToCall(timestamps[5])]).then(resolve, reject);
        });
    },
    questionview: (payload) => {
        return new Promise((resolve, reject) => {
            let promiseToCall = (obj) => {
                return new Promise((resolve2, reject2) => {
                    timeModel.findOneAndUpdate({
                        feature: "questionview",
                        timestamp: obj.timestamp,
                        frequency: obj.frequency,
                    }, {
                        feature: "questionview",
                        timestamp: obj.timestamp,
                        frequency: obj.frequency,
                        $inc: {
                            count: 1
                        }
                    }, {
                        upsert: true,
                        new: true,
                    }).then(resolve2, reject2)
                })
            }
            let timestamps = utils.getAnalyticsTimestamps(payload.viewdAt || new Date());
            return Promise.all([promiseToCall(timestamps[0]), promiseToCall(timestamps[1]), promiseToCall(timestamps[2]), promiseToCall(timestamps[3]), promiseToCall(timestamps[4]), promiseToCall(timestamps[5])]).then(resolve, reject);
        });
    },
    profileview: (payload) => {
        return new Promise((resolve, reject) => {
            let promiseToCall = (obj) => {
                return new Promise((resolve2, reject2) => {
                    console.log("INCOMING REQUEST >>> ", payload,obj)
                    obj.timestamp = obj.timestamp || Date.now();
                    obj.timestamp = new Date(obj.timestamp).set(0, 0);
                    profileViewModel.findOneAndUpdate({
                        feature: payload.feature,
                        timestamp: obj.timestamp,
                        frequency: "day",
                        userId: payload.id,
                    }, {
                        feature: payload.feature,
                        timestamp: obj.timestamp,
                        frequency: "day",
                        userId: payload.id,
                        $inc: {
                            count: 1
                        }
                    }, {
                        upsert: true,
                        new: true,
                    }).then(resolve2, reject2)
                })
            }
            let timestamps = utils.getAnalyticsTimestamps(payload.viewdAt || new Date());
            // only daily
            return Promise.all([promiseToCall(timestamps[2])]).then(resolve, reject);
        });
    }
}