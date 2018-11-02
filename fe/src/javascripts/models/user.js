//登录状态
const isSignIn = () => {
    return $.ajax({
        url: '/api/v1/user/isSignIn',
        success: results => results
    })
}

//登录持续
const info =()=>{
    return $.ajax({
        url: '/api/v1/user/info',
        success: results => results
    })
}

//退出
const exit =()=>{
    return $.ajax({
        url: '/api/v1/user/exit',
        success: results => results
    })
}
//权限
const allow = (auth) => {
    return $.ajax({
        url: '/api/v1/user/allow',
        data: { auth },
        success: results => results
    })
}
//管理员列表
const list = (_page) => {
    return $.ajax({
        url: '/api/v1/user/list',
        data:_page,
        success:(results) => {
            
           return results
        }
    })
}
// 提供删除数据
const remove = (data) => {
    return $.ajax({
        url: '/api/v1/user/remove',
        data,
        success:(results) => {
            
           return results
        }
    })
}

// 更新某条数据
const update = (data) => {
    return new Promise((resolve) => {
        $('#myModal #update-form').ajaxSubmit({
            url: '/api/v1/user/update',
            type: 'POST',
            data:data,
            success: (results) => {
                resolve(results)
            }
        })
    })
}
export default{
    isSignIn,
    info,
    exit,
    allow,
    list,
    remove,
    update
}