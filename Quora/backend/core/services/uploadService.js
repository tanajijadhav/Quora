let service = {};
var multer = require('multer');
var fs = require('fs');
var path = require('path');
let utils = require('./../commons/utils');
service.profileUpload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, callback) {
            let dir = 'uploads/profiles/';
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
            callback(null, dir);
        },
        filename: function (req, file, callback) {
            let filename = "File_" + req.params.userId;
            callback(null, filename);
        },
        onError: function (err, callback) {
            let error = {
                "message": "Error in file upload",
                "code": "MULTERERROR"
            }
            callback([error]);
        }
    }),
}).single('profileImage');
service.profileRead = (req, res, next) => {
    let userId = req.params.userId || null;
    res.header("Content-Type", 'application/png');
    if (fs.existsSync(path.resolve(process.cwd() + "/uploads/profiles/File_" + userId))) {
        res.sendFile(path.resolve("uploads/profiles/File_" + userId));
    } else {
        res.sendFile(path.resolve("uploads/profiles/mydefaultimage.png"));
    }
};
module.exports = (type) => {
    return service[type];
};