import BaseModel from './BaseModel'

/**
 * 新增/编辑的数据
 * 数据转换
 * @param { Array } arr
 * @returns { Array } options
 * 主要做新增/编辑时，数据配置和拼接
 */
function getConfigOptions(arr) {
    return arr.map(item => ({
        isDefault: 0,
        optionName: item.text,
        optionValue: item.value
    }))
}

class LightingModel extends BaseModel {
    constructor(data) {
        super(data, 'configPartPointLightControlList')
        const { options } = data
        const { config } = options

        this.pointIds = options.pointIds
        this.partPointLightControlId = options.partPointLightControlId
        this.configList = config
        // this.options = getConfigOptions(config)
        //
    }
}

export default LightingModel
