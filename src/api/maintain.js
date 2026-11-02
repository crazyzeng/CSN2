import request from "@/utils/request";

/**
 * 巡检/保养计划
 */
//分页模糊查询
export function getPageEquipmentMaintain(data = {}, paging = {
    pageNum: 1,
    pageSize: 10
}) {
    return request({
        // url: `/equipmentMaintainController/getPageEquipmentMaintain/${id}/${paging.pageNum}/${paging.pageSize}`,
        url: `/equipmentMaintainController/getPageEquipmentMaintain/${paging.pageNum}/${paging.pageSize}`,
        method: 'post',
        data
    });
}
// 查看
export function findOne(id) {
    return request({
        url: `/equipmentMaintainController/findOne/${id}`,
        method: 'get'
    });
}
//删除 
export function deleter(id) {
    return request({
        url: `/equipmentMaintainController/deleter/${id}`,
        method: 'delete'
    });
}
//批量删除
export function deleteBatch(data) {
    return request({
        url: `/equipmentMaintainController/deleteBatch`,
        method: 'post',
        data
    });
}

//查找资源

export function orgIdMapping(data) {
    return request({
        url: `/orgController/orgIdMapping?queryTypes=${data}`,
        method: 'get'
    });
}

//编辑
export function update(data) {
    return request({
        url: `/equipmentMaintainController/update`,
        method: 'post',
        data: data
    });
}
//新增
export function addMaintainPlan(data) {
    return request({
        url: `/equipmentMaintainController/addMaintainPlan`,
        method: 'post',
        data: data
    });
}

//启停
export function enableMaintainPlan(id, enable) {
    return request({
        url: `/equipmentMaintainController/enableMaintainPlan/${id}/${enable}`,
        method: 'post',
        // data:data
    });
}
