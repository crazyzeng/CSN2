import BaseModel from './BaseModel'

class NumberModel extends BaseModel {
    constructor(data) {
        super(data, 'configPartPointNumList')
        const { options } = data

        this.pointId = options.point
        this.pointName = options.pointName
        this.isEditable = options.isEdit ? 1 : 0
        this.decimalDigit = options.decimal
        this.valueFontSize = options.size
        this.aheadDecimalDigit = 10
        this.isSimulate = options.isSimulate
        this.color = options.color
    }
}

export default NumberModel
