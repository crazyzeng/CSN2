import request from '@/utils/request';

/**
 * 工单
 */
//分页模糊查询
export function getPageEquipmentWorker(
    data = {},
    paging = {
        pageNum: 1,
        pageSize: 10,
    }
) {
    return request({
        url: `/equipmentWorkOrderController/getPageEquipmentWorker/${paging.pageNum}/${paging.pageSize}`,
        method: 'post',
        data,
    });
}
//新增
export function add(data) {
    return request({
        url: `/equipmentWorkOrderController/add`,
        method: 'post',
        data,
    });
}
// 查看
export function findOne(id) {
    return request({
        url: `/equipmentWorkOrderController/findOne/${id}`,
        method: 'get',
    });
}

/**
 * 批量删除
 * @param ids
 * @returns {AxiosPromise}
 */
export function deleteBatch(ids) {
    return request.delete('/equipmentWorkOrderController/workOrder', {
        params: { ids },
    });
}

//查找资源

export function orgIdMapping(data) {
    return request({
        url: `/orgController/orgIdMapping?queryTypes=${data}`,
        method: 'get',
    });
}

//处理 /equipmentWorkOrderController/handle
export function handle(data) {
    return request({
        url: `/equipmentWorkOrderController/handle`,
        method: 'post',
        data: data,
    });
}

//批量处理
export function handleList(data) {
    return request({
        url: `/equipmentWorkOrderController/handleList`,
        method: 'post',
        data: data,
    });
}
