
const userSigninAuth = (req, res, next) => {
    if ( req.session.userinfo ) {
        next()
    } else {
        res.render('user', {
            code: 403,
            data: JSON.stringify({ msg: '登录可能过期，请重新登录' })
        })
    }
}

module.exports = {
    userSigninAuth
}