import BaseModel from './BaseModel'

class PolygonModel extends BaseModel {
    constructor(data) {
        super(data, 'polygonList')
        const { options } = data
        this.partName = options.name
        this.type = options.type
        this.themeId = ''
        this.edgeNum = options.number
        this.diaphaneity = options.alpha
        this.fillColor = options.bgColor
        this.frameColor = options.borderColor
        this.frameWidth = options.borderWidth
        this.frameStyle = options.borderStyle
        this.tip = options.tips
    }
}

export default PolygonModel
