import BaseModel from './BaseModel'

class MultiBitSwitchModel extends BaseModel {
    constructor(data) {
        super(data, 'multiBitSwitchList')
        const options = this.options

        options.id = data['id']
        options.partName = data['partName']
        options.type = data['type']
        options.diaphaneity = data['diaphaneity']
        options.tip = data['tip']
        options.onBackgroundColor = data['onBackgroundColor']
        options.offBackgroundColor = data['offBackgroundColor']
        options.onButtonColor = data['onButtonColor']
        options.offButtonColor = data['offButtonColor']
        options.onText = data['onText']
        options.offText = data['offText']
        options.writeOnPointId = data['writeOnPointId']
        options.writeOnValue = data['writeOnValue']
        options.writeOffPointId = data['writeOffPointId']
        options.writeOffValue = data['writeOffValue']
        options.readPointId = data['readPointId']
        options.started = data['started']
        options.closed = data['closed']
    }
}

export default MultiBitSwitchModel
