<template>
    <div class="content_warp">
        <section class="left_warp">
            <el-card class="top_chart_box">
                <span class="content_title">当日能耗走势</span>
                <div class="flex items-center justify-between mt-3">
                    <el-radio-group class="mt-1" v-model="topRadioVal" @change="topRadioChange">
                        <el-radio label="ENERGY_ELECTRIC">电</el-radio>
                        <el-radio label="ENERGY_WATER">水</el-radio>
                    </el-radio-group>
                    <span class=" mr-5" style="color: #ccd4ff;font-weight: bold;">当日能耗：{{ topTotalNum }} {{ dataType ==
                        'ENERGY_ELECTRIC' ? 'kWh' : 't' }}</span>
                </div>
                <TopBarChart :dataItem="topData" :energyType="dataType" />
            </el-card>
            <el-card class="center_chart_box">
                <span class="content_title">区域月度用能排名</span>
                <el-radio-group v-model="centerRadioVal" class="radioBox" @change="centerRadioChange">
                    <el-radio label="ENERGY_ELECTRIC">电</el-radio>
                    <el-radio label="ENERGY_WATER">水</el-radio>
                </el-radio-group>
                <CenterBarChart :dataItem="centerData" :energyType="dataType1" />
            </el-card>
            <el-card class="bottom_chart_box">
                <span class="content_title">分项月度用能占比</span>
                <div class="flex items-center justify-between mt-3">
                    <el-radio-group class="mt-1" v-model="bottomRadioVal" @change="bottomRadioChange">
                        <el-radio label="ENERGY_ELECTRIC">电</el-radio>
                        <el-radio label="ENERGY_WATER">水</el-radio>
                    </el-radio-group>
                    <span class=" mr-5" style="color: #ccd4ff;font-weight: bold;">当月分项能耗：{{ bottomTotalNum }} {{
                        bottomRadioVal == 'ENERGY_ELECTRIC' ? 'kWh' : 't' }}</span>
                </div>
                <BottomPieChart :dataItem="bottomData" :dataType="bottomRadioVal" />
            </el-card>
        </section>
        <section class="right_warp">
            <section class="right_top_warp">
                <span class="content_title">设备运维信息</span>
                <section class="right_top_box">
                    <section class="number_item">
                        <p @click="totalClick">
                            <span class="number_text">{{ maintanceData.total || '0' }} </span><span
                                class="number_unit">台</span>
                        </p>
                        <p><span>设备在编总数</span></p>
                    </section>
                    <section class="number_item">
                        <p @click="totalClick">
                            <span class="number_text">{{ maintanceData.run || '0' }} </span><span
                                class="number_unit">台</span>
                        </p>
                        <p><span>设备运行总数</span></p>
                    </section>
                    <section class="number_item">
                        <p @click="repairClick">
                            <span class="number_text">{{ maintanceData.repair || '0' }} </span><span
                                class="number_unit">台</span>
                        </p>
                        <p><span>正在维修设备</span></p>
                    </section>
                    <section class="number_item">
                        <p @click="upkeepClick">
                            <span class="number_text">{{ maintanceData.maintain || '0' }} </span><span
                                class="number_unit">台</span>
                        </p>
                        <p><span>正在保养设备</span></p>
                    </section>
                </section>
            </section>
            <section class="right_center_warp">
                <span class="content_title">设备健康信息</span>
                <!-- <section id="bar_chart"></section> -->
                <RightRadarChart></RightRadarChart>
            </section>
            <section class="right_bottom_warp">
                <el-card class="left_bottom_right">
                    <span class="content_title">运营事件</span>
                    <p class="table_head">
                        <span class="table_title relative right-3">事件内容</span><span class="table_title">时间</span>
                    </p>
                    <div class="eventTable">
                        <p class="table_tr" v-for="(item, index) in eventList" :key="index">
                            <el-tooltip class="item" effect="dark" :content="item.content" placement="right"><span>{{
                                item.content }}</span></el-tooltip><span>{{ item.happenTime }}</span>
                        </p>
                    </div>
                </el-card>
            </section>
        </section>
        <section class="center_warp">
            <section class="left_top">
                <img :src="imgSrc" alt="" />
                <section class="tab_warp">
                    <section v-for="(item, index) in tabItemList" :key="item.name" class="tab_item"
                        @click="tabClick(index)">
                        <p class="tab_item_name" :class="activeIndex === index ? 'active' : ''">
                            <i class="circle_bar" :class="activeIndex === index ? 'active' : ''"></i>
                            <span>{{ item.areaName }}</span>
                        </p>
                        <p>
                            <!-- <span>当日用能：</span><span>{{ item.dayData?.toFixed(2) + ' kWh' || '-' }}</span> -->
                            <span>当日用能：</span><span>{{ item.dayData ? item.dayData + ' kWh' : '-' }}</span>
                        </p>
                        <p>
                            <!-- <span>当月用能：</span><span>{{ item.energyData?.toFixed(2) + ' kWh' || '-' }}</span> -->
                            <span>当月用能：</span><span>{{ item.energyData ? item.energyData + ' kWh' : '-' }}</span>
                        </p>
                        <p class="threshold_text">
                            <span>当月阈值：</span>
                            <!-- <span>{{ item.threshold ? item.threshold.toFixed(2) + ' kWh' : '-' }}</span> -->
                            <span>{{ item.threshold ? item.threshold + ' kWh' : '-' }}</span>
                        </p>
                    </section>
                </section>
            </section>
            <section class="left_bottom">
                <el-card class="left_bottom_left">
                    <div class="flex justify-between items-center">
                        <span class="content_title">统计数据</span>
                        <div class="btns" v-if="getUserName == 'Jenny001'">
                            <el-button v-if="!totalData.enable" size="mini" type="primary"
                                @click="startEdit">编辑</el-button>
                            <el-button size="mini" type="primary" @click="saveData">{{
                                totalData.enable ? '禁用' : '启用'
                            }}</el-button>
                        </div>
                    </div>
                    <section class="number_box items-center">
                        <section class="number_item">
                            <div>
                                <span class="number_text" v-if="!isEditing">{{
                                    displayData.currentYearElectricSum
                                }}</span>
                                <el-input ref="input1" v-else v-model="totalData.currentYearElectricSum" size="mini"
                                    class="number_text"></el-input>
                            </div>
                            <p class="number_name">
                                <span>当年总电量<span class="number_unit">MWh</span></span>
                            </p>
                        </section>
                        <section class="number_item">
                            <div>
                                <span class="number_text" v-if="!isEditing">{{
                                    displayData.totalSaveElectricSum
                                }}</span>
                                <el-input v-else v-model="totalData.totalSaveElectricSum" size="mini"
                                    class="number_text"></el-input>
                            </div>
                            <p class="number_name">
                                <span>累计节电量<span class="number_unit">MWh</span></span>
                            </p>
                            <div>
                                <span class="number_text" v-if="!isEditing">{{
                                    displayData.totalSaveElectricRatio
                                }}</span>
                                <el-input v-else v-model="totalData.totalSaveElectricRatio" size="mini"
                                    class="number_text"></el-input>
                            </div>
                            <p class="number_name">
                                <span>累计节能率%<span class="number_unit"></span></span>
                            </p>
                        </section>
                        <section class="number_item">
                            <div>
                                <span class="number_text" v-if="!isEditing">{{
                                    displayData.currentYearSaveElectricSum
                                }}</span>
                                <el-input v-else v-model="totalData.currentYearSaveElectricSum" size="mini"
                                    class="number_text"></el-input>
                            </div>
                            <p>
                                <span class="number_name">年节电量<span class="number_unit">MWh</span></span>
                            </p>
                            <div>
                                <span class="number_text" v-if="!isEditing">{{
                                    displayData.currentYearSaveElectricRatio
                                }}</span>
                                <el-input v-else v-model="totalData.currentYearSaveElectricRatio" size="mini"
                                    class="number_text"></el-input>
                            </div>
                            <p>
                                <span class="number_name">年节能率%<span class="number_unit"></span></span>
                            </p>
                        </section>
                        <section class="number_item">
                            <div>
                                <span class="number_text" v-if="!isEditing">{{ displayData.totalWaterSum }}</span>
                                <el-input v-else v-model="totalData.totalWaterSum" size="mini"
                                    class="number_text"></el-input>
                            </div>
                            <p>
                                <span class="number_name">累计用水量<span class="number_unit">kt</span></span>
                            </p>
                            <div>
                                <span class="number_text" v-if="!isEditing">{{ displayData.currentYearWaterSum }}</span>
                                <el-input v-else v-model="totalData.currentYearWaterSum" size="mini"
                                    class="number_text"></el-input>
                            </div>
                            <p>
                                <span class="number_name">年用水量<span class="number_unit">kt</span></span>
                            </p>
                        </section>
                    </section>
                </el-card>
            </section>
        </section>
    </div>
