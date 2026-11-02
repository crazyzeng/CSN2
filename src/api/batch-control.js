import request from '@/utils/request';

// 查询最近一次一键执行结果
export function getLatestStatus(){
    return request({
        method:'get',
        url:'/equipmentControl/latest'
    })
}

// 一键执行
export function handleBatchCtrl(data){
    return request({
        method:'post',
        url:'/taskController/writeBatch',
        data,
    })
}

//分组管理分页
export function getGroupPage(data){
    return request({
        method:'get',
        url:'/batchControl/page',
        params:{...data}
    })
}

//设备信息表
export function getEquipmentPage(paging,data){
    return request({
        method:'post',
        url:`/equipment/page`,
        params:{...paging},
        data,
    })
}

//分组配置保存
export function saveGroupConfig(data){
    return request({
        method:'post',
        url:'/batchControl',
        data,
    })
}
//分组配置编辑
export function updateGroupConfig(data){
    return request({
        method:'put',
        url:'/batchControl',
        data,
    })
}

//分组配置删除
export function deleteGroupConfig(data){
    return request({
        method:'delete',
        url:'/batchControl',
        data,
    })
}

// 执行
export function doExcute(data){
    return request({
        method:'get',
        url:`/batchControl/enable/${data.id}/${data.value}`
    })
}