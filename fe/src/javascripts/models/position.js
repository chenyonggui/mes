
// 提供列表数据
const list = (page) => {
    return $.ajax({
        url: '/api/v1/position/list',
        data: page,
        success:(results) => {
            
           return results
        }
    })
}

// 提供保存数据
const save = (data) => {
    return new Promise((resolve) => {
        $('.position-save #save-form').ajaxSubmit({
            url: '/api/v1/position/save',
            type: 'POST',
            success: (results) => {
                resolve(results)
            }
        })
    })
}

// 提供删除数据
const remove = (data) => {
    return $.ajax({
        url: '/api/v1/position/remove',
        data,
        success:(results) => {
            
           return results
        }
    })
}

// 提供某条数据
const listone = (data) => {
    return $.ajax({
        url: '/api/v1/position/listone',
        data,
        success:(results) => {
            
           return results
        }
    })
}
// 提供各部门员工数据
// const listsection = (data) => {
//     return $.ajax({
//         url: '/api/v1/position/listsection',
//         data,
//         success:(results) => {
            
//            return results
//         }
//     })
// }

// 提供搜索获取的数据
// const search = (data) => {
//     return $.ajax({
//         url: '/api/v1/position/search',
//         data,
//         success:(results) => {
            
//            return results
//         }
//     })
// }
// 更新某条数据
const update = (data) => {
    return new Promise((resolve) => {
        $('.position-update #update-form').ajaxSubmit({
            url: '/api/v1/position/update',
            type: 'POST',
            success: (results) => {
                resolve(results)
            }
        })
    })
}
export default {
    list,
    save,
    remove,
    listone,
    update
}


