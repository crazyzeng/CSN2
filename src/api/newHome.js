// 新版首页接口
import request from '@/utils/request';

/**
 *  总用能数据
 * @param {*} date 
 * @returns month | year
 */
export function getTotalUsageData(date) { 
  return request({
    method: 'get',
    url: `/homePage/new/total/${date}`
  })
}

/**
 *  当日冷站用能数据
 * @param {*} type
 * @returns WG | HK
 */
export function getTodayColdUsageData(type) {
  return request({
    method: 'get',
    url: `/homePage/new/stationEnergy/${type}`
  })
}

/**
 * 分区节能数据
 */
export function getAreaSavingData() {
  return request({
    method: 'get',
    url: `/homePage/yearStatistics`
  })
}

/**
 *  当日分项用能
 * @param {*} type
 * @returns ELECTRIC | WATER 
 */
export function getTodayItemUsageData(type) {
  return request({
    method: 'get',
    url: `/homePage/new/itemEnergy/${type}`
  })
}

/**
 *  当日分项用能基准
 * @param {*} type
 * @returns ELECTRIC | WATER
 */
export function getTodayItemUsageBaseData(type) {
  return request({
    method: 'get',
    url: `/homePage/new/itemEnergyBenchmark/${type}`
  })
}

/**
 *  分区节能获取当日湿度和温度
 * @param {*} type
 * @returns ELECTRIC | WATER
 */
export function handleNewTempData() {
  return request({
    method: 'get',
    url: `/homePage/new/tempData`
  })
}