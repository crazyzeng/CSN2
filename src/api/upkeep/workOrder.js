// 保养工单
import request from '@/utils/request';

//分页
export function getWorkOrderPage(page, params) {
    return request({
        url: `/maintain/workOrder/page`,
        method: 'get',
        params: {
            pageNo: page.pageNo,
            pageSize: page.pageSize,
            ...params
        }
    })
}
//详情
export function getDetailInfo(id) {
    return request({
        url: `/maintain/workOrder/${id}`,
        method: 'get',
    })
}
//指派
export function doAssign(id, username) {
    return request({
        url: `/maintain/workOrder/distribute/${id}?username=${username}`,
        method: 'post',
    })
}
//处理
export function handleSomething(data) {
    return request({
        url: '/maintain/workOrder/handle',
        method: 'post',
        data,
    })
}
//统计信息
export function getStatisticalInfo() {
    return request({
        url: '/maintain/workOrder/statistical',
        method: 'get',
    })
}

// 保养人员列表
export function getUserList() {
    return request({
        url: '/maintain/workOrder/userList',
        method: 'get',
    })
}

// 完成
export function handleFinish(id){
    return request({
        method:'post',
        url:`/maintain/workOrder/complete/${id}`
    })
}