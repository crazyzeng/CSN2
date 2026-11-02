<template>
    <div class="chart-container" ref="chart"></div>
</template>

<script>
import * as echarts from "echarts"

export default {
    name: "TriblePieChart",
    props: {
        chartData: {
            type: Array,
            default: () => [],
        },
    },

    data() {
        return {
            myChart: null,
            totalNum: 0,
            baseSize: 1,
            data1: [],
            color: [
                "#A4CC45",
                "#FFD287",
                "#39A0F8",
                "#FD5655",
                "#B08DF9",
                "#6B9CFF",
            ],
            color1: [],
            color2: [],
            color3: [],
            resizeObserver: null,
        };
    },

    watch: {
        chartData: {
            deep: true,
            handler() {
                this.renderChart();
            },
        },
    },

    mounted() {
        this.calcBaseFontSize();
        this.initChart();
    },

    beforeDestroy() {
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }

        if (this.myChart) {
            this.myChart.dispose();
            this.myChart = null;
        }
    },

    methods: {
        calcBaseFontSize() {
            const clientWidth =
                window.innerWidth ||
                document.documentElement.clientWidth ||
                document.body.clientWidth;

            this.baseSize = clientWidth / 1920;
        },

        hexToRgba(hex, opacity) {
            return (
                "rgba(" +
                parseInt("0x" + hex.slice(1, 3)) +
                "," +
                parseInt("0x" + hex.slice(3, 5)) +
                "," +
                parseInt("0x" + hex.slice(5, 7)) +
                "," +
                opacity +
                ")"
            );
        },

        initChart() {
            this.myChart = echarts.init(this.$refs.chart);

            this.renderChart();

            this.resizeObserver = new ResizeObserver(() => {
                this.calcBaseFontSize();
                this.myChart.resize();
            });

            this.resizeObserver.observe(this.$refs.chart);
        },

        getTotal(data) {
            let sum = 0;

            data.forEach((item) => {
                sum += Number(item.value);
            });

            this.totalNum = sum;
        },

        renderChart() {
            if (!this.myChart) return;

            const detailData =
                this.chartData.length > 0
                    ? this.chartData
                    : [
                        { name: "电梯1", value: "330" },
                        { name: "电梯2", value: "231" },
                        { name: "电梯3", value: "176" },
                        { name: "电梯4", value: "130" },
                        { name: "电梯5", value: "131" },
                        { name: "电梯6", value: "276" },
                    ];

            this.data1 = [];
            this.color1 = [];
            this.color2 = [];
            this.color3 = [];

            const radius = ["40%", "45%"];

            const radius2 = ["45%", "65%"];
            const radius3 = ["53%", "65%"];

            this.color.forEach((item) => {
                this.color1.push(item, "transparent");
                this.color2.push(this.hexToRgba(item, 0.4), "transparent");
                this.color3.push(this.hexToRgba(item, 0.1), "transparent");
            });

            this.getTotal(detailData);

            detailData.forEach((item) => {
                this.data1.push(item, {
                    name: "",
                    // value: 10,
                    // itemStyle: {
                    //     color: "transparent",
                    // },
                });
            });

            const option = {
                title: {
                    // text: `{num|${this.totalNum}}{unit|kWh}`,
                    subtext: "分项基准",
                    top: "45%",
                    left: "50%",
                    textAlign: "center",
                    textStyle: {
                        rich: {
                            num: {
                                fontSize: this.baseSize * 28,
                                fontWeight: "bold",
                                color: "#333"
                            },
                            unit: {
                                fontSize: this.baseSize * 10,
                                color: "#666",
                                padding: [-5, 0, 0, 2]
                            }
                        }
                    },
                    subtextStyle: {
                        fontSize: this.baseSize * 17,
                        color: "#333",
                        align: "center",
                        fontWeight: "bold"
                    }
                },

                legend: {
                    show: false,
                    data: detailData.map((item) => item.name),
                    orient: "vertical",
                    left: "55%",
                    top: "center",
                    itemGap: this.baseSize * 10,
                    formatter: (name) => {
                        let target = 0;

                        detailData.forEach((item) => {
                            if (item.name === name) {
                                target = item.value;
                            }
                        });

                        return `${name} ${(
                            (target / this.totalNum) *
                            100
                        ).toFixed(2)}%`;
                    },
                },

                tooltip: {
                    formatter: (params) => {
                        if (params.name) {
                            return `${params.name} : ${params.value}kWh (${(
                                (params.value / this.totalNum) *
                                100
                            ).toFixed(2)}%)`;
                        }
                    },
                    // 文字样式
                    textStyle: {
                        fontSize: this.baseSize * 14,
                    },
                },

                series: [
                    {
                        type: "pie",
                        radius: radius3,
                        center: ["50%", "50%"],
                        itemStyle: {
                            color: (params) => this.color1[params.dataIndex],
                            borderWidth: 3,
                            borderColor: "#fff"
                        },
                        // label: { show: false },
                        label: {
                            show: true,
                            position: "outside",
                            alignTo: 'labelLine',
                            bleedMargin: 5,
                            avoidLabelOverlap: true,
                            minAngle: 5,
                            formatter: (params) => {
                                const percent = (
                                    (params.value / this.totalNum) * 100
                                ).toFixed(0)
                                return `{name|${params.name}  ${percent}%}\n{value|${params.value}kWh}`
                            },
                            rich: {
                                name: {
                                    fontSize: this.baseSize * 12,
                                    color: "#666",
                                    lineHeight: 16
                                },
                                value: {
                                    fontSize: this.baseSize * 12,
                                    color: "#666"
                                }
                            }
                        },
                        labelLine: {
                            show: true,
                            length: 15,
                            length2: 20,
                            lineStyle: {
                                width: 1,
                                color: "#aaa"
                            }
                        },
                        data: this.data1,
                    },
                    {
                        type: "pie",
                        radius: radius2,
                        center: ["50%", "50%"],
                        hoverAnimation: false,
                        itemStyle: {
                            color: (params) => this.color2[params.dataIndex],
                            borderWidth: 3,
                            borderColor: "#fff"
                        },
                        label: { show: false },
                        data: this.data1,
                    },
                    {
                        type: "pie",
                        radius: radius,
                        center: ["50%", "50%"],
                        hoverAnimation: false,
                        itemStyle: {
                            color: (params) => this.color3[params.dataIndex],
                            borderWidth: 3,
                            borderColor: "#fff"
                        },
                        label: { show: false },
                        data: this.data1,
                    },
                ],
            };

            this.myChart.setOption(option);
        },
    },
};
</script>

<style scoped lang="scss">
.chart-container {
    width: 100%;
    height: 100%;
}
</style>