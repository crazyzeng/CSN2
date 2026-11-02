<!-- 节能分析 -->
<template>
    <div class="empty_page">
        <div class="card bg_style">
            <div class="tabs-container">
                <el-tabs tab-position="left" class="h-full" @tab-click="tabsClick">
                    <el-tab-pane label="本月"></el-tab-pane>
                    <el-tab-pane label="本年"></el-tab-pane>
                </el-tabs>
            </div>
            <div class="card_box" v-for="(item, index) in cardList" :key="index" :style="{
                background: item.gradient,
                '--card-shadow': item.shadow
            }">
                <div class="box-header">
                    <div class="label">{{ item.label }}</div>
                    <div class="mom" v-if="item.mom">{{ item.mom }}</div>
                </div>
                <div class="box-body">
                    <span class="value">{{ item.value }}</span>
                    <span class="unit">{{ item.unit }}</span>
                </div>
            </div>
        </div>
        <div class="stacked_area_chart bg_style">
            <div class="chart_title mt-2">节能趋势分析</div>
            <LineChart :chartData="emptyPageData.energyTrend"></LineChart>
        </div>
        <div class="stacked_area_chart bg_style">
            <div class="select_box">
                <el-select style="width:210px" v-model="selectData" @change="selectChange">
                    <el-option v-for="item in emptyPageData.systemEnergyTrend.systemData" :key="item.systemId"
                        :label="item.systemName" :value="item.systemId"></el-option>
                </el-select>
            </div>
            <div class="chart_title mt-2">系统节能分析</div>
            <LineChart2 :chartData="lineChartData"></LineChart2>
        </div>
        <div class="content">
            <div class="left_box bg_style">
                <div class="chart_title mt-2">区域负荷排名</div>
                <div class="rank-list-container">
                    <div class="rank" v-for="(item, index) in rankData" :key="index">
                        <div class="rank_box">
                            <div class="rank-index">{{ index + 1 }}</div>
                            <div class="rank-label">{{ item.label }}</div>

                            <div class="rank-info">
                                <div class="rank-text">
                                    <!-- <div>全年基准：{{ item.benchmark }}MWh</div> -->
                                    <div>全年负荷：{{ item.Load }}MWh</div>
                                    <div class="highlight">能耗环比：{{ item.proportion }}</div>
                                </div>

                                <div class="rank-bar-bg">
                                    <div class="rank-bar-value" :style="{ width: item.barWidth }"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="right_box bg_style">
                <div class="chart_title mt-2">系统节能结构</div>
                <div class="right_box_content">
                    <div class="system_echarts">
                        <RightPie1 :rightPieData="pieChartData"></RightPie1>
                    </div>
                    <div class="system-list">
                        <div class="system-item" v-for="(item, index) in systemData" :key="index">
                            <div class="system-img">
                                <img :src="item.image" alt="" />
                            </div>
                            <div class="system-title">{{ item.title }}</div>
                            <div class="system-data-left">
                                <el-tooltip :content="'全年基准：' + item.benchmark + 'MWh'" placement="top" effect="dark">
                                    <div>全年基准：{{ item.benchmark }}MWh</div>
                                </el-tooltip>
                                <el-tooltip :content="'全年负荷：' + item.Load + 'MWh'" placement="top" effect="dark">
                                    <div>全年负荷：{{ item.Load }}MWh</div>
                                </el-tooltip>
                            </div>
                            <div class="system-data-right">
                                <el-tooltip :content="'全年节能：' + item.energySaving + 'MWh'" placement="top"
                                    effect="dark">
                                    <div>全年节能：{{ item.energySaving }}MWh</div>
                                </el-tooltip>
                                <el-tooltip :content="'节能率：' + item.energySavingRate + '%'" placement="top"
                                    effect="dark">
                                    <div>节能率：{{ item.energySavingRate }}%</div>
                                </el-tooltip>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import LineChart from "./chart/LineChart.vue";
import LineChart2 from "./chart/LineChart2.vue";
import RightPie1 from "./chart/RightPie1.vue";
import ZLImg from '@/assets/img/emptyPage/Other.png'
import ZRImg from '@/assets/img/emptyPage/GeneralPower.png'
import ZMImg from '@/assets/img/emptyPage/airConditioner.png'
import SYImg from '@/assets/img/emptyPage/CommercialElectricity.png'
import TYImg from '@/assets/img/emptyPage/Lighting.png'
import { handleNewEnergySaveAnalysis } from "../../api/newEnergyDataAnalysis/newEmptyPage";

