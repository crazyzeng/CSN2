import BaseModel from './BaseModel'

class RadioModel extends BaseModel {
    constructor(data) {
        super(data, 'configPartPointRadioboxList')
        const { options } = data

        this.pointId = options.point
        this.pointName = options.pointName
        this.radioValue = options.pointValue
        this.groupName = options.groupName
    }
}

export default RadioModel
