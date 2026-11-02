<template>
    <div class="pmvChart" ref="ecControl"></div>
</template>

<script>
import * as echarts from "echarts"
import guageBg from '@/assets/img/energyManagement/guageBg.png'

export default {
    props: {
        num: {
            type: Number,
            default: 1,
        },
    },

    data() {
        return {
            myChart: null,
            resizeObserver: null,
        };
    },

    methods: {
        getOption() {
            const chart = this.myChart

            const width = chart ? chart.getWidth() : 300
            const height = chart ? chart.getHeight() : 300

            // 统一基准尺寸
            const size = Math.min(width, height)

            return {
                graphic: [
                    // 背景图（完全跟随容器）
                    {
                        type: 'image',
                        z: 1,
                        left: width / 2 - size * 0.45,
                        top: height / 2 - size * 0.45,
                        style: {
                            image: guageBg,
                            width: size * 0.9,
                            height: size * 0.9,
                        }
                    },

                    // 文本（和背景同一体系）
                    {
                        type: 'text',
                        z: 3,
                        left: 'center',
                        top: height / 2 + size * 0.28,
                        style: {
                            text: `{name|PMV} {value|${this.num > 0 ? '+' : ''}${this.num}}`,
                            textAlign: 'center',
                            rich: {
                                name: {
                                    fontSize: size * 0.06,
                                    fill: '#999',
                                    padding: [0, 10, 0, 0],
                                },
                                value: {
                                    fontSize: size * 0.12,
                                    fill: '#333',
                                    fontWeight: 'bold',
                                }
                            }
                        }
                    }
                ],

                series: [
                    {
                        type: "gauge",

                        // 全部基于 size
                        radius: size * 0.28,
                        center: [width / 2, height / 2],

                        startAngle: 215,
                        endAngle: -35,
                        min: -3,
                        max: 3,
                        splitNumber: 6,
                        z: 2,

                        axisLine: {
                            show: false,
                        },

                        pointer: {
                            show: true,
                            length: size * 0.28,
                            width: 2,
                            itemStyle: {
                                color: "#f0d00a",
                            },
                        },

                        axisLabel: {
                            show: true,
                            color: '#464646',
                            fontSize: size * 0.05,
                            distance: size * 0.08,
                            formatter: function (value) {
                                if (value == -3) return '冷';
                                if (value == -2) return '凉';
                                if (value == -1) return '微凉';
                                if (value == 0) return '适中';
                                if (value == 1) return '微暖';
                                if (value == 2) return '暖';
                                if (value == 3) return '热';
                                return '';
                            }
                        },

                        axisTick: {
                            show: true,
                            distance: -size * 0.06,
                            length: size * 0.03,
                            lineStyle: {
                                color: "#ccc",
                                width: 1,
                            },
                        },

                        splitLine: {
                            show: true,
                            distance: -size * 0.08,
                            length: size * 0.05,
                            lineStyle: {
                                color: "#666",
                                width: 2,
                            },
                        },

                        detail: {
                            show: false // ❗彻底不用 detail
                        },

                        data: [
                            {
                                value: this.num
                            }
                        ],
                    },
                ],
            };
        },

        initChart() {
            this.myChart = echarts.init(this.$refs.ecControl);

            this.myChart.setOption(this.getOption());

            // resize 必须重算 option
            this.resizeObserver = new ResizeObserver(() => {
                if (this.myChart) {
                    this.myChart.resize();
                    this.myChart.setOption(this.getOption(), true);
                }
            });

            this.resizeObserver.observe(this.$refs.ecControl);
        },

        updateChart() {
            if (!this.myChart) return;

            this.myChart.setOption({
                series: [
                    {
                        data: [{ value: this.num }]
                    }
                ]
            });
        }
    },

    watch: {
        num() {
            this.updateChart();
        },
    },

    mounted() {
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
.pmvChart {
    width: 100%;
    height: 100%;
}
</style>