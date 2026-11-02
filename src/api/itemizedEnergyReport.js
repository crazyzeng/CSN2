import request from '@/utils/request';

/**
 * 分项能耗报表
 */

// 列表分页
export function getEnergyReportList(data){
    return request({
        method:'post',
        url:`/energyData/subItemEnergy`,
        data,
    })
}

// 列表分页
// export function getEnergyReportList(data){
//     return request({
//         method:'post',
//         url:`/energyData/subItemEnergy2`,
//         data,
//     })
// }

// 获取分项名称列表
export function getSubItemList(type){
    return request({
        method:'get',
        url:`/energyData/subItem?energyType=${type}`,
    })
}

// 分项能耗报表-导出
export function exportEnergyReport(data){
    return request({
        method:'post',
        url:`/energyData/subItemEnergy/export`,
        data,
        responseType:'blob'
    })
}