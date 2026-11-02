<template>
    <section :id="chartId" class="trend_line_chart"></section>
</template>
<script>
import * as echarts from 'echarts';

export default {
    props: {
        dataItem: {
            type: Array,
            default: [],
        },
        dateType: {
            type: String,
            default: '',
        },
        dateColor: {
            type: String,
            default: '',
        },
    },
    data: function () {
        return {
            chartId: `chart-${Math.random().toString(36).substr(2, 9)}`,
            myChart: null,
            options: {
                title: {
                    text: '(COP)',
                    left: 18,
                    top: 12,
                    textStyle: { fontSize: 12, fontWeight: 'normal', color: '#808080', }
                },
                grid: {
                    top: '17%',
                    bottom: '10%',
                    left: '3%',
                    right: '3%',
                    containLabel: false,
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'line',
                        lineStyle: {
                            type: 'dashed',
                        },
                    },
                    textStyle: {
                        color: '#808080',
                    },
                    lineStyle: {
                        color: '#93dcfe',
                    },
                    borderWidth: 1,
                    borderColor: '#eee',
                    backgroundColor: '#ffffff',
                    padding: [10, 10, 10, 10],
                    formatter: (params) => this.tooltipFormatter(params, this.dateType),
                    extraCssText: 'box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);',
                },
                xAxis: [
                    {
                        name: '（月）',
                        nameTextStyle: {
                            color: '#808080',
                        },
                        type: 'category',
                        data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
                        axisTick: {
                            show: false,
                        },
                        axisLabel: {
                            color: '#808080',
                        },
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: '#DCDCDC',
                            },
                        },
                        splitLine: {
                            show: false,
                        },
                    },
                ],
                yAxis: [
                    {
                        nameTextStyle: {
                            color: '#808080',
                            fontSize: 16,
                        },
                        type: 'value',
                        axisLabel: {
                            color: '#808080',
                        },
                        axisLine: {
                            show: false,
                            lineStyle: {
                                color: '#DCDCDC',
                            },
                        },
                        axisTick: {
                            show: false,
                        },
                        splitLine: {
                            show: false,
                        },
                    },
                ],
                series: [
                    {
                        type: 'line',
                        name: 'cop',
                        itemStyle: {
                            color: '#49aae5',
                        },
                        areaStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                {
                                    offset: 0,
                                    color: this.dateColor || '#49aae5',
                                },
                                {
                                    offset: 1,
                                    color: 'rgba(255, 255, 255, 0)',
                                },
                            ]),
                        },
                        data: [],
                    },
                ],
            },
        };
    },
    watch: {
        dataItem: function () {
            this.updateChart();
        },
        dateType: function () {
            this.updateChart();
        },
    },
    mounted() {
        this.init();
    },
    methods: {
        darkenColor(color, percent) {
            if (!color) return '#49aae5';
            let num = parseInt(color.replace("#", ""), 16),
                amt = Math.round(2.55 * percent),
                R = (num >> 16) - amt,
                G = (num >> 8 & 0x00FF) - amt,
                B = (num & 0x0000FF) - amt;
            return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
                (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
                (B < 255 ? B < 1 ? 0 : B : 255))
                .toString(16).slice(1);
        },
        init() {
            const chartDom = document.getElementById(this.chartId);
            if (chartDom) {
                this.myChart = echarts.init(chartDom);
                this.updateChart();
                window.addEventListener('resize', this.myChart.resize);
            } else {
                console.error('Chart DOM element not found.');
            }
        },
        updateChart() {
            if (this.myChart) {
                const unit = this.dateType == 'year' ? '月' : this.dateType == 'month' ? '日' : '时';
                this.options.xAxis[0].name = `(${unit})`;
                
                const lineColor = this.darkenColor(this.dateColor, 10); 

                this.options.series[0] = {
                    ...this.options.series[0],
                    data: this.dataItem,
                    itemStyle: {
                        color: lineColor,
                    },
                    lineStyle: {
                        color: lineColor,
                        width: 2,
                    },
                    symbol: 'none',
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {
                                offset: 0,
                                color: this.dateColor || '#49aae5',
                            },
                            {
                                offset: 1,
                                color: 'rgba(255, 255, 255, 0)',
                            },
                        ]),
                    },
                };

                const length = this.dataItem.length;
                const xAxisData =
                    this.dateType === 'date'
                        ? Array.from({ length }, (_, i) => i.toString())
                        : Array.from({ length }, (_, i) => (i + 1).toString());
                this.options.xAxis[0].data = xAxisData;
                this.myChart.setOption(this.options);
            }
        },
        tooltipFormatter(params, dateType) {
            if (!params || params.length === 0) return '';
            const unit = dateType === 'year' ? '月' : dateType === 'month' ? '日' : '时';
            const timeLabel = `${params[0].name}${unit}`;
            const value = params[0].value !== undefined && params[0].value !== null ? params[0].value : '-';
            
            // 上面一行显示时间，颜色为蓝色；下面一行为 cop：209 这样的格式，颜色为黑色
            return `
                <div style="min-width: 100px;">
                    <div style="color: #49aae5; margin-bottom: 4px;">${timeLabel}</div>
                    <div style="color: #000000;">cop: ${value}</div>
                </div>
            `;
        },
    },
    beforeDestroy() {
        if (this.myChart) {
            window.removeEventListener('resize', this.myChart.resize);
            this.myChart.dispose();
        }
    },
};
</script>
<style lang="scss" scoped>
.trend_line_chart {
    width: 100%;
    height: calc(100% - 30px);
}
</style>