export default {
    components: { LineChart, LineChart2, RightPie1 },
    computed: {
        pieChartData() {
            const data = {};
            const details = this.emptyPageData.systemEnergyPie?.detail || [];
            details.forEach(item => {
                data[item.systemName] = Number(item.yearEnergySave) || 0;
            });
            return data;
        }
    },
    data: function () {
        return {
            selectData: '',
            lineChartData: {},
            cardData: {
                year: [],
                month: []
            },
            cardList: [
                {
                        label: '月度基准',
                        value:'',
                        unit: 'MWh',
                        mom: '',
                        gradient: "#FFF6E7",
                        shadow: "0 6px 16px rgba(254,199,111,0.20)"
                    },
                    {
                        label: '月度能耗',
                        value: '',
                        unit: 'MWh',
                        mom: '',
                        gradient: "#F0E8FF",
                        shadow: "0 6px 16px rgba(134,163,248,0.18)"
                    },
                    {
                        label: '月度节能',
                        value: '',
                        unit: 'MWh',
                        mom: '',
                        gradient: "#E3EAFC",
                        shadow: "0 6px 16px rgba(159,222,243,0.20)"
                    },
                    {
                        label: '减排贡献',
                        value: '',
                        unit: 'kgco2',
                        mom: '',
                        gradient: "#F6FBE4",
                        shadow: "0 6px 16px rgba(192,232,142,0.20)"
                    }
            ],
            rankData: [],
            systemData: [
                {
                    title: '其他',
                    benchmark: '',
                    Load: '',
                    energySaving: '',
                    energySavingRate: '',
                    image: ZLImg,
                },
                {
                    title: '一般动力',
                    benchmark: '',
                    Load: '',
                    energySaving: '',
                    energySavingRate: '',
                    image: ZRImg,
                },
                {
                    title: '暖通空调',
                    benchmark: '',
                    Load: '',
                    energySaving: '',
                    energySavingRate: '',
                    image: ZMImg,
                },
                {
                    title: '商业用电',
                    benchmark: '',
                    Load: '',
                    energySaving: '',
                    energySavingRate: '',
                    image: SYImg,
                },
                {
                    title: '照明',
                    benchmark: '',
                    Load: '',
                    energySaving: '',
                    energySavingRate: '',
                    image: TYImg,
                },
            ],
            emptyPageData: {
                monthCard: {
                    benchmark: null,
                    energy: null,
                    energyHbChange: null,
                    energySave: null,
                    energySaveHbChange: null,
                    energySaveCarbon: null
                },
                yearCard: {
                    benchmark: null,
                    energy: null,
                    energyHbChange: null,
                    energySave: null,
                    energySaveHbChange: null,
                    energySaveCarbon: null
                },
                energyTrend: {
                    xAxis: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                    labels: ["用电量", "基准值"],
                    data: [[], []],
                },
                systemEnergyTrend: {
                    xAxis: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                    labels: ["用电量", "基准值"],
                    systemData: [
                        {
                            systemId: "",
                            systemName: "",
                            data: [[], []]
                        },
                    ]
                },
                systemEnergyPie: {
                    total: null,
                    detail: [
                        {
                            systemId: "",
                            systemName: "",
                            yearBenchmark: null,
                            yearEnergy: null,
                            yearEnergySave: null,
                            yearEnergySaveRate: null,
                        },
                    ]
                },
                areaEnergy: [
                    {
                        areaName: "",
                        yearEnergy: null,
                        hb: '',
                    },
                ]
            }
        };
    },
    created: function () {
    },
    mounted() {
        this.init();
    },

    methods: {
        init() {
            this.getNewEnergyPredict();


        },
        async getNewEnergyPredict() {
            const res = await handleNewEnergySaveAnalysis();
                console.log(res.data);

            if (res.code === 200) {
                this.emptyPageData = res.data;
                this.updateCardData();
                this.cardList = this.cardData.month
                if (this.emptyPageData.systemEnergyTrend && 
                    this.emptyPageData.systemEnergyTrend.systemData && 
                    this.emptyPageData.systemEnergyTrend.systemData.length > 0) {
                    this.selectData = this.emptyPageData.systemEnergyTrend.systemData[0].systemId;
                }
                this.updateSystemChartData();
                this.updateRankData();
                this.updateSystemDataList();
            }
        },
        // 卡片数据赋值
        updateCardData() {
            const { monthCard, yearCard } = this.emptyPageData;

            // 将 kWh 转换为 MWh (除以 1000)，并保留两位小数，如果为 null/undefined 则显示 '--'
            const formatValueToMWh = (val) => {
                if (val === null || val === undefined || isNaN(val)) {
                    return '--';
                }
                return (Number(val) / 1000).toFixed(2);
            };

            // 格式化非 MWh 单位的数值（如 kgco2），保留两位小数
            const formatValue = (val) => {
                if (val === null || val === undefined || isNaN(val)) {
                    return '--';
                }
                return Number(val).toFixed(2);
            };

            if (yearCard) {
                this.cardData.year = [
                    {
                        label: '年度基准',
                        value: formatValueToMWh(yearCard.benchmark),
                        unit: 'MWh',
                        mom: '',
                        gradient: "#FFF6E7",
                        shadow: "0 6px 16px rgba(254,199,111,0.20)"
                    },
                    {
                        label: '年度能耗',
                        value: formatValueToMWh(yearCard.energy),
                        unit: 'MWh',
                        mom: yearCard.energyHbChange ? `环比${yearCard.energyHbChange}%` : '',
                        gradient: "#F0E8FF",
                        shadow: "0 6px 16px rgba(134,163,248,0.18)"
                    },
                    {
                        label: '年度节能',
                        value: formatValueToMWh(yearCard.energySave),
                        unit: 'MWh',
                        mom: yearCard.energySaveHbChange ? `环比${yearCard.energySaveHbChange}%` : '',
                        gradient: "#E3EAFC",
                        shadow: "0 6px 16px rgba(159,222,243,0.20)"
                    },
                    {
                        label: '减排贡献',
                        value: formatValue(yearCard.energySaveCarbon),
                        unit: 'kgco2',
                        mom: '',
                        gradient: "#F6FBE4",
                        shadow: "0 6px 16px rgba(192,232,142,0.20)"
                    }
                ];
            }

            if (monthCard) {
                this.cardData.month = [
                    {
                        label: '月度基准',
                        value: formatValueToMWh(monthCard.benchmark),
                        unit: 'MWh',
                        mom: '',
                        gradient: "#FFF6E7",
                        shadow: "0 6px 16px rgba(254,199,111,0.20)"
                    },
                    {
                        label: '月度能耗',
                        value: formatValueToMWh(monthCard.energy),
                        unit: 'MWh',
                        mom: monthCard.energyHbChange ? `环比${monthCard.energyHbChange}%` : '',
                        gradient: "#F0E8FF",
                        shadow: "0 6px 16px rgba(134,163,248,0.18)"
                    },
                    {
                        label: '月度节能',
                        value: formatValueToMWh(monthCard.energySave),
                        unit: 'MWh',
                        mom: monthCard.energySaveHbChange ? `环比${monthCard.energySaveHbChange}%` : '',
                        gradient: "#E3EAFC",
                        shadow: "0 6px 16px rgba(159,222,243,0.20)"
                    },
                    {
                        label: '减排贡献',
                        value: formatValue(monthCard.energySaveCarbon),
                        unit: 'kgco2',
                        mom: '',
                        gradient: "#F6FBE4",
                        shadow: "0 6px 16px rgba(192,232,142,0.20)"
                    }
                ];
            }
        },
        // 卡片切换 
        tabsClick(val) {
            if (val.label === '本月') {
                this.cardList = this.cardData.month
            } else if (val.label === '本年') {
                this.cardList = this.cardData.year
            }
        },
        selectChange(val) {
            this.updateSystemChartData();
        },
        updateSystemChartData() {
            const systemTrend = this.emptyPageData.systemEnergyTrend;
            if (!systemTrend || !systemTrend.systemData) {
                this.lineChartData = {
                    xAxis: [],
                    labels: ["用电量", "基准值"],
                    data: [[], []]
                };
                return;
            }

            const selectedSystem = systemTrend.systemData.find(item => item.systemId === this.selectData);

            if (selectedSystem && selectedSystem.data) {
                this.lineChartData = {
                    xAxis: systemTrend.xAxis,
                    labels: systemTrend.labels,
                    data: selectedSystem.data
                };
            } else {
                this.lineChartData = {
                    xAxis: systemTrend.xAxis,
                    labels: systemTrend.labels,
                    data: [[], []]
                };
            }
        },
        updateRankData() {
            const areaEnergyList = this.emptyPageData.areaEnergy || [];
            if (!areaEnergyList.length) {
                return;
            }

            const validLoads = areaEnergyList
                .map(item => item.yearEnergy)
                .filter(val => val !== null && val !== undefined && !isNaN(val));
            
            const maxLoad = validLoads.length > 0 ? Math.max(...validLoads) : 0;

            this.rankData = areaEnergyList.map((item, index) => {
                const proportionText = item.hb !== null && item.hb !== undefined ? `${item.hb}%` : '--';
                
                let barWidthPercent = 0;
                if (maxLoad > 0 && item.yearEnergy !== null && item.yearEnergy !== undefined) {
                    barWidthPercent = (item.yearEnergy / maxLoad) * 100;
                }
                
                barWidthPercent = Math.max(0, Math.min(100, barWidthPercent));

                // 将 kWh 转换为 MWh (除以 1000)，并保留两位小数
                const loadInMWh = item.yearEnergy !== null && item.yearEnergy !== undefined 
                    ? (Number(item.yearEnergy) / 1000).toFixed(2) 
                    : '--';

                return {
                    label: item.areaName || '',
                    benchmark: '--',
                    Load: loadInMWh,
                    proportion: proportionText,
                    barWidth: `${barWidthPercent}%`
                };
            });
        },
        updateSystemDataList() {
            const details = this.emptyPageData.systemEnergyPie?.detail || [];
            
            const imageMap = {
                '其他': ZLImg,
                '一般动力': ZRImg,
                '暖通空调': ZMImg,
                '商业用电': SYImg,
                '照明': TYImg,
            };

            // 辅助函数：将 kWh 转换为 MWh，保留两位小数
            const formatToMWh = (val) => {
                if (val === null || val === undefined || isNaN(val)) {
                    return '--';
                }
                return (Number(val) / 1000).toFixed(2);
            };

            this.systemData = details.map(item => {
                return {
                    title: item.systemName,
                    benchmark: formatToMWh(item.yearBenchmark),
                    Load: formatToMWh(item.yearEnergy),
                    energySaving: formatToMWh(item.yearEnergySave),
                    energySavingRate: item.yearEnergySaveRate !== null && item.yearEnergySaveRate !== undefined ? item.yearEnergySaveRate : '--',
                    image: imageMap[item.systemName] || ZLImg 
                };
            });
        },
    },
};
</script>

