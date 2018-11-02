
var express = require('express');
var router = express.Router();
var user_controller = require('../controllers/user')
var auth = require('../middlewares/auth')
const resApplicationJson = (req, res, next) => {
    res.set('content-type', 'application/json; charset=utf8')
    next()
}
// 为/position中所有的路由都使用这个中间件
router.use(resApplicationJson)

router.get('/isSignIn', user_controller.isSignIn);
router.get('/info',auth.userSigninAuth, user_controller.info);
router.get('/exit', user_controller.exit);
router.get('/allow',auth.userSigninAuth, user_controller.allow);
router.get('/list',auth.userSigninAuth, user_controller.list);
router.get('/remove',auth.userSigninAuth, user_controller.remove);
router.post('/update',auth.userSigninAuth, user_controller.update);
module.exports = router