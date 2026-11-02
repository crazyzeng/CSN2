<template>
    <div ref="compareChart" class="chart-container"></div>
</template>

<script>
import * as echarts from 'echarts';

export default {
    name: 'compareChart',
    props: {
        dateType: { type: String, default: '' },
        chartData: {
            type: Object,
            default: () => ({}),
        },
        xAxis: {
            type: Array,
            default: () => [],
        },
        lineType: {
            type: String,
            default: '温度',
        },
    },
    data() {
        return {
            chart: null,
            resizeObserver: null,
            baseWidth: 1920, // 🔥 设计稿宽度
        };
    },

    watch: {
        chartData: {
            handler() {
                this.updateChart();
            },
            deep: true,
        },
        lineType() {
            this.updateChart();
        },
    },

    mounted() {
        this.initChart();
        this.initResizeObserver();
    },

    beforeDestroy() {
        this.resizeObserver && this.resizeObserver.disconnect();
        this.chart && this.chart.dispose();
    },

    methods: {
        // 字体自适应
        getFontSize(size) {
            const width = this.$refs.compareChart?.offsetWidth || this.baseWidth;
            return (width / this.baseWidth) * size;
        },

        // 初始化
        initChart() {
            this.chart = echarts.init(this.$refs.compareChart);
            this.chart.setOption(this.getOption());
        },

        // 容器自适应（核心）
        initResizeObserver() {
            this.resizeObserver = new ResizeObserver(() => {
                if (this.chart) {
                    this.chart.resize();
                    this.chart.setOption(this.getOption(), true); // 字体刷新
                }
            });
            this.resizeObserver.observe(this.$refs.compareChart);
        },

        // 更新数据
        updateChart() {
            if (!this.chart) return;
            if (!this.chartData || Object.keys(this.chartData).length === 0) return;

            const option = this.getOption();

            if (this.lineType === '温度') {
                option.series[0].name = '本期温度';
                option.series[1].name = '上期温度';
                option.yAxis[0].name = '℃';
                option.series[0].data = this.chartData.temperature?.current || [];
                option.series[1].data = this.chartData.temperature?.compare || [];
            } else {
                option.series[0].name = '本期湿度';
                option.series[1].name = '上期湿度';
                option.yAxis[0].name = '%';
                option.series[0].data = this.chartData.humidity?.current || [];
                option.series[1].data = this.chartData.humidity?.compare || [];
            }

            option.xAxis[0].data = this.xAxis;

            if (this.dateType === 'year') {
                option.xAxis[0].name = '月';
            } else if (this.dateType === 'month') {
                option.xAxis[0].name = '日';
            } else if (this.dateType === 'day') {
                option.xAxis[0].name = '时';
            }

            this.chart.setOption(option);
        },

        // 所有配置统一出口
        getOption() {
            return {
                color: ['#FFECC2', '#DFCEFF'],

                tooltip: {
                    trigger: 'axis',
                    axisPointer: { type: 'shadow' },
                    textStyle: {
                        fontSize: this.getFontSize(14),
                    },
                },

                grid: {
                    top: '28%',
                    left: '4%',
                    right: '5%',
                    bottom: '5%',
                    containLabel: true,
                },

                xAxis: [
                    {
                        type: 'category',
                        nameTextStyle: {
                            color: '#333',
                            fontSize: this.getFontSize(14),
                        },
                        axisLine: {
                            lineStyle: { color: '#e6e6e6' },
                        },
                        axisLabel: {
                            color: '#333',
                            fontSize: this.getFontSize(12),
                        },
                        data: [],
                    },
                ],

                yAxis: [
                    {
                        type: 'value',
                        name: '',
                        nameTextStyle: {
                            color: '#333',
                            fontSize: this.getFontSize(14),
                        },
                        axisLabel: {
                            color: '#333',
                            fontSize: this.getFontSize(12),
                        },
                    },
                ],

                series: [
                    {
                        name: '',
                        type: 'line',
                        smooth: true,
                        symbolSize: this.getFontSize(6),
                        lineStyle: {
                            width: this.getFontSize(2),
                        },
                        data: [],
                    },
                    {
                        name: '',
                        type: 'line',
                        smooth: true,
                        symbolSize: this.getFontSize(6),
                        lineStyle: {
                            width: this.getFontSize(2),
                        },
                        data: [],
                    },
                ],
            };
        },
    },
};
</script>

<style scoped>
.chart-container {
    width: 100%;
    height: 100%;
}
</style>