import BaseModel from './BaseModel'

class CircleModel extends BaseModel {
    constructor(data) {
        super(data, 'circleList')
        const options = this.options
        options.id = data['id']
        options.name = data['partName']
        options.type = data['type']
        options.alpha = data['diaphaneity']
        options.bgColor = data['fillColor']
        options.borderColor = data['frameColor']
        options.borderWidth = data['frameWidth']
        options.borderStyle = data['frameStyle']
        options.tips = data['tip']
    }
}

export default CircleModel
