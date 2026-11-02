import request from '@/utils/request';

// 获取分项名称
export function handleSubItems(data) {
    return request({
        url: `/orgController/getSubItemTree?energyType=${data.energyType}`,
        method: 'get'
    });
}

// 表计配置分页
export function getMeterConfigPage(data,paging) {
    return request({
        url: `/meter/config/page?pageSize=${paging.pageSize}&pageNum=${paging.pageNum}`,
        method: 'post',
        data,
    });
}

// 表计配置新增
export function getMeterConfigAdd(data) {
    return request({
        url: `/meter/config`,
        method: 'post',
        data
    });
}

// 表计配置编辑
export function getMeterConfigEdit(data) {
    return request({
        url: `/meter/config`,
        method: 'put',
        data
    });
}

// 表计配置删除
export function getMeterConfigDel(data) {
    return request({
        url: `/meter/config`,
        method: 'delete',
        data
    });
}