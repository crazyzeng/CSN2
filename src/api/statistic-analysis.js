import request from '@/utils/request'

// 获取火警数据
export function getFireAlarmTimes(data) {
    return request({
        url: '/analysis/fireAlarmTimes',
        method: 'get',
        params:data,
    })
}

// 获取误报数据
export function getMisreportRate(data) {
    return request({
        url: '/analysis/misreportRate',
        method: 'get',
        params:data,
    })
}

// 获取告警雷达图
export function getAlarmTypeRadar(data) {
    return request({
        url: '/analysis/alarmTypeRadar',
        method: 'get',
        params:data,
    })
}

// 获取告警柱状图图
export function getSystemAlarm(data) {
    return request({
        url: '/analysis/orgSystemAlarmTimes',
        method: 'get',
        params:data,
    })
}

// 获取维保数据状图图
export function getMaintenanceData(data) {
    return request({
        url: '/analysis/maintenanceData',
        method: 'get',
        params:data,
    })
}


//根据资源ID获取资源下的设备
export function getEquipmentListById(data) {
    return request({
        url: `/historyData/queryObjectList`,
        method: 'get',
        params:data
    })
}
//历史数据查询接口
export function getHistory(data) {
    return request({
        url: '/historyData',
        method: 'get',
        params:data,
    })
}