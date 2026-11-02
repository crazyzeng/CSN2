import request from '@/utils/request';

//新增台账
export function addEquipment(data) {
    return request({
        url: `/equipment`,
        method: 'post',
        data,
    });
}

//编辑台账
export function editEquipment(data) {
    return request({
        url: `/equipment`,
        method: 'put',
        data,
    });
}

//获取台账详情
export function getEquipmentDetail(id) {
    return request({
        url: `/equipment/${id}`,
        method: 'get',
    });
}

//获取台账编辑回显信息
export function getEquipmentGeneralInfo(id) {
    return request({
        url: `/equipment/${id}/generalInfo`,
        method: 'get',
    });
}

/**
 * 设备台账列表
 * @param params
 * @param pageNo
 * @param pageSize
 * @returns {Promise<AxiosResponse<any>>}
 */
export function getEquipmentPageData(params = {}, pageNo = 1, pageSize = 10) {
    return request.get('/equipment/1/pageData', {
        params: { ...params, pageNo, pageSize },
    });
}

/**
 * 设备台账列表
 * @param params
 * @param pageNo
 * @param pageSize
 * @returns {Promise<AxiosResponse<any>>}
 */
export function getEquipmentNormalPageData(params = {}, pageNo = 1, pageSize = 10) {
    return request.get('/equipment/0/pageData', {
        params: { ...params, pageNo, pageSize },
    });
}

//删除设备台账
export function delEquipment(ids) {
    return request({
        url: `/equipment`,
        method: 'delete',
        params: { idArray: ids },
    });
}

//设备台账初始化
export function equipmentInitializing() {
    return request({
        url: `/equipment/initializing`,
        method: 'post',
    });
}

//设备台账报废
export function equipmentScrapped(ids) {
    return request({
        url: `/equipment/scrapped`,
        method: 'put',
        params: { idArray: ids },
    });
}

//设备台账导出模板
export function exportEquipmentTem() {
    return request({
        url: `/equipment/excelTemplate`,
        method: 'get',
        headers: {
            'content-type': 'application/json; charset=utf-8',
        },
        responseType: 'blob',
    });
}

//设备台账导出
export function exportEquipment() {
    return request({
        url: `/equipment/excel`,
        method: 'post',
        headers: {
            'content-type': 'application/json; charset=utf-8',
        },
        responseType: 'blob',
        // data
    });
}

//-------------- 备品备件
//备品备件列表
export function getEquipmentBackupPartList(data = {}, paging = { pageNo: 1, pageSize: 10 }) {
    let opt = Object.assign({}, data, paging);
    return request({
        url: `/equipmentBackupPart`,
        method: 'get',
        params: opt,
    });
}

//新增备件
export function addEquipmentBackupPart(data) {
    return request({
        url: `/equipmentBackupPart`,
        method: 'post',
        data,
    });
}

//编辑备件
export function editEquipmentBackupPart(data) {
    return request({
        url: `/equipmentBackupPart`,
        method: 'put',
        data,
    });
}

//删除备件
export function delEquipmentBackupPart(ids) {
    return request({
        url: `/equipmentBackupPart`,
        method: 'delete',
        params: { idArray: ids },
    });
}

//获取台账详情
export function getEquipmentBackupPartInfo(id) {
    return request({
        url: `/equipmentBackupPart/${id}`,
        method: 'get',
    });
}

//获取备件告警信息
export function getStockWaring() {
    return request({
        url: `/equipmentBackupPart/stockWaring`,
        method: 'get',
    });
}

//备品备件导出模板
export function exportBackupPartTem() {
    return request({
        url: `/equipmentBackupPart/excelTemplate`,
        method: 'get',
        headers: {
            'content-type': 'application/json; charset=utf-8',
        },
        responseType: 'blob',
    });
}

//备品备件导出
export function exportBackupPart() {
    return request({
        url: `/equipmentBackupPart/excel`,
        method: 'post',
        headers: {
            'content-type': 'application/json; charset=utf-8',
        },
        responseType: 'blob',
        // data
    });
}

//-------------- 出入库

//备件出入库
export function spareStockRecord(data) {
    return request({
        url: `/spareStockRecord`,
        method: 'post',
        data,
    });
}

//出入库记录
export function getStockRecordList(data = {}, paging = { pageNo: 1, pageSize: 10 }) {
    let opt = Object.assign({}, data, paging);
    return request({
        url: `/spareStockRecord`,
        method: 'get',
        params: opt,
    });
}

//删除出入库记录
export function delSpareStockRecord(ids) {
    return request({
        url: `/spareStockRecord`,
        method: 'delete',
        params: { idArray: ids },
    });
}

//出入库记录导出
export function exportSpareStockRecord() {
    return request({
        url: `/spareStockRecord/excel`,
        method: 'post',
        headers: {
            'content-type': 'application/json; charset=utf-8',
        },
        responseType: 'blob',
        // data
    });
}

//出入库记录详情
export function spareStockRecordDetail(id) {
    return request({
        url: `/spareStockRecord/${id}`,
        method: 'get',
    });
}
