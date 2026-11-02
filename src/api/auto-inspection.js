// 智能巡检
import request from "@/utils/request";


//查询属性点
export function getPointList(data,page){
    return request({
        method:'post',
        url:`/pointController/findPointByPage/${page.pageNo}/${page.pageSize}`,
        data,
    })
}

// 查询通讯设备
export function getDeviceList(data){
    return request({
        method:'post',
        url:`deviceController/findDeviceByPage/1/9999`,
        data,
    })
}
// 查询设备台账
export function getEquipmentList(data,page){
    return request({
        url:`/equipment/page?pageNo=${page.pageNo}&pageSize=${page.pageSize}`,
        method:'post',
        data,
    })
}

//新增配置
export function addSettingParams(data){
    return request({
        url:`/smartInspect/config`,
        method:'post',
        data,
    })
}

// 编辑配置
export function updateSettingParams(data){
    return request({
        url:'/smartInspect/config',
        method:'put',
        data,
    })
}

//配置启用/停用
export function switchConfig(id,value){
    return request({
        method:'get',
        url:`/smartInspect/config/enable/${id}/${value}`
    })
}

//配置分页
export function getConfigListByPage(data,page){
    return request({
        method:'post',
        url:`/smartInspect/config/page?pageNo=${page.pageNo}&pageSize=${page.pageSize}`,
        data,
    })
}

//模板下载
export function getConfigTemplate(){
    return request({
        method:'get',
        url:'/smartInspect/config/exportTemplate',
        headers: {
            'content-type': 'application/json; charset=utf-8',
        },
        responseType: 'blob',
    })
}

// 新增任务时配置查询
export function getConfigGroup(dynamicParam){
    return request({
        method:'get',
        url:`/smartInspect/config/group?dynamicParam=${dynamicParam}`
    })
}

// 获取智能巡检列表分页
export function getAutoInspectList(data,page){
    return request({
        method:'post',
        url:`/smartInspect/page?pageNo=${page.pageNo}&pageSize=${page.pageSize}`,
        data,
    })
}
// 新增任务
export function addAutoInspect(data){
    return request({
        method:'post',
        url:'/smartInspect',
        data,
    })
}

// 编辑任务
export function updateAutoInspect(data){
    return request({
        method:'put',
        url:'/smartInspect',
        data,
    })
}

// 删除任务
export function delAutoInspect(data){
    return request({
        method:'delete',
        url:'/smartInspect',
        data,
    })
}

// 启用/禁用任务
export function switchAutoInspec(id,val){
    return request({
        method:'get',
        url:`/smartInspect/enable?id=${id}&val=${val}`
    })
}

// 任务详情
export function autoInspectDetail(id){
    return request({
        method:'get',
        url:`/smartInspect/${id}`
    })
}

//单检
export function singleInspect(data){
    return request({
        method:'post',
        url:'/smartInspect/singleInspect',
        data,
    })
}

// 智能巡检记录分页
export function getAutoInspectHistory(params){
    return request({
        method:'get',
        url:`/smartInspect/record/page`,
        params:{...params}
    })
}

//智能巡检记录详情
export function getAutoInspectHistoryDetail(id){
    return request({
        method:'get',
        url:`/smartInspect/record/${id}`
    })
}

// 智能巡检记录导出
export function downloadAutoHistoryData(id){
    return request({
        method:'get',
        url:`/smartInspect/record/export/${id}`,
        headers: {
            'content-type': 'application/json; charset=utf-8',
        },
        responseType: 'blob',
    })
}

// 新增巡检路线
export function addInspectPath(data){
    return request({
        method:'post',
        url:'/inspect/line',
        data,
    })
}

// 巡检路线查询分页
export function getInspectPathByPage(data,page){
    return request({
        method:'get',
        url:`/inspect/line/page?lineNmae=${data.lineName}&pageNo=${page.pageNo}&pageSize=${page.pageSize}`
    })
}

// 编辑巡检路线
export function updateInspectPath(data){
    return request({
        method:'put',
        url:'/inspect/line',
        data,
    })
}






// --------------------------------------------------------
