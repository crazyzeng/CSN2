import request from '@/utils/request';

// 分页
export function getSparePartsPage(data,paging){
    return request({
        url:`/stock/page?pageNo=${paging.pageNo}&pageSize=${paging.pageSize}`,
        method:'post',
        data,
    })
}

// 新增
export function addSpareParts(data){
    return request({
        url:'/stock',
        method:'post',
        data,
    })
}

// 库存信息记录
// 查询
export function getStockOrderRecord(data,paging){
    return request({
        method:'post',
        url:`/stock/pageStockOrder?pageNo=${paging.pageNo}&pageSize=${paging.pageSize}`,
        data,
    })
}

// 详情
export function getStockOrderDetail(id){
    return request({
        method:'get',
        url:`/stock/getStockOrderDetail/${id}`
    })
}

// 备注
export function addCommit(data){
    return request({
        method:'post',
        url:'/stock/addStockOrderComm',
        data,
    })
}
//仓库查询
export function getAllReponsitory(){
    return request({
        method:'get',
        url:'/stock/listRepository'
    })
}

//盘点单分页
export function getCheckOrderPage(data,paging){
    return request({
        method:'post',
        url:`/stock/pageCheckOrder?pageNo=${paging.pageNo}&pageSize=${paging.pageSize}`,
        data,
    })
}

// 仓库管理--------------------------
//分页
export function getStockListPage(data,paging){
    return request({
        method:'post',
        url:`/stock/page?pageNo=${paging.pageNo}&pageSize=${paging.pageSize}`,
        data,
    })
}

//修改库存阈值
export function updateThreshold(data){
    return request({
        method:'put',
        url:'/stock',
        data,
    })
}

// 新增
export function addStock(data){
    return request({
        method:'post',
        url:'/stock',
        data,
    })
}

//获取出库单号
export function getStockOutNumber(){
    return request({
        method:'get',
        url:'/common/outNumber'
    })
}

//获取入库单号
export function getStockInNumber(){
    return request({
        method:'get',
        url:'/common/inNumber'
    })
}

//获取调拔单号
export function getTransferNumber(){
    return request({
        method:'get',
        url:'/common/allocateNumber'
    })
}

//获取报废单号
export function getScrapNumber(){
    return request({
        method:'get',
        url:'/common/scrapNumber'
    })
}

//仓库管理统计数据
export function getStatisticsData(){
    return request({
        method:'get',
        url:'/stock/statistics'
    })
}

// 模板下载
export function downloadTemplate(){
    return request({
        method:'get',
        url:'/stock/exportTemplate',
        headers: {
            'content-type': 'application/json; charset=utf-8',
        },
        responseType: 'blob',
    })
}

//库存列表导出
export function exportStockExcel(data){
    return request({
        method:'post',
        url:'/stock/exportStock',
        data,
        headers: {
            'content-type': 'application/json; charset=utf-8',
        },
        responseType: 'blob',
    })
}
