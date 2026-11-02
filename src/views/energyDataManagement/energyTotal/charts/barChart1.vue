<template>
    <div ref="bar1" :style="{ height: '100%' }"></div>
</template>

<script>
import resize from './mixins/resize';
import * as echarts from 'echarts';

export default {
    name: 'barChart1',
    mixins: [resize],
    props: {
        dataType: {
            type: String,
            default: '',
        },
        dataOption: {
            type: Object,
            default() {
                return {};
            },
        },
        dataOptionTb: {
            type: Object,
            default() {
                return {};
            },
        },
        dataOptionHb: {
            type: Object,
            default() {
                return {};
            },
        },
        category: {
            type: String,
            default: 'cur',
        },
        rateMap: {
            type: Object,
            default: () => ({}),
        },
    },
    data() {
        return {
            chart: null,
            optionNew: {},
            curData: [],
            options: {
                title: {},
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow',
                    },
                    formatter: (params) => {
                        const item = params[0]; // 横向柱状图只有一条
                        const name = item.name; // yAxis 类目
                        const value = Number(item.value) || 0;

                        // 计算占比
                        const total = Object.values(this.curData)
                            .map(v => Number(v) || 0)
                            .reduce((sum, v) => sum + v, 0);

                        const percent = total
                            ? ((value / total) * 100).toFixed(2)
                            : '0.00';
                        // 基础两行
                        let html = `
                        <div>
                            <div>${item.marker}${name}：${value}</div>
                            <div style="margin-left: 16px;">占比：${percent}%
                        </div>`;

                        // 同比 / 环比
                        // if (this.category !== 'cur') {
                        //     const rateLabel = this.category === 'tb' ? '同比' : '环比';
                        //     const rate = this.rateMap[name];

                        //     if (rate === null || rate === undefined || rate === '') {
                        //         html += `
                        //         <div style="margin-left: 16px; color: #fff;">${rateLabel}：-</div>`;
                        //     } else {
                        //         const numRate = Number(String(rate).replace('%', ''));
                        //         const showRate = isNaN(numRate) ? '-' : Math.abs(numRate) + '%';

                        //         let arrow = '';
                        //         let color = '#fff';

                        //         if (!isNaN(numRate)) {
                        //             if (numRate > 0) {
                        //                 arrow = '↑';
                        //                 color = '#f5222d';
                        //             } else if (numRate < 0) {
                        //                 arrow = '↓';
                        //                 color = '#52c41a';
                        //             }
                        //         }
                        //         html += `
                        //         <div style="margin-left: 16px;">${rateLabel}：${showRate}
                        //             <span style="margin-left: 4px; color: ${color};">${arrow}</span>
                        //         </div>`;
                        //     }
                        // }


                        if (this.category === 'cur') {
                            const tbNum = this.dataOptionTb[item.name]
                            const hbNum = this.dataOptionHb[item.name]
                            const rate = this.rateMap[name];

                                let arrow1 = '';
                                let color1 = '#fff';
                                let arrow2 = '';
                                let color2 = '#fff';

                                if (tbNum) {
                                    if (parseFloat(tbNum.replace('%', '')) / 100 > 0) {
                                        arrow1 = '↑';
                                        color1 = '#f5222d';
                                    } else if (parseFloat(tbNum.replace('%', '')) / 100 < 0) {
                                        arrow1 = '↓';
                                        color1 = '#52c41a';
                                    }
                                }
                                if (hbNum) {
                                    if (parseFloat(hbNum.replace('%', '')) / 100 > 0) {
                                        arrow2 = '↑';
                                        color2 = '#f5222d';
                                    } else if (parseFloat(hbNum.replace('%', '')) / 100 < 0) {
                                        arrow2 = '↓';
                                        color2 = '#52c41a';
                                    }
                                }

                                const curTbnum = tbNum ? (parseFloat(tbNum.replace('%', '')) / 100 > 0 ? tbNum : Math.abs(parseFloat(tbNum.replace('%', ''))) + '%') : ' -';
                                const curHbnum = hbNum ? (parseFloat(hbNum.replace('%', '')) / 100 > 0 ? hbNum : Math.abs(parseFloat(hbNum.replace('%', ''))) + '%') : ' -';
                                html += `
                                <div style="margin-left: 16px;">同比：${curTbnum}
                                    <span style="margin-left: 4px; color: ${color1};">${!curTbnum || curTbnum === ' -' ? '' : arrow1}</span>
                                </div>
                                <div style="margin-left: 16px;">环比：${curHbnum}
                                    <span style="margin-left: 4px; color: ${color2};">${!curHbnum || curHbnum === ' -' ? '' : arrow2}</span>
                                </div>
                                `;
                        }
                        html += '</div>';
                        return html;
                    },
                },
                // legend: {},
                grid: {
                    left: '4%',
                    right: '30%',
                    bottom: '3%',
                    containLabel: true,
                },
                xAxis: {
                    type: 'value',
                    boundaryGap: [0, 0.01],
                    splitLine: {
                        show: false,
                    },
                    axisLine: {
                        show: false,
                    },
                    axisLabel: {
                        color: '#ccd4ff',
                        show: false,
                    },
                },
                yAxis: {
                    type: 'category',
                    splitLine: {
                        show: false,
                    },
                    axisLine: {
                        show: false,
                    },
                    axisLabel: {
                        color: '#ccd4ff',
                    },
                    data: [],
                },
                series: [
                    {
                        name: '本期',
                        type: 'bar',
                        barWidth: 15, //固定柱子宽度
                        itemStyle: {
                            normal: {
                                barBorderRadius: [20, 20, 20, 20],
                                color: new echarts.graphic.LinearGradient(0, 1, 1, 1, [
                                    { offset: 0, color: '#00CED8' },
                                    { offset: 1, color: '#D9FFFF' },
                                ]),
                            },
                        },
                        label: {
                            position: 'right',
                            show: true,
                            color: '#A4FFFF',
                        },
                        data: [],
                    },
                ],
            },
        };
    },
    watch: {
        dataOption(data) {
            if (Object.keys(data).length > 0) {
                let xData = Object.values(data).map((v) => Number(v));
                let yData = Object.keys(data);
                let total = xData.reduce((sum, v) => sum + v, 0);
                let myChart = this.$echarts.init(this.$refs.bar1);
                this.curData = data;
                this.options.series[0].data = xData;
                this.options.yAxis.data = yData;
                // 设置 label formatter
                this.options.series[0].label.formatter = function (params) {
                    const value = Number(params.value) || 0;
                    if (!total) return `${value} (0%)`;

                    const percent = ((value / total) * 100).toFixed(2);
                    return `${value} (${percent}%)`;
                };
                myChart.setOption(this.options);
            } else {
                this.$nextTick(() => {
                    const dom = this.$refs.bar1;
                    dom.innerHTML = '<p style="text-align: center;font-size: 24px;line-height: 320px;">暂无数据<p>';
                    dom.removeAttribute('_echarts_instance_');
                });
            }
        },
        category: {
            deep: true,
            immediate: true,
            handler(val) {
                if (val === 'cur') {
                    this.options.series[0].itemStyle.normal.color = new echarts.graphic.LinearGradient(0, 1, 1, 1, [
                        { offset: 0, color: '#0044cc' },
                        { offset: 1, color: '#D9FFFF' },
                    ]);
                }
                if (val === 'tb') {
                    this.options.series[0].itemStyle.normal.color = new echarts.graphic.LinearGradient(0, 1, 1, 1, [
                        { offset: 0, color: '#0044cc' },
                        { offset: 1, color: '#2fdfff' },
                    ]);
                }
                if (val === 'hb') {
                    this.options.series[0].itemStyle.normal.color = new echarts.graphic.LinearGradient(0, 1, 1, 1, [
                        { offset: 0, color: '#3906d1' },
                        { offset: 1, color: '#c2adff' },
                    ]);
                }
            },
        },
    },
    mounted() {
        this.init();
    },
    methods: {
        // 初始化
        async init() {
            let myChart = this.$echarts.init(this.$refs.bar1);
            window.onresize = myChart.resize;
            myChart.setOption(this.options);
        },

        getData() { },
    },
};
</script>

<style lang="scss" scoped></style>
