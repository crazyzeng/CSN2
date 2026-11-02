<!-- 账单管理 -->
<template>
  <section class="container_warp">
    <section class="container_box">
      <el-divider class="curDivider" direction="vertical" />
      <wl-main-container data-title="账单管理">
        <div class="top_btn">
          <!--时间类型选择-->
          <el-radio-group v-model="queryFormData.dateType" @change="timeTypeChange">
            <el-radio label="year">年</el-radio>
            <el-radio v-if="tabLabelName === '电度电费'" label="month">月</el-radio>
          </el-radio-group>
          <el-form class="table-view-query-form form" :inline="true" ref="queryForm" :model="queryFormData">
            <!--时间选择-->
            <el-form-item label="时间" prop="select">
              <el-date-picker
                ref="dateChose"
                id="dateChose"
                v-model="queryFormData.date"
                :type="periodTimeType"
                :format="datePickFormat"
                :value-format="datePickFormat"
                placeholder="选择时间"
              >
              </el-date-picker>
            </el-form-item>
            <!--查询/重置-->
            <el-form-item>
              <el-button type="primary" round icon="el-icon-search" @click="handleTableFormQuery(queryFormData)">查询</el-button>
              <el-button type="primary" round icon="el-icon-refresh-left" @click="handleQueryFormReset(queryFormData)">重置</el-button>
            </el-form-item>
            <el-form-item class="addPlan" v-show="tabLabelName == '电度电费' || tabLabelName == '基本电费'">
              <el-button class="border-btn b-b-b" type="primary" round icon="el-icon-document-add" @click="addPlan(tabLabelName)">添加计价计划</el-button>
            </el-form-item>
          </el-form>
        </div>
        <!-- <el-tabs :tab-position="tabPosition" type="border-card" style="height: 100%" @tab-click="tabClick">
          <el-tab-pane label="电度电费" lazy> -->
        <el-row class="electric_degree">
          <div class="container">
            <div class="container1">
              <img src="@/assets/img/bills/electric_icon.png" alt="" />
              <span>总电费/元</span>
              <p>{{ totalCost }}</p>
            </div>
          </div>
          <div class="container" v-for="(item, index) in infoList" :key="item.intervalType">
            <!-- {{ index }} -->
            <div :class="`container${index + 2}`">
              <div class="block">{{ item.intervalType + "时段" }}</div>
              <span>电价：{{ priceList[item.intervalType] }}元</span>
              <div class="bot_data">
                <div>
                  <p>{{ item.totalElectricityAmount }}</p>
                  <p>电费/元</p>
                </div>
                <div>
                  <p>{{ costPercent(item.totalElectricityAmount) }}</p>
                  <p>电费占比</p>
                </div>
                <div>
                  <p>{{ item.totalCost }}</p>
                  <p>用电量kWh</p>
                </div>
              </div>
            </div>
          </div>
        </el-row>
        <!-- <el-row> -->
        <div class="barChart1">
          <barChart1 :data-option="dataOption"></barChart1>
        </div>
        <!-- </el-row> -->
        <!-- </el-tab-pane> -->
        <!-- <el-tab-pane label="基本电费" lazy>
        <baseBill :dataDialog1Flag="dataDialog1Flag" :data-time="queryFormData.date" @dialog1Save="dialog1Save"
          @dialog1Cancel="dialog1Cancel" :searchResult="searchData">
        </baseBill>
      </el-tab-pane> -->
        <!-- <el-tab-pane label="力调电费" lazy>
                <otherBill :data-time="queryFormData.date" :searchResult="searchData"></otherBill>
            </el-tab-pane> -->
        <!-- </el-tabs> -->
        <addPrice :dataFlag="dataDialog2Flag" @dialog2Save="dialog2Save" @dialog2Cancel="dialog2Cancel"></addPrice>
      </wl-main-container>
    </section>
  </section>
</template>

<script>
import dayjs from "dayjs";
import Big from "big.js";
import barChart1 from "./charts/barChart1.vue";
import lineChart from "./charts/lineChart.vue";
import baseBill from "./baseBill.vue";
import otherBill from "./otherBill.vue";
import addPrice from "./dialog/dialog2.vue";
import { fetchBillData, fetchBaseBill, fetchAdjustmentData, fetchDegreeRule } from "@/api/bill-management.js";

