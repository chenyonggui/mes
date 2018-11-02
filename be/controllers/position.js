const { handleData } = require('../util')
const position_model = require('../models/position')

// 返回全部数据
const listall = async (req, res) => {
    res.set('content-type', 'application/json; charset=utf8')
    let _data = await position_model.listall()
    handleData(_data, res, 'position')
}

// list部分控制器
const list = async (req, res) => {
    res.set('content-type', 'application/json; charset=utf8')
    let _data = await position_model.list(req.query)
    handleData(_data, res, 'position')
}

// 添加员工
const save = async (req, res) => {
    // 接收到发送过来的数据 req.body, 然后存入数据库
    res.set('content-type', 'application/json; charset=utf8')
    let _data = await position_model.save(req.body)
    handleData(_data, res, 'position')
}

// 删除员工
const remove = async (req, res) => {
    res.set('content-type', 'application/json; charset=utf8')
    let _data = await position_model.remove(req.query)
    // 如果数据已经删除了，同时删除图片
    handleData(_data, res, 'position')
}
//单个数据
const listone = async (req, res) => {
    res.set('content-type', 'application/json; charset=utf8')
    let _data = await position_model.listone(req.query)
    handleData(_data, res, 'position')
}
//部门数据
// const section = async (req, res) => {
//     res.set('content-type', 'application/json; charset=utf8')
//     let _data = await position_model.section(req.query)
//     handleData(_data, res, 'position')
// }
//更新
const update = async (req, res) => {
    res.set('content-type', 'application/json; charset=utf8')
    let _data = await position_model.update(req.body)
    handleData(_data, res, 'position')
}
// //搜索
// const search = async (req, res) => {
//     res.set('content-type', 'application/json; charset=utf8')
//     let _data = await position_model.search(req.query)
//     handleData(_data, res, 'position')
// }


module.exports = {
    listall,
    list,
    save,
    remove,
    listone,
    update
}