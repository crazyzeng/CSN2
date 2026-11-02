import request from "@/utils/request";

/**
 * 作业指导库
 */
//分页模糊查询
export function getPageByParam(data = {}, paging = {
    pageNum: 1,
    pageSize: 10
}) {
    return request({
        url: `/workInstruction/getPageByParam/${paging.pageNum}/${paging.pageSize}`,
        method: 'post',
        data
    });
}
//新增
export function add(data) {
    return request({
        url: `/workInstruction/add`,
        method: 'post',
        data
    });
}
// 查看
export function findOne(id) {
    return request({
        url: `/workInstruction/findOne/${id}`,
        method: 'get'
    });
}
//删除
export function del(id) {
    return request({
        url: `/workInstruction/del/${id}`,
        method: 'delete'
    });
}
//批量删除
export function deleteBatch(data) {
    return request({
        url: `/workInstruction/delBeth`,
        method: 'post',
        data
    });
}
//编辑 
export function update(data) {
    return request({
        url: `/workInstruction/update`,
        method: 'post',
        data: data
    });
}
//删除富文本
export function delTxt(id) {
    return request({
        url: `/workInstruction/delInfo/${id}`,
        method: 'delete'
    });
}


//查找资源

export function orgIdMapping(data) {
    return request({
        url: `/orgController/orgIdMapping?queryTypes=${data}`,
        method: 'get'
    });
}
//查台账，获取对应的设备信息
export function getEInfo(id) {
    return request({
        url: `/equipment/${id}`,
        method: 'get'
    });
}

