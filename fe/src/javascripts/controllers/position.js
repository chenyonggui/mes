import { bus, handleToastByData } from '../util'
// 职位员工列表视图
import position_list_template from '../views/position-list.html'
// 添加员工视图
import position_save_template from '../views/position-save.html'
// 修改信息视图
import position_update_template from '../views/position-update.html'
// model
import position_model from '../models/position'
import user_model from '../models/user'
import qs from 'querystring'
import not_allow_template from '../views/not-allow.html'


// 列表视图的控制器
const list = async (req, res, next) => {
    req.query = req.query || {} // 防止没有参数的时候，req.query为null
    let _page = {
        value:req.query.value,// 页面信息， 当点击了分页器按钮后，页面url就会变化，然后list控制器就会重新执行，重新获取数据再渲染
        pageNo: req.query.pageNo,
        pageSize: req.query.pageSize,
        search: req.query.search,
        index: req.query.index
    }

    // 编译模板 
    let html = template.render(position_list_template, {
        data: (await position_model.list(_page)).data // 获取到列表数据
    })
    let _page1= (await position_model.list(_page)).data;

    res.render(html)
    bindListEvent(_page,_page1)// 给添加按钮绑定事件
}

// list的事件绑定
const bindListEvent = (_page,_page1) => {
    console.log(_page);
    // 添加按钮点击跳转到添加路由
    $('.position-list #addbtn').on('click', async function () {
        let _can = await user_model.allow('list-add')
        if (_can.status === 403) {
            alert('登陆后操作')
            window.location.href = '/admin.html'
            return false;
        }
        if (_can.status === 402) {
            alert("您没有权限，请联系管理员");
            return false;
        }
        bus.emit('go','/position-save')
    })
    let listval = _page.value?_page.value:_page.search;
    let title  = listval?listval+"员工列表":"员工列表";
    listval = listval?listval:"Here";
    $('.content-wrapper>.content-header>h1').html(title);
    $('.position-list .pos-update').on('click', async function () {
        let _can = await user_model.allow('list-update')
        if (_can.status === 403) {
            alert('登陆后操作')
            window.location.href = '/admin.html'
            return false;
        }
        if (_can.status === 402) {
            alert("您没有权限，请联系管理员");
            return false;
        }
        let id = $(this).parents('tr').data('id')
        bus.emit('go','/position-update', { id })
    })
    $('.nav-link li.nav-link-chird').eq(_page.index).addClass('active').siblings().removeClass('active');
    let list = "<li class='staff-list'><a href='javascript:void(0)'><i class='fa fa-group'></i> 员工列表</a></li>"+
    "<li ><a href='javascript:void(0)'></i> "+listval+"</a></li>"
    $('.content-wrapper>.content-header>.breadcrumb').html(list);
    $('.pos-remove').on('click',async function () {
        let _can = await user_model.allow('list-remove')
        if (_can.status === 403) {
            alert('登陆后操作')
            window.location.href = '/admin.html'
            return false;
        }
        if (_can.status === 402) {
            alert("您没有权限，请联系管理员");
            return false;
        }
        handleRemovePosition.bind(this,_page1)()
    })
    $('#possearch').on('click',function(e){
        e.preventDefault()
        let val = $('#keywords_1').val()
        console.log(val);
        bus.emit('go','/position-list?search='+val)
       
    })
    $('.breadcrumb>.staff-list').on('click',function(){
             bus.emit('go', '/position-list')
           })
}
// 删除操作
const handleRemovePosition = async function (_page1)  {
    
    let id = $(this).parents('tr').data('id')
    let _data = await position_model.remove({id: id})  
    let trs = $('.position-list__tabel tr[data-id]')
    // 如果只剩一个，将pageNo-1
    let _pageNo = trs.length > 1 ? _page1.pageInfo.pageNo : (_page1.pageInfo.pageNo - (_page1.pageInfo.pageNo > 1 ? 1 : 0))
    console.log(_pageNo);
    handleToastByData(_data, {
        isReact: false,
        success: (data) => {
            // 删除成功后
            bus.emit('go', '/position-list?pageNo='+_pageNo+'&_='+data.deleteId+'&search='+_page1.pageInfo.search)
        }
    })
}

// save视图的控制器
const save =  (req, res, next) => { 
    res.render(position_save_template)
    bindSaveEvent()
    
}

// save的事件绑定
const bindSaveEvent = () => {
    $('.content-wrapper>.content-header>h1').html('员工列表');
    // 返回按钮逻辑
    let list = "<li class='staff-list'><a href='javascript:void(0)'><i class='fa fa-group'></i> 员工信息</a></li>"+
    "<li class='active'><a href='javascript:void(0)'><i class='fa fa-male active'></i> 添加员工</a></li>"
    $('.content-wrapper>.content-header>.breadcrumb').html(list);
    $('.position-save #back').on('click', function () {
        bus.emit('go', '/position-list')

    })
    $('.position-save #save-form').submit(handleSaveSubmit)
    $('.breadcrumb>.staff-list').on('click',function(){
        bus.emit('go', '/position-list')
    })
}

