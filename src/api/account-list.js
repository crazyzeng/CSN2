import request from '@/utils/request';

// 新增台账
export function addAccountList(data){
    return request({
        url:'/equipment',
        method:'post',
        data,
    })
}

// 删除
export function delAccountList(data){
    return request({
        url:'/equipment',
        method:'delete',
        data,
    })
}

//分页查询
export function getAccountListByPage(data,page){
    delete page.total
    return request({
        url:`/equipment/page`,
        method:'post',
        params:{...page},
        data,
    })
}

//编辑
export function updateAccountList(data){
    return request({
        url:'/equipment',
        method:'put',
        data,
    })
}

// 导出模板
export function downloadTemplate(){
    return request({
        url:'/equipment/excelTemplate',
        method:'get',
        headers: {
            'content-type': 'application/json; charset=utf-8',
        },
        responseType: 'blob',
    })
}

// 导出
export function exportAccountList(data){
    return request({
        url:'/equipment/exportExcel',
        method:'post',
        data,
        headers: {
            'content-type': 'application/json; charset=utf-8',
        },
        responseType: 'blob',
    })
}

// 详情
export function getAccountDetail(id){
    return request({
        url:`/equipment/${id}`,
        method:'get'
    })
}

// 报废
export function doScrap(data){
    return request({
        url:'/equipment/scrapped',
        method:'put',
        data,
    })
}

// 动态参数查询全部台账
export function fetchAllEquipment(dynamicParam){
    return request({
        method:'get',
        url:`/equipment/listByParam?dynamicParam=${dynamicParam}`
    })
}

// 批量获取设备信息
export function fetchEquipmentById(data){
    return request({
        method:'post',
        url:'/equipment/listByIds',
        data,
    })
}

// 统计数据
export function fetchOverViewData(){
    return request({
        method:'get',
        url:'/equipment/statistics'
    })
}

//检查台账编号是否唯一
export function checkEquipmentNumber(equipmentNum){
    return request({
        method:'get',
        url:`/equipment/checkNumber?number=${equipmentNum}`
    })
}
