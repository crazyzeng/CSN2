import request from '@/utils/request.js'

// 异常数据校正分页
export function energyDataResetPointDataHours(data, page) {
    return request({
        url: `/energyData/pageSimulateData?name=${data.name}&queryDate=${data.queryDate}&pageNum=${page.pageNo}&pageSize=${page.pageSize}`,
        method: 'get',
        data
    });
}

// 详情提交
export function handleEnergyDataResetPointDataHours(data) {
    return request({
        url: `/energyData/resetPointDataHours`,
        method: 'post',
        data,
    });
  }