<!-- 能耗总览 -->
<template>
  <section class="container_warp">
    <section class="container_box">
      <el-divider class="curDivider" direction="vertical" />
      <wl-main-container data-title="能耗总览">
        <div class="top_btn">
          <!--时间类型选择-->
          <el-radio-group v-model="queryFormData.dateType" @change="timeTypeChange">
            <el-radio label="year">年</el-radio>
            <el-radio label="month">月</el-radio>
            <el-radio label="day">日</el-radio>
          </el-radio-group>
          <el-form class="table-view-query-form form" :inline="true" ref="queryForm" :model="queryFormData">
            <!--时间选择-->
            <el-form-item label="时间" prop="select">
              <el-date-picker ref="dateChose" id="dateChose" v-model="queryFormData.date" :type="periodTimeType"
                :format="datePickFormat" :value-format="datePickFormat" placeholder="选择时间" :clearable="false">
              </el-date-picker>
            </el-form-item>
            <!--查询/重置-->
            <el-form-item>
              <el-button type="primary" round icon="el-icon-search"
                @click="handleTableFormQuery(queryFormData)">查询</el-button>
              <el-button type="primary" round icon="el-icon-refresh-left"
                @click="handleQueryFormReset(queryFormData)">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <!--4个能耗类型-->
        <el-row justify="start">
          <!--用电-->
          <el-col :class="act_elc ? 'act_elc electric mid_block' : 'electric mid_block'">
            <div class="container" @click="electricClick">
              <div class="block_top">
                <div class="block_top_left">
                  <img :src="act_elc
                    ? electricIconFocus
                    : electricIcon
                    " alt="" />
                </div>
                <div class="block_top_right">
                  <p>本{{ timeName }}用电</p>
                  <p>{{ current.ENERGY_ELECTRIC || 0 }}kWh</p>
                </div>
              </div>
              <div class="block_mid">
                <span>同比</span>
                <span>{{ tb.ENERGY_ELECTRIC || 0 }}kWh</span>
                <span v-if="tbCompareData.ENERGY_ELECTRIC">
                  <img :src="tbCompareData.ENERGY_ELECTRIC > 0
                    ? arrowTop
                    : arrowBot
                    " alt="" />
                </span>
                <span>{{
                  tbCompareData.ENERGY_ELECTRIC < 0 ? tbCompareData.ENERGY_ELECTRIC.toString().substring(1) :
                    tbCompareData.ENERGY_ELECTRIC || "-" }}%</span>
              </div>
              <div class="block_bot">
                <span>环比</span>
                <span>{{ hb.ENERGY_ELECTRIC || 0 }}kWh</span>
                <span v-if="hbCompareData.ENERGY_ELECTRIC">
                  <img :src="hbCompareData.ENERGY_ELECTRIC > 0
                    ? arrowTop
                    : arrowBot
                    " alt="" />
                </span>
                <span>{{
                  hbCompareData.ENERGY_ELECTRIC < 0 ? hbCompareData.ENERGY_ELECTRIC.toString().substring(1) :
                    hbCompareData.ENERGY_ELECTRIC || "-" }}%</span>
              </div>
            </div>
          </el-col>
          <!--用水-->
          <el-col :class="act_water ? 'act_water water mid_block' : 'water mid_block'">
            <div @click="waterClick">
              <div class="block_top">
                <div class="block_top_left">
                  <img :src="act_water ? waterIconFocus : waterIcon
                    " alt="" />
                </div>
                <div class="block_top_right">
                  <p>本{{ timeName }}用水</p>
                  <p>{{ current.ENERGY_WATER || 0 }}t</p>
                </div>
              </div>
              <div class="block_mid">
                <span>同比</span>
                <span>{{ tb.ENERGY_WATER || 0 }}t</span>
                <span v-if="tbCompareData.ENERGY_WATER">
                  <img :src="tbCompareData.ENERGY_WATER > 0
                    ? arrowTop
                    : arrowBot
                    " alt="" />
                </span>
                <span>{{
                  tbCompareData.ENERGY_WATER < 0 ? tbCompareData.ENERGY_WATER.toString().substring(1) :
                    tbCompareData.ENERGY_WATER || "-" }}%</span>
              </div>
              <div class="block_bot">
                <span>环比</span>
                <span>{{ hb.ENERGY_WATER || 0 }}t</span>
                <span v-if="hbCompareData.ENERGY_WATER">
                  <img :src="hbCompareData.ENERGY_WATER > 0
                    ? arrowTop
                    : arrowBot
                    " alt="" />
                </span>
                <span>{{
                  hbCompareData.ENERGY_WATER < 0 ? hbCompareData.ENERGY_WATER.toString().substring(1) :
                    hbCompareData.ENERGY_WATER || "-" }}%</span>
              </div>
            </div>
          </el-col>
          <!--用热-->
          <el-col :class="act_heat ? 'act_heat heat mid_block' : 'heat mid_block'">
            <div @click="heatClick">
              <div class="block_top">
                <div class="block_top_left">
                  <img
                    :src="act_heat ? heatIconFocus : heatIcon"
                    alt="" />
                </div>
                <div class="block_top_right">
                  <p>本{{ timeName }}用热</p>
                  <p>{{ current.ENERGY_HEAT || 0 }}GJ</p>
                </div>
              </div>
              <div class="block_mid">
                <span>同比</span>
                <span>{{ tb.ENERGY_HEAT || 0 }}GJ</span>
                <span v-if="tbCompareData.ENERGY_HEAT">
                  <img :src="tbCompareData.ENERGY_HEAT > 0
                    ? arrowTop
                    : arrowBot
                    " alt="" />
                </span>
                <span>{{ tbCompareData.ENERGY_HEAT < 0 ? tbCompareData.ENERGY_HEAT.toString().substring(1) :
                  tbCompareData.ENERGY_HEAT || "-" }}%</span>
              </div>
              <div class="block_bot">
                <span>环比</span>
                <span>{{ hb.ENERGY_HEAT || 0 }}GJ</span>
                <span v-if="hbCompareData.ENERGY_HEAT">
                  <img :src="hbCompareData.ENERGY_HEAT > 0
                    ? arrowTop
                    : arrowBot
                    " alt="" />
                </span>
                <span>{{ hbCompareData.ENERGY_HEAT < 0 ? hbCompareData.ENERGY_HEAT.toString().substring(1) :
                  hbCompareData.ENERGY_HEAT || "-" }}%</span>
              </div>
            </div>
          </el-col>
          <!--用气-->
          <el-col :class="act_gas ? 'act_gas gas mid_block' : 'gas mid_block'">
            <div @click="gasClick">
              <div class="block_top">
                <div class="block_top_left">
                  <img
                    :src="act_gas ? gasIconFocus : gasIcon"
                    alt="" />
                </div>
                <div class="block_top_right">
                  <p>本{{ timeName }}用气</p>
                  <p>{{ current.ENERGY_GAS || 0 }}m³</p>
                </div>
              </div>
              <div class="block_mid">
                <span>同比</span>
                <span>{{ tb.ENERGY_GAS || 0 }}m³</span>
                <span v-if="tbCompareData.ENERGY_GAS">
                  <img :src="tbCompareData.ENERGY_GAS > 0
                    ? arrowTop
                    : arrowBot
                    " alt="" />
                </span>
                <span>{{ tbCompareData.ENERGY_GAS < 0 ? tbCompareData.ENERGY_GAS.toString().substring(1) :
                  tbCompareData.ENERGY_GAS || "-" }}%</span>
              </div>
              <div class="block_bot">
                <span>环比</span>
                <span>{{ hb.ENERGY_GAS || 0 }}m³</span>
                <span v-if="hbCompareData.ENERGY_GAS">
                  <img :src="hbCompareData.ENERGY_GAS > 0
                    ? arrowTop
                    : arrowBot
                    " alt="" />
                </span>
                <span>{{ hbCompareData.ENERGY_GAS < 0 ? hbCompareData.ENERGY_GAS.toString().substring(1) :
                  hbCompareData.ENERGY_GAS || "-" }}%</span>
              </div>
            </div>
          </el-col>
        </el-row>
        <!--主体，图表部分-->
        <!--布局-->
        <el-container class="chartContainer">
          <el-main>
            <!--折线图-->
            <div class="lineTitle">
              <p>
                {{ curDate }} 用{{ energyTypeName }}
                <!-- <span>（截止{{ deadLine }}）</span> -->
              </p>
              <p>{{ lineTotal }}{{ lineUnit }}</p>
            </div>
            <div class="lineChart">
              <trendChart :data-option="trendChart" :data-type="energyType"></trendChart>
            </div>
            <!--三个柱状图-->
            <div class="barCharts">
              <!--本期-->
              <div class="cur">
                <div class="barChart1">
                  <p>
                    区域用{{ energyTypeName }}占比<span>（{{ lineUnit }}）</span><span>本期</span>
                  </p>
                </div>
                <barChart1 :data-option="barChart1" :data-option-tb="barTbChange" :data-option-hb="barHbChange"
                  :data-type="energyType" :category="'cur'"></barChart1>
              </div>

              <!--同比-->
              <div class="same">
                <div class="barChart2">
                  <p>
                    区域用{{ energyTypeName }}占比<span>（{{ lineUnit }}）</span><span>同比</span>
                  </p>
                </div>
                <barChart1 :data-option="barChart2" :data-type="energyType" :category="'tb'" :rateMap="barTbChange">
                </barChart1>
              </div>

              <!--环比-->
              <div class="ring_wj">
                <div class="barChart3">
                  <p>
                    区域用{{ energyTypeName }}占比<span>（{{ lineUnit }}）</span><span>环比</span>
                  </p>
                </div>
                <barChart1 :data-option="barChart3" :data-type="energyType" :category="'hb'" :rateMap="barHbChange">
                </barChart1>
              </div>
            </div>
          </el-main>
          <el-aside width="415px">
            <div class="pieCharts">
              <div class="pieChartsTitle">
                <span>分项用能对比</span>
                <img src="@/assets/icon/total_energy/arrow_left.png" alt="" />
              </div>
              <div class="cur">
                <div class="pieChart1">
                  <span>本期</span>
                </div>
                <pieChart1 :data-option="pieChart1" :pieTbChange="pieTbChange" :pieHbChange="pieHbChange">
                </pieChart1>
              </div>
              <div class="same">
                <div class="pieChart2">
                  <span>同比</span>
                </div>
                <pieChart1 :data-option="pieChart2" :rateMap="pieTbChange" rateLabel="同比"></pieChart1>
              </div>
              <div class="ring_wj">
                <div class="pieChart3">
                  <span>环比</span>
                </div>
                <pieChart1 :data-option="pieChart3" :rateMap="pieHbChange" rateLabel="环比"></pieChart1>
              </div>
            </div>
          </el-aside>
        </el-container>
      </wl-main-container>
    </section>
  </section>
