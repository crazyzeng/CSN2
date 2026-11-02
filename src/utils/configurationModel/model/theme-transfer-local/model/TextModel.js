import BaseModel from './BaseModel'

class TextModel extends BaseModel {
    constructor(data) {
        super(data, 'configPartTextList')
        const options = this.options

        options.color = data['textColor']
        options.text = data['textContent']
        options.size = data['textFontSize']
        options.url = data['linkUrl']
        options.urlType = data['linkOpen']
        options.modelWidth = data['linkWidth']
        options.modelHeight = data['linkHeight']
    }
}

export default TextModel
