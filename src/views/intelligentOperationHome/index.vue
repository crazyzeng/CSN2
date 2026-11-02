<!--运维总览-->
<template>
  <section class="content_warp">
    <!-- <el-divider class="curDivider" direction="vertical" /> -->
    <!-- <wl-main-container data-title="运维信息概览"> -->
    <div class="box_warp">
      <div class="left_content">
        <div class="left_top mb-4">
          <!-- <span class="title_text">实时运维状态</span><span class="sub_title_text">（{{ currentDate }}）</span> -->
          <div class="flex items-center justify-between py-1">
            <div class="strategy_card px-5 py-2 rounded-lg shadow-lg flex items-center"
              v-for="(item, index) in infoList" :key="item.name" :style="{
                background: `linear-gradient(to bottom, ${item.gradient}, #fff)`,
                '--hover-border': item.hoverBorder,
                '--card-shadow': item.shadow
              }">
              <div class=" flex flex-col justify-between text-gray-900">
                <div class=" mb-2">
                  <span style="font-size: 16px">{{ item.name }}</span>
                  <el-button class="detailBtn" v-if="index === 1" @click="getDetail">详情</el-button>
                </div>
                <p>
                  <span class="top_num mr-2">{{ item.num }}</span><span style="font-size: 14px">{{ index === 4 ? "条" : "台"
                  }}</span>
                </p>
              </div>
            </div>
            <!-- <div style="clear: both"></div> -->
          </div>
        </div>
        <el-card class="left_center rounded-lg mb-4">
          <!-- <span class="title_text">年度工单数量同比</span> -->
          <div class=" w-full flex items-center justify-between">
            <div class="card_title">年度工单数量同比</div>
            <el-radio-group class="radio_btn" v-model="topCenterRadio" @change="radioChange">
              <el-radio-button label="维修">维修</el-radio-button>
              <el-radio-button label="保养">保养</el-radio-button>
              <el-radio-button label="巡检">巡检</el-radio-button>
            </el-radio-group>
          </div>
          <div class="left_center_box">
            <div class="left_center_left">
              <CenterBarChart :data-item="centerBarItem" @change="barClick"></CenterBarChart>
            </div>
            <div class="left_center_right ml-4">
              <div style="width: 100%; height: 50%">
                <CenterPieChart :data-item="centerPieItem" :data-year="dataYear"
                  :data-name="topCenterRadio === '巡检' ? '巡检次数' : topCenterRadio + '设备'">
                </CenterPieChart>
              </div>
              <div style="width: 100%; height: 50%">
                <CenterPieChart :data-item="centerPieItem1" :data-year="dataYear1"
                  :data-name="topCenterRadio === '巡检' ? '巡检次数' : topCenterRadio + '设备'"></CenterPieChart>
              </div>
            </div>
          </div>
        </el-card>
        <div class="left_bottom">
          <el-card class="left_bottom_left rounded-lg">
            <div class="card_title mb-2">累计工单数量</div>
            <span class="sub_title_text">自2023年3月9日起</span>
            <div style="width: 100%; height: calc(100% - 30px);">
              <BottomBarChart :data-item="barItem"></BottomBarChart>
            </div>
          </el-card>
          <el-card class="left_bottom_right rounded-lg">
            <div class=" flex items-center">
              <div class="card_title">累计设备维保信息</div><span class="sub_title_text">自2023年3月9日起</span>
            </div>
            <div style="width: 100%; height: calc(100% - 30px); display: flex; justify-content: space-between">
              <div class="left-bot-right-pie-div" style="width: 33%; height: 100%; margin-top: 0px">
                <CenterPieChart :data-item="bottomPieItem" data-name="维修设备"></CenterPieChart>
              </div>
              <div class="left-bot-right-pie-div" style="width: 33%; height: 100%; margin-top: 0px">
                <CenterPieChart :data-item="bottomPieItem1" data-name="保养设备"></CenterPieChart>
              </div>
              <div class="left-bot-right-pie-div" style="width: 33%; height: 100%; margin-top: 0px">
                <CenterPieChart :data-item="bottomPieItem2" data-name="巡检次数"></CenterPieChart>
              </div>
            </div>
          </el-card>
        </div>
      </div>
      <div class="right_content rounded-lg">
        <el-card class="mb-5 rounded-lg" style="height: 58%;">
          <div class="card_title mb-5">代办事项</div>
          <el-table :data="tableData" style="width: 100%;box-shadow: 0 0 3px rgba(90, 151, 250, 0.3);" height="calc(100% - 40px)">
            <el-table-column prop="orderType" label="工单信息" min-width="100" align="center"> </el-table-column>
            <el-table-column prop="createTime" label="创建时间" min-width="160" align="center"> </el-table-column>
            <el-table-column prop="status" label="状态" align="center">
              <template #default="{ }">执行中</template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template #default="{ row }">
                <el-button type="text" @click="viewDetail(row)" class="todoDetail">详情</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
        <el-card class="right_radar_box rounded-lg">
          <div class="card_title mb-5">设备健康信息</div>
          <div class="rader_chart">
            <RightRadarChart></RightRadarChart>
          </div>
        </el-card>
      </div>
    </div>
    <OfflineDetailModal ref="detailModal" :data="offlineDetail"></OfflineDetailModal>
    <!-- </wl-main-container> -->
  </section>
