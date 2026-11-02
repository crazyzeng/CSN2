<template>
    <div ref="chart" class="echart-container"></div>
</template>

<script>
import * as echarts from 'echarts';

export default {
    name: 'SortBarChart',
    props: {
        chartData: {
            type: Array,
            required: true,
        },
        yAxisName: {
            type: String,
            default: 'kWh'
        },
        chartOverSize: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            chartInstance: null,
        };
    },
    mounted() {
        // 转换传入的字符串为数字数组
        let dataAsArray = this.chartData;
        dataAsArray.sort((a, b) => b.dataValue - a.dataValue);
        const xAxisData = dataAsArray.map(v => { return v.name });
        const seriesData = dataAsArray.map(v => { return v.dataValue });
        this.initChart(seriesData, xAxisData, this.yAxisName); // 传递数组到初始化函数
    },
    methods: {
        initChart(dataArray, xAxisData, yAxisName) {
            this.chartInstance = echarts.init(this.$refs.chart);
            const option = {
                title: {
                    text: yAxisName,
                    textStyle: {
                        color: '#ffffff',
                    },
                },
                tooltip: {},
                xAxis: {
                    data: xAxisData,
                    axisLine: {
                        lineStyle: {
                            color: '#ffffff',
                        },
                    },
                    axisLabel: {
                        show: true,
                        interval: 0,
                        rotate: this.chartOverSize ? '45' : 0
                    }
                },
                yAxis: {
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: '#ddd',
                            type: 'dashed', // 设置虚线
                        },
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#ffffff',
                        },
                    },

                },
                series: [
                    {
                        name: '用电量',
                        type: 'bar',
                        barWidth: 20,
                        data: dataArray,
                        itemStyle: {
                            barBorderRadius: [10, 10, 0, 0],
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                { offset: 0, color: '#6a9cfe' },
                                { offset: 1, color: '#b5cfff' }
                            ]),
                        },
                    },
                ],
                grid: {
                    left: '3%',
                    right: '3%',
                    bottom: '3%',
                    containLabel: true,
                },
            };

            this.chartInstance.setOption(option);
        },
    },
    watch: {
        chartData: {
            handler(newVal) {
                // const newDataAsArray = newVal.split(',').map(Number);
                // if (this.chartInstance) {
                //     this.chartInstance.setOption({
                //         series: [
                //             {
                //                 name: '用电量',
                //                 data: newDataAsArray,
                //             },
                //         ],
                //     });
                // }
            },
            deep: true,
        },
    },

};
</script>

<style scoped>
.echart-container {
    height: 300px;
    /* or any other dimension */
    width: 60%;
}
</style>