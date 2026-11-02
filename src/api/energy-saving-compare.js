import request from '@/utils/request'

// 节能对比
export function fetchEnergySavingCompareList(data) {
    return request({
        url: `/energySave/energySaveCompare?queryDate=${data.queryDate}`,
        method: 'get'
    });
}