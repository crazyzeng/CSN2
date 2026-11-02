import request from '@/utils/request';

//顺序启停控制分页
export function getDataByPage(params){
    return request({
        method:'get',
        url:'/sequenceControl/page',
        params:{...params}
    })
}

// 启停操作
export function handleSwitch(params){
    return request({
        method:'get',
        url:'/sequenceControl/control',
        params:{...params}
    })
}