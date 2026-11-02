import BaseModel from './BaseModel'

class ChartModel extends BaseModel {
    constructor(data) {
        super(data, 'configPartPointTrendList')
        const options = this.options

        this._id = data['partPointTrendId']
        options.point = data['pointId']
        options.pointName = data['pointName']
        options.isVirtualPoint = !!Number(data['isSimulate'])
        options.dateType = data['trendType']
        options.chartType = data['chartType']
    }
}

export default ChartModel
