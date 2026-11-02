<template>
    <div class="chart-container" ref="chart"></div>
</template>

<script>
import * as echarts from "echarts"

export default {
    name: "StackBarChart",

    props: {
        chartData: {
            type: Object,
            default: () => ({})
        }
    },

    data() {
        return {
            myChart: null,
            resizeObserver: null
        }
    },

    mounted() {
        this.initChart()
    },

    beforeDestroy() {
        if (this.resizeObserver) {
            this.resizeObserver.disconnect()
        }

        if (this.myChart) {
            this.myChart.dispose()
        }
    },

    watch: {
        chartData: {
            deep: true,
            handler() {
                this.renderChart()
            }
        }
    },

    methods: {

        initChart() {

            this.myChart = echarts.init(this.$refs.chart)

            this.renderChart()

            this.resizeObserver = new ResizeObserver(() => {
                this.myChart.resize()
            })

            this.resizeObserver.observe(this.$refs.chart)
        },

        renderChart() {
            if (!this.myChart) return
            const data = this.chartData || {}
            const categories = data.labels
            const baseline = data.benchmark
            const current = data.data
            const totals = categories.map((_, i) => {
                return (baseline[i] || 0) + (current[i] || 0)
            })
            const option = {
                tooltip: {
                    trigger: "axis",
                    axisPointer: { type: "shadow" }
                },
                legend: {
                    top: 20,
                    itemWidth: 14,
                    itemHeight: 8,
                    textStyle: {
                        color: "#666"
                    },
                    data: ["当季基准", "当季负荷"]
                },
                grid: {
                    left: "5%",
                    right: "5%",
                    bottom: "10%",
                    top: 50,
                    containLabel: true
                },
                xAxis: {
                    type: "category",
                    data: categories,
                    axisLine: {
                        lineStyle: { color: "#ccc" }
                    },
                    axisTick: { show: false },
                    axisLabel: {
                        color: "#666",
                        formatter: function (value, index) {
                            return `${value}`
                            // return `${value}\n${totals[index]}kWh`
                        },
                        lineHeight: 20
                    }
                },
                yAxis: {
                    type: "value",
                    splitLine: { show: false },
                    axisLine: { show: false },
                    axisTick: { show: false },
                    axisLabel: { show: false }
                },
                series: [

                    /** 底部柱子 */
                    {
                        name: "当季负荷",
                        type: "bar",
                        stack: "total",
                        barWidth: 12,
                        itemStyle: {
                            barBorderRadius: [0, 0, 10, 10],
                            color: new echarts.graphic.LinearGradient(
                                0, 0, 0, 1,
                                [
                                    { offset: 0, color: "#6b9cff" },
                                    { offset: 0.6, color: "#8bb0ff" },
                                    { offset: 1, color: "#c9dbff" }
                                ]
                            )
                        },

                        data: current
                    },

                    /** 顶部柱子 */
                    {
                        name: "当季基准",
                        type: "bar",
                        stack: "total",
                        barWidth: 16,
                        itemStyle: {
                            barBorderRadius: [10, 10, 0, 0],
                            color: new echarts.graphic.LinearGradient(
                                0, 1, 0, 0,
                                [
                                    { offset: 0, color: "#cae196" },
                                    { offset: 0.6, color: "#c2dc84" },
                                    { offset: 1, color: "#a5cd48" }
                                ]
                            )
                        },

                        data: baseline
                    }

                ]
            }

            this.myChart.setOption(option)
        }

    }
}
</script>

<style scoped>
.chart-container {
    width: 100%;
    height: 100%;
}
</style>