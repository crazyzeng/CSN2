import BaseModel from './BaseModel'

class BitSwitchModel extends BaseModel {
    constructor(data) {
        super(data, 'configPartPointBitSwitchList')
        const { options } = data
        const { config } = options

        this.pointId = options.readPoint
        this.pointName = options.readPointName
        this.controlPointId = options.writePoint
        this.controlPointName = options.writePointName
        this.controlPointValue = options.writePointValue
        this.falseValue = config[0].value
        this.imgFalseUrl = config[0].imgSrc
        this.trueValue = config[1].value
        this.imgTrueUrl = config[1].imgSrc
    }
}

export default BitSwitchModel
