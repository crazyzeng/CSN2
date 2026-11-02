import request from "@/utils/request";

// 能源预测
export function fetchEnergyPredictionList(data) {
    return request({
        url: `/energyCalculate/getLoadCalculate/${data.buildType}/${data.energyType}`,
        method: 'get',
        params: { heatMode: data.heatMode, startDate: data.startDate }
    });
}
// 历史记录
export function fetchEnergyPredictionRecord(data) {
    return request({
        url: `/energyCalculate/getLoadCalculateHistory?buildType=${data.buildType}&energyType=${data.energyType}&startDate=${data.startDate}&pageSize=${data.pageSize}&pageNum=${data.pageNum}`,
        method: 'get'
    })
}
// 历史记录详情
export function fetchRecordListDetail(data) {
    return request({
        url: `/energyCalculate/getLoadCalculateHistoryDetail?buildType=${data.buildType}&energyType=${data.energyType}&startDate=${data.startDate}`,
        method: 'get'
    })
}