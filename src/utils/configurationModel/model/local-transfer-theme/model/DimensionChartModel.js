import BaseModel from './BaseModel'

function getAxisList(data) {
    return data.map(item => ({
        unit: item.valueLabel,
        color: item.axisLineStyle,
        position: item.position,
        deviation: item.offset,
        identifier: item.id
    }))
}

function getDetailList(data) {
    return data.map(item => ({
        yAxis: item.yAxisIndex,
        iconType: item.symbol,
        groupName: item.name,
        pointExpression: item.valueFormula,
        thresholdExpression: item.itemStyleColor
    }))
}

class DimensionChartModel extends BaseModel {
    constructor(data) {
        super(data, 'configPartPointDimensionChartList')
        const { options } = data
        const { yAxis, series } = options

        this.isSimulate = options.isVirtualPoint ? 1 : 0
        this.trendType = options.dateType
        this.chartType = options.chartType
        this.axisList = getAxisList(yAxis)
        this.detailList = getDetailList(series)
    }
}

export default DimensionChartModel
