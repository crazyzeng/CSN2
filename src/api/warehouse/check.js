// 仓库管理，盘点
import request from '@/utils/request';
// 盘点单分页
export function getPage(data, params) {
    return request({
        url: '/stock/pageCheckOrder',
        method: 'post',
        params: {
            pageNo: params.pageNo,
            pageSize: params.pageSize,
        },
        data,
    })
}
//  仓库查询
export function getStorehouseList() {
    return request({
        url: '/stock/listRepository',
        method: 'get',
    })
}

// 新增盘点
export function addCheckOrder(id) {
    return request({
        url: `/stock/addCheckOrder/${id}`,
        method: 'get',
    })
}
// 生成盘点单
export function exportCheckOrder(id) {
    return request({
        url: `/stock/exportCheckOrder/${id}`,
        method: 'get',
        headers: {
            'content-type': 'application/json; charset=utf-8',
        },
        responseType: 'blob',
    })
}
//工单生成，完成盘点，确定
export function addStockOrder(data) {
    return request({
        url: '/stock/addStockOrder',
        method: 'post',
        data,
    })
}
// 同时生成工单
export function downloadOrderList(data){
    return request({
        method:'post',
        url:`/stock/genStockOrderExcel`,
        data,
        headers: {
            'content-type': 'application/json; charset=utf-8',
        },
        responseType: 'blob',
    })
}
// 动态参数查询指定仓库库存
export function getListByParam(params) {
    return request({
        url: `/stock/listByParam`,
        method: 'get',
        params: { ...params }
    })
}

// 导出
export function exportCheckList(data){
    return request({
        method:'post',
        url:'/stock/exportCheck',
        data,
        headers: {
            'content-type': 'application/json; charset=utf-8',
        },
        responseType: 'blob',
    })
}