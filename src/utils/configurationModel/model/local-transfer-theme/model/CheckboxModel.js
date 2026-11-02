import BaseModel from './BaseModel'

class CheckboxModel extends BaseModel {
    constructor(data) {
        super(data, 'configPartPointCheckboxList')
        const { options } = data
        const { config } = options

        this.pointId = options.point
        this.pointName = options.pointName
        this.isControl = options.isControl ? 1 : 0
        this.falseValue = config[0].value
        this.imgFalseUrl = config[0].imgSrc
        this.trueValue = config[1].value
        this.imgTrueUrl = config[1].imgSrc
    }
}

export default CheckboxModel
