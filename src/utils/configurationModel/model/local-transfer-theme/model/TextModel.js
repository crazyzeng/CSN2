import BaseModel from './BaseModel'

class TextModel extends BaseModel {
    constructor(data) {
        super(data, 'configPartTextList')
        const { options } = data

        this.textColor = options.color
        this.textContent = options.text
        this.textFontSize = options.size
        this.linkUrl = options.url
        this.linkOpen = options.urlType
        this.linkWidth = options.modelWidth
        this.linkHeight = options.modelHeight
    }
}

export default TextModel
