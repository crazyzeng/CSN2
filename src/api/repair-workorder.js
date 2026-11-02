import request from '@/utils/request';

//分页查询
export function getRepairWorkOrderByPage(data,page){
    return request({
        method:'post',
        url:`/repair/page?pageNo=${page.pageNo}&pageSize=${page.pageSize}`,
        data,
    })
}

// 故障申报
export function addRepairWorkOrder(data){
    return request({
        method:'post',
        url:'/repair',
        data,
    })
}

// 编辑
export function updateRepairWorkOrder(data){
    return request({
        method:'put',
        url:'/repair',
        data,
    })
}

//删除
export function deleteRepairWorkOrder(id){
    return request({
        method:'delete',
        url:`/repair/${id}`
    })
}

// 指派
export function assignRepairWorkOrder(data){
    return request({
        method:'put',
        url:`/repair/assign?id=${data.id}&username=${data.username}`
    })
}

// 处理
export function handleRepairWorkOrder(data){
    return request({
        method:'post',
        url:'/repair/handle',
        data,
    })
}

//详情
export function getRepairWorkOrderDetail(id){
    return request({
        method:'get',
        url:`/repair/${id}`
    })
}

// 获取维修工单编号
export function getRepairWorkOrderNumber(){
    return request({
        method:'get',
        url:'/common/repairNumber'
    })
}

// 获取总览数据
export function getOverViewData(){
    return request({
        method:'get',
        url:'/repair/statistics'
    })
}

//转单
export function handleTransfer(id){
    return request({
        method:'get',
        url:`/repair/transfer/${id}`
    })
}