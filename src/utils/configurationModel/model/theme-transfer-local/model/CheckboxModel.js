import BaseModel from './BaseModel'

class CheckboxModel extends BaseModel {
    constructor(data) {
        super(data, 'configPartPointCheckboxList')
        const options = this.options
        const config = options.config = []

        options.point = data['pointId']
        options.pointName = data['pointName']
        options.isControl = !!Number(data['isControl'])
        config[0] = { value: data['falseValue'], text: 'OFF', imgSrc: data['imgFalseUrl'] }
        config[1] = { value: data['trueValue'], text: 'ON', imgSrc: data['imgTrueUrl'] }
    }
}

export default CheckboxModel
