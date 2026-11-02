import request from "@/utils/request";
import { isFatherAndSon } from '@/utils/index'

//消防维保
//维保记录数量统计
export function getCountEquipment(id) {
  return request({
    url: `/indexController/getCountEquipment/${id}`,
    method: 'get',
  })
}
//消防设备维修占比
export function getRepairEquipment(id, type) {
  return request({
    url: `/indexController/getRepairEquipment/${id}/${type}`,
    method: 'get',
  })
}
//告警统计
// 告警类型
export function findAlarmMasterplate(data = {}) {
  return request({
    url: `/alarmMasterplateController/findAlarmMasterplate`,
    method: 'post',
    data: data
  })
}
//告警数据
export function getAlarmData(id, type) {
  return request({
    url: `/indexController/getAlarmData/${id}/${type}`,
    method: 'get',
  })
}
//区域误报率
export function getMisreport(id) {
  return request({
    url: `/indexController/getMisreport/${id}`,
    method: 'get',
  })
}
//消防联动设备运行情况
export function getDeviceState(id) {
  return request({
    url: `/indexController/getDeviceState/${id}`,
    method: 'get',
  })
}
//消防水源监测
//各类别模板的告警数量 
export function getFireWaterDate(id) {
  return request({
    url: `/indexController/getFireWaterDate/${id}`,
    method: 'get',
  })
}
//各设备总数和告警数
export function getfireWaterDeviceDate(id) {
  return request({
    url: `/indexController/getfireWaterDeviceDate/${id}`,
    method: 'get',
  })
}
//火情探测设备情况
//情况
export function getFireDeviceData(id) {
  return request({
    url: `/indexController/getFireDeviceData/${id}`,
    method: 'get',
  })
}
//logo
export function getFireLogo(id) {
  return request({
    url: `/indexController/getFireLogo/${id}`,
    method: 'get',
  })
}
// 查询站点
export function getUserSite(data = { type: 'org_resource_type_site' }) {
  return request({
    url: `/orgController/findOrgByLoginUser`,
    method: 'post',
    data: data
  })
}

// 查询所有资源
export function queryOrgAll(data = {}) {
  return request({
    url: `/orgController/findOrg`,
    method: 'post',
    data: data
  })
    .then(res => {
      const { data } = res
      if (data instanceof Array && data.length > 0) {
        return { data: isFatherAndSon(data, 'orgId', 'parentOrgId') }
      } else {
        return []
      }
    })
}

//new 查询所有资源
export function getSourceTree(data = {}) {
  return request({
    url: `/energyOverviewController/filterOrgByPointType/ENERGY`,
    method: 'post',
    data: data
  })
    .then(res => {
      const { data } = res
      if (data instanceof Array && data.length > 0) {
        return { data: isFatherAndSon(data, 'orgId', 'parentOrgId') }
      } else {
        return []
      }
    })
}

// 询多个资源下的点位对象
export function getPointByOrgList(data) {
  return request({
    url: `/orgController/getPointByOrg/${data.type}`,
    method: 'post',
    data: data.orgIdList
  })
}

//获取所有能耗类型点位
export function getEnergyPointByOrg(data) {
  return request({
    url: `/orgController/getEnergyPointByOrg/${data.orgId}/${data.type}`,
    method: 'get',
  })
}


// 查询组织下的点位对象(可筛选点位类型)
export function getPointByOrgAType(data) {
  return request({
    url: `/orgController/getPointByOrg/${data.orgId}/${data.type}`,
    method: 'get',
  })
}

// 通过用户获取组织
export function getOrgByUser(username) {
  return request({
    url: `/orgController/getOrgByUser/${username}`,
    method: 'get',
  })
}

// 通过角色获取组织
export function getOrgByRoleCode(roleCode) {
  return request({
    url: `/orgController/getOrgByRoleCode/${roleCode}`,
    method: 'get',
  })
}

// 查询登录用户的资源树类型
export function findOrgByLoginUserFilterSecondType(secondType) {
  return request({
    url: `orgController/findOrgByLoginUserFilterSecondType/${secondType}`,
    method: 'get'
  }).then(res => {
    if (Array.isArray(res.data)) {
      if (res.data.length > 0) {
        return isFatherAndSon(res.data, 'orgId', 'parentOrgId')
      } else {
        return []
      }
    }

    return false
  })
}




//查询所有资源名称
export function getOrgName(types) {
  return request({
      url: `/orgController/orgIdMapping`,
      method: 'get',
      params:{queryTypes:types}
  })
}

//查询所有资源名称
export function getSystemList(types) {
  return request({
      url: `/orgController/userOrgList`,
      method: 'get',
      params:{type:types}
  })
}

