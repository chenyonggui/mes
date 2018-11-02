var express = require('express');
var router = express.Router();
var fileUpload = require('../middlewares/fileUpload')
var position_controller = require('../controllers/position')
var auth = require('../middlewares/auth')
/* GET home page. */
router.get('/list',auth.userSigninAuth, position_controller.list)
router.post('/save', fileUpload, position_controller.save)
router.get('/remove',auth.userSigninAuth, position_controller.remove)
router.get('/listone',auth.userSigninAuth, position_controller.listone)
// router.get('/listsection', position_controller.section)
router.post('/update',fileUpload, position_controller.update)
// router.get('/search', position_controller.search)


module.exports = router; 
