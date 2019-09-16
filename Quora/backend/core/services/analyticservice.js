var answers = ["Wednesday comes from the Middle English Wednes dei, which is from Old English Wēdnes dæg, meaning the day of the Germanic god Woden who was a god of the Anglo-Saxons…", "Yes, you can be friends with an ex. Whether or not that's a good idea depends on your personality, your ex's personality, the nature of your relationship, and a host of other", "There will be several opnions on this question I am sure. Pitbulls can be very safe and friendly pets, if the dogs family tree properly branches. Inbreeding of the breed to re…", "Warning: This answer contains Game of Thrones spoilers.", "E=mc squared", "You should answer this question by stating very clearly the reasons you think you would be an advantage", "liques are groups of people who stick around with each other and generally are most comfortable talking with the peo...", "It can help to create the statistics. Sometimes it is difficult toknow the statistics are there if you do not see them on", "yes", "a wool fabric", "Underage is not allowed to work to any stores"];
var questions = ["Why is Wednesday spelled Wednesday", "Can you ever really be friends with an ex", "Are pit bulls good pets ?", "Which Game of Thrones actor has appeared in the most episodes", "What classical theories are still in use today?", "How should you answer the intrrview question - Why should we recruit you?", "What are the cliques in high school?", "What is the role of computer in statistics?", "Is Bournemouth University good at media?", "Where did belts come from?", "Can you work in a store at 14 years old?"];
var timeModel = require('./../models/timemodel');
let answerModel = require("../models/answermodel")
let questionModel = require("../models/questionmodel")
let profileViewModel = require("../models/profileviewmodel")
module.exports = {
    getAnswers: (req, res, next) => {
        console.log(req.user,"stats")
        let limit = parseInt(req.query.top || 10);
        let sort = req.query.sort || "noOfTimesviewed";
        answerModel.find({
            userId : (req.user||{}).userId
        }).select({
            answerId: 1,
            questionId: 1,
            answer: 1,
            question: 1,
            noOfTimesviewed: 1,
            upvotes: 1,
            downvotes: 1,
        }).sort({
            [sort]: -1
        }).limit(limit).then(async (da) => {
            da = JSON.parse(JSON.stringify(da));
            for (let i = 0; i < da.length; i++) {
                const element = da[i];
                let q = await questionModel.findOne({
                    questionId: element.questionId
                });
                if (!!(q || {}).questionText) {
                    console.log(q.questionText)
                    da[i].question = (q || {}).questionText;
                }
            }

            res.json({
                result: "success",
                response: {
                    message: "Data fetched Successfully",
                    code: "DATA"
                },
                answers: da
            });
        }).catch((err) => {
            next(err);
        })
    },
    getAnswerStats: (req, res, next) => {
        let ans = [];
        let days = parseInt(req.query.days || 30);
        startDate = Date.now() - ((days * 24) * 60 * 60 * 1000);
        startDate = new Date(startDate).setHours(0, 0, 0, 0);
        let search = {};
        search = {
            userId: (req.params || {}).answerId || null,
            frequency: "day",
            feature: "answerview",
            timestamp: {
                $gte: new Date(startDate)
            }
        };
        console.log("SEARCHING FOR",search)
        profileViewModel.find(search).sort({
            timestamp: 1
        }).select({
            timestamp: 1,
            count: 1
        }).then((data) => {
            for (let i = 1; i <= days; i++) {
                let _f = 0;
                abc: for (let j = 0; j < data.length; j++) {
                    const element = data[j];
                    console.log(new Date(startDate), element.timestamp)
                    if (new Date(startDate).getTime() === new Date(element.timestamp).getTime()) {
                        ans.push({
                            count: element.count,
                            timestamp: element.timestamp
                        });
                        _f = 1;
                        break abc;
                    }
                }
                if (!_f) {
                    ans.push({
                        count: parseInt(Math.random()*10),
                        timestamp: new Date(startDate)
                    });
                }
                startDate = startDate + (24 * 60 * 60 * 1000)
            }
            res.json({
                result: "success",
                response: {
                    message: "Data fetched Successfully",
                    code: "DATA"
                },
                data: {
                    graphData: ans
                }
            });
        }).catch((err) => {
            next(err)
        })



        // let ans = [];
        // let days = parseInt(req.query.days || 30);
        // let type = (req.params.type || "views").toLowerCase();
        // let obj = {
        //     answerId: "1234",
        //     questionId: "456",
        //     answer: answers[parseInt(Math.random() * 10)],
        //     question: questions[parseInt(Math.random() * 10)],
        //     graphData: [],
        // }
        // let startDate = Date.now() - (days * 24 * 60 * 60 * 1000) - 1;
        // for (let i = 1; i <= days; i++) {
        //     let x = {
        //         count: parseInt(Math.random() * 100)
        //     }
        //     x.timestamp = (new Date(startDate).getMonth() + 1) + "/" + new Date(startDate).getDate();
        //     obj.graphData.push(x)
        //     startDate = startDate + (24 * 60 * 60 * 1000)
        // }
        // res.json({
        //     result: "success",
        //     response: {
        //         message: "Data fetched Successfully",
        //         code: "DATA"
        //     },
        //     data: obj
        // });
    },
    getProfileViews: (req, res, next) => {
        let ans = [];
        let days = parseInt(req.query.days || 30);
        startDate = Date.now() - ((days * 24) * 60 * 60 * 1000);
        startDate = new Date(startDate).setHours(0, 0, 0, 0);
        profileViewModel.find({
            userId: (req.user || {}).userId || null,
            frequency: "day",
            feature: "profileview",
            timestamp: {
                $gte: new Date(startDate)
            }
        }).sort({
            timestamp: 1
        }).select({
            timestamp: 1,
            count: 1
        }).then((data) => {
            for (let i = 1; i <= days; i++) {
                let _f = 0;
                abc: for (let j = 0; j < data.length; j++) {
                    const element = data[j];
                    console.log(new Date(startDate), element.timestamp)
                    if (new Date(startDate).getTime() === new Date(element.timestamp).getTime()) {
                        ans.push({
                            count: element.count,
                            timestamp: element.timestamp
                        });
                        _f = 1;
                        break abc;
                    }
                }
                if (!_f) {
                    ans.push({
                        count: parseInt(Math.random()*100),
                        timestamp: new Date(startDate)
                    });
                }
                startDate = startDate + (24 * 60 * 60 * 1000)
            }
            res.json({
                result: "success",
                response: {
                    message: "Data fetched Successfully",
                    code: "DATA"
                },
                data: {
                    graphData: ans
                }
            });
        }).catch((err) => {
            next(err)
        })
    },
    getBookmarksView: (req, res, next) => {
        let ans = []
        let days = parseInt(req.query.days || 30);
        startDate = Date.now() - ((days * 24) * 60 * 60 * 1000);
        startDate = new Date(startDate).setHours(0, 0, 0, 0);
        profileViewModel.find({
            userId: (req.params || {}).answerId || null,
            frequency: "day",
            feature: "bookmarkview",
            timestamp: {
                $gte: new Date(startDate)
            }
        }).sort({
            timestamp: 1
        }).select({
            timestamp: 1,
            count: 1
        }).then((data) => {
            for (let i = 1; i <= days; i++) {
                let _f = 0;
                abc: for (let j = 0; j < data.length; j++) {
                    const element = data[j];
                    console.log(new Date(startDate), element.timestamp)
                    if (new Date(startDate).getTime() === new Date(element.timestamp).getTime()) {
                        ans.push({
                            count: element.count,
                            timestamp: element.timestamp
                        });
                        _f = 1;
                        break abc;
                    }
                }
                if (!_f) {
                    ans.push({
                        count: parseInt(Math.random()*31),
                        timestamp: new Date(startDate)
                    });
                }
                startDate = startDate + (24 * 60 * 60 * 1000)
            }
            res.json({
                result: "success",
                response: {
                    message: "Data fetched Successfully",
                    code: "DATA"
                },
                data: {
                    graphData: ans
                }
            });
        }).catch((err) => {
            next(err)
        })
    },
    getViews: (req, res, next) => {
        try {
            let frequency = req.query.frequency || "day";
            frequency = frequency.toLowerCase();
            let type = req.query.type || "signin";
            type = type.toLowerCase();
            let obj = {
                frequency: frequency,
                type: type,
                graphData: [],
            }
            let startDate = null;
            console.log("CHECK > >> > ");

            let sendData = (data) => {
                res.json({
                    result: "success",
                    response: {
                        message: "Data fetched Successfully",
                        code: "DATA"
                    },
                    data: data
                });
            }
            switch (frequency) {
                case "hour":
                    startDate = Date.now() - (60 * 60 * 1000);
                    startDate = new Date(startDate).setSeconds(0, 0);
                    console.log("query" ,{
                        frequency: "min",
                        feature: obj.type,
                        timestamp: {
                            $gte: new Date(startDate)
                        }
                    })
                    timeModel.find({
                        frequency: "min",
                        feature: obj.type,
                        timestamp: {
                            $gte: new Date(startDate)
                        }
                    }).sort({
                        timestamp: 1
                    }).select({
                        timestamp: 1,
                        count: 1
                    }).then(d => {
                        console.log(JSON.stringify(d,null,2));
                        for (let i = 1; i <= 60; i++) {
                            let _f = 0;
                            abc: for (let j = 0; j < d.length; j++) {
                                const element = d[j];
                                console.log(new Date(startDate).getTime(), new Date(element.timestamp).getTime())
                                if (new Date(startDate).getTime() === new Date(element.timestamp).getTime()) {
                                    console.log("IN")
                                    obj.graphData.push({
                                        count: element.count,
                                        timestamp: element.timestamp
                                    });
                                    _f = 1;
                                    break abc;
                                }
                            }
                            if (!_f) {
                                obj.graphData.push({
                                    count: 0,
                                    timestamp: new Date(startDate)
                                });
                            }
                            startDate = startDate + (1 * 60 * 1000)
                        }
                        sendData(obj);
                    }).catch(e => console.error(e));
                    break;
                case "day":
                    startDate = Date.now() - (24 * 60 * 60 * 1000);
                    startDate = new Date(startDate).setMinutes(0, 0, 0);
                    timeModel.find({
                        frequency: "hour",
                        feature: obj.type,
                        timestamp: {
                            $gte: new Date(startDate)
                        }
                    }).sort({
                        timestamp: 1
                    }).select({
                        timestamp: 1,
                        count: 1
                    }).then(d => {
                        for (let i = 1; i <= 24; i++) {
                            let _f = 0;
                            abc: for (let j = 0; j < d.length; j++) {
                                const element = d[j];
                                console.log(new Date(startDate), element.timestamp)
                                if (new Date(startDate).getTime() === new Date(element.timestamp).getTime()) {
                                    obj.graphData.push({
                                        count: element.count,
                                        timestamp: element.timestamp
                                    });
                                    _f = 1;
                                    break abc;
                                }
                            }
                            if (!_f) {
                                obj.graphData.push({
                                    count: 0,
                                    timestamp: new Date(startDate)
                                });
                            }
                            startDate = startDate + (60 * 60 * 1000)
                        }
                        sendData(obj);
                    }).catch(e => console.error(e));
                    break;
                case "week":
                    startDate = Date.now() - (7 * 24 * 60 * 60 * 1000);
                    startDate = new Date(startDate).setHours(0, 0, 0, 0);;
                    timeModel.find({
                        frequency: "day",
                        feature: obj.type,
                        timestamp: {
                            $gte: new Date(startDate)
                        }
                    }).sort({
                        timestamp: 1
                    }).select({
                        timestamp: 1,
                        count: 1
                    }).then(d => {
                        for (let i = 1; i <= 7; i++) {
                            let _f = 0;
                            abc: for (let j = 0; j < d.length; j++) {
                                const element = d[j];
                                console.log(new Date(startDate), element.timestamp)
                                if (new Date(startDate).getTime() === new Date(element.timestamp).getTime()) {
                                    obj.graphData.push({
                                        count: element.count,
                                        timestamp: element.timestamp
                                    });
                                    _f = 1;
                                    break abc;
                                }
                            }
                            if (!_f) {
                                obj.graphData.push({
                                    count: 0,
                                    timestamp: new Date(startDate)
                                });
                            }
                            startDate = startDate + (24 * 60 * 60 * 1000)
                        }
                        sendData(obj);
                    }).catch(e => console.error(e));
                    break;
                case "month":
                    startDate = Date.now() - (30 * 24 * 60 * 60 * 1000);
                    startDate = new Date(startDate).setHours(0, 0, 0, 0);;
                    timeModel.find({
                        frequency: "day",
                        feature: obj.type,
                        timestamp: {
                            $gte: new Date(startDate)
                        }
                    }).sort({
                        timestamp: 1
                    }).select({
                        timestamp: 1,
                        count: 1
                    }).then(d => {
                        for (let i = 1; i <= 31; i++) {
                            let _f = 0;
                            abc: for (let j = 0; j < d.length; j++) {
                                const element = d[j];
                                console.log(new Date(startDate), element.timestamp)
                                if (new Date(startDate).getTime() === new Date(element.timestamp).getTime()) {
                                    obj.graphData.push({
                                        count: element.count,
                                        timestamp: element.timestamp
                                    });
                                    _f = 1;
                                    break abc;
                                }
                            }
                            if (!_f) {
                                obj.graphData.push({
                                    count: 0,
                                    timestamp: new Date(startDate)
                                });
                            }
                            startDate = startDate + (24 * 60 * 60 * 1000)
                        }
                        sendData(obj);
                    }).catch(e => console.error(e));
                    break;
                default:
                    break;
            }
            console.log("CHECK  < < < < < > >> > ");

        } catch (error) {
            console.log(error)
        }

    }
}