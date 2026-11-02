import BaseModel from './BaseModel'

class StaticTextModel extends BaseModel {
    constructor(data) {
        super(data, 'textList')
        const { options } = data
        this.partName = options.name
        this.type = options.type
        this.themeId = ''
        this.diaphaneity = options.alpha
        this.font = options.font
        this.fontSize = options.fontSize
        this.fontColor = options.textColor
        this.bold = options.fontWeight
        this.content = options.text
        this.linkUrl = options.url
        this.tip = options.tips
    }
}

export default StaticTextModel
