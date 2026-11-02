import request from '@/utils/request';

//根据区域和冷热模式获取策略组合下拉
export function getPolicyMode(params){
    return request({
        method:'get',
        url:'/energySave/getModeSelect',
        params:{...params}
    })
}

// 根据区域和自定义查询当前策略
export function getCurrentPolicyMode(params){
    return request({
        method:'get',
        url:'/energySave/getStrategy',
        params:{...params}
    })
}

//保存自定义策略
export function policySave(data,params){
    return request({
        method:'post',
        url:'/energySave/setCustomStrategy',
        params:{...params},
        data,
    })
}

//执行策略开关量设置
export function policySwitchToggle(params){
    return request({
        method:'get',
        url:'/energySave/allow',
        params:{...params},
    })
}

//获取开关量
export function getPolicySwitchStatus(params){
    return request({
        method:'get',
        url:'/energySave/getAllow',
        params:{...params},
    })
}

//查询策略执行记录
export function getPolicyExecuteHistory(params){
    return request({
        method:'get',
        url:'/energySave/getRecord',
        params:{...params}
    })
}