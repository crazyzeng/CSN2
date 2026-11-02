import request from '@/utils/request';

/* 设备运行状态 */

//设备状态总览
export function getAllEquStatus(){
    return request({
        url:`/equipmentStatus/getEquipmentOverview`,
        method:'get',
    })
}
//设备运行状态
export function getSingleStatus(){
    return request({
        url:`equipmentStatus/getEquipmentStatus`,
        method:'get'
    })
}
