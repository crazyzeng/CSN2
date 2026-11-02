import request from '@/utils/request';

/* 碳排放 */

//查询
export function getAlldata(data){
    return request({
        url:`carbon/statistics?date=${data.date}`,
        method:'get',
    })
}