// 开关防止多次提交
let _isLoading = false
const handleSaveSubmit = async function (e) {
    
    e.preventDefault()
    
    if ( _isLoading ) return false;

    _isLoading = true
    // 拿到form的数据
    // let _params = qs.parse($(this).serialize())
    let _can = await user_model.allow('list-add')
    if (_can.status === 403) {
        alert('登陆后操作')
        window.location.href = '/admin.html'
        return false;
    }
    if (_can.status === 402) {
        alert("您没有权限，请联系管理员");
        return false;
    }
        bus.emit('go','/position-save')
    let result = await position_model.save()

    _isLoading = false

    handleToastByData(result)

    // handleToastByData(result, { isReact: false, success: () => {
    //     bus.emit('go', '/position-list')
    // }})
}


const update = async (req, res) => {
    let { id } = req.body// 要更新的数据的id
    // 获取id对应的数据进行渲染
    let html = template.render(position_update_template, {
        data: (await position_model.listone({ id })).data // 获取到列表数据
    })
    res.render(html)
    bindUpdateEvent()
}



const bindUpdateEvent = () => {
    // 返回按钮逻辑
    $('.position-update #back').on('click', function () {
        bus.emit('go', '/position-list')
    })
    let list = "<li class='staff-list'><a href='javascript:void(0)'><i class='fa fa-group'></i> 员工信息</a></li><li class='active'><a href='javascript:void(0)'><i class='fa fa-rotate-left active'></i> 修改信息</a></li>"
    $('.content-wrapper>.content-header>.breadcrumb').html(list);
    
    $('.position-update #update-form').submit(handleUpdateSubmit)
    $('.breadcrumb>.staff-list').on('click',function(){
        bus.emit('go', '/position-list')
    })
}

const handleUpdateSubmit = async function (e) {
    e.preventDefault();
    // let _datastr = $(this).serialize()
    // let _data = qs.parse(_datastr)
    let _results = await position_model.update()  
    handleToastByData(_results)
}

//部门数据
// const section = async (req, res) => {
//     let { sectionName,index } = req.body// 要更新的数据的id
//     // 获取id对应的数据进行渲染
//     let html = template.render(position_list_template, {
//         data: (await position_model.listsection({ sectionName })).data // 获取到列表数据
//     })
//     res.render(html)
//     bindsectionEvent(sectionName,index)
// }

// const bindsectionEvent = (sectionName,index) => {
//     // 添加按钮点击跳转到添加路由
//     $('.position-list #addbtn').on('click', function () {
//         bus.emit('go','/position-save')
//     })

//     $('.position-list .pos-update').on('click', function () {
//         let id = $(this).parents('tr').data('id')
//         bus.emit('go','/position-update', { id })
//     })
//     $('.content-wrapper>.content-header>h1').html(sectionName+'员工列表');
//     let list = "<li><a href='javascript:void(0)'><i class='fa fa-group'></i> 员工信息</a></li><li class='sectionlist'><a href='javascript:void(0)'><i class='fa fa-male'></i> 员工列表</a></li><li class='active'>"+sectionName+"</li>"
//     $('.content-wrapper>.content-header>.breadcrumb').html(list);
//     $('.nav-link li.nav-link-chird').eq(index).addClass('active').siblings().removeClass('active');
//     $('.pos-remove').on('click', handleRemovePosition)
//     $('.breadcrumb>.sectionlist').on('click',function(){
//         bus.emit('go', '/position-list')
//     })
//     $('#possearch').on('click',function(e){
//         e.preventDefault()
//         let val = $('#keywords_1').val()
//         bus.emit('go','/position-search', { val })
//     })
// }

//搜索
// const search = async (req, res) => {
//     let { val } = req.body// 要更新的数据的id
//     // 获取id对应的数据进行渲染
//     let html = template.render(position_list_template, {
//         data: (await position_model.search({ val })).data // 获取到列表数据
//     })
//     res.render(html)
//     bindsearchEvent()
// }

// const bindsearchEvent = () => {
//     // 添加按钮点击跳转到添加路由
//     $('.position-list #addbtn').on('click', function () {
//         bus.emit('go','/position-save')
//     })

//     $('.position-list .pos-update').on('click', function () {
//         let id = $(this).parents('tr').data('id')
//         bus.emit('go','/position-update', { id })
//     })
//     $('.content-wrapper>.content-header>h1').html('搜索列表');
//     let list = "<li class='staff-list'><a href='javascript:void(0)'><i class='fa fa-group'></i> 员工信息</a></li>"+
//     "<li class='active'>搜索</li>"
//     $('.content-wrapper>.content-header>.breadcrumb').html(list);
//     $('.pos-remove').on('click', handleRemovePosition)
//     $('.breadcrumb>.staff-list').on('click',function(){
//         bus.emit('go', '/position-list')
//     })
//     $('#possearch').on('click',function(e){
//         e.preventDefault()
//         let val = $('#keywords_1').val()
//         let a = Math.random()*10;
//         bus.emit('go','/position-search?_+'+a, { val })
//     })
// }
export default {
    list,
    save,
    update,
}