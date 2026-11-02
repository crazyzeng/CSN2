import request from "@/utils/request";

//调度设备运行状态柱状图数据
export function fetchDeviceStatusDataList(buildType) {
    return request({
        url: `/energySave/showEnergyStrategy?buildType=${buildType}`,
        method: 'get'
    });
}

//设备运行状态
export function fetchDeviceStatus(buildType) {
    return request({
        url: `/energySave/getEnergyStationDeviceStatus?buildType=${buildType}`,
        method: 'get'
    })
}

// 策略分页
export function fetchEnergySavingPage(page, data) {
    return request({
        url: `/energySave/page?pageSize=${page.pageSize}&pageNo=${page.pageNo}`,
        data,
        method: 'post'
    })
}
// 策略详情
export function fetchEnergySavingDetail(id) {
    return request({
        url: `/energySave/getDetailInfo/${id}`,
        method: 'get'
    })
}

// 获取能源策略配置信息
export function getEnergySupply(buildType) {
    return request({
        url: `/energySave/getEnergySupply?buildType=${buildType}`,
        method: 'get'
    })
}

// 保存能源策略配置
export function saveEnergySupply(data) {
    return request({
        url: '/energySave/saveEnergySupply',
        method: 'post',
        data
    })
}

// 算法设备参数设置
export function getAiConfigType() {
    return request({
        url: `/aiConfig/type`,
        method: 'get'
    })
}

// 算法设备参数设置（其他）
export function getAiConfigOtherType(buildType) {
    return request({
        url: `/aiConfig/other?areaCode=${buildType}`,
        method: 'get'
    })
}

// 获取设备类型及图片
export function getAiConfigDevice(params) {
    return request({
        url: `/aiConfig/device`,
        method: 'get',
        params:{...params}
    })
}