</template>

<script>
import { getTotal, getSystemItem, getTrend, getAreaData } from "@/api/energyManagement"; //
import trendChart from "./charts/trendChart.vue";
import barChart1 from "./charts/barChart1.vue";
import pieChart1 from "./charts/pieChart1.vue";
import dayjs from "dayjs";
import Big from "big.js";
// 静态图标资源：原模板内 require() 在 Vite（ESM）下不可用，改为静态 import 后挂载到 data 供模板使用
import electricIconFocus from '@/assets/icon/total_energy/electric_icon_focus.png'
import electricIcon from '@/assets/icon/total_energy/electric_icon.png'
import waterIconFocus from '@/assets/icon/total_energy/water_icon_focus.png'
import waterIcon from '@/assets/icon/total_energy/water_icon.png'
import heatIconFocus from '@/assets/icon/total_energy/heat_icon_focus.png'
import heatIcon from '@/assets/icon/total_energy/heat_icon.png'
import gasIconFocus from '@/assets/icon/total_energy/gas_icon_focus.png'
import gasIcon from '@/assets/icon/total_energy/gas_icon.png'
import arrowTop from '@/assets/icon/total_energy/arrow_top.png'
import arrowBot from '@/assets/icon/total_energy/arrow_bot.png'

export default {
  components: { pieChart1, trendChart, barChart1 },
  data() {
    return {
      act_elc: true,
      act_water: false,
      act_heat: false,
      act_gas: false,
      // 图标资源（由顶部 import 提供，供模板 :src 绑定使用）
      electricIconFocus,
      electricIcon,
      waterIconFocus,
      waterIcon,
      heatIconFocus,
      heatIcon,
      gasIconFocus,
      gasIcon,
      arrowTop,
      arrowBot,
      queryFormData: {
        dateType: "day",
        date: dayjs(new Date()).format("YYYY-MM-DD"),
        energyType: "ENERGY_ELECTRIC",
      },
      periodTimeType: "date",
      timeArr: [],
      datePickFormat: "yyyy-MM-dd",
      timeName: "日",
      current: {
        ENERGY_ELECTRIC: 0,
        ENERGY_GAS: 0,
        ENERGY_HEAT: 0,
        ENERGY_WATER: 0,
      },
      hb: {
        ENERGY_ELECTRIC: 0,
        ENERGY_GAS: 0,
        ENERGY_HEAT: 0,
        ENERGY_WATER: 0,
      },
      hbCompareData: {
        ENERGY_ELECTRIC: 0,
        ENERGY_GAS: 0,
        ENERGY_HEAT: 0,
        ENERGY_WATER: 0,
      },
      tb: {
        ENERGY_ELECTRIC: 0,
        ENERGY_GAS: 0,
        ENERGY_HEAT: 0,
        ENERGY_WATER: 0,
      },
      tbCompareData: {
        ENERGY_ELECTRIC: 0,
        ENERGY_GAS: 0,
        ENERGY_HEAT: 0,
        ENERGY_WATER: 0,
      },
      pieChart1: {},
      pieChart2: {},
      pieChart3: {},
      pieTbChange: {},
      pieHbChange: {},
      barChart1: {},
      barChart2: {},
      barChart3: {},
      barTbChange: {},
      barHbChange: {},
      trendChart: {},
      energyType: "",
      energyTypeName: "电",
      lineTotal: "",
      curTotal: "",
      lineUnit: "kWh",
      barData: {},
      pieData: {},
      deadLine: "",
    };
  },

  computed: {
    curDate() {
      // 当前选中日期
      if (this.periodTimeType === "year") {
        return this.queryFormData.date + "年";
      } else if (this.periodTimeType === "month") {
        let selectedDate = this.queryFormData.date;
        let dateObj = new Date(selectedDate);
        let year = dateObj.getFullYear();
        let month = dateObj.getMonth() + 1;
        return year + "年" + month + "月";
      } else {
        let selectedDate = this.queryFormData.date;
        let dateObj = new Date(selectedDate);
        let year = dateObj.getFullYear();
        let month = dateObj.getMonth() + 1;
        let date = dateObj.getDate();
        return year + "年" + month + "月" + date + "日";
      }
    },
  },

  mounted() {
    this.init();
  },

  methods: {
    init() {
      this.getData(this.queryFormData);
      this.loadItemEnergy(this.queryFormData);
      this.loadAreaData(this.queryFormData);
      this.loadTodayTrend(this.queryFormData);
      let myDate = new Date();
      let h = myDate.getHours();
      this.deadLine = dayjs(new Date()).subtract(1, "hour").format("HH") + ":00";
    },
    // 总能耗
    getData(data) {
      //currentTotal，各能耗类型 总能耗
      //everyTime，今日用能 折线图
      //areaEnergy，区域能耗
      //systemEnergy，分项用能占比
      getTotal(data).then((res) => {
        if (res.code == 200) {
          //初始化，默认的是用电的相关信息
          let totalData = res.data;
          this.current = totalData.current;
          this.hb = totalData.hb;
          this.hbCompareData = totalData.hbCompareData;
          this.tb = totalData.tb;
          this.tbCompareData = totalData.tbCompareData;
          //折线图数据trendChart
          // this.trendChart = res.data.everyTime;
          // this.energyType = this.queryFormData.energyType;
          // //折线本期值总值
          // let curE = res.data.everyTime.current[this.energyType];
          // this.curTotal = res.data.everyTime.current;
          // this.lineTotal = this.sumValue(curE);
          //bar
          // this.barData = res.data.areaEnergy;
          // this.barChart1 = res.data.areaEnergy.current[this.energyType];
          // this.barChart2 = res.data.areaEnergy.tb[this.energyType];
          // this.barChart3 = res.data.areaEnergy.hb[this.energyType];
          //pie
          // this.pieData = res.data.systemEnergy;
          // this.pieChart1 = res.data.systemEnergy.current[this.energyType];
          // this.pieChart2 = res.data.systemEnergy.tb[this.energyType];
          // this.pieChart3 = res.data.systemEnergy.hb[this.energyType];
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 分项能耗
    loadItemEnergy(data) {
      getSystemItem(data).then((res) => {
        if (res.code == 200) {
          this.pieData = res.data;
          this.pieChart2 = res.data.tb;
          this.pieChart3 = res.data.hb;
          this.pieTbChange = res.data.tbChange;
          this.pieHbChange = res.data.hbChange;
          this.pieChart1 = res.data.current;
        }
      });
    },
    // 今日能耗趋势
    loadTodayTrend(data) {
      getTrend(data).then((res) => {
        if (res.code == 200) {
          this.trendChart = res.data;
          this.energyType = this.queryFormData.energyType;
          //折线本期值总值
          let curE = res.data.current;
          this.curTotal = res.data.current;
          this.lineTotal = this.sumValue(curE);
        }
      });
    },
    // 区域能耗数据
    loadAreaData(data) {
      getAreaData(data).then((res) => {
        if (res.code == 200) {
          this.barData = res.data;
          this.barChart1 = res.data.current;
          this.barChart2 = res.data.tb;
          this.barChart3 = res.data.hb;
          this.barTbChange = res.data.tbChange;
          this.barHbChange = res.data.hbChange;
        }
      });
    },
    timeTypeChange(data) {
      console.log(data);
      switch (data) {
        case "year":
          this.year();
          break;
        case "month":
          this.month();
          break;
        case "day":
          this.day();
          break;
        default:
          break;
      }
    },
    day() {
      this.periodTimeType = "date";
      this.queryFormData.dateType = "day";
      this.datePickFormat = "yyyy-MM-dd";
      this.queryFormData.date = dayjs(new Date()).format("YYYY-MM-DD");
    },
    month() {
      this.periodTimeType = "month";
      this.queryFormData.dateType = "month";
      this.datePickFormat = "yyyy-MM";
      this.queryFormData.date = dayjs(new Date()).format("YYYY-MM");
    },
    year() {
      this.periodTimeType = "year";
      this.queryFormData.dateType = "year";
      this.datePickFormat = "yyyy";
      this.queryFormData.date = dayjs(new Date()).format("YYYY");
    },
    //查询
    handleTableFormQuery(data) {
      if (this.periodTimeType == "year") {
        this.timeName = "年";
        // this.queryFormData.date = dayjs(new Date()).format("YYYY");
      }
      if (this.periodTimeType == "month") {
        this.timeName = "月";
      }
      if (this.periodTimeType == "date") {
        this.timeName = "日";
      }

      this.getData(data);
      this.loadAreaData(data);
      this.loadItemEnergy(data);
      this.loadTodayTrend(data);
    },
    //重置
    handleQueryFormReset(data) {
      this.electricClick();
      this.queryFormData.dateType = "day";
      this.datePickFormat = "yyyy-MM-dd";
      this.queryFormData.date = dayjs(new Date()).format("YYYY-MM-DD");
      this.queryFormData.energyType = "ENERGY_ELECTRIC";
      this.handleTableFormQuery(this.queryFormData);
      this.periodTimeType = "date";
      this.timeName = "日";
    },
    //用电点击
    electricClick() {
      if (this.act_elc == false) {
        this.act_elc = true;
        this.act_water = false;
        this.act_heat = false;
        this.act_gas = false;
        this.queryFormData.energyType = "ENERGY_ELECTRIC";
        //line
        this.energyType = "ENERGY_ELECTRIC";
        this.energyTypeName = "电";
        let lineData = this.curTotal.ENERGY_ELECTRIC;
        this.lineTotal = this.sumValue(lineData);
        this.lineUnit = "kWh";
        //bar
        this.barChart1 = this.barData.current.ENERGY_ELECTRIC;
        this.barChart2 = this.barData.tb.ENERGY_ELECTRIC;
        this.barChart3 = this.barData.hb.ENERGY_ELECTRIC;
        //pie
        this.pieChart1 = this.pieData.current.ENERGY_ELECTRIC;
        this.pieChart2 = this.pieData.tb.ENERGY_ELECTRIC;
        this.pieChart3 = this.pieData.hb.ENERGY_ELECTRIC;
        this.getData(this.queryFormData);
        this.loadAreaData(this.queryFormData);
        this.loadItemEnergy(this.queryFormData);
        this.loadTodayTrend(this.queryFormData);
      }
    },
    waterClick() {
      if (this.act_water == false) {
        this.act_water = true;
        this.act_elc = false;
        this.act_heat = false;
        this.act_gas = false;
        this.queryFormData.energyType = "ENERGY_WATER";
        //line
        this.energyType = "ENERGY_WATER";
        this.energyTypeName = "水";
        let lineData = this.curTotal.ENERGY_WATER;
        this.lineTotal = this.sumValue(lineData);
        this.lineUnit = "t";
        //bar
        this.barChart1 = this.barData.current.ENERGY_WATER;
        this.barChart2 = this.barData.tb.ENERGY_WATER;
        this.barChart3 = this.barData.hb.ENERGY_WATER;
        //pie
        this.pieChart1 = this.pieData.current.ENERGY_WATER;
        this.pieChart2 = this.pieData.tb.ENERGY_WATER;
        this.pieChart3 = this.pieData.hb.ENERGY_WATER;
        this.getData(this.queryFormData);
        this.loadAreaData(this.queryFormData);
        this.loadItemEnergy(this.queryFormData);
        this.loadTodayTrend(this.queryFormData);
      }
    },
    heatClick() {
      if (this.act_heat == false) {
        this.act_water = false;
        this.act_elc = false;
        this.act_heat = true;
        this.act_gas = false;
        this.queryFormData.energyType = "ENERGY_HEAT";
        //line
        this.energyType = "ENERGY_HEAT";
        this.energyTypeName = "热";
        let lineData = this.curTotal.ENERGY_HEAT;
        this.lineTotal = this.sumValue(lineData);
        this.lineUnit = "GJ";
        //bar
        this.barChart1 = this.barData.current.ENERGY_HEAT;
        this.barChart2 = this.barData.tb.ENERGY_HEAT;
        this.barChart3 = this.barData.hb.ENERGY_HEAT;
        //pie
        this.pieChart1 = this.pieData.current.ENERGY_HEAT;
        this.pieChart2 = this.pieData.tb.ENERGY_HEAT;
        this.pieChart3 = this.pieData.hb.ENERGY_HEAT;
        this.getData(this.queryFormData);
        this.loadAreaData(this.queryFormData);
        this.loadItemEnergy(this.queryFormData);
        this.loadTodayTrend(this.queryFormData);
      }
    },
    gasClick() {
      if (this.act_gas == false) {
        this.act_water = false;
        this.act_elc = false;
        this.act_heat = false;
        this.act_gas = true;
        this.queryFormData.energyType = "ENERGY_GAS";
        //line
        this.energyType = "ENERGY_GAS";
        this.energyTypeName = "气";
        let lineData = this.curTotal.ENERGY_GAS;
        this.lineTotal = this.sumValue(lineData);
        this.lineUnit = "m³";
        //bar
        this.barChart1 = this.barData.current.ENERGY_GAS;
        this.barChart2 = this.barData.tb.ENERGY_GAS;
        this.barChart3 = this.barData.hb.ENERGY_GAS;
        //pie
        this.pieChart1 = this.pieData.current.ENERGY_GAS;
        this.pieChart2 = this.pieData.tb.ENERGY_GAS;
        this.pieChart3 = this.pieData.hb.ENERGY_GAS;
        this.getData(this.queryFormData);
        this.loadAreaData(this.queryFormData);
        this.loadItemEnergy(this.queryFormData);
        this.loadTodayTrend(this.queryFormData);
      }
    },
    //趋势图
    sumValue(arr) {
      var sum = new Big(0);
      if (arr !== undefined && arr.length > 0) {
        arr.forEach(function (val, idx, arr) {
          let tempNum;
          if (val == null) tempNum = new Big(0);
          else tempNum = new Big(val);
          sum = tempNum.plus(sum).toFixed(2);
        }, 0);
      }
      return sum;
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./index.scss";

//
::v-deep(.th-main-title) {
  h2 {
    line-height: normal !important;
    margin-left: 20px !important;
  }
}

.el-form {
  margin-top: 0 !important;
}

.th-main-title {
  height: 50px !important;
}

.el-main {
  height: calc(100% - 50px) !important;
}

.curDivider {
  left: 13px;
  top: 3px;
}

//
.th-main-view {
  padding: 0;
}

.el-aside {
  padding-bottom: 0;
  padding-top: 0;
  padding-right: 20px;
}

.el-container {
  height: auto;
}
</style>
