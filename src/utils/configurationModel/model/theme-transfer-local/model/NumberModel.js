import BaseModel from './BaseModel'

class NumberModel extends BaseModel {
    constructor(data) {
        super(data, 'configPartPointNumList')
        const options = this.options

        options.point = data['pointId']
        options.pointName = data['pointName']
        options.isEdit = !!Number(data['isEditable'])
        options.decimal = data['decimalDigit']
        options.size = data['valueFontSize']
        options.isSimulate = data['isSimulate']
        options.color = data['color']
    }
}

export default NumberModel
