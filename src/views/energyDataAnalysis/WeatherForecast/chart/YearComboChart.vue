<template>
    <div ref="comboChart" class="echart-container"></div>
</template>

<script>
import { deepClone } from '@/utils/index';
import * as echarts from 'echarts';

export default {
    name: 'YearComboChart',
    props: {
        chartData: {
            type: Array,
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
            if (this.chartData.length > 0) {
                const tempArray = [];
                this.chartData.forEach(v => {
                    tempArray.push(v.time.substr(0, 5))
                })
                return tempArray
            }
        },
        xAxisData() {
            if (this.chartData.length > 0) {
                const tempArray = this.chartData.map(v => { return v.time.substr(5) })
                return tempArray
            }
        },
        firstUsage() {
            if (this.chartData.length > 0) {
                const lastArray = this.chartData
                const tempArray = lastArray.map(v => { return v.dataValue })
                return tempArray
            } else return []
        },
        firstTourist() {
            if (this.chartData.length > 0) {
                const lastArray = this.chartData
                const tempArray = lastArray.map(v => { return v.touristNumber })
                return tempArray
            } else return []
        },
        secondUsage() {
            if (this.chartData.length > 0) {
                const lastArray = this.chartData
                const tempArray = lastArray.map(v => { return v.tbDataValue })
                return tempArray
            } else return []
        },
        secondTourist() {
            if (this.chartData.length > 0) {
                const lastArray = deepClone(this.chartData)
                const tempArray = lastArray.map(v => { return v.tbTouristNumber })
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
                        data: this.secondUsage,
                    },
                    {
                        name: '2023年用电量',
                        type: 'bar',
                        barWidth: 15,
                        color: '#34AFFF',
                        itemStyle: {
                            barBorderRadius: [10, 10, 0, 0],
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                { offset: 0, color: '#1fe3ff' },
                                { offset: 1, color: '#b5f1fa' }
                            ]),
                        },
                        data: this.firstUsage,
                    },
                    {
                        name: '2019年发送旅客量',
                        type: 'line',
                        color: '#04E38A',
                        yAxisIndex: 1,
                        data: this.secondTourist
                    },
                    {
                        name: '2023年发送旅客量',
                        type: 'line',
                        color: '#FEA844',
                        yAxisIndex: 1,
                        data: this.firstTourist
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
    width: 60%;
    height: 400px;
    /* or any other dimensions */
}
</style>
