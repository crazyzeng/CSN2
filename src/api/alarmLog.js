import request from '@/utils/request';

/* 告警记录 */

//分页查询
export function getByPage(data = {},paging){
    paging = paging ? paging : paging = {page:1,pageSize:1000};
    return request({
        url:`alarmRecordController/getAlarmRecordByParam/${paging.pageNum}/${paging.pageSize}`,
        method:'post',
        data:data
    })
}

// 告警类别
export function getAlarmType(data){
    return request({
        url:'alarmMasterplateController/findAlarmMasterplate',
        method:'post',
        data,
    })
}

// 解除告警
export function dealAlarm (id){
    return request({
        url:`/alarmRecordController/clearAlarm/${id}`,
        method:'get'
    })
}

// 删除
export function deleteData(id){
    return request({
        url:`/alarmRecordController/delBatchAlarmRecord/${id}`,
        method:'get'
    })
}