import request from "@/utils/request";

/**
 * 查询告警列表数据
 * @method POST
 * @param { Object } data 查询条件
 * @param { Object } paging 分页配置
 * @returns { Promise } axios 实例
 */
export function queryWarnList(data = {}, paging = { pageNum: 1, pageSize: 10 }) {
    return request({
        url: `/alarmRecordController/getAlarmRecordByParam/${paging.pageNum}/${paging.pageSize}`,
        method: 'post',
        data
    });
}
// 通讯告警分页
export function queryCommunicationList(data = {}, paging = { pageNum: 1, pageSize: 10 }) {
    return request.get('/alarmRecordController/pageCommunicationAlarm', {
      params: {
        startDate: data.startDate,
        endDate: data.endDate,
        pageNum: paging.pageNum,
        pageSize: paging.pageSize
      }
    });
  }
  /**
 * 批量告警删除记录
 * @param {Array<any>}idArray
 * @returns {Promise<AxiosResponse<any>>}
 */
export function batchDeleteAlarmRecord(idArray) {
    return request.delete('/alarmRecordController', {
      data:idArray
    });
  }
/**
 * 告警类别
 * @method POST
 * @param { Object } data 空对象一般不用传值
 * @returns { Promise } axios 实例
 */
export function getWarnMasterPlate(data = {}) {
    return request({
        url: `/alarmMasterplateController/findAlarmMasterplate`,
        method: 'post',
        data
    });
}

/**
 * 获取告警详情
 * @method GET
 * @param { String } alarmRecordId 告警记录 id
 * @returns { Promise } axios 实例
 */
export function getWarnDetail(alarmRecordId) {
    return request({
        url: `/alarmRecordController/getAlarmRecord/${alarmRecordId}`,
        method: 'get'
    });
}

/**
 * 删除告警
 * @method GET
 * @param { String } alarmRecordId 告警记录 id
 * @returns { Promise } axios 实例
 */
export function delWarn(alarmRecordId) {
    return request({
        url: `/alarmRecordController/delAlarmRecord/${alarmRecordId}`,
        method: 'get'
    });
}

/**
 * 批量删除告警
 * @method GET
 * @param { String } alarmRecordIds 告警记录 id
 * @returns { Promise } axios 实例
 */
export function delWarns(alarmRecordIds) {
    return request({
        url: `/alarmRecordController/delBatchAlarmRecord/${alarmRecordIds}`,
        method: 'get'
    });
}

/**
 * 处理
 * @method POST
 * @param { Object } data 告警处理
 * @returns { Promise } axios 实例
 */
export function handleWarn(data = {}) {
    return request({
        url: `/alarmRecordController/handleAlarm`,
        method: 'post',
        data
    });
}

/**
 * 导出
 * @method POST
 * @param { Object } data 告警查询条件
 * @returns { Promise } axios 实例
 */
export function exportWarns(data = {}) {
    return request({
        url: `/alarmRecordController/export`,
        method: 'post',
        responseType: 'blob',
        data
    });
}
// 设备告警导出
export function exportDeviceWarns(data = {}) {
    return request({
        url: `/alarmRecordController/exportAlarmRecord`,
        method: 'post',
        responseType: 'blob',
        data
    });
}
// 系统告警导出
export function exportSystemWarns(data = {}) {
    return request({
        url: `/alarmRecordController/exportCommunicationAlarm`,
        method: 'get',
        responseType: 'blob',
        params:{...data}
    });
}
// 能源告警导出
export function exportEnergyWarns(data = {}) {
    return request({
        url: `/alarmRecordController/exportEnergyAlarm`,
        method: 'get',
        responseType: 'blob',
        params:{...data}
    });
}

// 系统告警处理
export function dealCommunicationAlarm(data = {}) {
    return request({
        url: `/alarmRecordController/handleSystemAlarm`,
        method: 'post',
        data
    });
}


//能源告警分页
export function getEnergyWarnsPage(data={}){
    return request({
        url:'/alarmRecordController/pageEnergyAlarm',
        method:'get',
        params:{...data}
    })
}

//能源告警处理
export function handleEnergyAlarm(data={}){
    return request({
        url:'/alarmRecordController/handleEnergyAlarm',
        method:'post',
        data,
    })
}

//能源告警删除
export function deleteEnergyAlarm(data){
    return request({
        url:'/alarmRecordController/deleteEnergyAlarm',
        method:'delete',
        data,
    })
}