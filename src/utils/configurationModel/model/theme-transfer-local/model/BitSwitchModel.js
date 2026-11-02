import BaseModel from './BaseModel'

class BitSwitchModel extends BaseModel {
    constructor(data) {
        super(data, 'configPartPointBitSwitchList')
        const options = this.options
        const config = options.config = []

        options.readPoint = data['pointId']
        options.readPointName = data['pointName']
        options.writePoint = data['controlPointId']
        options.writePointName = data['controlPointName']
        options.writePointValue = data['controlPointValue']
        config[0] = { value: data['falseValue'], imgSrc: data['imgFalseUrl'] }
        config[1] = { value: data['trueValue'], imgSrc: data['imgTrueUrl'] }
    }
}

export default BitSwitchModel
