let jwt = require('./../commons/jwt');
let authservice = require('./../services/authservice').router;
let userservice = require('./../services/userservice').router;
let followservice = require('./../services/followservice').router;
let questionservice = require('../services/questionservice').router;
let conversationservice = require('./../services/conversationservice').router;
let answerservice = require('../services/answerservice').router;
let topicservice = require('../services/topicservice').router;
let analyticService = require('../services/analyticservice');
let uploadService = require('../services/uploadService');
let notificationservice = require('../services/notificationservice').router;
let searchservice = require("../services/searchservice").router;

// const upload = require('../services/imageservice');

// const singleUpload = upload.single('profileimage');
// versionRouter.put("/users/:userId/image", jwt.verifyRequest, function (req, res) {
//     singleUpload(req, res, function (err) {
//         if (err) {
//             return res.status(422).send({
//                 errors: [{
//                     title: 'Image Upload Error',
//                     detail: err.message
//                 }]
//             });
//         }

//         return res.json({
//             'imageUrl': req.file.location
//         });
//     });
// });
module.exports = (express) => {
    try {
        let versionRouter = express.Router();

        /* Auth Routes */
        versionRouter.post('/signin', authservice.signin);
        versionRouter.post('/signup', authservice.signup);
        /* Auth Routes */

        versionRouter.post('/search', jwt.verifyRequest, searchservice.search);

        /* User Routes */
        //versionRouter.post('/users', userservice.create);
        versionRouter.get('/users/:userId', jwt.verifyRequest, userservice.read);

        versionRouter.put("/users/:userId/image", jwt.verifyRequest, uploadService("profileUpload"), userservice.uploadImage);
        versionRouter.get("/users/:userId/image", uploadService('profileRead'));
        versionRouter.put('/users/:userId', jwt.verifyRequest, userservice.update);
        versionRouter.delete('/users/:userId', jwt.verifyRequest, userservice.delete);
        versionRouter.post('/users/:userId/topic', jwt.verifyRequest, userservice.followTopic);
        versionRouter.delete('/users/:userId/topic', jwt.verifyRequest, userservice.unFollowTopic);
        versionRouter.get('/users/:userId/notifications', jwt.verifyRequest, notificationservice.readMany);
        /* User Routes */

        /* Follow Routes */
        versionRouter.post('/follow/:userId', jwt.verifyRequest, followservice.markFollow); // only self can
        versionRouter.post('/unfollow/:userId', jwt.verifyRequest, followservice.markUnfollow); // only self can
        versionRouter.get('/users/:userId/followers', jwt.verifyRequest, followservice.getFollowers);
        versionRouter.get('/users/:userId/following', jwt.verifyRequest, followservice.getFollowing);
        /* Follow Routes */

        /* Question Routes */

        /* UserFeed */
     versionRouter.get('/userfeeds',jwt.verifyRequest, questionservice.userFeedList);
     /* UserFeed */
     
    /* User Profile Related Question, content routes*/
    versionRouter.get('/users/:userId/questions',jwt.verifyRequest, questionservice.userQuestionList);
    versionRouter.get('/users/:userId/answers',jwt.verifyRequest, questionservice.userAnswerList)
    /* User Profile Related Question, content routes*/

    /* User Content */
    versionRouter.get('/user/:userId/content',jwt.verifyRequest, questionservice.userContentGet);
    /* User Content */
    
        versionRouter.post('/questions', jwt.verifyRequest, questionservice.create);
        versionRouter.get('/questions/:questionId', jwt.verifyRequest, questionservice.read);
        //versionRouter.put('/questions/:questionId', jwt.verifyRequest, questionservice.update);
        //versionRouter.delete('/questions/:questionId', jwt.verifyRequest, questionservice.delete);
        versionRouter.post('/questions/:questionId/follow', jwt.verifyRequest, questionservice.questionFollow); // NOtify Hrishi
        /* Question Routes */

        /* conversations Routes */
        versionRouter.get('/conversations/sendto', jwt.verifyRequest, conversationservice.searchUsers);
        versionRouter.get('/conversations', jwt.verifyRequest, conversationservice.getConversations);
        versionRouter.get('/conversations/:conversationId', jwt.verifyRequest, conversationservice.getOneConversation); // only self can
        versionRouter.post('/conversations/message', jwt.verifyRequest, conversationservice.sendMessage);
        /* conversations Routes */

        /* Answer Routes */
        versionRouter.post('/answers', jwt.verifyRequest, answerservice.create);
        versionRouter.get('/answers', jwt.verifyRequest, analyticService.getAnswers);
        versionRouter.post('/answers/:answerId/vote', jwt.verifyRequest, answerservice.upordownvote); // notify Hrishi
        versionRouter.post('/answers/:answerId/bookmark', jwt.verifyRequest, answerservice.answerBookmark); // notify Hrishi
        versionRouter.post('/answers/:answerId/comments', jwt.verifyRequest, answerservice.answerComments);
        versionRouter.get('/answers/:answerId/:type', jwt.verifyRequest, analyticService.getAnswerStats);
        //versionRouter.get('/answers/:questionId', jwt.verifyRequest, answerservice.read);
        versionRouter.put('/answers/:answerId', jwt.verifyRequest, answerservice.update);
        //versionRouter.delete('/answers/:questionId', jwt.verifyRequest, answerservice.delete);

        versionRouter.get('/views', analyticService.getViews);
        /* Answer Routes */

        /* Topic Routes */
        versionRouter.post('/topics', jwt.verifyRequest, topicservice.create);
        versionRouter.get('/topics/:topicId', jwt.verifyRequest, topicservice.read);
        versionRouter.get('/topics', jwt.verifyRequest, topicservice.readMany);
        versionRouter.put('/topics/:questionId', jwt.verifyRequest, topicservice.update);
        versionRouter.delete('/topics/:questionId', jwt.verifyRequest, topicservice.delete);
        /* Topic Routes */

        /* question related to topic*/
        versionRouter.get('/topicQuestions', jwt.verifyRequest, questionservice.questionsRelatedToTopic); //user related topic questions as well as any topic question
        /* question related to topic*/
        
        /* user bookmarked answers and question*/
        versionRouter.get('/users/:userId/bookmarkedAnswers', jwt.verifyRequest, questionservice.userBookmarkedAnswers)
        /* user bookmarked answers and question*/

        return versionRouter;
    } catch (error) {
        console.error(error)
    }

}