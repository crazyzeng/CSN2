import BaseModel from './BaseModel'

function getConfigOptions(arr) {
    return arr.map(item => ({
        minValue: item.minValue,
        minType: item.minType,
        maxValue: item.maxValue,
        maxType: item.maxType,
        imgSrc: item.imgUrl,
    }))
}

class MultiStatusModel extends BaseModel {
    constructor(data) {
        super(data, 'configPartPointMultiStatusDisplayList')
        const options = this.options
        const config = options.config = []

        options.point = data['pointId']
        options.pointName = data['pointName']

        config.push(...getConfigOptions(data['detailList']))
    }
}

export default MultiStatusModel
