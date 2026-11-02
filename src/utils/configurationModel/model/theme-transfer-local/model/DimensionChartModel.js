import BaseModel from './BaseModel'

function getAxisList(data) {
    return data.map(item => ({
        valueLabel: item.unit,
        axisLineStyle: item.color,
        position: item.position,
        offset: item.deviation,
        id: item.identifier,
        name: '默认' // 字段不知道
    }))
}

function getDetailList(data) {
    return data.map(item => ({
        yAxisIndex: item.yAxis,
        symbol: item.iconType,
        name: item.groupName,
        valueFormula: item.pointExpression,
        itemStyleColor: item.thresholdExpression
    }))
}

class DimensionChartModel extends BaseModel {
    constructor(data) {
        super(data, 'configPartPointDimensionChartList')
        const options = this.options

        options.isVirtualPoint = Number(data['isSimulate'])
        options.dateType = data['trendType']
        options.chartType = data['chartType']

        // 原实现将 const 变量 yAxis/series 二次赋值（babel 下虽不报错，但 options.yAxis/options.series
        // 仍为空数组，存在隐患）；这里一次性把后端 axisList/detailList 映射到前端 options 上。
        options.yAxis = getAxisList(data['axisList'])
        options.series = getDetailList(data['detailList'])
    }
}

export default DimensionChartModel