</template>

<script>
import resize from "@/utils/resize.js";
import BottomBarChart from "./chart/BottomBarChart.vue";
import CenterBarChart from "./chart/CenterBarChart.vue";
import CenterPieChart from "./chart/CenterPieChart.vue";
import RightRadarChart from "./chart/RightRadarChart.vue";
import OfflineDetailModal from "./OfflineDetailModal.vue";
import { getCurrentStatus, getWorkOrderList, getYearWorkOrderNumber, getTotalWorkOrderList } from "@/api/home.js";
import dayjs from "dayjs";
import { numberTransfer } from "@/utils";
import { getWebSocket } from "@/utils/websocket";

export default {
  name: "home",
  components: { BottomBarChart, CenterBarChart, CenterPieChart, RightRadarChart, OfflineDetailModal },
  mixins: [resize],
  data: function () {
    return {
      currentDate: dayjs(new Date()).format("YYYY年MM月DD日"),
      infoList: [
        {
          name: "设备总数",
          num: 0,
          prop: "total",
          gradient: "#e6efff",
          hoverBorder: "#86a3f8",
          shadow: "0 6px 16px rgba(134,163,248,0.18)"
        },
        {
          name: "离线设备",
          num: 0,
          prop: "offline",
          gradient: "#f7ffe6",
          hoverBorder: "#c0e88e",
          shadow: "0 6px 16px rgba(192,232,142,0.20)"

        },
        {
          name: "正在保养设备",
          num: 0,
          prop: "maintain",
          gradient: "#fcf3e3",
          hoverBorder: "#fec76f",
          shadow: "0 6px 16px rgba(254,199,111,0.20)"
        },
        {
          name: "正在维修设备",
          num: 0,
          prop: "repair",
          gradient: "#e6f9ff",
          hoverBorder: "#9fdef3",
          shadow: "0 6px 16px rgba(159,222,243,0.20)"
        },
        {
          name: "今日巡检路线",
          num: 0,
          prop: "line",
          gradient: "#eee6fe",
          hoverBorder: "#d7c3fd",
          shadow: "0 6px 16px rgba(215,195,253,0.20)"
        },
      ],
      topCenterRadio: "维修",
      tableData: [],
      barItem: {},
      centerBarItem: {},
      centerData: {},
      centerPieItem: {},
      centerPieItem1: {},
      bottomPieItem: {},
      bottomPieItem1: {},
      bottomPieItem2: {},
      dataYear: "",
      dataYear1: "",
      offlineNum: 0,
      offlineDetail: [],
    };
  },
  created() { },
  beforeDestroy() { },
  computed: {},
  watch: {},
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.getOverViewData();
      this.getToDoList();
      this.getYearData();
      this.getTotalData();
      this.offLineWebSocket();
    },
    offLineWebSocket() {
      const ws = getWebSocket("custom/offline");
      ws.setMessage((res) => {
        const data = JSON.parse(res.data);
        if (Object.keys(data).length > 0) {
          this.offlineNum = data.offline;
          this.offlineDetail = data.offlineDetail;
        }
      });
      ws.init();
      this.$once("hook:beforeDestroy", () => ws.getWS().close());
    },
    getOverViewData() {
      getCurrentStatus().then((res) => {
        if (res.code === 200 && Object.keys(res.data).length > 0) {
          this.offlineDetail = res.data.offlineDetail;
          this.infoList.forEach((v) => {
            for (let key in res.data) {
              if (v.prop === key) v.num = res.data[key];
            }
          });
        }
      });
    },
    getToDoList() {
      getWorkOrderList().then((res) => {
        if (res.code === 200 && res.data.length > 0) this.tableData = res.data;
      });
    },
    getYearData() {
      getYearWorkOrderNumber().then((res) => {
        if (res.code === 200 && Object.values(res.data).length > 0) {
          this.centerData = res.data;
          this.centerBarItem = this.centerData.repair;
          this.centerPieItem = this.centerData.repair?.now.yearCompare || {};
          this.centerPieItem1 = this.centerData.repair?.compare.yearCompare || {};
          this.dataYear = "今年";
          this.dataYear1 = "去年";
        }
      });
    },
    getTotalData() {
      getTotalWorkOrderList().then((res) => {
        if (res.code === 200 && Object.values(res.data).length > 0) {
          this.barItem = res.data.total;
          this.bottomPieItem = res.data.repair;
          this.bottomPieItem1 = res.data.maintain;
          this.bottomPieItem2 = res.data.inspect;
        }
      });
    },

    barClick(e) {
      let tempData = {},
        tempData1 = {};
      this.dataYear = numberTransfer(e + 1) + "月";
      this.dataYear1 = numberTransfer(e + 1) + "月";
      switch (this.topCenterRadio) {
        case "维修":
          tempData = this.centerData.repair?.now.chart ? this.centerData.repair?.now.chart[e] : {};
          tempData1 = this.centerData.repair?.compare.chart ? this.centerData.repair?.compare.chart[e] : {};
          break;
        case "保养":
          tempData = this.centerData.maintain?.now.chart ? this.centerData.maintain?.now.chart[e] : {};
          tempData1 = this.centerData.maintain?.compare.chart ? this.centerData.maintain?.compare.chart[e] : {};
          break;
        case "巡检":
          tempData = this.centerData.inspect?.now.chart ? this.centerData.inspect?.now.chart[e] : {};
          tempData1 = this.centerData.inspect?.compare.chart ? this.centerData.inspect?.compare.chart[e] : {};
          break;
        default:
          break;
      }
      this.centerPieItem = tempData || {};
      this.centerPieItem1 = tempData1 || {};
    },
    getDetail() {
      this.$refs.detailModal?.open();
    },
    radioChange() {
      if (this.topCenterRadio === "维修") {
        this.centerBarItem = this.centerData.repair;
        this.centerPieItem = this.centerData.repair?.now.yearCompare || {};
        this.centerPieItem1 = this.centerData.repair?.compare.yearCompare || {};
      }
      if (this.topCenterRadio === "保养") {
        this.centerBarItem = this.centerData.maintain;
        this.centerPieItem = this.centerData.maintain?.now.yearCompare || {};
        this.centerPieItem1 = this.centerData.maintain?.compare.yearCompare || {};
      }
      if (this.topCenterRadio === "巡检") {
        this.centerBarItem = this.centerData.inspect;
        this.centerPieItem = this.centerData.inspect?.now.yearCompare || {};
        this.centerPieItem1 = this.centerData.inspect?.compare.yearCompare || {};
      }
    },
    viewDetail(item) {
      let tempStr = "";
      switch (item.orderType) {
        case "保养":
          tempStr = "upkeepWorkOrder";
          break;
        case "维修":
          tempStr = "repairWorkOrder";
          break;
        case "巡检":
          tempStr = "inspectionWordOrder";
          break;
        default:
          break;
      }
      this.$router.push({
        name: tempStr,
        params: { orderNumber: item.orderNumber },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep {
  .radio_btn {
    .el-radio-button:first-child .el-radio-button__inner {
      border-radius: 20px 0 0 20px;
    }

    .el-radio-button:last-child .el-radio-button__inner {
      border-radius: 0 20px 20px 0;
    }

    .el-radio-button--mini .el-radio-button__inner {
      padding: 5px 15px;
    }
  }

  .el-radio-button__inner {
    background: #e5ecff;
  }

  .el-radio-button__orig-radio:checked+.el-radio-button__inner {
    background: #6e94fe;
  }

  .el-button--primary {
    background: #6e94fe;
  }
}

.title_text {
  font-size: 20px;
  color: #fefeff;
}

.card_title {
  width: 237px;
  height: 24px;
  background-image: url("../../assets/home/titBg.png");
  background-repeat: no-repeat;
  padding-left: 35px;
  font-weight: bold;
  color: #444;
  line-height: 25px;
  font-size: 14px;
  letter-spacing: 2px;
}

.detailBtn {
  width: 46px;
  height: 20px;
  line-height: 20px;
  font-size: 12px;
  background-color: #d9e2ff;
  color: #2b60f4 !important;
  border: none;
  margin-left: 10px;
  padding: 0;
}

.todoDetail {
  font-size: 14px;
}

.sub_title_text {
  font-size: 14px;
  color: #737272;
}

.box_warp {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;

  .left_content {
    width: 70%;
    height: 100%;

    .left_top {
      height: 12%;
      >span {
        vertical-align: middle;
      }

      .strategy_card {
        width: 19%;
        transition: all 0.3s ease;
        box-shadow: var(--card-shadow);
        outline: 2px solid transparent;
        outline-offset: 0;

        &:hover {
          // transform: translateY(-4px);
          outline: 2px solid var(--hover-border);
          box-shadow: var(--card-shadow), 0 8px 20px rgba(0, 0, 0, 0.08);
        }
      }

      .container {
        width: auto;
        float: left;
        text-align: center;

        >div {
          >p:first-child {
            padding: 5px 0 20px 0;
          }
        }
      }


      .top_num {
        font-size: 30px;
        font-weight: bold;
        color: #333;
      }

      .container1 {
        // border-radius: 0px 60px 60px 0px;
        background-image: url("@/assets/img//bills/top_bloack_bg1.png");
        background-repeat: no-repeat;
        background-size: 100% 100%;
        background-position: 100% 100%;
        width: 265px;
        height: 130px;
        position: relative;
      }

      .container2,
      .container3,
      .container4 {
        // border-radius: 0px 60px 60px 0px;
        background-image: url("@/assets/img//bills/top_bloack_bg2.png");
        background-repeat: no-repeat;
        background-size: 100% 100%;
        background-position: 100% 100%;
        width: 268px;
        height: 130px;
        margin-left: -25px;
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
      }

      .container2 {
        .block {
          background-image: url("@/assets/img//bills/block1.png");
        }

        .top_num {
          font-size: 40px;
          font-weight: bold;
          color: #ff6210;
        }
      }

      .container3 {
        .block {
          background-image: url("@/assets/img//bills/block2.png");
        }

        .top_num {
          font-size: 40px;
          font-weight: bold;
          color: #4dffa5;
        }
      }

      .container4 {
        .block {
          background-image: url("@/assets/img//bills/block3.png");
        }

        .top_num {
          font-size: 40px;
          font-weight: bold;
          color: #098cfd;
        }
      }

      .container5 {
        .block {
          background-image: url("@/assets/img//bills/block4.png");
        }

        .top_num {
          font-size: 40px;
          font-weight: bold;
          color: #8365fb;
        }
      }

      .container5 {
        // border-radius: 0px 60px 60px 0px;
        background-image: url("@/assets/img//bills/top_bloack_bg3.png");
        background-repeat: no-repeat;
        background-size: 100% 100%;
        background-position: 100% 100%;
        width: 265px;
        height: 130px;
        margin-left: -25px;

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
      }
    }

    .left_center {
      overflow: hidden;
      height: calc(58% - 32px);

      >span {
        vertical-align: middle;
      }

      .left_center_box {
        height: 100%;
        display: flex;
        justify-content: space-between;

        .left_center_left {
          width: 70%;
          height: 100%;
        }

        .left_center_right {
          width: 28%;
          height: 100%;
        }
      }
    }

    .left_bottom {
      width: 100%;
      // height: calc(100% - 590px);
      height: 30%;
      display: flex;
      justify-content: space-between;
      margin-top: 5px;
      overflow: hidden;

      .left_bottom_left {
        >span {
          vertical-align: middle;
        }

        width: 25%;
        height: 100%;

        >div {
          background-color: #1e2a45;
          border-radius: 10px;
        }
      }

      .left_bottom_right {
        overflow: hidden;

        >span {
          vertical-align: middle;
        }

        width: calc(75% - 15px);
        height: 100%;

        >div {
          background-color: #1e2a45;
          border-radius: 10px;
        }
      }
    }
  }

  .right_content {
    width: 30%;
    height: 100%;
    overflow: hidden;
    margin-left: 20px;

    >span {
      vertical-align: middle;
    }

    .right_radar_box {
      width: 100%;
      // height: calc(100% - 500px);
      height: 40%;
      margin-top: 5px;


      .rader_chart {
        width: 100%;
        height: calc(100% - 50px);
        // background-color: #1e2a45;
        // border-radius: 10px;
      }
    }
  }
}
::v-deep {
  .el-card__body {
    height: 100%;
  }
}

//
::v-deep {
  .th-main-title h2 {
    line-height: normal !important;
    margin-left: 0 !important;
  }
}

.th-main-view {
  padding: 0;

  // width: auto;
  // width: calc(100% - 20px);
  // padding-right: 20px;
  ::v-deep {
    header {
      height: 40px !important;
    }
  }
}

::v-deep {
  .th-container-view {
    height: calc(100% - 30px) !important;
  }
}

::v-deep {
  .right_radar_box {
    .rader_chart {
      // height: calc(100% - 120px) !important;
    }
  }

  @media (min-height: 1080px) {
    .th-container-view {
      height: calc(100% - 60px) !important;
    }

    .right_radar_box {
      // height: calc(100% - 592px) !important;

      .rader_chart {
        // height: calc(100% - 90px) !important;
      }
    }

    .left-bot-right-pie-div {
      section {
        div {
          // margin-top: 50px !important;
        }
      }
    }
  }
}
</style>
