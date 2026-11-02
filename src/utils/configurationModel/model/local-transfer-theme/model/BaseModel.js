import { prefixByType } from '../../../config/config'

const validatorPointKeys = [
    'point', 
    'pointValue',
    'writePoint', 
    'readPoint', 
    'redPoint', 
    'redPointValue', 
    'greenPoint', 
    'greenPointValue', 
    'yellowPoint', 
    'yellowPointValue'
]

const validatorImagesKeys = [
    'imgSrc'
]

class BaseModel {
    constructor(data, type) {
        validatorPoint(data)

        const { attribute, formatter } = data

        // attribute
        this[`${prefixByType[type]}Width`] = attribute.w
        this[`${prefixByType[type]}Height`] = attribute.h
        this[`${prefixByType[type]}X`] = attribute.x
        this[`${prefixByType[type]}Y`] = attribute.y
        this['zIndex'] = attribute.z
        this['imgRotation'] = attribute.deg
        this['imgReverse'] = attribute.flip

        // formatter
        this.configControlPartColor = { partType: data.name, expressions: formatter.color }
        this.configControlPartEnable = { partType: data.name, expressions: formatter.isControl }
        this.configControlPartDisplay = { partType: data.name, expressions: formatter.isShow }
    }
}

/**
 * 验证 point 点位的选择
 */
function validatorPoint (data) {
    const { options } = data
    const keys = Object.keys(options)

    const intersection1 = validatorPointKeys.filter(item => keys.includes(item))
    
    if(intersection1.length) {
        intersection1.forEach(key => {
            if(
                options[key] === '' || 
                options[key] === null || 
                options[key] === undefined 
            ) {
                throw new Error(`组件类型：${ data.name };组件名称：${ data.text ? data.text : data.id };验证信息：请选择点位地址或点位值;`)
            }
        })
    }


    if(data.name === 'BitSwitch') {
        const [{ imgSrc: imgSrcOff }, { imgSrc: imgSrcOn }] = options.config

        if(
            imgSrcOff === '' || imgSrcOff === null || imgSrcOff === undefined || imgSrcOff.length > 128 ||
            imgSrcOn === '' || imgSrcOn === null || imgSrcOn === undefined || imgSrcOn.length > 128
        ) {
            throw new Error(`组件类型：${data.name};组件名称：${ data.text ? data.text : data.id };验证信息：请选择图片;`)
        }
    }
}

export default BaseModel
