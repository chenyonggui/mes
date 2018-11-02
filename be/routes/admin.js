var express = require('express');
var router = express.Router();
var fileUpload = require('../middlewares/fileUpload')
var admin_controller = require('../controllers/admin')



const resApplicationJson = (req, res, next) => {
    res.set('content-type', 'application/json; charset=utf8')
    next()
}

router.use(resApplicationJson)

router.post('/signup', admin_controller.signUp);
router.post('/signin', admin_controller.signIn);


module.exports = router;