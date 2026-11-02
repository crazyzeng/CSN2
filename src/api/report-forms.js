import request from '@/utils/request'

// 获取列表
export function getForms(data) {
    return request({
        url: '/report',
        method: 'get',
        params:data,
    })
}