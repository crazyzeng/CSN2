import BaseModel from './BaseModel'

function getConfigOptions(arr) {
    return arr.map(item => ({
        minValue: item.minValue,
        minType: item.minType,
        maxValue: item.maxValue,
        maxType: item.maxType,
        imgUrl: item.imgSrc
    }))
}

class MultiStatusModel extends BaseModel {
    constructor(data) {
        super(data, 'configPartPointMultiStatusDisplayList')
        const { options } = data
        const { config } = options

        this.pointId = options.point
        this.pointName = options.pointName
        this.detailList = getConfigOptions(config)
    }
}

export default MultiStatusModel
