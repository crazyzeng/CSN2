import BaseModel from './BaseModel'

class ImageModel extends BaseModel {
    constructor(data) {
        super(data, 'configPartImgList')
        const options = this.options

        options.imgSrc = data['imgUrl']
        options.url = data['linkUrl']
        options.urlType = data['linkOpen']
        options.modelWidth = data['linkWidth']
        options.modelHeight = data['linkHeight']
    }
}

export default ImageModel
