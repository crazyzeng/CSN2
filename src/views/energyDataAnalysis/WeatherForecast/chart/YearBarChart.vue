<template>
    <div ref="chart" class="echart-container"></div>
</template>
  
<script>
import * as echarts from 'echarts';

export default {
    name: 'XBarChart',
    props: {
        chartData: {
            type: Array,
            required: true,
        },
        chartX: {
            type: Array,
            required: true,
        },
        chartUnit: {
            type: String,
            required: true
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
        // const dataAsArray = this.chartData.split(',').map(Number);
        this.initChart(); // 传递数组到初始化函数
    },
    methods: {
        initChart() {
            this.chartInstance = echarts.init(this.$refs.chart);

            const option = {
                title: {
                    text: this.chartUnit,
                    textStyle: {
                        color: '#ffffff',
                    },
                },
                tooltip: {},
                xAxis: {
                    data: this.chartX,
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
                        data: this.chartData,
                        // itemStyle: {
                        //     color: '#4169E1',
                        // },
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
                    left: '1%',
                    right: '1%',
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
                this.initChart(newVal)
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
    width: 70%;
}
</style>
  