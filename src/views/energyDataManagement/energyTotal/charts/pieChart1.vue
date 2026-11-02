<template>
    <div ref="pie1" :style="{ height: '228px', width: '100%' }"></div>
</template>

<script>
import resize from './mixins/resize';

export default {
    name: 'pie1',
    mixins: [resize],
    props: {
        dataOption: {
            type: Object,
            default() {
                return {};
            },
        },
        pieTbChange: {
            type: Object,
            default: () => ({}),
        },
        pieHbChange: {
            type: Object,
            default: () => ({}),
        },
        rateMap: {
            type: Object,
            default: () => ({}),
        },
        rateLabel: {
            type: String,
            default: '',
        },
    },
    data() {
        const vm = this;
        return {
            chart: null,
            optionNew: {},
            pieTbChange2: {},
            pieHbChange2: {},
            curData: [],
            options: {
                color: [
                    '#02C2AE',
                    '#578CF7',
                    '#52DFF7',
                    '#F8CC7E',
                    '#F8EA95',
                    '#C190F3',
                    '#ECC2EC',
                    '##4577CC',
                    '#F38969',
                ],
                tooltip: {
                    trigger: 'item',
                },
                legend: {
                    type: 'scroll',
                    orient: 'vertical',
                    top: '20%',
                    left: '3%',
                    // left: 'left',
                    orient: 'vertical',
                    icon: 'circle',
                    pageIcons: {
                        vertical: [
                            'path://M472.064 272.448l-399.232 399.232c-22.08 22.08-22.08 57.792 0 79.872 22.016 22.016 57.792 22.08 79.872 0L512 392.256l359.296 359.296c22.016 22.016 57.792 22.08 79.872 0 22.08-22.08 22.016-57.792 0-79.872L551.936 272.448C529.856 250.432 494.144 250.432 472.064 272.448z',
                            'path://M472.064 751.552 72.832 352.32c-22.08-22.08-22.08-57.792 0-79.872 22.016-22.016 57.792-22.08 79.872 0L512 631.744l359.296-359.296c22.016-22.016 57.792-22.08 79.872 0 22.08 22.08 22.016 57.792 0 79.872l-399.232 399.232C529.856 773.568 494.144 773.568 472.064 751.552z',
                        ],
                    },
                    pageIconColor: '#7f7f7f', // 可以点击的翻页按钮颜色
                    pageIconInactiveColor: '#00a9eb', // 禁用的按钮颜色
                    pageIconSize: 15, //这当然就是按钮的大小
                    pageTextStyle: {
                        color: '#fff',
                    },
                    textStyle: {
                        color: [
                            '#02C2AE',
                            '#578CF7',
                            '#52DFF7',
                            '#F8CC7E',
                            '#F8EA95',
                            '#C190F3',
                            '#ECC2EC',
                            '#4577CC',
                            '#F38969',
                        ],
                    },
                },
                tooltip: {
                    trigger: 'item',
                    formatter: function (params) {
                        const value = Number(params.value) || 0;
                        const percent = params.percent;
                        const rate = params.data.rate;
                        const rateLabel = params.data.rateLabel || '';
                        let rateLine = '';
                        // if (rateLabel) {
                        //     if (rate === null || rate === undefined || rate === '') {
                        //         rateLine = `
                        //             <div style="margin-left: 17px; color: #fff;">
                        //               ${rateLabel}：-
                        //             </div>`;
                        //     } else {
                        //         const numRate = Number(String(rate).replace('%', ''));
                        //         const showRate = Math.abs(numRate) + '%';
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
                        //         rateLine = `
                        //             <div style="margin-left: 17px;">
                        //               ${rateLabel}：${showRate}<span style="margin-left: 4px; color: ${color};">${arrow}</span>
                        //             </div>`;
                        //     }
                        // }

                        if (!rateLabel) {
                            const tbNum = vm.pieTbChange[params.name]
                            const hbNum = vm.pieHbChange[params.name]

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
                            rateLine = `
                                    <div style="margin-left: 17px;">
                                      同比：${curTbnum}<span style="margin-left: 4px; color: ${color1};"> ${!curTbnum || curTbnum === ' -' ? '' : arrow1}</span>
                                    </div>
                                    <div style="margin-left: 17px;">
                                      环比：${curHbnum}<span style="margin-left: 4px; color: ${color2};"> ${!curHbnum || curHbnum === ' -' ? '' : arrow2}</span>
                                    </div>`;

                        }
                        return `
                          <div>
                            <div>${params.marker}${params.name}：${value}</div>
                            <div>&nbsp;&nbsp;&nbsp;&nbsp;占比：${percent}%</div>
                            ${rateLine}
                          </div>`;
                    },
                },

                series: [
                    {
                        name: '',
                        type: 'pie',
                        avoidLabelOverlap: false,
                        center: ['72%', '50%'],
                        label: {
                            show: false,
                            position: 'inner',
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: '12',
                                fontWeight: 'bold',
                            },
                        },
                        labelLine: {
                            show: false,
                        },
                        data: [],
                    },
                ],
            },
            nameList: [],
            valueList: [],
        };
    },
    watch: {
        dataOption(data) {
            if (Object.keys(data).length > 0) {
                let valueList = Object.values(data).map((v) => Number(v) || 0);
                let nameList = Object.keys(data);
                // let total = valueList.reduce((sum, v) => sum + v, 0);
                let cur = nameList.map((name, index) => ({
                    name,
                    value: valueList[index],
                    rate: this.rateMap[name],
                    rateLabel: this.rateLabel, // 同比 / 环比
                }));
                this.options.series[0].data = cur;
                let myChart = this.$echarts.init(this.$refs.pie1);
                myChart.setOption(this.options);
            } else {
                this.$nextTick(() => {
                    const dom = this.$refs.pie1;
                    dom.innerHTML = '<p style="text-align: center;font-size: 24px;line-height: 235px;">暂无数据<p>';
                    dom.removeAttribute('_echarts_instance_');
                });
            }
        },
    },


    mounted() {
        this.init();
    },
    methods: {
        // 初始化
        async init() {
            let myChart = this.$echarts.init(this.$refs.pie1);
            window.onresize = myChart.resize;
            myChart.setOption(this.options);
        },

        getData() { },
    },
};
</script>

<style lang="scss" scoped></style>
