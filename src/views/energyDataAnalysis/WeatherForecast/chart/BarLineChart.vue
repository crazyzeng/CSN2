<template>
    <div ref="comboChart" class="echart-container"></div>
</template>

<script>
import * as echarts from 'echarts';

export default {
    name: 'BarLineChart',
    props: {
        chartData: {
            type: Object,
            required: true
        },
    },
    data() {
        return {
            chartInstance: null
        };
    },
    computed: {
        legendData() {
            if (Object.values(this.chartData).length > 0) {
                const tempArray = [];
                for (let key in this.chartData) tempArray.push(this.chartData[key][0].time.substr(0, 5))
                return tempArray
            }
        },
        xAxisData() {
            if (Object.values(this.chartData).length > 0) {
                const tempArray = this.chartData.submeterData.map(v => { return v.time.substr(5) })
                return tempArray
            }
        },
        firstUsage() {
            if (Object.values(this.chartData).length > 0) {
                const lastArray = this.chartData.submeterData
                const tempArray = lastArray.map(v => { return v.dataValue })
                return tempArray
            } else return []
        },
        firstTourist() {
            if (Object.values(this.chartData).length > 0) {
                const lastArray = this.chartData.submeterData
                const tempArray = lastArray.map(v => { return v.touristNumber })
                return tempArray
            } else return []
        },
        secondUsage() {
            if (Object.values(this.chartData).length > 0) {
                const lastArray = this.chartData.submeterDepict
                const tempArray = lastArray.map(v => { return v.dataValue })
                return tempArray
            } else return []
        },
        secondTourist() {
            if (Object.values(this.chartData).length > 0) {
                const lastArray = this.chartData.submeterDepict
                const tempArray = lastArray.map(v => { return v.touristNumber })
                return tempArray
            } else return []
        }
    },
    mounted() {
        this.initChart();
    },
    methods: {
        initChart() {
            this.chartInstance = echarts.init(this.$refs.comboChart);
            const option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow',
                        crossStyle: {
                            color: '#999'
                        }
                    }
                },
                grid: {
                    top: '8%'
                },
                legend: {
                    data: ['2019年用电量', '2023年用电量', '2019年发送旅客量', '2023年发送旅客量'],
                    textStyle: {
                        color: '#fff'
                    },
                    y: 'bottom'
                },
                xAxis: [
                    {
                        type: 'category',
                        data: this.xAxisData,
                        axisPointer: {
                            type: 'shadow'
                        },
                        axisLabel: {
                            color: '#fff'
                        },
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: '#ddd'
                            }
                        },
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: 'kWh',
                        nameTextStyle: {
                            color: '#fff'
                        },
                        min: 0,
                        axisLabel: {
                            formatter: '{value}',
                            color: '#fff'
                        },
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: '#ddd'
                            }
                        },
                        splitLine: {
                            show: true,
                            lineStyle: {
                                color: '#ccc',
                                type: 'dashed'
                            }
                        }
                    },
                    {
                        type: 'value',
                        name: '人',
                        nameTextStyle: {
                            color: '#fff'
                        },
                        min: 0,
                        axisLabel: {
                            formatter: '{value}',
                            color: '#fff'
                        },
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: '#ddd'
                            }
                        },
                        splitLine: {
                            show: true,
                            lineStyle: {
                                color: '#ccc',
                                type: 'dashed'
                            }
                        }
                    },
                ],
                series: [
                    {
                        name: '2019年用电量',
                        type: 'bar',
                        barWidth: 15,
                        color: '#4169E1',
                        itemStyle: {
                            barBorderRadius: [10, 10, 0, 0],
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                { offset: 0, color: '#6a9cfe' },
                                { offset: 1, color: '#b5cfff' }
                            ]),
                        },
                        data: this.firstUsage,
                    },
                    {
                        name: '2023年用电量',
                        type: 'bar',
                        barWidth: 15,
                        color: '#009DFF',
                        itemStyle: {
                            barBorderRadius: [10, 10, 0, 0],
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                { offset: 0, color: '#1fe3ff' },
                                { offset: 1, color: '#b5f1fa' }
                            ]),
                        },
                        data: this.secondUsage,
                    },
                    {
                        name: '2019年发送旅客量',
                        type: 'line',
                        color: '#d2ed93',
                        yAxisIndex: 1,
                        data: this.firstTourist
                    },
                    {
                        name: '2023年发送旅客量',
                        type: 'line',
                        color: '#f5c794',
                        yAxisIndex: 1,
                        data: this.secondTourist
                    }
                ]
            };

            this.chartInstance.setOption(option);
        }
    },
    watch: {
        chartData: {
            deep: true,
            handler(val) {
            }
        },
    }
};
</script>

<style scoped>
.echart-container {
    height: 400px;
    /* or any other dimensions */
    width: 60%;
}
</style>
