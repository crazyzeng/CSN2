import BaseModel from './BaseModel'

class BatchSwitchModel extends BaseModel {
    constructor(data) {
        super(data, 'configPartPointBatchControlList')
        const options = this.options

        options.partPointBatchControlId = data['partPointBatchControlId']
        options.themeId = data['themeId']
        options.onValue = data['onValue']
        options.offValue = data['offValue']
        options.pointIdList = data['pointIdList']
    }
}

export default BatchSwitchModel
