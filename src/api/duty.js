import request from "@/utils/request";

/**
 * 查询电子值班列表数据
 * @method POST
 * @param { Object } data 查询条件
 * @param { Object } paging 分页配置
 * @returns { Promise } axios 实例
 */
export function queryDutyList(data = {}, paging = { pageNum: 1, pageSize: 10 }) {
    return request({
        url: `/duty/pageDuty/${paging.pageNum}/${paging.pageSize}`,
        method: 'post',
        data
    });
}

/**
 * 开启电子值班详情
 * @method GET
 * @param { String } dutyId 电子值班 id
 * @returns { Promise } axios 实例
 */
export function startDuty(dutyId) {
    return request({
        url: `/duty//enableDuty/${dutyId}/1`,
        method: 'get'
    });
}

/**
 * 禁用电子值班详情
 * @method GET
 * @param { String } dutyId 电子值班 id
 * @returns { Promise } axios 实例
 */
export function stopDuty(dutyId) {
    return request({
        url: `/duty//enableDuty/${dutyId}/0`,
        method: 'get'
    });
}

/**
 * 获取电子值班详情
 * @method GET
 * @param { String } dutyId 电子值班 id
 * @returns { Promise } axios 实例
 */
export function getDutyDetail(dutyId) {
    return request({
        url: `/duty/getDutyDetail/${dutyId}`,
        method: 'get'
    });
}

/**
 * 新增电子值班
 * @method POST
 * @param { Object } data 电子值班
 * @returns { Promise } axios 实例
 */
export function addDuty(data = {}) {
    return request({
        url: `/duty/addDuty`,
        method: 'post',
        data
    });
}

/**
 * 更新电子值班
 * @method POST
 * @param { Object } data 电子值班
 * @returns { Promise } axios 实例
 */
export function updateDuty(data = {}) {
    return request({
        url: `/duty/updateDuty`,
        method: 'post',
        data
    });
}

/**
 * 删除电子值班
 * @method GET
 * @param { String } dutyId 电子值班 id
 * @returns { Promise } axios 实例
 */
export function delDuty(dutyId) {
    return request({
        url: `/duty/deleteDuty/${dutyId}`,
        method: 'get'
    });
}

export function getDutyUserTree() {
    return request({
        url: `/userController/getDutyUserTree`,
        method: 'get'
    });
}

