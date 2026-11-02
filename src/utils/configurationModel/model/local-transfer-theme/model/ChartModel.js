import BaseModel from './BaseModel'

class ChartModel extends BaseModel {
    constructor(data) {
        super(data, 'configPartPointTrendList')
        const { options } = data

        this.pointId = options.point
        this.pointName = options.pointName
        this.isSimulate = options.isVirtualPoint ? 1 : 0
        this.trendType = options.dateType
        this.chartType = options.chartType
    }
}

export default ChartModel
