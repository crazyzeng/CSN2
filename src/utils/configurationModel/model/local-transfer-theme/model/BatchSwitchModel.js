import BaseModel from './BaseModel'

class BatchSwitchModel extends BaseModel {
    constructor(data) {
        super(data, 'configPartPointBatchControlList')
        const { options } = data

        this.partPointBatchControlId = options.partPointBatchControlId
        this.themeId = options.themeId
        this.pointIdList = options.pointIdList
        this.onValue = options.onValue
        this.offValue = options.offValue
    }
}

export default BatchSwitchModel
