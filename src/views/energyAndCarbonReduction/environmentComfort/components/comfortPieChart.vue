<template>
    <div class="ratioPieChart" ref="ecControl"></div>
</template>

<script>
import * as echarts from "echarts"
import greenCircle from '@/assets/img/energyManagement/greenCircle.png'

export default {
    props: {
        detailData: {
            type: Number,
            default: 75,
        },
        title: {
            type: String,
            default: '舒适度',
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
            const value = Number(this.detailData || 0)
            const title = this.title || '舒适度'

            // 获取容器尺寸（关键）
            const chart = this.myChart
            const width = chart ? chart.getWidth() : 260
            const height = chart ? chart.getHeight() : 260

            // 用最小边保证是正圆
            const size = Math.min(width, height)

            return {
                title: [
                    {
                        text: value,
                        subtext: title,
                        left: '48%',
                        top: '40%',
                        textStyle: {
                            fontSize: size * 0.12,
                            color: '#333',
                            fontWeight: 600,
                        },
                        subtextStyle: {
                            fontSize: size * 0.06,
                            color: '#666',
                        },
                        textAlign: 'center',
                    }
                ],

                polar: {
                    radius: ['58%', '67%'],
                    center: ['50%', '50%'],
                },

                angleAxis: {
                    max: 100,
                    show: false,
                },

                radiusAxis: {
                    type: 'category',
                    show: false,
                },

                // 背景图跟容器走
                graphic: [
                    {
                        type: 'image',
                        z: 1,
                        left: 'center',
                        top: 'middle',
                        style: {
                            image: greenCircle,
                            width: size * 0.8,   // 核心
                            height: size * 0.8,
                        }
                    }
                ],

                series: [
                    {
                        type: 'bar',
                        coordinateSystem: 'polar',
                        roundCap: true,
                        barWidth: size * 0.08, // 同步缩放
                        data: value > 0 ? [value] : [],
                        z: 2,

                        itemStyle: {
                            color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                                { offset: 0, color: '#deebbd' },
                                { offset: 0.5, color: '#c3dd84' },
                                { offset: 1, color: '#a7cc4c' }
                            ])
                        }
                    }
                ]
            }
        },

        initChart() {
            this.myChart = echarts.init(this.$refs.ecControl);
            this.myChart.setOption(this.getOption());

            this.resizeObserver = new ResizeObserver(() => {
                this.clacBaseFontSize();

                if (this.myChart) {
                    this.myChart.resize();

                    // 重新 setOption（让背景重新计算）
                    this.myChart.setOption(this.getOption(), true);
                }
            });

            this.resizeObserver.observe(this.$refs.ecControl);
        },

        updateChart() {
            if (!this.myChart) return;

            this.myChart.setOption(this.getOption(), true);
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