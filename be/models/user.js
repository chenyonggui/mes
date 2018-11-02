

const mongoose  = require('../util/mongoose')

const UsersModel = mongoose.model('users')


const UserInfo=(id) => {
    return UsersModel
    .findById(id)
    .then(results => {
        return results
    })
    .catch(err => {
        return false
    })
}
const auths = () => {
    return {
        'map': 1,
        'list': 1,
        'list-remove': 1,
        'list-update': 2,
        'list-add': 1,
    }
}



const listall = (query) => {
    let _query = query || {}// 查询的约定条件
    return UsersModel.find(_query).sort({createTime: -1}).then((results) => {
        return results
    }).catch((err) => {
        return false
    })
}


const list = async ({ pageNo = 1, pageSize = 5,value='',search='' }) => {
    let re = new RegExp(search, 'i')
    // let Search = search ? { Name: re } : {}
    let Value = value ? { section: value } : '';
    let Search = search ? { Name: re } : '';
    let _query = Value?Value:{}
    if( Search){
        _query = Search;
    }
    let _all_items = await listall(_query)
    return UsersModel
    .find(_query)
    .sort({createTime: -1})
    .skip((pageNo - 1) * pageSize)// 从哪一页开始
    .limit(~~pageSize)// 截取多少
    .then(results => {
         return { 
            items: results, 
            pageInfo: { // 页码信息
                pageNo, // 当前页
                pageSize, // 一页数量
                total: _all_items.length, // 总数
                totalPage: Math.ceil(_all_items.length / pageSize),
                search : search // 总页数
            }
        }
    })
    .catch(err => {
        return false
    })
}

//删除数据
const remove = async( { id } ) => {
    // 删除数据库中的某一条数据
    return UsersModel.deleteOne({ _id: id }).then((results) => {
        results.deleteId = id
        return results
    }).catch((err) => {
        // fs.appendFileSync('./logs/logs.txt', Moment().format("YYYY-MM-DD, hh:mm") + '' +JSON.stringify(err))
        return false
    })
}


//更新权限
const update = (body) => {
    let authority = body.authority;
    if(authority == '超级管理员'){
        authority = '0';
    }else if(authority == '高级管理员'){
        authority = '1';
    }else{
        authority = '2';
    }
    
    let bodys = {
        authority:authority,
    }
    if(body.password){
        bodys = {
            authority:authority,
            password:body.password
        }
    }else{
        bodys = {
            authority:authority,
        }
    }

    return UsersModel.updateOne({ _id: body.id }, {...bodys}).then((results) => {
        return results
    }).catch((err) => {
        return false
    }) 
}

module.exports = {
    UserInfo,
    auths,
    list,
    remove,
    update
}