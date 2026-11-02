import BaseModel from './BaseModel'

class ImageModel extends BaseModel {
    constructor(data) {
        super(data, 'configPartImgList')
        const { options } = data

        this.imgUrl = options.imgSrc
        this.linkUrl = options.url
        this.linkOpen = options.urlType
        this.linkWidth = options.modelWidth
        this.linkHeight = options.modelHeight
    }
}

export default ImageModel
