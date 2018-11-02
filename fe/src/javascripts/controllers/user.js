import user_model from '../models/user'
const renderUserInfo = async () => {
    // 获取用户信息，再去渲染
    let _result = await user_model.info()
    
    if ( _result.status === 304 ) { // 用户没有登录信息
        alert('请重新登录')
        window.location.href = '/admin.html'
    } else {
        $('.hidden-xs').html(_result.data.username)
        
        if(_result.data.authority =="0"){
            $('#Administrator').html('超级管理员')
            $('#vip').html('SVIP')
        }else if(_result.data.authority =="1"){
            $('#Administrator').html('高级管理员')
            $('#vip').html('VIP')
        }else{
            $('#Administrator').html('普通管理员')
            $('#vip').html('vip')
        }
        if(_result.data.authority === "0"){
            $('#authority').show()
        }
    }


    $('#exit').click( async function () {
        let _result = await user_model.exit()
        if ( _result.status === 200 ) {
            $.cookie('connect.sid', { expires: -1 })
            window.location.href = '/admin.html'
        }
    })


}

export default {
    renderUserInfo
}