<template>
    <div ref="sparkLineChart" class="sparkLineChart"></div>
</template>

<script>
import * as echarts from "echarts"

export default {
    name: "SparkLine",
    props: {
        color: String,
        chartData: Array
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
            this.myChart = echarts.init(this.$refs.sparkLineChart)

            this.renderChart()

            this.resizeObserver = new ResizeObserver(() => {
                this.myChart.resize()
            })

            this.resizeObserver.observe(this.$refs.sparkLineChart)
        },

        renderChart() {
            if (!this.myChart) return

            const options = {
                grid: { left: 0, right: 0, top: 2, bottom: 0 },
                xAxis: {
                    type: "category",
                    show: false
                },
                yAxis: {
                    type: "value",
                    show: false
                },
                series: [
                    {
                        type: "line",
                        smooth: true,
                        data: this.chartData,
                        symbol: "none",
                        lineStyle: {
                            width: 3,
                            color: this.color
                        },
                        areaStyle: {
                            color: new echarts.graphic.LinearGradient(
                                0, 0, 0, 1,
                                [
                                    { offset: 0, color: this.color },
                                    { offset: 1, color: "rgba(255,255,255,0)" }
                                ]
                            )
                        }
                    }
                ]
            }
            this.myChart.setOption(options)
        }
    },
}
</script>

<style scoped lang="scss">
.sparkLineChart {
    width: 100%;
    height: 100%;
}
</style>