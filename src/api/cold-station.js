import request from '@/utils/request';

/* 冷站 */

// 冷站运行参数

// 获取设备树
export function getColdStationTree(orgId) {
  return request({
    url: `/cop/getCopOrgTree/${orgId}`,
    method: 'get'
  });
}


// 冷站趋势图
export function getColdStationTrend(params) {
  return request({
    url: '/cop/copTrend',
    method: 'get',
    params
  });
}

// 设备状态列表
export function getStatusList(data) {
  return request({
    url: `/cop/copStatusRecord?pageNo=${data.pageNo}&pageSize=${data.pageSize}`,
    method: 'post',
    data
  });
}

// 传感器列表
export function getSensorList(data) {
  return request({
    url: `/cop/copSensorRecord?pageNo=${data.pageNo}&pageSize=${data.pageSize}`,
    method: 'post',
    data
  });
}

// 运行时间列表
export function getRunTimeList(data) {
  return request({
    url: `/cop/copRuntimeRecord?pageNo=${data.pageNo}&pageSize=${data.pageSize}`,
    method: 'post',
    data
  });
}

// 导出
export function exportExcel(data) {
  return request({
    url: '/cop/exportData',
    method: 'post',
    data,
    responseType: 'blob'
  });
}

// 冷站能耗报表设备树数据
export function getColdStationData(parentOrgId) {
  return request({
    url: `/cop/getCopOrgTree/energy/${parentOrgId}`,
    method: 'get',
  });
}

// 冷站能耗报表
export function getColdStationEnergy(data) {
  return request({
    url: '/energyData/coldSiteEnergyData',
    method: 'post',
    data
  });
}

// 冷站能耗报表-导出
export function exportColdStationEnergy(data) {
  return request({
    url: '/energyData/coldSiteEnergyData/export',
    method: 'post',
    data,
    responseType: 'blob'
  });
}

/**
 * 17块总表
 */
// 获取17块总表设备
export function getTotalDeviceTree() {
  return request({
    url: '/energyData/summaryMeterTree',
    method: 'get',
  });
}

// 获取17块总表数据
export function getTotalData(data) {
  return request({
    url: '/energyData/summaryMeterEnergyData',
    method: 'post',
    data
  });
}

// 17块总表-导出
export function exportTotalData(data) {
  return request({
    url: '/energyData/summaryMeterEnergyData/export',
    method: 'post',
    data,
    responseType: 'blob'
  });
}

/**
 * 系统能耗
 */
// 获取系统能耗表头
export function getSystemEfficiencyHeader(type) {
  return request({
    url: `/energyData/listTitle/${type}`,
    method: 'get',
  });
}

// 查询
export function handleEnergyDataSystemEfficiency(data, arr) {
  return request({
    url: `/energyData/systemEfficiency2?queryDate=${data.queryDate}&type=${data.type}`,
    method: 'post',
    headers: {
      'content-type': 'application/json; charset=utf-8',
    },
    data: arr,
  });
}

// 导出
export function handleEnergyDataExport(data, arr) {
  return request({
    url: `/energyData/systemEfficiency2/export?queryDate=${data.queryDate}&type=${data.type}`,
    method: 'post',
    responseType: 'blob',
    data: arr,
  });
}




/**
 * 设备运行参数
 */
// 运行时长分页
export function handleEquipmentPageEquipmentRunTime(data,page) {
  return request({
      url: `/equipment/pageEquipmentRunTime?equipmentName=${data.equipmentName}&queryDate=${data.queryDate}&pageNum=${page.pageNo}&pageSize=${page.pageSize}`,
      method: 'post',
      data: data.equipmentType,
  });
}

// 状态记录分页
export function handleEquipmentPageEquipmentStatus(data,page) {
  return request({
      url: `/equipment/pageEquipmentStatus?equipmentName=${data.equipmentName}&queryDate=${data.queryDate}&pageNum=${page.pageNo}&pageSize=${page.pageSize}`,
      method: 'get',
  });
}

// 传感器分页
export function handleEquipmentPageSensorData(data,page) {
  return request({
      url: `/equipment/pageSensorData?equipmentName=${data.equipmentName}&queryDate=${data.queryDate}&pageNum=${page.pageNo}&pageSize=${page.pageSize}`,
      method: 'get',
  });
}

