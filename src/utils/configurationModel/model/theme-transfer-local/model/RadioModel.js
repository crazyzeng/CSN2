import BaseModel from './BaseModel'

class RadioModel extends BaseModel {
    constructor(data) {
        super(data, 'configPartPointRadioboxList')
        const options = this.options

        options.point = data['pointId']
        options.pointName = data['pointName']
        options.pointValue = data['radioValue']
        options.groupName = data['groupName']
    }
}

export default RadioModel
