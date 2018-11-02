const URL = require('url')

// 返回用户登录状态
import user_model from '../models/user'

const userSigninState = async () => {
    // return !!URL.parse(window.location.href, true).query.ok
    let isSignIn = await user_model.isSignIn()
   
    return !!(isSignIn.status === 200)
    // return true
}
// 验证用户登录状态
const userSigninAuth =async (success, fail) => {
    let auth = await userSigninState()
    if ( auth ) {
        success(auth)
        return true;
    } else {
        fail()
        return false
    }
}

export  {
    userSigninState,
    userSigninAuth
}

export default {
    userSigninState,
    userSigninAuth
}