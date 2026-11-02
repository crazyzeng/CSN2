import BaseModel from './BaseModel'

class RectModel extends BaseModel {
    constructor(data) {
        super(data, 'rectangleList')
        const { options } = data
        this.partName = options.name
        this.type = options.type
        this.themeId = ''
        this.rotation = options.deg
        this.reverse = options.flip
        this.diaphaneity = options.alpha
        this.fillColor = options.bgColor
        this.frameColor = options.borderColor
        this.frameWidth = options.borderWidth
        this.frameStyle = options.borderStyle
        this.tip = options.tips
    }
}

export default RectModel
