const mongoose = require('../util/mongoose')
const Moment = require('moment') // 时间格式化
const fs = require('fs-extra') // 时间格式化
const PATH = require('path') // 时间格式化

// 创建的Model模型 （collection）
var PositionModel = mongoose.model('positions', new mongoose.Schema({
    section: String,
    Name: String,
    number: String,
    salary: String,
    position: String,
    createTime: String,
    formatTime: String,
    Logo: String
}));

// 返回列表全部数据
const listall = (query) => {
    let _query = query || {}// 查询的约定条件
    return PositionModel.find(_query).sort({createTime: -1}).then((results) => {
        return results
    }).catch((err) => {
        return false
    })
}



// 返回列表数据
const list = async ({ pageNo = 1, pageSize = 5,value='',search='' }) => {
    let re = new RegExp(search, 'i')
    // let Search = search ? { Name: re } : {}
    let Value = value ? { section: value } : '';
    let Search = search ? { Name: re } : '';
    let _query = Value?Value:{}
    if( Search){
        _query = Search;
    }
   
       
    // 查询的约定条件
    // limit // 取几条
    // skip // 从哪里开始
    let _all_items = await listall(_query)


    return PositionModel.find(_query)
    .sort({createTime: -1})
    .skip((pageNo - 1) * pageSize)// 从哪一页开始
    .limit(~~pageSize)// 截取多少
    .then((results) => {

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
    }).catch((err) => {
        return false
    })
}

// 保存数据
const save = (body) => {
    // 此时的时间
    let _timestamp = Date.now()
    // 根据这个时间创建moment
    let moment = Moment(_timestamp)
    body.Logo =  body.Logo || default_logo
    return new PositionModel({
        ...body,
        createTime: _timestamp,
        formatTime: moment.format("YYYY-MM-DD, hh:mm")
    })
    .save()
    .then((result) => {
        return result
    })
    .catch((err) => {
        return false
    })

}
// 删除
const remove = async( { id } ) => {
    // 删除数据库中的某一条数据
    let _row = await listone({ id })
    return PositionModel.deleteOne({ _id: id }).then((results) => {
        results.deleteId = id
        if ( _row.Logo) {
            fs.removeSync(PATH.resolve(__dirname, '../public'+_row.Logo))
        }  
        return results
    }).catch((err) => {
        // fs.appendFileSync('./logs/logs.txt', Moment().format("YYYY-MM-DD, hh:mm") + '' +JSON.stringify(err))
        return false
    })
}
//单条数据
const listone = ({ id }) => {
    return PositionModel.findById(id).then((results) => {
        return results
    }).catch((err) => {
        return false
    }) 
}
//各部门数据
// const section = ({ sectionName }) => {
//     let _query = {
//         section: sectionName
//     }
//     return PositionModel.find(_query).sort({createTime: -1}).then((results) => {
//         return results
//     }).catch((err) => {
//         return false
//     }) 
// }

//搜索的数据
// const search = ({ val }) => {
//     let _query = {
//         $or: [
//             { Name: val}, {section:val}
//          ]
       
//     }
//     console.log(_query, 111)
//     return PositionModel.find(_query).sort({createTime: -1}).then((results) => {
//         return results
//     }).catch((err) => {
//         return false
//     }) 
// }
//更新数据
const update = (body) => {
    if ( !body.Logo ) delete body.Logo

    if ( body.republish ) {
        let _timestamp = Date.now()
        let moment = Moment(_timestamp)
        body.createTime = _timestamp
        body.formatTime = moment.format("YYYY-MM-DD, hh:mm")
    }
    return PositionModel.updateOne({ _id: body.id }, { ...body }).then((results) => {
        return results
    }).catch((err) => {
        return false
    }) 
}


module.exports = {
    list,
    listall,
    save,
    remove,
    listone,
    update
   
}