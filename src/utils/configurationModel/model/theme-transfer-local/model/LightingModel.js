import BaseModel from './BaseModel'

/**
 * 显示时/页面加载时使用
 * 数据转换
 * @param { Array } arr
 * @returns { Array } options
 */
function getConfigOptions(arr) {
    return arr.map(item => ({
        text: item.optionName,
        value: item.optionValue
    }))
}

class LightingModel extends BaseModel {
    constructor(data) {
        super(data, 'configPartPointLightControlList')
        const options = this.options
        // const config = options.config = []

        options.pointIds = data['pointIds']
        options.partPointLightControlId = data['partPointLightControlId']
        options.config = data['configList']
        //
        // config.push(...getConfigOptions(data['options']))
    }
}

export default LightingModel