</template>

<script>
import * as echarts from 'echarts';
import resize from '@/utils/resize.js';
import img1 from '@/assets/home/ElevatedLayer.png';
import img2 from '@/assets/home/PlatformLayer.png';
import img3 from '@/assets/home/OutboundLayer.png';
import TopBarChart from './TopBarChart.vue';
import CenterBarChart from './CenterBarChart.vue';
import BottomPieChart from './BottomPieChart.vue';
import RightRadarChart from './chart/RightRadarChart.vue';
import {
    fetchEnergyTrend,
    fetchMonthUsageRank,
    fetchMonthSystemUsage,
    getAreaData,
    getDeviceMaintenanceData,
    getOverviewData,
    getEditOverviewData,
    editOverviewData,
} from '@/api/home.js';
import { getWebSocket } from '@/utils/websocket';
import Big from 'big.js';

export default {
    name: 'home',
    components: { TopBarChart, CenterBarChart, BottomPieChart, RightRadarChart },
    mixins: [resize],
    data: function () {
        return {
            topRadioVal: 'ENERGY_ELECTRIC',
            centerRadioVal: 'ENERGY_ELECTRIC',
            bottomRadioVal: 'ENERGY_ELECTRIC',
            activeIndex: 0,
            imgSrc: img3,
            tabItemList: [],
            eventList: [],
            processList: [
                {
                    name: '客服系统',
                    percentage: 100,
                },
                {
                    name: '电梯系统',
                    percentage: 100,
                },
                {
                    name: '供配电系统',
                    percentage: 100,
                },
                {
                    name: '照明系统',
                    percentage: 100,
                },
            ],
            bgColor: '#DCDCDC',
            percentage: 10,
            colors: [
                { color: '#778AFF' },
                { color: '#02C2AE' },
                { color: '#52DFF7' },
                { color: '#F1B051' },
                { color: '#F9B5EB' },
                { color: '#2676DE' },
                { color: '#F8CC7E' },
                { color: '#F38969' },
            ],
            topData: [],
            topTotalNum: null,
            centerData: [],
            bottomData: [],
            bottomTotalNum: null,
            dataType: 'ENERGY_ELECTRIC',
            dataType1: 'ENERGY_ELECTRIC',
            timer: null,
            ws: null,
            overviewData: {},
            maintanceData: {},
            option: {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow',
                    },
                    formatter(val) {
                        return `${val[0].seriesName}:${val[0].data}</br>${val[1].seriesName}:${0 - val[1].data}`;
                    },
                },
                legend: {
                    data: ['不健康', '健康'],
                    textStyle: {
                        color: '#fff',
                    },
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true,
                },
                xAxis: [
                    {
                        type: 'value',
                        axisLabel: {
                            formatter(value, index) {
                                if (value < 0) return 0 - value;
                                else return value;
                            },
                        },
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: '#606672',
                            },
                        },
                        splitLine: {
                            show: false,
                        },
                    },
                ],
                yAxis: [
                    {
                        type: 'category',
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: '#606672',
                            },
                        },
                        axisTick: {
                            show: false,
                        },
                        data: ['1', '2', '3', '4', '5', '6', '7'],
                    },
                ],
                color: ['#80FFFF', '#00BFBF'],
                series: [
                    {
                        name: '健康',
                        type: 'bar',
                        stack: 'Total',
                        barWidth: 18,
                        label: {
                            show: true,
                        },
                        emphasis: {
                            focus: 'series',
                        },
                        data: [320, 302, 341, 374, 390, 450, 420],
                    },
                    {
                        name: '不健康',
                        type: 'bar',
                        stack: 'Total',
                        barWidth: 18,
                        label: {
                            show: true,
                            formatter(val) {
                                return 0 - val.data;
                            },
                        },
                        emphasis: {
                            focus: 'series',
                        },
                        data: [-120, -132, -101, -134, -190, -230, -210],
                    },
                ],
            },
            isEditing: false,
            totalData: {
                enable: 0, // 是否启用 0不启用 1启用
                currentYearElectricSum: '', // 当年总电量
                totalSaveElectricSum: '', // 累计节电量
                totalSaveElectricRatio: '', // 累计节能率
                currentYearSaveElectricSum: '', // 年节电量
                currentYearSaveElectricRatio: '', // 年节能率
                totalWaterSum: '', // 累计用水量
                currentYearWaterSum: '', // 年用水量
            },
        };
    },
    created() { },
    beforeDestroy() {
        if (this.ws) this.ws.close();
        this.ws = null;
        clearInterval(this.timer);
    },
    computed: {
        yearToal: function () {
            if (this.overviewData.electric && this.overviewData.electric.currentSum) {
                const tempNum = new Big(this.overviewData.electric.currentSum);
                // return tempNum.div(1000).toFixed(3);
                return tempNum.div(1000);
            } else return '0';
        },
        allRate: function () {
            if (this.overviewData.electric && this.overviewData.electric.allRate) {
                // return this.overviewData.electric.allRate.toFixed(2);
                return this.overviewData.electric.allRate;
            } else return '0';
        },
        yearRate: function () {
            if (this.overviewData.electric && this.overviewData.electric.yearRate) {
                // return this.overviewData.electric.yearRate.toFixed(2);
                return this.overviewData.electric.yearRate;
            } else return '0';
        },
        electricSaveTotal: function () {
            if (this.overviewData.electric && this.overviewData.electric.all) {
                const tempNum = new Big(this.overviewData.electric.all);
                // return tempNum.div(1000).toFixed(3);
                return tempNum.div(1000);
            } else return '0';
        },
        electricYearSave: function () {
            if (this.overviewData.electric && this.overviewData.electric.year) {
                const tempNum = new Big(this.overviewData.electric.year);
                // return tempNum.div(1000).toFixed(3);
                return tempNum.div(1000);
            } else return '0';
        },
        waterSaveTotal: function () {
            if (this.overviewData.water && this.overviewData.water.all) {
                const tempNum = new Big(this.overviewData.water.all);
                // return tempNum.div(1000).toFixed(3);
                return tempNum.div(1000);
            } else return '0';
        },
        waterYearSave: function () {
            if (this.overviewData.water && this.overviewData.water.year) {
                const tempNum = new Big(this.overviewData.water.year);
                // return tempNum.div(1000).toFixed(3);
                return tempNum.div(1000);
            } else return '0';
        },
        displayData() {
            if (this.totalData.enable === 1) {
                // 假数据启用时，直接用 totalData
                return this.totalData;
            } else {
                // 正常情况，转 computed 计算出来的展示值
                return {
                    enable: 0,
                    currentYearElectricSum: this.yearToal,
                    totalSaveElectricSum: this.electricSaveTotal,
                    totalSaveElectricRatio: this.allRate,
                    currentYearSaveElectricSum: this.electricYearSave,
                    currentYearSaveElectricRatio: this.yearRate,
                    totalWaterSum: this.waterSaveTotal,
                    currentYearWaterSum: this.waterYearSave,
                };
            }
        },
        getUserName() {
            const { user, roles } = this.$store.getters;
            if (roles.length <= 0) roles.push({});
            return `${user.userName}`;
        },
    },
    watch: {},
    mounted() {
        this.init();
    },
    methods: {
        init() {
            // let myChart = this.$echarts.init(document.getElementById('bar_chart'));
            // myChart.setOption(this.option);
            // window.onresize = myChart.resize;
            this.headerInfoWebSocket();
            //能耗走势
            this.getEnergyTrendData(this.topRadioVal);
            // 区域月度用能
            this.getMonthAreaUsageData(this.topRadioVal);
            // 分项月度用能占比
            this.getMonthSystemUsageData(this.bottomRadioVal);
            //各层用能数据
            this.getFloorUsageData();
            //设备维保信息
            this.getMaintenceData();
            //统计数据
            this.getEditTotalData();
        },
        totalClick() {
            this.$router.push('accountListManagement');
        },
        repairClick() {
            this.$router.push({ name: 'repairWorkOrder', params: { orderStatus: '1' } });
        },
        upkeepClick() {
            this.$router.push({ name: 'upkeepWorkOrder', params: { status: '0' } });
        },
        getTotalData() {
            getOverviewData().then((res) => {
                if (res.code === 200 && res.data && Object.keys(res.data).length > 0) this.overviewData = res.data;
            });
        },
        getMaintenceData() {
            getDeviceMaintenanceData().then((res) => {
                if (res.code === 200 && res.data && Object.keys(res.data).length > 0) this.maintanceData = res.data;
            });
        },
        getFloorUsageData() {
            getAreaData().then((res) => {
                if (res.code === 200 && res.data) {
                    this.tabItemList = res.data;
                    this.tabItemList.forEach((v) => {
                        v.realVal = 0;
                    });
                    this.realTimeWebSocket();
                }
            });
        },
        getMonthAreaUsageData(energyType) {
            fetchMonthUsageRank(energyType).then((res) => {
                if (res.code === 200 && res.data.length > 0) this.centerData = res.data;
            });
        },
        getMonthSystemUsageData(energyType) {
            fetchMonthSystemUsage(energyType).then((res) => {
                if (res.code === 200 && res.data.length > 0) {
                    this.bottomData = res.data;
                    const total = res.data.reduce((sum, item) => {
                            const value = Number(Object.values(item)[0]) || 0;
                            return sum + value;
                        }, 0);
                    this.bottomTotalNum = total ? total.toFixed(2) : 0;
                    // this.bottomTotalNum = total ? total : 0;
                }
            });
        },
        realTimeWebSocket() {
            let that = this;
            const tempPoints = this.tabItemList.map((v) => {
                const tempArr = [];
                tempArr.concat(v.pointId);
                return tempArr;
            });
            if (tempPoints.length > 0) {
                const url = `wss://${location.hostname + ':' + location.port}/websocket/cacheThemePointDataWebSocket/-1`;
                // const url = 'ws://192.168.2.152:6103/cacheThemePointDataWebSocket/-1'
                that.ws = new WebSocket(url);
                that.ws.onopen = function () {
                    that.ws.send(tempPoints.toString(','));
                    that.timer = setInterval(() => {
                        that.ws.send(tempPoints.toString(','));
                    }, 10000);
                };
                that.ws.onmessage = function (res) {
                    const result = JSON.parse(res.data);
                    if (Object.keys(result).length > 0) that.serializeData(result);
                };
            }
        },
        serializeData(data) {
            for (let k in data) {
                that.tabItemList.forEach((v) => {
                    if (v.pointId.length > 0) {
                        let realVal = new Big(0);
                        v.pointId.forEach((w) => {
                            if (w === k) realVal.plus(new Big(data[k].value));
                        });
                        v.realVal = realVal;
                    }
                });
            }
        },
        headerInfoWebSocket() {
            const ws = getWebSocket('custom/homePage');
            ws.setMessage((res) => {
                const data = JSON.parse(res.data);
                if (data.length > 0) this.eventList = data;
            });
            ws.init();
            this.$once('hook:beforeDestroy', () => ws.getWS().close());
        },
        tabClick(index) {
            this.activeIndex = index;
            if (index === 1) {
                this.imgSrc = img2;
            } else if (index === 2) this.imgSrc = img1;
            else this.imgSrc = img3;
        },
        topRadioChange(e) {
            this.getEnergyTrendData(e);
            this.dataType = e;
        },
        centerRadioChange(e) {
            this.getMonthAreaUsageData(e);
            this.dataType1 = e;
        },
        bottomRadioChange(e) {
            this.getMonthSystemUsageData(e);
        },
        getEnergyTrendData(data) {
            fetchEnergyTrend(data).then((res) => {
                if (res.code === 200 && res.data.length > 0) {
                    this.topData = res.data;
                    const total = res.data.reduce((sum, item) => {
                            return sum + (Number(item) || 0);
                        }, 0)
                    // this.topTotalNum = total ? total.toFixed(2) : '--';
                    this.topTotalNum = total ? total : '--';
                }
            });
        },

        // 统计数据-点击事件
        // 获取统计数据
        getEditTotalData() {
            getEditOverviewData().then((res) => {
                if (res.code === 200 && res.data) {
                    this.totalData = res.data;
                    if (res.data.enable === 0) {
                        this.getTotalData();
                    }
                } else {
                    this.getTotalData();
                }
            });
        },
        startEdit() {
            this.isEditing = !this.isEditing;

            this.totalData = this.displayData; // 直接用计算属性的值
        },
        saveData() {
            // 保存输入的值
            this.totalData.enable = this.totalData.enable == 0 ? 1 : 0;
            console.log(this.totalData, 'totalData');
            editOverviewData(this.totalData).then((res) => {
                if (res.code === 200) {
                    this.isEditing = false;
                    this.getEditTotalData(); // 重新获取数据
                }
            });
        },
    },
};
</script>

