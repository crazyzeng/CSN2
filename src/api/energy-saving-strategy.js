import request from '@/utils/request';

// 节能策略列表
export function fetchEnergyStrategyList(data, page) {
    return request({
        url: `/energySaveStrategy/page?strategyName=${data.strategyName}&strategyStatus=${data.strategyStatus}&pageSize=${page.pageSize}&pageNum=${page.pageNum}`,
        method: 'get',
    });
}

/*
 开启关闭策略
 val=1 开启
 val=0 关闭
*/ 
export function toggleEnergyStrategyStatus(data) {
    return request({
        url: `/energySaveStrategy/operate?id=${data.id}&val=${data.val}`,
        method: 'get',
    });
}

// 策略详情
export function fetchEnergyStrategyDetail(id) {
    return request({
        url: `/energySaveStrategy/${id}`,
        method: 'get',
    });
}

// 删除策略
export function deleteEnergyStrategy(id) {
    return request({
        url: `/energySaveStrategy/${id}`,
        method: 'delete',
    });
}

// 检查控制点位是否在其他策略中被使用
export function checkControlPointUsage(data) {
    return request({
        url: `/energySaveStrategy/checkPointStrategy`,
        method: 'post',
        data, // 策略id列表
    });
}

// 新增策略
export function addEnergyStrategy(data) {
    return request({
        url: `/energySaveStrategy`,
        method: 'post',
        data,
    });
}

// 编辑策略
export function updateEnergyStrategy(data) {
    return request({
        url: `/energySaveStrategy`,
        method: 'post',
        data,
    });
}

// 根据id获取策略配置的点位列表
export function getPointListByIds(data,page) {
    return request({
        method:'post',
        url:`/pointController/findPointByPage/${page.pageNo}/${page.pageSize}`,
        data,
    })
}