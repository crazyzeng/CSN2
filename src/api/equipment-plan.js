import request from '@/utils/request';

//分页
export function getDataByPage(params){
    return request({
        method:'get',
        url:'/dailyControl/page',
        params:{...params}
    })
}

//启用、停用
export function handleSwitch(params){
    return request({
        method:'get',
        url:'/dailyControl/executeConfig',
        params:{...params}
    })
}

//删除
export function deleteExecuteConfig(configId){
    return request({
        method:'delete',
        url:`/dailyControl/${configId}`
    })
}

//获取详情
export function getExecuteConfigDetail(configId){
    return request({
        method:'get',
        url:`/dailyControl/${configId}`
    })
}

//新增
export function addExecuteConfig(data){
    return request({
        method:'post',
        url:'/dailyControl',
        data,
    })
}

//编辑
export function updateExecuteConfig(data){
    return request({
        method:'put',
        url:'/dailyControl',
        data, 
    })
}