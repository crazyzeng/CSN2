import BaseModel from './BaseModel'

class CircleModel extends BaseModel {
    constructor(data) {
        super(data, 'circleList')
        const { options } = data
        this.partName = options.name
        this.type = options.type
        this.themeId = ''
        this.diaphaneity = options.alpha
        this.fillColor = options.bgColor
        this.frameColor = options.borderColor
        this.frameWidth = options.borderWidth
        this.frameStyle = options.borderStyle
        this.tip = options.tips
    }
}

export default CircleModel
