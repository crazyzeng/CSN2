import request from "@/utils/request";

/**
 * @description 根据 主题id 获取对应主题的数据
 * @param {String} id 主题id
*/
export function getConfigTheme(id) {
    return request({
        url: `/configThemeController/getConfigTheme/${id}`,
        method: 'get'
    });
}

/**
 * @description 根据 资源id 获取对应资源的主题数据
 * @param {String} orgId 资源
 * @param {String} dicCode 资源代码
*/
export function getConfigThemeByMenuAndOrg(orgId, dicCode) {
    return request({
        url: `/configThemeController/getConfigThemeByMenuAndOrg/${orgId}/${dicCode}`,
        method: 'get'
    });
}

/**
 * @description 点位趋势接口
 * @param { Object } data 趋势图点位和开始时间 { partPointTrendId, startTime }
*/
export function getConfigPointTrendData(data) {
    return request({
        url: `configPartPointTrendController/getPointTrendData/${data.partPointTrendId}/${data.startTime}`,
        method: 'get'
    });
}

export function doWriteTask(data){
    return request({
        url:`taskController/write/${data.pointId}?value=${data.value}`,
        method:'post'
    })
}

//群控开关操作
export function handleBatchCtrl(data,value){
    return request({
        url:`taskController/batchControl?value=${value}`,
        data,
        method:'post'
    })
}

 //回路操作操作
 export function handleLightModelCtrl(lightControlId, id) {
    return request({
        url:`configThemeController/lightControl?lightControlId=${lightControlId}&id=${id}`,
        method:'get'
    })
}
