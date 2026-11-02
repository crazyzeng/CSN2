import BaseModel from './BaseModel'

class RectModel extends BaseModel {
    constructor(data) {
        super(data, 'rectangleList')
        const options = this.options
        options.id = data['id']
        options.name = data['partName']
        options.type = data['type']
        options.deg = data['rotation']
        options.flip = data['reverse']
        options.alpha = data['diaphaneity']
        options.bgColor = data['fillColor']
        options.borderColor = data['frameColor']
        options.borderWidth = data['frameWidth']
        options.borderStyle = data['frameStyle']
        options.tips = data['tip']
    }
}

export default RectModel
