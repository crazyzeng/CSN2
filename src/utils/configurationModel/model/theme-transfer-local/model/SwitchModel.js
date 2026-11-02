import BaseModel from './BaseModel'

class SwitchModel extends BaseModel {
    constructor(data) {
        super(data, 'configPartPointSwitchList')
        const options = this.options
        const config = options.config = []

        options.point = data['pointId']
        options.pointName = data['pointName']
        config[0] = { value: data['falseValue'], text: data['imgFalseUrl'] }
        config[1] = { value: data['trueValue'], text: data['imgTrueUrl'] }
    }
}

export default SwitchModel
