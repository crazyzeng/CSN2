<template>
    <div ref="comboChart" class="echart-container"></div>
</template>

<script>
import * as echarts from 'echarts';

export default {
    name: 'ComboChart',
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
                legend: {
                    data: ['旅客量', '旅客耗电率'],
                    textStyle: {
                        color: '#fff'
                    }
                },
                xAxis: [
                    {
                        type: 'category',
                        data: Array.from({ length: 12 }, (_, i) => `${i + 1}月`),
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
                        name: '人',
                        nameTextStyle: {
                            color: '#fff'
                        },
                        min: 0,
                        max: 8000000,
                        interval: 1600000,
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
                        name: 'kWh',
                        nameTextStyle: {
                            color: '#fff'
                        },
                        min: 0,
                        max: 2,
                        interval: 0.4,
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
                    }
                ],
                series: [
                    {
                        name: '旅客量',
                        type: 'bar',
                        // color: '#4169E1',
                        barWidth: 12,
                        itemStyle: {
                            barBorderRadius: [10, 10, 0, 0],
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                { offset: 0, color: '#6a9cfe' },
                                { offset: 1, color: '#b5cfff' }
                            ]),
                        },
                        data: this.chartData.touristNumber,
                    },
                    {
                        name: '旅客耗电率',
                        type: 'line',
                        color: '#73C0DE',
                        itemStyle: {
                            color: '#d2ed93',
                        },
                        yAxisIndex: 1,
                        data: this.chartData.touristAvg
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