<style lang="scss" scoped>
#radar_chart {
    width: 100%;
    // height: calc(100% - 682px);
    overflow: hidden;
}

.content_warp {
    width: 100%;
    height: 100%;

    .content_title {
        display: block;
        width: 223px;
        height: 27px;
        line-height: 27px;
        text-indent: 20px;
        background-image: url(../../assets/img/title_bg.png);
        color: #fff;
    }

    .left_warp {
        width: calc((100% - 870px) / 2);
        height: 100%;
        float: left;

        >div:first-child,
        >div:nth-child(3) {
            height: calc((100% - 352px) / 2);
        }

        >div:nth-child(2) {
            height: 332px;
            margin: 10px 0;
        }
    }

    .center_warp {
        width: 870px;
        height: 100%;
        float: left;
        border-radius: 6px;

        .left_top {
            border: 2px solid;
            border-radius: 10px;
            // height: 630px;
            // height: 66.5%;
            // height: calc(100% - 332px);
            height: calc(100% - (100% - 330px) / 2);
            border-image: linear-gradient(#23cfe7, #597ffb) 1;
            clip-path: inset(0 round 5px);
            text-align: center;
            margin: 0 15px;
            //
            border: 2px solid transparent;
            border-radius: 10px;
            background-clip: padding-box, border-box;
            background-origin: padding-box, border-box;
            background-image: linear-gradient(to right, #1e2a45, #1e2a45), linear-gradient(#23cfe7, #597ffb);

            //
            img {
                width: 751px;
                // height: 441px;
                height: 75%;
                margin: auto;
            }
        }

        .left_bottom {
            display: flex;
            justify-content: space-between;
            // height: calc(100% - 645px);
            // height: calc(33.33% - 15px);
            height: calc((100% - 352px) / 2);
            margin-top: 10px;

            .left_bottom_left {
                width: calc(100% - 30px);
                border-radius: 10px;
                background-color: #1e2a45;
                border-color: #1e2a45;
                margin: 0 15px;

                .el-card__body {
                    display: flex;
                }

                .number_box:nth-child(3) {
                    margin-top: 16px;
                }

                .number_box {
                    display: flex;
                    justify-content: space-evenly;
                    color: #fff;
                    height: calc(100% - 30px);

                    .number_item {
                        padding: 6px;
                        text-align: center;
                        padding-top: 20px;
                    }

                    .number_item>div:nth-child(3) {
                        margin-top: 25px;
                    }

                    // >.number_item:nth-child(1) {
                    // width: 125px;
                    // padding-top: 50px;
                    // }

                    // >.number_item:nth-child(2) {
                    // width: 125px;
                    // }

                    >.number_item:nth-child(2) {
                        .number_text {
                            color: #778aff;
                        }
                    }

                    >.number_item:nth-child(3) {
                        .number_text {
                            color: #f8ea95;
                        }
                    }

                    .number_text {
                        color: #52dff7;
                        font-size: 18px;
                        font-weight: bold;
                    }

                    .number_unit {
                        font-size: 12px;
                    }

                    .number_name,
                    .number_tips {
                        font-size: 16px;
                    }
                }
            }
        }

        .tab_warp {
            display: flex;
            justify-content: space-around;
            margin-top: 20px;

            .tab_item {
                cursor: pointer;

                .threshold_text {
                    // margin: 8px 0;
                }

                >p:nth-child(n + 2) {
                    // padding-left: 70px;
                    text-align: left;
                }

                .tab_item_name {
                    // color: linear-gradient(#23CFE7, #597FFB) 1;
                    background: linear-gradient(to bottom, #23cfe7, #597ffb);
                    -webkit-background-clip: text;
                    color: transparent;
                    margin-bottom: 15px;

                    i.active {
                        background: linear-gradient(to bottom, #23cfe7, #597ffb);
                    }

                    i {
                        display: inline-block;
                        width: 12px;
                        height: 12px;
                        border-radius: 6px;
                        background: linear-gradient(to bottom, #f1f1f1, #403d3d);
                        vertical-align: middle;
                        margin-right: 10px;
                    }

                    span {
                        display: inline-block;
                        font-size: 20px;
                        font-weight: bold;
                        vertical-align: middle;
                        color: #fff;
                    }
                }

                .tab_item_name.active {
                    span {
                        background: linear-gradient(180deg, #23cfe7, #597ffb);
                        -webkit-background-clip: text;
                        color: transparent;
                    }
                }
            }
        }

        .top_chart_box,
        .center_chart_box,
        .bottom_chart_box {
            position: relative;
        }

        .top_chart_box,
        .bottom_chart_box {
            height: calc((100% - 344px) / 2);
        }

        .center_chart_box {
            margin-top: 12px;
            margin-bottom: 12px;
        }
    }

    .radioBox {
        // position: absolute;
        // top: 20px;
        // right: 30px;
        margin-top: 15px;
    }

    .right_warp {
        width: calc((100% - 870px) / 2);
        height: 100%;
        float: right;
        // border-radius: 6px;
        // box-shadow: 0 2px 12px 0 #091a3b;
        padding: 0 20px 0 0;

        .right_top_warp {
            padding: 12px;
            height: calc((100% - 352px) / 2);
            background-color: #1e2a45;
            border-radius: 10px;
        }

        .right_center_warp {
            padding: 12px;
            height: 332px;
            margin: 10px 0;
            background-color: #1e2a45;
            border-radius: 10px;
        }

        .right_bottom_warp {
            height: calc((100% - 352px) / 2);
            background-color: #1e2a45;
            border-radius: 10px;
        }

        .left_bottom_right {
            width: 100%;
            height: 100%;
            border-radius: 6px;
            background-color: #1e2a45;
            border-color: #1e2a45;

            .table_title {
                color: #2f85ff;
                font-size: 16px;
            }

            .table_head {
                display: flex;
                justify-content: space-around;
                margin-top: 6px;
                border-bottom: 1px solid #5a87a9;
                padding-bottom: 4px;
            }

            p.table_tr {
                color: #fff;
                display: flex;
                justify-content: space-around;
            }

            p.table_tr>span:first-child {
                display: block;
                width: 155px;
                padding-right: 20px;
                border-right: 1px solid #5a87a9;
                display: inline-block;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                text-align: center;
            }

            p.table_tr>span {
                padding: 2px 0;
            }
        }

        #bar_chart {
            width: 100%;
            height: calc(100% - 27px);
            overflow: hidden;
            background-color: #1e2a45;
        }

        .right_top_box {
            display: flex;
            justify-content: space-around;
            flex-wrap: wrap;
            padding: 10px;
            margin: 10px 0 0 0;
            background-color: #1e2a45;
            height: calc(100% - 30px);

            .number_item {
                width: 50%;
                text-align: center;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
            }

            .number_text {
                font-size: 22px;
                font-weight: bold;
            }

            .number_item>p:nth-child(2) {
                padding-top: 0px;
            }

            >.number_item:nth-child(2) {
                .number_text {
                    color: #f8ea95;
                }
            }

            >.number_item:nth-child(3) {
                .number_text {
                    color: #52dff7;
                }
            }

            >.number_item:nth-child(4) {
                .number_text {
                    color: orange;
                }
            }

            >.number_item:nth-child(3),
            >.number_item:nth-child(4) {
                margin-top: 24px;
            }

            >.number_item:first-child {
                .number_text {
                    color: #02c2ae;
                }
            }
        }

        .process_box {
            display: flex;
            flex-wrap: wrap;
            padding-top: 10px;

            >div {
                display: flex;
                flex-direction: column;
                flex-wrap: wrap;
                align-content: center;
                justify-content: center;
                align-items: center;
                flex: 1 1 50%;
                margin-top: 10px;

                >span {
                    padding-top: 5px;
                }
            }
        }
    }
}

::v-deep {
    .number_text .el-input__inner {
        width: 140px;
    }
}

::v-deep {
    .el-card.is-always-shadow {
        // box-shadow: 0 2px 12px 0 #091a3b;
    }

    .el-card {
        // background-color: #1e2a45 !important;
        border: none !important;
        border-radius: 10px;
    }

    .el-card__body {
        padding: 12px;
        height: 100%;
        color: #fff;
    }

    .el-progress__text {
        color: #fff !important;
        font-size: 32px !important;
        font-weight: bold;
        font-family: windows LCD;
    }

    .el-progress-circle {
        width: 100px !important;
        height: 100px !important;
    }

    .el-radio {
        color: #fff !important;
    }
}

.eventTable {
    height: 140px;
    overflow-y: auto;
    padding: 10px 0 0 0;
}

@media (min-height: 1080px) {
    .content_warp .center_warp .left_top img {
        margin-top: 20px;
    }
}
</style>
