import request from '@/utils/request'
import { isFatherAndSon } from '@/utils/index'

/**
 * @description 查询字典
 * @param {Object} data 参数 示例：{ name: 'xxx_xxx' }
 */
export function queryDictionary(data = {}) {
    return request({
        url: `/dicController/findDic`,
        method: 'post',
        data
    })
}

/**
 * @description 查询字典 有层级关系
 * @param {Object} data 参数 示例：{ name: 'xxx_xxx' }
 */
export function queryDictionaryJson(data = {}) {
    return request({
        url: `/dicController/findDic`,
        method: 'post',
        data
    }).then(res => {
        const { data: resData } = res
        if (resData instanceof Array && resData.length > 0) {
            return { resData: isFatherAndSon(resData) }
        } else {
            return []
        }
    })
}


export function findDic(data = {}) {
    return request({
        url: `/dicController/findDic`,
        method: 'post',
        data
    })
}


//查询设备台账中的设备类型
export function deviceLedgerTypeList() {
    return request({
      url: `/tEquipmentDictionaryController/getAll`,
      method: "get",
    });
  }