<template>
    <div class="ratioPieChart" ref="ecControl"></div>
</template>

<script>
import * as echarts from "echarts"

export default {
    props: {
        // 百分比（例如 75）
        percent: {
            type: Number,
            default: 75,
        },
        // 比例（例如 0.01）
        ratio: {
            type: Number,
            default: 0.01,
        },
    },

    data() {
        return {
            baseSize: 0,
            myChart: null,
            resizeObserver: null,
        };
    },

    methods: {
        clacBaseFontSize() {
            const clientwidth =
                window.innerWidth ||
                document.documentElement.clientWidth ||
                document.body.clientWidth;
            this.baseSize = clientwidth / 1920;
        },

        getOption() {
            return {
                backgroundColor: "",
                title: [
                    {
                        text: this.percent,
                        subtext: "环境舒适度",
                        x: "center",
                        top: "25%",
                        textStyle: {
                            fontSize: this.baseSize * 20,
                            color: "#393939",
                            fontWeight: "600",
                        },
                        subtextStyle: {
                            fontSize: this.baseSize * 12,
                            color: "#333",
                            fontWeight: "500",
                            lineHeight: 55,
                        },
                    },
                ],
                tooltip: { show: false },
                angleAxis: {
                    max: 100,
                    clockwise: false,
                    show: false,
                },
                radiusAxis: {
                    type: "category",
                    axisLabel: { show: false },
                    axisLine: { show: false },
                    axisTick: { show: false },
                },
                polar: {
                    center: ["50%", "38%"],
                    radius: "170%",
                },
                series: [
                    {
                        type: "bar",
                        data: [this.percent],
                        coordinateSystem: "polar",
                        roundCap: true,
                        barWidth: 6,
                        showBackground: true,
                        backgroundStyle: {
                            color: "#e9f1d6",
                            borderWidth: 8,
                            borderColor: "#e9f1d6",
                        },
                        itemStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                { offset: 0, color: "#d5e7ac" },
                                { offset: 1, color: "#9abe47" },
                            ]),
                        },
                    },
                    {
                        type: "bar",
                        data: [this.ratio],
                        coordinateSystem: "polar",
                        barWidth: 0,
                        itemStyle: {
                            color: "transparent",
                        },
                    },
                ],
            };
        },

        initChart() {
            this.myChart = echarts.init(this.$refs.ecControl);
            this.myChart.setOption(this.getOption());

            this.resizeObserver = new ResizeObserver(() => {
                this.clacBaseFontSize();
                this.myChart && this.myChart.resize();
            });

            this.resizeObserver.observe(this.$refs.ecControl);
        },

        updateChart() {
            if (!this.myChart) return;

            this.myChart.setOption({
                title: [{ text: this.percent }],
                series: [
                    { data: [this.percent] },
                    { data: [this.ratio] },
                ],
            });
        }
    },

    watch: {
        percent() {
            this.updateChart();
        },
        ratio() {
            this.updateChart();
        },
    },

    mounted() {
        this.clacBaseFontSize();
        this.initChart();
    },

    beforeDestroy() {
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
        if (this.myChart) {
            this.myChart.dispose();
        }
    },
};
</script>

<style scoped>
.ratioPieChart {
    width: 100%;
    height: 100%;
}
</style>