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

            const rawData = this.chartData || [];

            const isAllNull = rawData.length > 0 &&
                rawData.every(item => item.value == null);
            const detailData = isAllNull
                ? rawData.map(item => ({
                    ...item,
                    value: 1 // ⭐占位值，保证图能画出来
                }))
                : rawData.map(item => ({
                    ...item,
                    value: item.value == null ? 0 : Number(item.value)
                }));

            // const detailData =
            //     this.chartData.length > 0
            //         ? this.chartData
            //         : [
            //             { name: "电梯1", value: "330" },
            //             { name: "电梯2", value: "231" },
            //             { name: "电梯3", value: "176" },
            //             { name: "电梯4", value: "130" },
            //             { name: "电梯5", value: "131" },
            //             { name: "电梯6", value: "276" },
            //         ];

            this.data1 = [];
            this.color1 = [];
            this.color2 = [];
            this.color3 = [];

            const radius = ["50%", "60%"];

            const radius2 = ["60%", "80%"];
            const radius3 = ["68%", "80%"];

            this.color.forEach((item) => {
                this.color1.push(item, "transparent");
                this.color2.push(this.hexToRgba(item, 0.4), "transparent");
                this.color3.push(this.hexToRgba(item, 0.1), "transparent");
            });

            this.getTotal(detailData);

            // 添加间隔
            this.data1 = []
            const gapRatio = 0.008
            let gapValue = this.totalNum * gapRatio
            // gapValue = Math.max(gapValue, 2)
            // gapValue = Math.min(gapValue, 20)
            detailData.forEach(item => {
                this.data1.push(item)
                this.data1.push({
                    value: gapValue,
                    name: "",
                    itemStyle: { color: "transparent" },
                    label: { show: false },
                    labelLine: { show: false },
                    tooltip: { show: false }
                })
            })

            const option = {
                title: {
                    text: `分项负荷`,
                    top: "44%",
                    left: "43%",
                    textAlign: "center",
                    textStyle: {
                        fontSize: this.baseSize * 18,
                        color: "#333"
                    },
                },

                legend: {
                    show: false,
                    data: detailData.map((item) => item.name),
                    orient: "vertical",
                    left: "55%",
                    top: "center",

                    itemWidth: this.baseSize * 16,
                    itemHeight: this.baseSize * 6,
                    itemGap: this.baseSize * 15,

                    formatter: (name) => {
                        let target = 0
                        detailData.forEach((item) => {
                            if (item.name === name) {
                                target = item.value
                            }
                        })

                        const percent = ((target / this.totalNum) * 100).toFixed(0)

                        return `{name|${name}} {value|${target}MWh} {percent|(+${percent}%)}`
                    },

                    textStyle: {
                        rich: {
                            name: {
                                color: "#333",
                                fontSize: this.baseSize * 14,
                                width: 60,
                                align: "right"
                            },
                            value: {
                                color: "#666",
                                fontSize: this.baseSize * 14,
                                padding: [0, 6, 0, 6]
                            },
                            percent: {
                                color: "#60a5fa",
                                fontSize: this.baseSize * 14,
                                width: 60,
                                align: "right",
                                // fontWeight: "bold"
                            }
                        }
                    }
                },

                tooltip: {
                    formatter: (params) => {
                        if (isAllNull) {
                            return `${params.name} : --`;
                        }
                        if (params.name) {
                            return `${params.name} : ${params.value}MWh (${(
                                (params.value / this.totalNum) *
                                100
                            ).toFixed(2)}%)`;
                        }
                    },
                    textStyle: {
                        fontSize: this.baseSize * 14,
                    },
                },
                series: [
                    {
                        type: "pie",
                        radius: radius3,
                        center: ["45%", "50%"],
                        showEmptyCircle: true,
                        itemStyle: {
                            color: (params) => this.color1[params.dataIndex],
                        },
                        label: { show: false },
                        data: this.data1,
                    },
                    {
                        type: "pie",
                        radius: radius2,
                        center: ["45%", "50%"],
                        hoverAnimation: false,
                        showEmptyCircle: true,
                        itemStyle: {
                            color: (params) => this.color2[params.dataIndex],
                        },
                        label: { show: false },
                        data: this.data1,
                    },
                    {
                        type: "pie",
                        radius: radius,
                        center: ["45%", "50%"],
                        hoverAnimation: false,
                        showEmptyCircle: true,
                        itemStyle: {
                            color: (params) => this.color3[params.dataIndex],
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