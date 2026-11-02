<template>
    <div class="chart" ref="chart"></div>
</template>

<script>
import * as echarts from 'echarts';

export default {
    name: 'WaterBarChart',
    props: {
        data: {
            type: Array,
            default: () => [],
            // [{ name: '生活用水', value: 500 }, ...]
        },
    },
    data() {
        return {
            chart: null,
        };
    },
    watch: {
        data: {
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
        renderChart() {
            const safeData = (this.data || []).map((i) => ({
                ...i,
                value: i.value == null ? 0 : i.value,
            }));

            const names = safeData.map((i) => i.name);
            const values = safeData.map((i) => i.value);

            const option = {
                grid: {
                    left: 10,
                    right: 50,
                    top: 30,
                    bottom: 0,
                    containLabel: true,
                },
                xAxis: {
                    type: 'value',
                    show: false,
                },
                yAxis: {
                    type: 'category',
                    data: names,
                    axisLine: {
                        show: true,
                        lineStyle: { color: '#ccc' },
                    },
                    axisLabel: { show: true, color: '#333' },
                    axisTick: { show: false },
                },
                series: [
                    {
                        type: 'bar',
                        data: values,
                        barWidth: 15,
                        itemStyle: {
                            barBorderRadius: [0, 10, 10, 0],
                            color: (params) => {
                                const colorList = [
                                    ['#a5cd48', '#cae196'], // 绿色渐变（非生活用水）
                                    ['#6b9cff', '#c9dbff'], // 蓝色渐变（生活用水）
                                ];

                                const colors = colorList[params.dataIndex];

                                return new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                                    { offset: 0, color: colors[0] }, // 左
                                    { offset: 1, color: colors[1] }, // 右
                                ]);
                            },
                        },

                        label: {
                            show: true,
                            position: 'right',
                            formatter: ({ value }) => `${value}万吨`,
                        },
                    },
                ],
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
