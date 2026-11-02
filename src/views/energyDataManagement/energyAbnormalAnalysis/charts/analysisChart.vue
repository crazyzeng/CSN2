<template>
    <div ref="analysisChart" class="chart-container"></div>
</template>

<script>
import * as echarts from 'echarts';

export default {
    name: 'analysisChart',
    props: {
        dateType: {
            type: String,
            default: '',
        },
        chartData: {
            type: Object,
            default() {
                return {};
            },
        },
        xAxis: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            chart: null,
            resizeObserver: null,
            baseWidth: 1920,
        };
    },
    watch: {
        chartData: {
            handler(data) {
                if (!data || Object.keys(data).length === 0) return;
                this.updateChart(data);
            },
            deep: true,
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
        // 字体缩放
        getFontSize(size) {
            const width = this.$refs.analysisChart?.offsetWidth || this.baseWidth;
            return (width / this.baseWidth) * size;
        },

        // 初始化图表
        initChart() {
            this.chart = echarts.init(this.$refs.analysisChart);
            this.chart.setOption(this.getOption());
        },

        // ResizeObserver（真正自适应）
        initResizeObserver() {
            this.resizeObserver = new ResizeObserver(() => {
                if (this.chart) {
                    this.chart.resize();
                    this.chart.setOption(this.getOption(), true); // 关键：字体重算
                }
            });
            this.resizeObserver.observe(this.$refs.analysisChart);
        },

        // 更新数据
        updateChart(data) {
            const option = this.getOption();

            option.series[0].data = data.current;
            option.series[1].data = data.compare;
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

        // 统一 option（所有尺寸走这里）
        getOption() {
            return {
                color: ['#a4ffff', '#408fc3', '#7d55e0'],

                tooltip: {
                    trigger: 'axis',
                    axisPointer: { type: 'shadow' },
                    textStyle: {
                        fontSize: this.getFontSize(14),
                    },
                    formatter: (params) => {
                        let tar, tar2;

                        if (params[0]?.seriesType === 'bar') {
                            tar = params[0];
                            tar2 = params[1];
                        } else {
                            tar = params[1];
                            tar2 = params[0];
                        }

                        const name = params[0]?.name || '';
                        const value1 = tar?.value ?? '-';
                        const value2 = tar2?.value ?? '-';

                        return `
                            ${name}
                            <br/>${tar?.marker}${tar?.seriesName} : ${value1} kWh
                            <br/>${tar2?.marker || ''}${tar2?.seriesName || '上期能耗'} : ${value2} kWh
                        `;
                    },
                },

                legend: {
                    data: ['本期能耗', '上期能耗'],
                    top: '2%',
                    itemGap: this.getFontSize(30),
                    textStyle: {
                        color: '#333',
                        fontSize: this.getFontSize(14),
                    },
                },

                grid: {
                    top: '28%',
                    left: '3%',
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
                        name: 'kWh',
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
                        name: '本期能耗',
                        type: 'bar',
                        barWidth: this.getFontSize(10), // 柱宽也缩放
                        itemStyle: {
                            barBorderRadius: [10, 10, 0, 0],
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                { offset: 0, color: '#6a9cfe' },
                                { offset: 1, color: '#b5cfff' },
                            ]),
                        },
                        data: [],
                    },
                    {
                        name: '上期能耗',
                        type: 'line',
                        itemStyle: {
                            color: '#D6E9A8',
                        },
                        lineStyle: {
                            width: this.getFontSize(2),
                        },
                        symbolSize: this.getFontSize(6),
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