<template>
    <div class="chart-card h-full">

        <div class="chart-header">
            <div class="title">{{ title }}</div>
            <div class="diff">( {{ diffText }} )</div>
        </div>

        <div ref="chart" class="chart"></div>

        <div class="chart-footer">
            <span>当月均值：{{ currentAvg }}{{ unit }}</span>
            <span>历史均值：{{ historyAvg }}{{ unit }}</span>
        </div>

    </div>
</template>

<script>
import * as echarts from "echarts"

export default {
    name: "LineCompareChart",

    props: {
        title: String,
        diffText: String,

        months: {
            type: Array,
            default: () => []
        },

        historyData: {
            type: Array,
            default: () => []
        },

        currentData: {
            type: Array,
            default: () => []
        },

        historyAvg: Number,
        currentAvg: Number,

        unit: {
            type: String,
            default: ""
        },

        historyName: {
            type: String,
            default: "历史数据"
        },

        currentName: {
            type: String,
            default: "当前数据"
        }
    },

    data() {
        return {
            chart: null
        }
    },

    mounted() {
        this.initChart()
    },

    watch: {
        historyData() {
            this.renderChart()
        },
        currentData() {
            this.renderChart()
        }
    },

    methods: {

        initChart() {
            this.chart = echarts.init(this.$refs.chart)
            this.renderChart()

            window.addEventListener("resize", () => {
                this.chart.resize()
            })
        },

        renderChart() {

            const option = {
                grid: {
                    left: 30,
                    right: 10,
                    top: 20,
                    bottom: 20
                },
                tooltip: {
                    trigger: "axis",
                },
                legend: {
                    right: 0,
                    itemWidth: 12,
                    itemHeight: 5,
                    itemGap: 20,
                    icon: "roundRect", 
                    textStyle: {
                        color: "#666"
                    },
                    data: [this.historyName, this.currentName]
                },

                xAxis: {
                    type: "category",
                    data: this.months,
                    boundaryGap: false,
                    axisLine: {
                        lineStyle: { color: "#ccc" }
                    },
                    
                },

                yAxis: {
                    type: "value",
                    splitLine: {
                        lineStyle: {
                            color: "#eee"
                        }
                    },
                },

                series: [
                    {
                        name: this.historyName,
                        type: "line",
                        smooth: true,
                        data: this.historyData,
                        lineStyle: {
                            width: 2,
                            color: "#fbd08a"
                        },
                        itemStyle: {
                            color: "#fbd08a"
                        },
                        areaStyle: {
                            color: new echarts.graphic.LinearGradient(
                                0, 0, 0, 1,
                                [
                                    { offset: 0, color: "rgba(255,216,90,0.45)" },
                                    { offset: 1, color: "rgba(255,216,90,0.05)" }
                                ]
                            )
                        },
                        symbol: "none",
                    },
                    {
                        name: this.currentName,
                        type: "line",
                        smooth: true,
                        data: this.currentData,
                        lineStyle: {
                            width: 2,
                            color: "#4FAAFF"
                        },
                        itemStyle: {
                            color: "#4FAAFF"
                        },
                        areaStyle: {
                            color: new echarts.graphic.LinearGradient(
                                0, 0, 0, 1,
                                [
                                    { offset: 0, color: "rgba(92, 185, 252,0.45)" },
                                    { offset: 1, color: "rgba(92, 185, 252,0.05)" }
                                ]
                            )
                        },
                        symbol: "none",
                    }
                ],
            }

            this.chart.setOption(option)

        }

    }
}
</script>

<style scoped>
.chart-card {
    padding: 10px;
}

.chart-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
}

.title {
    font-size: 18px;
    font-weight: 600;
}

.diff {
    color: #60a5fa;
    font-size: 13px;
}

.chart {
    width: 100%;
    /* height: 200px; */
    height: calc(100% - 50px);
}

.chart-footer {
    display: flex;
    justify-content: space-around;
    margin-top: 10px;
    color: #555;
}
</style>