export default {
  components: { barChart1, lineChart, baseBill, otherBill, addPrice },

  data() {
    return {
      //tab页面方向设置
      tabPosition: "left",
      queryFormData: {
        dateType: "month",
        date: dayjs(new Date()).format("YYYYMM"),
        energyType: "ENERGY_ELECTRIC",
      },
      searchData: {},
      infoList: [
        { intervalType: "尖", totalCost: 0, totalElectricityAmount: 0, ratio: 17 },
        { intervalType: "峰", totalCost: 0, totalElectricityAmount: 0, ratio: 17 },
        { intervalType: "平", totalCost: 0, totalElectricityAmount: 0, ratio: 17 },
        { intervalType: "谷", totalCost: 0, totalElectricityAmount: 0, ratio: 17 },
      ],
      totalCost: 0,
      //时间相关筛选
      periodTimeType: "month",
      timeArr: [],
      datePickFormat: "yyyyMM",
      timeName: "年",
      tabLabelName: "电度电费",
      dataDialog1Flag: false,
      dataDialog2Flag: false,
      dataOption: {
        xData: [],
        seriesData: [],
        seriesData1: [],
        seriesData2: [],
        seriesData3: [],
        unit: "",
      },
      priceList: {
        尖: 0,
        峰: 0,
        平: 0,
        谷: 0,
      },
    };
  },

  computed: {},

  mounted() {
    this.init();
  },

  methods: {
    init() {
      this.getData();
      this.getRule();
    },
    async getRule() {
      const res = await fetchDegreeRule();
      res.data.forEach((v) => {
        for (let k in this.priceList) if (v.ruleType === k) this.priceList[k] = v.price;
      });
    },
    getData() {
      if (this.tabLabelName === "基本电费") {
        fetchBaseBill(this.queryFormData.date).then((res) => {
          if (res && res.code === 200) this.searchData = res.data;
        });
      } else if (this.tabLabelName === "力调电费") {
        fetchAdjustmentData(this.queryFormData.date).then((res) => {
          if (res && res.code === 200) this.searchData = res.data;
        });
      } else {
        fetchBillData(this.queryFormData.date).then((res) => {
          if (res && res.code === 200) {
            if (res.data.infoList.length > 0) {
              this.infoList = res.data.infoList;
            } else {
              this.infoList = [
                { intervalType: "尖", totalCost: 0, totalElectricityAmount: 0, ratio: 17 },
                { intervalType: "峰", totalCost: 0, totalElectricityAmount: 0, ratio: 17 },
                { intervalType: "平", totalCost: 0, totalElectricityAmount: 0, ratio: 17 },
                { intervalType: "谷", totalCost: 0, totalElectricityAmount: 0, ratio: 17 },
              ];
            }
            this.totalCost = res.data.totalCost;
            if (Object.keys(res.data.data).length > 0) {
              this.dataOption.xData = res.data.data["尖"].map((v) => {
                return v.billDate;
              });
              this.dataOption.unit = this.queryFormData.dateType === "year" ? "(月)" : "(日)";
              this.dataOption.seriesData = res.data.data["尖"]?.map((v) => {
                return v.cost;
              });
              this.dataOption.seriesData1 = res.data.data["峰"]?.map((v) => {
                return v.cost;
              });
              this.dataOption.seriesData2 = res.data.data["平"]?.map((v) => {
                return v.cost;
              });
              this.dataOption.seriesData3 = res.data.data["谷"]?.map((v) => {
                return v.cost;
              });
            } else {
              this.dataOption.seriesData = [];
              this.dataOption.seriesData1 = [];
              this.dataOption.seriesData2 = [];
              this.dataOption.seriesData3 = [];
            }
          }
        });
      }
    },
    tabClick(tab, event) {
      this.tabLabelName = tab.label;
      if (this.tabLabelName !== "电度电费") {
        this.queryFormData.dateType = "year";
        this.year();
        this.queryFormData.date = dayjs(new Date()).format("YYYY");
      }
    },
    costPercent(val) {
      const v1 = new Big(val);
      const v2 = new Big(this.totalCost);
      if (v2 == 0) {
        return 0 + "%";
      } else {
        return v1.div(v2).times(100).toFixed(2) + "%";
      }
    },
    //查询
    handleTableFormQuery(data) {
      if (this.periodTimeType == "year") {
        this.timeName = "年";
        this.queryFormData.dateType = "year";
        this.datePickFormat = "yyyy";
      }
      if (this.periodTimeType == "month") {
        this.timeName = "月";
        this.queryFormData.dateType = "month";
        this.datePickFormat = "yyyyMM";
      }
      this.getData(data);
    },
    //重置
    handleQueryFormReset(data) {
      if (this.queryFormData.dateType === "year") {
        this.queryFormData.date = dayjs(new Date()).format("YYYY");
        this.queryFormData.dateType = "year";
        this.queryFormData.energyType = "ENERGY_ELECTRIC";
        this.year();
        this.handleTableFormQuery(this.queryFormData);
        this.timeName = "年";
      } else {
        this.queryFormData.date = dayjs(new Date()).format("YYYYMM");
        this.queryFormData.dateType = "month";
        this.queryFormData.energyType = "ENERGY_ELECTRIC";
        this.month();
        this.handleTableFormQuery(this.queryFormData);
      }
    },
    //添加计价规则
    addPlan(tabName) {
      console.log(tabName);
      if (tabName == "电度电费") this.dataDialog2Flag = true;
      if (tabName == "基本电费") this.dataDialog1Flag = true;
    },
    //时间类型选择
    timeTypeChange(data) {
      switch (data) {
        case "year":
          this.year();
          break;
        case "month":
          this.month();
          break;
        default:
          break;
      }
    },
    month() {
      this.periodTimeType = "month";
      this.queryFormData.dateType = "month";
      this.datePickFormat = "yyyyMM";
      this.queryFormData.date = dayjs(new Date()).format("YYYYMM");
    },
    year() {
      this.periodTimeType = "year";
      this.queryFormData.dateType = "year";
      this.datePickFormat = "yyyy";
      this.queryFormData.date = dayjs(new Date()).format("YYYY");
    },
    dialog1Save() {
      this.dataDialog1Flag = false;
    },
    dialog1Cancel() {
      this.dataDialog1Flag = false;
    },
    dialog2Save() {
      this.dataDialog2Flag = false;
    },
    dialog2Cancel() {
      this.dataDialog2Flag = false;
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-radio {
  color: #fff !important;
}

.theme-main > div {
  min-width: 1776px;
}

::v-deep {
  .el-tabs--border-card {
    background-color: transparent;
    border: none;
    background: #1e2a45;
    box-shadow: 4px 4px 7px 0px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
  }

  .el-tabs--left.el-tabs--border-card .el-tabs__header.is-left {
    border: none;
    box-shadow: 0px 0px 0px 4px rgba(0, 0, 0, 0.3);
    background-color: transparent;
  }

  .el-tabs--border-card > .el-tabs__header {
    border-bottom: none !important;
  }

  .el-tabs--left .el-tabs__nav.is-left {
    // height: 741px !important;
    height: 100% !important;
  }

  .el-tabs--left.el-tabs--border-card .el-tabs__item.is-left {
    border: 1px solid transparent;
    margin: -1px 0 -1px -1px;
    writing-mode: vertical-rl;
    height: 248px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    color: #fff;
  }

  .el-tabs--border-card > .el-tabs__header .el-tabs__item {
    background-color: #1e2a45;
  }

  .el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active {
    color: #2e6cd8;
    background-color: #1e2a45;
  }

  .el-button--primary {
    background: #2a3e62;
  }
}

.top_btn {
  position: absolute;
  top: 5px;
  left: 160px;
  background: transparent;
  border-radius: 14px;
  z-index: 999;
  width: calc(100% - 330px);
}

.top_btn_active {
  background: linear-gradient(to right, #13b1ff, #146ef9);
  color: #fff;
}

.form {
  position: relative;
  left: 150px;
  top: -25px;

  .el-button--primary {
    border: 1px solid #2a3e62;
    color: #fff;
    margin-left: 30px;
    font-size: 12px;
  }

  .addPlan {
    float: right;
    margin-right: 5px !important;
  }
}

.electric_degree {
  margin-top: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.container {
  display: flex;// inline-block
  justify-content: space-between;
  margin-top: 30px;
}

.container1 {
  // border-radius: 0px 60px 60px 0px;
  // background-image: url("@/assets/img//bills/top_bloack_bg1.png");
  // background-repeat: no-repeat;
  // background-size: 100% 100%;
  // background-position: 100% 100%;
  width: 310px;//340
  height: 160px;
  // margin-left: 20px;
  position: relative;
  background-color: #2a3e62;
  border-radius: 10px 0 0 10px;

  img {
    position: absolute;
    left: 32px;
    top: 25px;
  }

  span {
    position: absolute;
    left: 80px;
    top: 30px;
    font-size: 18px;
  }

  p {
    position: absolute;
    left: -20px;
    top: 80px;
    width: 100%;
    text-align: center;
    font-size: 30px;
    font-weight: bold;
    color: #45f0ff;
  }
}

.container2,
.container3,
.container4 {
  // border-radius: 0px 60px 60px 0px;
  // background-image: url("@/assets/img//bills/top_bloack_bg2.png");
  // background-repeat: no-repeat;
  // background-size: 100% 100%;
  // background-position: 100% 100%;
  width: 340px;//
  height: 160px;
  // margin-left: -25px;
  position: relative;
  background-color: #2a3e62;
  border-radius: 0;
  margin-right: 10px;

  .block {
    width: 80px;
    height: 54px;
    position: absolute;
    left: 56px;
    font-size: 18px;
    line-height: 80px;
    text-align: center;
  }

  span {
    position: absolute;
    left: 150px;
    top: 30px;
  }

  .bot_data {
    position: absolute;
    left: 5px;
    top: 75px;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    width: calc(100% - 20px);

    div {
      p {
        text-align: center;
      }

      p:first-child {
        font-size: 20px;
        font-weight: bold;
      }

      p:nth-child(2) {
        color: #fff;
        font-size: 14px;
        margin-top: 20px;
      }
    }
  }
}

.container2 {
  .block {
    background-image: url("@/assets/img//bills/block1.png");
  }

  .bot_data {
    div {
      p:first-child {
        color: #ff5a00;
      }
    }
  }
}

.container3 {
  .block {
    background-image: url("@/assets/img//bills/block2.png");
  }

  .bot_data {
    div {
      p:first-child {
        color: #ffad5b;
      }
    }
  }
}

.container4 {
  .block {
    background-image: url("@/assets/img//bills/block3.png");
  }

  .bot_data {
    div {
      p:first-child {
        color: #008aff;
      }
    }
  }
}

.container5 {
  .block {
    background-image: url("@/assets/img//bills/block4.png");
  }

  .bot_data {
    div {
      p:first-child {
        color: #835ffb;
      }
    }
  }
}

.container5 {
  // border-radius: 0px 60px 60px 0px;
  // background-image: url("@/assets/img//bills/top_bloack_bg3.png");
  // background-repeat: no-repeat;
  // background-size: 100% 100%;
  // background-position: 100% 100%;
  width: 340px;//360
  height: 160px;
  // margin-right: 20px;
  // margin-left: -25px;
  background-color: #2a3e62;
  border-radius: 0 10px 10px 0;
  position: relative;

  .block {
    width: 80px;
    height: 54px;
    position: absolute;
    left: 56px;
    font-size: 18px;
    line-height: 80px;
    text-align: center;
  }

  span {
    position: absolute;
    left: 150px;
    top: 30px;
  }

  .bot_data {
    position: absolute;
    left: 5px;
    top: 75px;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    width: calc(100% - 20px);

    div {
      p {
        text-align: center;
      }

      p:first-child {
        font-size: 20px;
        font-weight: bold;
      }

      p:nth-child(2) {
        color: #fff;
        font-size: 14px;
        margin-top: 20px;
      }
    }
  }
}

.barChart1 {
  // height: 500px !important;
  height: calc(100% - 250px) !important;
  background: #1e2a45;
  border-radius: 10px;
  margin-top: 50px;
}

//
.th-main-view {
  padding: 0;
}
::v-deep {
  .th-container-view {
    padding: 0 20px;
    background-color: #1e2a45;
    margin: 0 20px;
    border-radius: 10px;
  }
}
</style>
