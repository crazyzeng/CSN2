// 巡检内容配置
import request from "@/utils/request";


// 巡检记录分页查询
export function getInspectHistoryByPage(data,page,time){
    return request({
        method:'post',
        url:`/inspect/record/page?pageNo=${page.pageNo}&pageSize=${page.pageSize}&startDate=${time.startDate}&endDate=${time.endDate}`,
        data,
    })
}

//巡检记录详情
export function getInspectHistoryDetail(id){
    return request({
        method:'get',
        url:`/inspect/record/${id}`,
    })
}


// 巡检内容配置分页
export function getInspectConentByPage(data){
    return request({
        method:'get',
        url:`/inspect/config?equipmentType=${data.equipmentType}`
    })
}

//巡检内容配置详情
export function getInspectContentDetail(equipmentType){
    return request({
        method:'get',
        url:`/inspect/config/detail?equipmentType=${equipmentType}`
    })
}

//巡检内容配置新增配置
export function addInspectContent(data){
    return request({
        method:'post',
        url:'/inspect/config',
        data,
    })
}
//巡检内容配置删除配置
export function deleteInspectContent(id){
    return request({
        method:'delete',
        url:`/inspect/config/${id}`
    })
}

//计划巡检分页查询 
export function getInspectPlanByPage(data,page){
    return request({
        method:'post',
        url:`/inspect/page?pageNo=${page.pageNo}&pageSize=${page.pageSize}`,
        data,
    })
}


// 计划巡检新增
export function addInspectPlan(data){
    return request({
        method:'post',
        url:'/inspect',
        data,
    })
}

// 计划巡检编辑
export function updateInspectPlan(data){
    return request({
        method:'put',
        url:'/inspect',
        data,
    })
}

//计划巡检删除、批量删除
export function deleteInspectPlan(data){
    return request({
        method:'delete',
        url:'/inspect',
        data,
    })
}

// 计划巡检启用、停用
export function switchInspectPlan(id,val){
    return request({
        method:'get',
        url:`/inspect/enable?id=${id}&val=${val}`
    })
}

//计划巡检详情、查询线路所有设备
export function getEquipmentByLineId(id){
    return request({
        method:'get',
        url:`/inspect/lineEquipment/${id}`
    })
}