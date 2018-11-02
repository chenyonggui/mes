import { bus, handleToastByData } from '../util'
// 管理员列表视图
import authority_list_template from '../views/authority-list.html'
// 添加员工视图

// model
import user_model from '../models/user'
import qs from 'querystring'

const list = async (req,res,next)=>{
    req.query = req.query || {} // 防止没有参数的时候，req.query为null
    let _page = {
        value:req.query.value,// 页面信息， 当点击了分页器按钮后，页面url就会变化，然后list控制器就会重新执行，重新获取数据再渲染
        pageNo: req.query.pageNo,
        pageSize: req.query.pageSize,
        search: req.query.search,
        index: req.query.index
    }



    let html = template.render(authority_list_template, {
        data: (await user_model.list(_page)).data // 获取到列表数据
    })
    let _page1= (await user_model.list(_page)).data;
    res.render(html)
    bindListEvent(_page,_page1);
}
const bindListEvent = (_page,_page1) => {
    // 添加按钮点击跳转到添加路由
   
    let listval = _page.value?_page.value:_page.search;
    let title  = "管理员列表";
    listval = listval?listval:"Here";
    $('.content-wrapper>.content-header>h1').html(title);

    $('.position-list .pos-update').on('click', async function () {
       
        let id = $(this).parents('tr').data('id')
        bus.emit('go','/authority-update', { id })
    })
    let list = "<li class='staff-list'><a href='javascript:void(0)'><i class='fa fa-group'></i> 管理员列表</a></li>"+
    "<li ><a href='javascript:void(0)'></i> "+listval+"</a></li>"
    $('.content-wrapper>.content-header>.breadcrumb').html(list);
    $('.pos-remove').on('click',async function () {
        handleRemovePosition.bind(this,_page1)()
    })
    $('#possearch').on('click',function(e){
        e.preventDefault()
        let val = $('#keywords_1').val()
        bus.emit('go','/authority-list?search='+val)
       
    })
    $('.breadcrumb>.staff-list').on('click',function(){
            bus.emit('go', '/authority-list')
     })
}
//删除操作
const handleRemovePosition = async function (_page1)  {
    
    let id = $(this).parents('tr').data('id')
    let _data = await user_model.remove({id: id})  
    let trs = $('.position-list__tabel tr[data-id]')
    // 如果只剩一个，将pageNo-1
    let _pageNo = trs.length > 1 ? _page1.pageInfo.pageNo : (_page1.pageInfo.pageNo - (_page1.pageInfo.pageNo > 1 ? 1 : 0))
    console.log(_pageNo);
    handleToastByData(_data, {
        isReact: false,
        success: (data) => {
            // 删除成功后
            bus.emit('go', '/authority-list?pageNo='+_pageNo+'&_='+data.deleteId+'&search='+_page1.pageInfo.search)
        }
    })
}


//更新

const update = (req, res) => {
    $('#myModal').modal('show')
    let { id } = req.body// 要更新的数据的id
    // 获取id对应的数据进行渲染
    $('#myModal').attr('data',id)
    bindUpdateEvent()
}



const bindUpdateEvent = () => {
    // 返回按钮逻辑
    $('#cancel').on('click', function () {
        $('#myModal').modal('hide')
        bus.emit('go', '/authority-list')
    })
    $('#myModal #update-form').submit(handleUpdateSubmit)
}

const handleUpdateSubmit = async function (e) {
    e.preventDefault();
    let id =$('#myModal').attr('data');
    let _id = {"id":id}
    // let _datastr = $(this).serialize()
    // let _data = qs.parse(_datastr)
    let _results = await user_model.update(_id)
    handleToastByData(_results)
    bus.emit('go', '/authority-list?_id='+id);
    $('#myModal').modal('hide')

}


export default {
    list,
    update
}