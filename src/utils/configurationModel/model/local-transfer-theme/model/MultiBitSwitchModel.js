import BaseModel from './BaseModel'

class MultiBitSwitchModel extends BaseModel {
    constructor(data) {
        super(data, 'multiBitSwitchList')
        const { options } = data

        this.type = options.type
        this.themeId = ''
        this.partName = options.partName
        this.diaphaneity = options.diaphaneity
        this.tip = options.tip
        this.onBackgroundColor = options.onBackgroundColor
        this.offBackgroundColor = options.offBackgroundColor
        this.onButtonColor = options.onButtonColor
        this.offButtonColor = options.offButtonColor
        this.onText = options.onText
        this.offText = options.offText
        this.writeOnPointId = options.writeOnPointId
        this.writeOnValue = options.writeOnValue
        this.writeOffPointId = options.writeOffPointId
        this.writeOffValue = options.writeOffValue
        this.readPointId = options.readPointId
        this.started = options.started
        this.closed = options.closed
    }
}

export default MultiBitSwitchModel
