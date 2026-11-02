import BaseModel from './BaseModel'

function getConfigOptions(arr) {
    return arr.map(item => ({
        executeTime: item.executeTime,
        executeValue: item.executeValue
    }))
}

function getPointConfig(arr){
    return arr.map(item=>({
        pointId:item.pointId,
        onValue:item.onValue,
        offValue:item.offValue
    }))
}

class ScheduleModel extends BaseModel {
    constructor(data) {
        super(data, 'timeControlList')
        const options = this.options
        const timeConfigList = options.timeConfigList = []
        const pointConfigList = options.pointConfigList = []

        options.id = data['id']
        options.partName = data['partName']
        options.type = data['type']
        options.diaphaneity = data['diaphaneity']
        options.frameColor = data['frameColor']
        options.frameWidth = data['frameWidth']
        options.backgroundColor = data['backgroundColor']
        options.circleMode = data['circleMode']
        options.weekNum = data['weekNum']?.split(',')
        options.intervalTime = data['intervalTime']
        options.executeType = data['executeType']

        timeConfigList.push(...getConfigOptions(data['timeConfigList']))
        pointConfigList.push(...getPointConfig(data['pointConfigList']))


    }
}

export default ScheduleModel
