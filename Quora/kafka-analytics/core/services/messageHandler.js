let analyticservice = require("./analyticservice");
module.exports = (type, payload) => {
    return new Promise((resolve, reject) => {
        try {
            if (!type || !payload) {
                return reject("No Data Provided")
            }
            if (!!analyticservice[type]) {
                analyticservice[type](payload).then(resolve, reject);
            } else {
                return reject("No Type Match")
            }
        } catch (error) {
            reject(error)
        }
    })

}