// 引入样式
import '../stylesheets/app.scss'
import user_controller from './controllers/user'
// 引入路由
import router from './router'
import { userSigninAuth } from './util/auth'
// 主体结构视图
const body_template = require('./views/body.html')
// 渲染整体内容结构
$('#wrapper').html(body_template)

userSigninAuth((auth) => { // 如果用户已经登录
    // 启动路由
    router.init()
    user_controller.renderUserInfo()
}, () => { // 没有登录，直接跳转到admin
    window.location.href="/admin.html"
})