import BaseModel from './BaseModel'

/**
 * 数据转换
 * @param { Array } arr
 * @returns { Array } options
 */

class FireAlarmModel extends BaseModel {
    constructor(data) {
        super(data, 'configPartPointFireMonitorList')
        const { options } = data

        this.greenPointId = options.greenPoint
        this.greenPointValue  = options.greenPointValue
        this.redPointId = options.redPoint
        this.redPointValue  = options.redPointValue
        this.yellowPointId = options.yellowPoint
        this.yellowPointValue  = options.yellowPointValue
        this.deviceName = options.text
        this.deviceImgUrl = options.imgSrc
    }
}

export default FireAlarmModel
