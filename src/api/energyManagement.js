import request from '@/utils/request';

/**
 *
 * @method POST
 * @param { Object } data 查询条件
 * @param { Object } paging 分页配置
 * @returns { Promise } axios 实例
 */
//区域能耗分页
export function queryList(data = {}) {
    return request({
        url: `/energyData/areaEnergy/list?dateType=${data.dateType}&energyType=${data.energyType}&orgName=${data.orgName}&date=${data.date}`,
        method: 'get',
        data,
    });
}
//区域能耗，导出
export function exportArea(params) {
    return request({
        url: `/energyData/areaEnergy/export`,
        method: 'get',
        headers: {
            'content-type': 'application/json; charset=utf-8',
        },
        responseType: 'blob',
        params,
    });
}
//设备能耗分页
export function queryDeviceList(data = {}, paging = { pageNum: 1, pageSize: 10 }) {
    return request({
        url: `/energyData/deviceEnergy/page/${paging.pageNum}/${paging.pageSize}?deviceName=${data.deviceName}&deviceTypes=${data.deviceTypes}&dateType=${data.dateType}&orgName=${data.orgName}&date=${data.date}`,
        method: 'get',
        data,
    });
}
//设备能耗，区域下拉
export function getAreaList() {
    return request({
        url: `/equipmentStatus/getArea`,
        method: 'get',
    });
}
//设备能耗，设备类型下拉
export function getDeviceType(data = {}) {
    return request({
        url: `/equipmentStatus/getEquipmentType`,
        method: 'get',
        data,
    });
}
//设备能耗，获取时间段  /energyData/timeList?date=2021-10&dateType=month
export function getDeviceTime(data = {}) {
    return request({
        url: `energyData/timeList?date=${data.date}&dateType=${data.dateType}`,
        method: 'get',
        data,
    });
}
//设备能耗，导出
export function exportEquipmentExcel(params) {
    return request({
        url: `/energyData/deviceEnergy/export`,
        method: 'get',
        headers: {
            'content-type': 'application/json; charset=utf-8',
        },
        params,
        responseType: 'blob',
    });
}
//能耗总览
//总能耗
export function getTotal(data = {}) {
    return request({
        url: `/energyData/overview/total?dateType=${data.dateType}&date=${data.date}&energyType=${data.energyType}`,
        method: 'get',
        data,
    });
}
// 分项能耗数据
export function getSystemItem(data = {}) {
    return request({
        url: `/energyData/overview/system?dateType=${data.dateType}&date=${data.date}&energyType=${data.energyType}`,
        method: 'get',
        data,
    });
}
// 今日能耗趋势
export function getTodayTrend(data = {}) {
    return request({
        url: `/energyData/overview/todayTrend?dateType=${data.dateType}&date=${data.date}&energyType=${data.energyType}`,
        method: 'get',
        data,
    });
}
export function getTrend(data = {}) {
    return request({
        url: `/energyData/overview/trend?dateType=${data.dateType}&date=${data.date}&energyType=${data.energyType}`,
        method: 'get',
        data,
    });
}
// 区域能耗数据
export function getAreaData(data = {}) {
    return request({
        url: `/energyData/overview/area?dateType=${data.dateType}&date=${data.date}&energyType=${data.energyType}`,
        method: 'get',
        data,
    });
}

// 根据能源类型获取区域
export function getAreaByEnergyType(energyType){
    return request({
        url:`/selectOption/getEnergyAreaSelectOption/${energyType}`,
        method:'get'
    })
}


// 能耗异常分析
export function getAbnormalAnalysis(data = {}) {
    return request({
        url: `/energyData/energyCompareAnalysis?queryDate=${data.date}`,
        method: 'get',
        data,
    });
}

// 能耗异常分析导出
export function exportAbnormalAnalysis(data = {}) {
    return request({
        url: `/energyData/energyCompareAnalysis/export?queryDate=${data.date}`,
        method: 'get',
        headers: {
            'content-type': 'application/json; charset=utf-8',
        },
        responseType: 'blob',
        data,
    });
}