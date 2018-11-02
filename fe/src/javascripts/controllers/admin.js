
import admin_template from '../views/admin-forms.html'
import admin_model from '../models/admin-models'
import qs from 'querystring'
import toast from '../util/toast'

// 初始化动作
const init = () => {
    
    // 渲染视图
    render('signin')
    // 绑定事件
    bindEvent()
}

const bindEvent = () => {
    // 注意，使用了事件委托为切换按钮绑定事件（因为这两个按钮总是会被重新渲染）
    $('#admin').on('click', '.reg', function () {
        let _type = 'signup'
        render(_type)
    })

    // 注册表单
    $('#admin').on('submit', '#signUp-form', async function(e) {
        e.preventDefault()
        let _params = $(this).serialize()
        let _result = await admin_model.signUp(qs.parse(_params))
        console.log('a');
        if(_result.status == '201'){
            toast('用户已存在'); 
        }else if(_result.status == '500'){
            toast('失败，服务器出了问题');
        }else{
            toast('注册成功');
            render('signin')
        }
        
       
    })
    // 登录表单
    $('#admin').on('submit', '#signin-form', async function (e) {
        e.preventDefault()
        let _params = $(this).serialize()
        let _result = await admin_model.signIn(qs.parse(_params))
        if (_result.status == '203') {
            toast('密码错误');
        } else if (_result.status == '201') {
            toast('用户不存在');
        } else {
            // localStorage.user = qs.parse(_params).username
            window.location.href = "/"; 
        }
    
    })
}

// 根据类型来渲染视图，显示不同的组件
const render = (type) => {
    var _html = template.render(admin_template, {
        type: type
    })
    $('#admin').html(_html)
}

export default  {
    render,
    init
}