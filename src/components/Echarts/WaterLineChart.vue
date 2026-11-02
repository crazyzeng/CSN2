<template>
    <div class="chart" ref="chart"></div>
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
    },
    mounted() {
        this.chart = echarts.init(this.$refs.chart);
        this.renderChart();

        this.resizeObserver = new ResizeObserver(() => {
            this.chart.resize();
        });

        this.resizeObserver.observe(this.$refs.chart);
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
            const colors = ['#6bb7d6', '#a6e06a'];

            const series = this.seriesData.map((item, index) => ({
                name: item.name,
                type: 'line',
                data: item.data.map((v) => (v == null ? 0 : v)),
                smooth: true,
                symbol: 'none',
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
                    right: 30,
                    icon: 'roundRect',
                    itemGap: 20,
                    itemWidth: 14,
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
                    name: '(t)',
                },
                series,
            };

            this.chart.setOption(option);
        },
    },
};
</script>

<style scoped>
.chart {
    width: 100%;
    height: 100%;
}
</style>
