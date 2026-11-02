import request from '@/utils/request';

// 能耗基础数据分页
export function handleMeterDataList(data) {
    return request({
        url: `/meter/data/list?queryDate=${data.queryDate}`,
        method: 'post',
        data,
    });
}

// 能耗基础数据导出
export function exportMeterDataExport(data){
    return request({
        url:`/meter/data/export?queryDate=${data.queryDate}`,
        method:'post',
        data,
        headers: {
            'content-type': 'application/json; charset=utf-8',
        },
        responseType: 'blob',
    })
}