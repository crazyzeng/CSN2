import Models from './getModels'

import { baseModelByType } from '../../config/config'

export default function factory (data, key) {
    console.log('Models[baseModelByType[key]]',Models[baseModelByType[key]])
    return Models[baseModelByType[key]](data)
}
