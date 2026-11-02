import request from '@/utils/request';

// 电度电费账单查询
export function fetchBillData(dateStr){
    return request({
        url:`/bill/electricity?dateStr=${dateStr}`,
        method:'get'
    })
}

// 电度电费规则查询
export function fetchDegreeRule(){
    return request({
        url:'/priceRule/electricity',
        method:'get'
    })
}

// 电度电费规则编辑、
export function updateDegreeRule(data){
    return request({
        url:'/priceRule/electricity',
        method:'post',
        data,
    })
}

//---------------------------------------------
// 基础电费账单查询
export function fetchBaseBill(year){
    return request({
        url:`/bill/basic?year=${year}`,
        method:'get'
    })
}

// 基础电费规则查询
export function fetchBaseRule(){
    return request({
        url:'/priceRule/basic',
        method:'get'
    })
}
// 基础电费规则编辑编辑
export function updateBaseRule(data){
    return request({
        url:'/priceRule/basic',
        method:'post',
        data,
    })
}

//----------------------------------------
// 力调电费账单查询
export function fetchAdjustmentData(year){
    return request({
        url:`/bill/adjustment?year=${year}`,
        method:'get'
    })
}