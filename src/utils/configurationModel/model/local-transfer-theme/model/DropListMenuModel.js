import BaseModel from './BaseModel'

/**
 * 数据转换
 * @param { Array } arr
 * @returns { Array } options
 */
function getConfigOptions(arr) {
    return arr.map(item => ({
        isDefault: 0,
        optionName: item.text,
        optionValue: item.value
    }))
}

class DropListMenuModel extends BaseModel {
    constructor(data) {
        super(data, 'configPartPointSelectList')
        const { options } = data
        const { config } = options

        this.pointId = options.point
        this.pointName = options.pointName
        this.options = getConfigOptions(config)
    }
}

export default DropListMenuModel
