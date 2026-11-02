import BaseModel from './BaseModel'

/**
 * 数据转换
 * @param { Array } arr
 * @returns { Array } options
 */

class FireAlarmModel extends BaseModel {
    constructor(data) {
        super(data, 'configPartPointFireMonitorList')
        const options = this.options

        options.greenPoint = data['greenPointId']
        options.greenPointName = data['greenPointName']
        options.greenPointValue = Number(data['greenPointValue'])
        options.redPoint = data['redPointId']
        options.redPointName = data['redPointName']
        options.redPointValue = Number(data['redPointValue'])
        options.yellowPoint = data['yellowPointId']
        options.yellowPointName = data['yellowPointName']
        options.yellowPointValue = Number(data['yellowPointValue'])
        options.text = data['deviceName']
        options.imgSrc = data['deviceImgUrl']
    }
}

export default FireAlarmModel
