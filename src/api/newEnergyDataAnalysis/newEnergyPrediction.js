// 新版节能减碳-能耗预测接口
import request from '@/utils/request';

/**
 *  能耗预测数据
 * @param {*} date 
 * @returns month | year
 */
export function handleNewEnergyPredict() { 
  return request({
    method: 'get',
    url: `/homePage/new/energyPredict`
  })
}