<style lang="scss" scoped>
.empty_page {
    width: 100%;
    height: 100%;
    position: relative;
    color: #000;

    .card {
        height: 10%;
        margin-bottom: 15px;
        display: flex;
        align-items: center;
        padding: 0 15px;
        box-sizing: border-box;

        .tabs-container {
            flex-shrink: 0;
            margin-right: 15px;
        }

        .card_box {
            flex: 1;
            height: 80%;
            margin-left: 10px;
            padding: 7px 15px;
            border-radius: 8px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            transition: all 0.3s ease;

            &:first-child {
                margin-left: 0;
            }

            &:hover {
                transform: translateY(-2px);
            }

            .box-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                font-size: 14px;
                color: #666;

                .label {
                    font-weight: bold;
                    color: #333;
                }

                .mom {
                    font-size: 12px;
                    color: #999;
                }
            }

            .box-body {
                display: flex;
                justify-content: center;
                align-items: baseline;

                .value {
                    font-size: 24px;
                    font-weight: bold;
                    color: #333;
                    margin-right: 5px;
                }

                .unit {
                    font-size: 14px;
                    color: #666;
                }
            }
        }
    }

    .stacked_area_chart {
        height: calc(27.5% - 15px);
        margin-bottom: 15px;
        position: relative;
    }

    .content {
        width: 100%;
        height: calc(35% - 15px);
        display: flex;

        .left_box,
        .right_box {
            position: relative;
            width: calc(50% - 7.5px);
            height: 100%;
            color: #000;
        }

        .left_box {
            margin-right: 15px;
            overflow: hidden;

            .rank-list-container {
                height: calc(100% - 60px);
                margin-top: 50px;
                overflow-y: auto;
                padding: 20px;

                &::-webkit-scrollbar {
                    width: 4px;
                }

                &::-webkit-scrollbar-thumb {
                    background: #ccc;
                    border-radius: 2px;
                }
            }

            .rank {
                width: 100%;
                margin-bottom: 15px;

                &:last-child {
                    margin-bottom: 0;
                }

                .rank_box {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    height: 30px;
                    margin-bottom: 10px;

                    .rank-index {
                        width: 24px;
                        height: 24px;
                        line-height: 24px;
                        text-align: center;
                        background-color: #A3CB46;
                        color: #fff;
                        border-radius: 50%;
                        font-size: 12px;
                        font-weight: bold;
                        margin-right: 8px;
                        flex-shrink: 0;
                        box-shadow: 0 2px 4px rgba(163, 203, 70, 0.3);
                    }

                    .rank-label {
                        width: 20%;
                        font-size: 14px;
                        color: #333;
                        font-weight: 500;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        padding-right: 10px;
                    }

                    .rank-info {
                        width: 80%;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        height: 100%;
                        padding: 0px 10px;

                        .rank-text {
                            display: flex;
                            justify-content: space-between;
                            font-size: 12px;
                            color: #333;
                            margin-bottom: 2px;

                            div {
                                flex: 1;
                                text-align: left;

                                &:last-child {
                                    text-align: right;
                                }
                            }
                        }

                        .rank-bar-bg {
                            width: 100%;
                            height: 8px;
                            background-color: #F5F8EF;
                            border-radius: 4px;
                            overflow: hidden;
                            position: relative;

                            .rank-bar-value {
                                height: 100%;
                                background: linear-gradient(to right, #D3E5AB, #A3CB46);
                                border-radius: 4px;
                                transition: width 0.5s ease;
                            }
                        }
                    }
                }
            }
        }

        .right_box {
            position: relative;

            .right_box_content {
                width: 100%;
                height: calc(100% - 50px);
                margin-top: 50px;
                display: flex;
                flex-direction: row;

                .system_echarts {
                    height: 100%;
                    width: 35%;
                }

                .system-list {
                    width: calc(65% - 10px);
                    margin-bottom: 10px;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    overflow-y: auto;

                    .system-item {
                        width: 90%;
                        margin-left: 5%;
                        background-color: #fff;
                        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                        border-radius: 6px;
                        padding: 10px 12px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        min-height: 70px;
                        box-sizing: border-box;

                        .system-img {
                            width: 40px;
                            height: 40px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            flex-shrink: 0;

                            img {
                                max-width: 100%;
                                max-height: 100%;
                                object-fit: contain;
                            }
                        }

                        .system-title {
                            min-width: 60px;
                            font-size: 13px;
                            font-weight: bold;
                            color: #333;
                            text-align: left;
                            line-height: 1.4;
                            word-break: break-all;
                            flex-shrink: 0;
                            margin: 0 10px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        }

                        .system-data-left,
                        .system-data-right {
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            font-size: 11px;
                            color: #666;
                            line-height: 1.4;
                            flex: 1;
                            align-items: flex-start;
                            gap: 2px;
                            letter-spacing: 0.5px;
                            min-width: 0;

                            div {
                                white-space: nowrap;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                width: 100%;
                            }
                        }

                        .system-data-left {
                            margin-right: 10px;
                        }
                    }
                }
            }
        }
    }

    .select_box {
        position: absolute;
        top: 10px;
        right: 50px;
        z-index: 9999;
    }
}

.bg_style {
    background-color: #fff;
    box-shadow: 0 0 6px rgba(90, 151, 250, 0.3);
    border-radius: 10px;
}

.chart_title {
    background-image: url("../../assets/img/energyManagement/title_bg.png");
    width: 223px;
    height: 25px;
    line-height: 25px;
    color: #313131;
    font-size: 14px;
    text-indent: 35px;
    background-size: contain;
    background-repeat: no-repeat;
    position: absolute;
    left: 15px;
    letter-spacing: 2px;
    font-weight: 600;
}
</style>