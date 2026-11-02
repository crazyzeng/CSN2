import BaseModel from './BaseModel'

class StaticTextModel extends BaseModel {
    constructor(data) {
        super(data, 'textList')
        const options = this.options
        options.id = data['id']
        options.name = data['partName']
        options.type = data['type']
        options.alpha = data['diaphaneity']
        options.font = data['font']
        options.fontSize = data['fontSize']
        options.tips = data['tip']
        options.textColor = data['fontColor']
        options.fontWeight = data['bold']
        options.url = data['linkUrl']
        options.text = data['content']
    }
}

export default StaticTextModel
