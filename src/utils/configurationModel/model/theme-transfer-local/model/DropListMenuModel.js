import BaseModel from './BaseModel'

/**
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

class DropListMenuModel extends BaseModel {
    constructor(data) {
        super(data, 'configPartPointSelectList')
        const options = this.options
        const config = options.config = []

        options.point = data['pointId']
        options.pointName = data['pointName']
        options.point = data['pointId']

        config.push(...getConfigOptions(data['options']))
    }
}

export default DropListMenuModel
