import Models from './getModels';
import { baseModelByType } from '../../config/config'

export default function factory (data) {
    const { name } = data
    return Models[baseModelByType[name]](data)
}
