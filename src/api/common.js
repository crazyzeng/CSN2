import request from '@/utils/request';

// 获取系统标题
export function getSystemTitle() {
    return request({
        url: `/node/getTitle`,
        method: 'get',
    });
}

//获取区域下拉列表
export function getAreaList() {
    return request({
        url: `/dicController/getDictItemsByCode?dictCode=energy_area`,
        method: 'get',
    });
}
//设备类型
export function getDeviceType(data = {}) {
    return request({
        url: `/dicController/getDictItemsByCode?dictCode=equipment_type`,
        method: 'get',
        data,
    });
}

//获取字典通用
export function getDict(code){
    return request({
        url:`/dicController/getDictItemsByCode?dictCode=${code}`,
        method:'get',
    })
}
// 字典翻译
export function dictTrans(data,text){
    const dictMap = {}
    data.forEach((item) => {
        dictMap[item.itemValue] = item.itemText
      })
      return text !== undefined&&Object.keys(dictMap).length>0? dictMap[text] : ''
}

//获取初始告警信息
export function getDefaultAlarm(){
    return request({
        url:'/alarmRecordController/getAllAlarmCountAndCurrentMonthEnergyAlarm',
        method:'get'
    })
}