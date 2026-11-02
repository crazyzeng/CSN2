import BaseModel from './BaseModel'

class SwitchModel extends BaseModel {
    constructor(data) {
        super(data, 'configPartPointSwitchList')
        const { options } = data
        const { config } = options

        this.pointId = options.point
        this.pointName = options.pointName
        this.falseValue = config[0].value
        this.imgFalseUrl = config[0].text
        this.trueValue = config[1].value
        this.imgTrueUrl = config[1].text
    }
}

export default SwitchModel
