const admin_model = require('../models/admin')
const { handleData } = require('../util')



const signUp = async (req, res,next) => {
   
    let _isuser_result = await admin_model.IsUser(req.body.username);
    if(!_isuser_result.length){
        let _data = await admin_model.signup(req.body);
        handleData(_data,res, 'admin');
    }else{
        //如果用户名存在
        res.render('admin', {
            code: 201,
            data: JSON.stringify('用户名已存在')
        })
    }
}

const signIn = async (req, res,next) => {
   
    let _isuser_result = await admin_model.IsUser(req.body.username);
    console.log(_isuser_result.length)
    if(!!_isuser_result.length){
        let _data = await admin_model.signin(req.body.pwd,_isuser_result[0]);
        if (_data) {
            req.session.userinfo = {
                userid: _isuser_result[0]._id,
                authority: _isuser_result[0].authority
            }
            res.render('admin', { code: 200, data: JSON.stringify('success') })
        } else {
            res.render('admin', { code: 203, data: JSON.stringify('密码错误') })
        }
    }else{
        //如果用户名存在
        res.render('admin', {
            code: 201,
            data: JSON.stringify('用户名不存在')
        })
    }
}
module.exports = {
    signUp,
    signIn
}