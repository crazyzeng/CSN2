import request from "@/utils/request";

//查询所有资源名称
export function getSystemList(types) {
  return request({
      url: `/orgController/userOrgList`,
      method: 'get',
      params:{type:types}
  })
}

//旅客数据分页查询
// #124720603
// POST/touristData/page
// 创建时间  2023年11月14日
// 修改时间  1 天前
// 修改者  Cw7q
// 创建者  Cw7q
// 责任人  未设置
// 目录  旅客数据管理
// date
// string
// 数据时间
// 可选
// pageNo
// integer
// 页码
// 必需
// 示例值:
// 1
// pageSize
// integer
// 页签
// 必需
// 示例值:
// 10

export function getTouristDataPage({ date, pageNo, pageSize }) {
    return request({
        url: `/touristData/page?date=${date}&pageNo=${pageNo}&pageSize=${pageSize}`,
        method: 'post',
    })
}


//新增旅客数据
// POST/touristData
// 创建时间  2023年11月14日
// 修改时间  1 天前
// 修改者  Cw7q
// 创建者  Cw7q
// 责任人  未设置
// 目录  旅客数据管理
// object
//
// {0}
// {
//   "date": "2019-01",
//   "touristNumber": 2782778
// }

export function addTouristData(data) {
    return request({
        url: `/touristData`,
        method: 'post',
        data
    })
}


//更新发送旅客数
// PUT/touristData
// 创建时间  2023年11月14日
// 修改时间  1 天前
// 修改者  Cw7q
// 创建者  Cw7q
// 责任人  未设置
// 目录  旅客数据管理
// object
//
// {0}
// {
//   "id": 1,
//   "date": "2023-10",
//   "touristNumber": 586320
// }

export function updateTouristData(data) {
    return request({
        url: `/touristData`,
        method: 'put',
        data
    })
}

//批量删除发送游客数
// DELETE/touristData
// 创建时间  2023年11月14日
// 修改时间  1 天前
// 修改者  Cw7q
// 创建者  Cw7q
// 责任人  未设置
// 目录  旅客数据管理
// object
//
// {0}
// [
//   2,
//   4
// ]

export function deleteTouristData(data) {
    return request({
        url: `/touristData`,
        method: 'delete',
        data
    })
}


//获取发送旅客数导入模板
// GET/touristData/excelTemplate
// 创建时间  2023年11月14日
// 修改时间  1 天前
// 修改者  Cw7q
// 创建者  Cw7q
// 责任人  未设置
// 目录  旅客数据管理

export function getTouristDataExcelTemplate() {
    return request({
        url: `/touristData/excelTemplate`,
        method: 'get',
        headers: {
            'content-type': 'application/json; charset=utf-8',
        },
        responseType: 'blob',
    })
}

//导入发送旅客数
// POST/touristData/import
// 创建时间  2023年11月14日
// 修改时间  1 天前
// 修改者  Cw7q
// 创建者  Cw7q
// 责任人  未设置
// 目录  旅客数据管理
// file
// file
// excel文件
// 可选

export function importTouristData(data) {
    return request({
        url: `/touristData/import`,
        method: 'post',
        data
    })
}

//能耗报告分页查询
// POST/energyReport/page
// 创建时间  2023年11月14日
// 修改时间  1 天前
// 修改者  Cw7q
// 创建者  Cw7q
// 责任人  未设置
// 目录  能耗报告
// 成功 (200)
// 接口响应
// reportName
// string
// 报告名称
// 可选
// reportType
// string
// 可选
// 报告类型 year年 qtr季度 month月
//
// releaseTime
// string
// 可选
// 发布时间 yyyy-MM-dd
//
// pageNo
// integer
// 页签
// 必需
// 示例值:
// 1
// pageSize
// integer
// 页码
// 必需
// 示例值:

export function getEnergyReportPage({ reportName, reportType, releaseTime, pageNo, pageSize }) {
    return request({
        url: `/energyReport/page?reportName=${reportName}&reportType=${reportType}&releaseTime=${releaseTime}&pageNo=${pageNo}&pageSize=${pageSize}`,
        method: 'post',
    })
}


//GET/energyReport/{id}
// 创建时间  2023年11月14日
// 修改时间  1 天前
// 修改者  Cw7q
// 创建者  Cw7q
// 责任人  未设置
// 目录  能耗报告
// 成功 (200)
// 接口响应
// id
// integer
// id
// 必需
// 示例值:
// 45

export function getEnergyReportById(id) {
    return request({
        url: `/energyReport/${id}`,
        method: 'get',
    })
}

//分页
// #124122096
// GET/api/page
// 创建时间: 2023年11月11日
// 修改时间: 6 天前
// 最后修改人: 13871496762
// 创建人: 13871496762
// 责任人: 未设置
// 分组: API管理
// 名称	来源	URL / 参数	操作
// 成功 (200)	接口响应	http://127.0.0.1:4523/m1/2747615-0-default/api/page	快捷请求
// 异常 (500)	接口响应	http://127.0.0.1:4523/m1/2747615-0-default/api/page?apifoxResponseId=350241874	快捷请求
// 参数名	位置	类型	必填	说明
// pageNo	query
// integer
// 否
// 示例值：
// 1
// pageSize	query
// integer
// 否
// 示例值：
// 10

export function getApiPage({ pageNo, pageSize }) {
    return request({
        url: `/api/page?pageNo=${pageNo}&pageSize=${pageSize}`,
        method: 'get',
    })
}

//启用/禁用
// #124122263
// PUT/api
// 创建时间  2023年11月11日
// 修改时间  6 天前
// 修改者  13871496762
// 创建者  13871496762
// 责任人  未设置
// 目录  API管理
// 成功 (200)
// 接口响应
// url
// string
// 必需
// requestType
// string
// 必需
// disable
// integer
// 1禁用0启用
// 必需
// {
//   "requestType": "GET",
//   "url": "/api/page",
//   "disable": 1
// }

export function updateApi(data) {
    return request({
        url: `/api`,
        method: 'put',
        data
    })
}
