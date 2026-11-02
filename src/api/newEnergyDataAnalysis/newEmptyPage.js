// 新版节能减碳-能耗预测接口
import request from '@/utils/request';

/**
 *  节能分析数据
 * @param {*} date 
 * @returns month | year
 */
export function handleNewEnergySaveAnalysis() { 
  return request({
    method: 'get',
    url: `/homePage/new/energySaveAnalysis`
  })
}