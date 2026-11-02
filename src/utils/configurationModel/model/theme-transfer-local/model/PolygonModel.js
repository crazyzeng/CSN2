import BaseModel from './BaseModel'

class PolygonModel extends BaseModel {
    constructor(data) {
        super(data, 'polygonList')
        const options = this.options
        options.id = data['id']
        options.name = data['partName']
        options.type = data['type']
        options.alpha = data['diaphaneity']
        options.number = data['edgeNum']
        options.bgColor = data['fillColor']
        options.borderColor = data['frameColor']
        options.borderWidth = data['frameWidth']
        options.borderStyle = data['frameStyle']
        options.tips = data['tip']
    }
}

export default PolygonModel
