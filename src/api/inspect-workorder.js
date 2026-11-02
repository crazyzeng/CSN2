import request from '@/utils/request.js'

// 巡检工单分页查询
export function getInspectWorkOrderByPage(data,page){
    return request({
        method:'post',
        url:`/inspect/order/page?pageNo=${page.pageNo}&pageSize=${page.pageSize}`,
        data,
    })
}

// 巡检工单新增
export function addInspectWorkOrder(data){
    return request({
        method:'post',
        url:'/inspect/order',
        data,
    })
}

// 巡检工单指派
export function assignWorkOrder(data){
    return request({
        method:'put',
        url:`/inspect/order/assign?id=${data.id}&username=${data.username}`
    })
}

// 巡检工单转单
export function transferWorkOrder(id){
    return request({
        method:'get',
        url:`/inspect/order/transfer/${id}`
    })
}


// 巡检实况
export function getCurrentInspect(data,id){
    return request({
        method:'post',
        url:`/inspect/order/realTime?orderId=${id}`,
        data,
    })
}

// 通过lineId获取线路详情
export function getLineDetailByLineId(lineId){
    return request({
        method:'get',
        url:`/inspect/line/${lineId}`
    })
}

// 通过orderId获取线路详情及区域巡检状态
export function getinspectPathDetail(orderId){
    return request({
        method:'get',
        url:`/inspect/order/realTimeLine?orderId=${orderId}`
    })
}

// 获取巡检工单编号
export function getInspectWorkOrderNumber(){
    return request({
        method:'get',
        url:'/common/inspectOrderNumber'
    })
}

//获取巡检计划编号
export function getInspectPlanNumber(){
    return request({
        method:'get',
        url:'/common/inspectNumber'
    })
}


//查询线路所有设备
export function getPathEquipmentByLineId(id){
    return request({
        method:'get',
        url:`/inspect/lineEquipment/${id}`
    })
}