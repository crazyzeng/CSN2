<template>
    <div class="smoothLineChart" ref="smoothLineChart"></div>
</template>

<script>
import * as echarts from 'echarts';

export default {
    name: 'WaterLineChart',
    props: {
        xData: {
            type: Array,
            default: () => [],
        },
        seriesData: {
            type: Array,
            default: () => [],
        },
        curType: {
            type: String,
            default: '1',
        },
    },
    data() {
        return {
            chart: null,
        };
    },
    watch: {
        seriesData: {
            deep: true,
            handler() {
                this.renderChart();
            },
        },
        curType: {
            deep: true,
            handler() {
                this.renderChart();
            },
        },
    },
    mounted() {
        this.chart = echarts.init(this.$refs.smoothLineChart);
        this.renderChart();

        this.resizeObserver = new ResizeObserver(() => {
            this.chart.resize();
        });

        this.resizeObserver.observe(this.$refs.smoothLineChart);
    },

    beforeDestroy() {
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
    },

    methods: {
        // 自适应函数
        handleResize() {
            if (this.chart) {
                this.chart.resize();
            }
        },

        renderChart() {
            const colors = ['#6bb7d6', '#b18df9'];

            const series = this.seriesData.map((item, index) => ({
                name: item.name,
                type: 'line',
                data: item.data.map((v) => (v == null ? 0 : v)),
                smooth: true,
                symbol: 'none',
                // symbolSize: 4,
                lineStyle: {
                    width: 2,
                    color: colors[index],
                },
                itemStyle: {
                    color: colors[index],
                },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: colors[index] },
                        { offset: 1, color: 'rgba(255,255,255,0)' },
                    ]),
                },
            }));

            const option = {
                grid: {
                    left: 40,
                    right: 20,
                    top: 40,
                    bottom: 30,
                },
                tooltip: {
                    trigger: 'axis',
                },
                legend: {
                    top: 0,
                    right: '32%',
                    icon: 'emptyCircle',
                    itemGap: 40,
                    itemWidth: 8,
                    itemHeight: 8,
                    textStyle: {
                        color: '#666',
                    },
                    data: this.seriesData.map((i) => i.name),
                },
                xAxis: {
                    type: 'category',
                    data: this.xData,
                    boundaryGap: false,
                },
                yAxis: {
                    type: 'value',
                    name: this.curType === '1' ? '(℃)' : '(%)', 
                },
                series,
            };

            this.chart.setOption(option);
        },
    },
};
</script>

<style scoped>
.smoothLineChart {
    width: 100%;
    height: 100%;
}
</style>
