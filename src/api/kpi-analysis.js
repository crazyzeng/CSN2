import request from '@/utils/request'

/* KPI分析 */

// 获取数据
export function getAllData(data) {
    return request({
        url: `kpi/records?date=${data.month}`,
        method: 'get',
    })
}