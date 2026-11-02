import request from '@/utils/request';

/* 区域能耗阀值配置 */

//复制数据
export function copyData(data,oldMonth){
    return request({
        url:`/areaEnergyThreshold/copy/${oldMonth}`,
        method:'post',
        data,
    })
}
//查询区域及能源类型
export function getThresholdData(){
    return request({
        url:`/areaEnergyThreshold/getArea`,
        method:'get'
    })
}
//编辑
export function editThresholdData(data){
    return request({
        url:`/areaEnergyThreshold`,
        method:'post',
        data:data
    })
}
//查询阈值
export function getThresholdValue(month){
    return request({
        method:'get',
        url:`/areaEnergyThreshold/${month}`
    })
}