import BaseModel from './BaseModel'

function getTimeConfigOptions(arr) {
    return arr.map(item => ({
        executeTime: item.executeTime,
        executeValue: item.executeValue
    }))
}

function getPointConfigOptions(arr) {
    return arr.map(item => ({
        pointId: item.pointId,
        onValue: item.onValue,
        offValue:item.offValue
    }))
}
class ScheduleModel extends BaseModel {
    constructor(data) {
        super(data, 'timeControlList')
        const { options } = data
        const { timeConfigList,pointConfigList } = options

        this.type = options.type
        this.themeId = ''
        this.partName = options.partName
        this.diaphaneity = options.diaphaneity
        this.frameColor = options.frameColor
        this.frameWidth = options.frameWidth
        this.backgroundColor = options.backgroundColor
        this.circleMode = options.circleMode
        this.weekNum = options.weekNum?.join(',')
        this.intervalTime = options.intervalTime
        this.executeType = options.executeType

        this.timeConfigList = getTimeConfigOptions(timeConfigList)
        this.pointConfigList = getPointConfigOptions(pointConfigList)
    }
}

export default ScheduleModel
