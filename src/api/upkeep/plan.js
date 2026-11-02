// 保养计划
import request from '@/utils/request';

//新增
export function addPlan(data) {
    return request({
        url: `/maintain/plan`,
        method: 'post',
        data,
    })
}
//修改
export function editPlan(data) {
    return request({
        url: `/maintain/plan`,
        method: 'put',
        data,
    })
}
//删除
export function delPlan(id) {
    return request({
        url: `/maintain/plan/${id}`,
        method: 'delete',
    })
}
//启停
export function startStop(id, status) {
    return request({
        url: `/maintain/plan/startStop/${id}/${status}`,
        method: 'put',
    })
}
//分页
export function getPlanPage(page, params) {
    return request({
        url: `/maintain/plan/page`,
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
        url: `/maintain/plan/${id}`,
        method: 'get',
    })
}