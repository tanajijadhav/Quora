const rs = require("./../commons/responses");
const utils = require("./../commons/utils");
let questionModel = require("../models/questionmodel")
let topicModel = require("../models/topicmodel")
let userModel = require("../models/usermodel")

let service = {
    search: (...args) => {
        return new Promise(async function (resolve, reject) {
            try {
                
                let searchLimit = 2

                let output = []
                let _session = args[0] || {};
                let body = args[1] || {};
                let searchTerm = body.searchTerm || null;
                if (searchTerm === null){
                    console.error("Nothing in the search term, so sending empty list in response")
                    return resolve(output)
                }
                else{
                    await questionModel.find({questionText:new RegExp(searchTerm, "i")}).select({questionId:1,questionText:1,_id:0}).limit(searchLimit)
                    .then((questionObjs) => {
                        console.log(questionObjs.length)
                        for (let index=0;index<questionObjs.length;index++){
                            let temp = {}
                            temp["id"] = questionObjs[index].questionId
                            temp["value"] = questionObjs[index].questionText
                            temp["text"] = questionObjs[index].questionText
                            temp["type"] = "QUESTION"
                            output.push(temp)
                        }
                    }).catch(reject);

                    
                    await userModel.find({ $or:[ {firstName:new RegExp(searchTerm, "i")}, {lastName:new RegExp(searchTerm, "i")} ]}).select({firstName:1,lastName:1,userId:1,_id:0}).limit(searchLimit)
                    .then((userObjs) => {
                        for (let index=0;index<userObjs.length;index++){
                            let temp = {}
                            temp["id"] = userObjs[index].userId
                            temp["value"] = "Profile : " + userObjs[index].firstName +" "+ userObjs[index].lastName
                            temp["text"] = "Profile : " + userObjs[index].firstName +" "+ userObjs[index].lastName
                            temp["type"] = "PROFILE"
                            output.push(temp)
                        }
                    }).catch(reject);


                    await topicModel.find({topicText:new RegExp(searchTerm, "i")}).select({_id:0}).limit(searchLimit)
                    .then((topicObjs) => {
                        for (let index=0;index<topicObjs.length;index++){
                            let temp = {}
                            temp["id"] = topicObjs[index].topicId
                            temp["value"] = "Topic : " + topicObjs[index].topicText
                            temp["text"] = "Topic : " + topicObjs[index].topicText
                            temp["type"] = "TOPIC"
                            output.push(temp)
                        }
                    }).catch(reject);

                }
                resolve(output)
            } catch (e) {
                console.error(e)
                return reject(e);
            }
        });
    }
}
let router = {
    search: (req, res, next) => {
        let successCB = (data) => {
            res.json({
                result: "success",
                response: [{
                    message: "Search Results",
                    code: "SEARCH"
                }],
                data: data
            })
        };
        service.search(req.user, req.body).then(successCB, next);
    }
};
module.exports.service = service;
module.exports.router = router;