import { prefixByType, formTransKey } from '../../../config/config'

import { uuid } from '../../../../index'

class BaseModel {
    constructor(data, type) {
        this.id = uuid('material-', 1000)
        this.name = formTransKey[type]
        this.lock = false
        this.resizable = true
        this.options = {}
        const attribute = this.attribute = {}
        const formatter = this.formatter = {}


        // attribute
        attribute.w = data[`${prefixByType[type]}Width`]
        attribute.h = data[`${prefixByType[type]}Height`]
        attribute.x = data[`${prefixByType[type]}X`]
        attribute.y = data[`${prefixByType[type]}Y`]
        attribute.z = data['zIndex']
        if(type!=='configPartPointBatchControlList'){
            attribute.deg = data['imgRotation']
            attribute.flip = data['imgReverse']
            // formatter
            formatter.color = getFormatterExpressions(data, 'configControlPartColor')
            formatter.isShow = getFormatterExpressions(data, 'configControlPartDisplay')
            formatter.isControl = getFormatterExpressions(data, 'configControlPartEnable')
        }

    }
}

function getFormatterExpressions(data, key) {
    return data[key]
        ? data[key].expressions
        : ''
}

export default BaseModel
