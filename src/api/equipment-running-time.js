import request from '@/utils/request';

/* 设备累计运行时长 */

//设备运行时长
export function getEquipmentDuration(params){
    return request({
        url:`/equipmentStatus/sumRunTime`,
        method:'get',
        params:{...params}
    })
}

// 修改设备运行时长阈值
export function updateEquipmentThreshold(params){
    return request({
        url:'/equipmentStatus/sumRunTime',
        method:'post',
        data:params
    })
}

// 导出
export function exportList(){
    return request({
        url:'/equipmentStatus/sumRunTime/export',
        method:'get',
        headers: {
            'content-type': 'application/json; charset=utf-8',
        },
        responseType: 'blob',
    })
}

/** 事件记录，接口 */
// 查询
export function getEventRecordingList(data,paging){
    return request({
        url:`/eventRecord/page`,
        method:'post',
        data,
        params:{...paging}
    })
}
// 导出
export function exportEventRecordingList(data){
    return request({
        url:'/eventRecord/export',
        method:'post',
        data,
        headers: {
            'content-type': 'application/json; charset=utf-8',
        },
        responseType: 'blob',
    })
}

//设备列表查询
export function getEquipment(){
    return request({
        url:'/eventRecord/getEquipment',
        method:'get'
    })
}

//控制点列表查询
export function getControlPointList(equipmentName){
    return request({
        url:`/eventRecord/getPoint?equipmentName=${equipmentName}`,
        method:'get',
    })
}