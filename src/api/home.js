import request from '@/utils/request';

// 能耗趋势
export function fetchEnergyTrend(energyType){
    return request({
        url:`/homePage/todayEnergyTrend/${energyType}`,
        method:'get'
    })
}
// 月度用能
export function fetchMonthEnergyUsage(energyType){
    return request({
        url:`/homePage/month/${energyType}`,
        method:'get'
    })
}
// 区域月度用能排名
export function fetchMonthUsageRank(energyType){
    return request({
        method:'get',
        url:`/homePage/monthAreaEnergy/${energyType}`
    })
}
//分项月度用能占比
export function fetchMonthSystemUsage(energyType){
    return request({
        method:'get',
        url:`/homePage/monthSystemEnergy/${energyType}`
    })
}
//获取实时运维状态
export function getCurrentStatus(){
    return request({
        method:'get',
        url:'/equipment/overview/status'
    })
}

//获取待办
export function getWorkOrderList(){
    return request({
        method:'get',
        url:'/equipment/overview/listReadyOrder'
    })
}

//获取年度工单数量同比
export function getYearWorkOrderNumber(){
    return request({
        method:'get',
        url:'/equipment/overview/orderCompare'
    })
}

//获取累计数据信息
export function getTotalWorkOrderList(){
    return request({
        method:'get',
        url:'/equipment/overview/statistics'
    })
}

//各层用能
export function getAreaData(){
    return request({
        method:'get',
        url:'/homePage/areaEnergyData'
    })
}

//获取设备维保信息
export function getDeviceMaintenanceData(){
    return request({
        method:'get',
        url:'/homePage/equipment'
    })
}
//获取统计数据
export function getOverviewData(){
    return request({
        method:'get',
        url:'/homePage/yearStatistics'
    })
}

//获取编辑后的统计数据
export function getEditOverviewData(data){
    return request({
        method:'get',
        url:'/homePage/virtualData',
        data
    })
}
// 编辑统计数据
export function editOverviewData(data){
    return request({
        method:'post',
        url:'/homePage/virtualData',
        data
    })
}