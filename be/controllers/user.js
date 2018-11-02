const user_model = require('../models/user')
const { handleData } = require('../util')
const isSignIn = (req, res, next) => {
   // 判断是否登录
   if ( req.session.userinfo ) {
       res.render('user', {
           code: 200,
           data: JSON.stringify({ msg: '用户已登录' })
       })
   } else {
        res.render('user', {
            code: 201,
            data: JSON.stringify({ msg: '用户未登录' })
        })
   }
}


//用户信息
const info = async (req, res) => {
    
    let _result = await user_model.UserInfo(req.session.userinfo.userid)

    res.render('user', {
        code: 200,
        data: JSON.stringify({
            userid: _result._id,
            username: _result.username,
            number: _result.number,
            authority: _result.authority
        })
    })

}

//退出
const exit = async (req, res) => {
    
    req.session.userinfo = null

    res.render('user', { code: 200, data: JSON.stringify({ msg: '删除成功' }) })

}
//权限
const  allow = ( req, res ) => {
    
    let _confine = user_model.auths()[req.query.auth]

    let _can = req.session.userinfo.authority <= _confine

    res.render('user', { code: _can ? 200 : 402, data: JSON.stringify({ msg: _can ? '可以操作' : '不能操作' }) })

}

//管理员列表
const list = async (req, res) => {
    
    let _data = await user_model.list(req.query)
    handleData(_data, res, 'user')

}

//删除管理员
const remove = async (req, res) => {
    let _data = await user_model.remove(req.query)
    // 如果数据已经删除了，同时删除图片
    handleData(_data, res, 'user')    
}


//更新权限
const update = async (req, res) => {
    
    let _data = await user_model.update(req.body)
    handleData(_data, res, 'user')
}
module.exports={
    isSignIn,
    info,
    exit,
    allow,
    list,
    remove,
    update
}