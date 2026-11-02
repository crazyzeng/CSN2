<!-- 区域能耗 -->
<template>
  <section class="container_warp">
    <section class="container_box">
      <!-- <el-divider class="curDivider" direction="vertical" /> -->
      <!-- <wl-main-container data-title="区域能耗"> -->
      <!-- <div class="top_btn">
          <el-button :class="top_btn_flag == 0 ? 'top_btn_active' : 'day'" type="primary" size="default" @click="dayChange" style="border: none">
            日报
          </el-button>
          <el-button :class="top_btn_flag == 1 ? 'top_btn_active' : 'month'" type="primary" size="default" @click="monthChange" style="border: none">
            月报
          </el-button>
          <el-button :class="top_btn_flag == 2 ? 'top_btn_active' : 'year'" type="primary" size="default" @click="yearChange" style="border: none">
            年报
          </el-button>
        </div> -->
      <!-- 表单查询 -->
      <el-form class="table-view-query-form form" :inline="true" ref="queryForm" :model="queryFormData">
        <el-form-item label="能源类型" prop="select">
          <el-select v-model="queryFormData.energyType" placeholder="请选择能源类型" @change="energyTypeChange">
            <el-option v-for="item in energyTypeList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="区域" prop="select">
          <el-select v-model="queryFormData.orgName" placeholder="请选择区域">
            <el-option v-for="item in areaList" :key="item.text" :label="item.text" :value="item.text"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="报告类型" prop="">
          <el-select v-model="queryFormData.dateType" placeholder="请选择" @change="reportTypeChange">
            <el-option v-for="item in dateTypeList" :key="item.value" :label="item.text" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间" prop="select">
          <el-date-picker v-model="queryFormData.date" :type="periodTimeType" :format="datePickFormat"
            :value-format="datePickFormat" placeholder="选择时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleTableFormQuery(queryFormData)">查询</el-button>
          <el-button type="primary" icon="el-icon-refresh-left"
            @click="handleQueryFormReset(queryFormData)">重置</el-button>
        </el-form-item>
        <el-form-item style="margin-right: 0; float: right">
          <el-button type="primary" icon="el-icon-my-pieChart" @click="showPie">饼图</el-button>
          <el-button type="primary" icon="el-icon-my-trendChart"
            @click="showTrend">趋势图</el-button>
          <el-button type="primary" icon="el-icon-my-export"
            @click="exportEquipment">导出</el-button>
        </el-form-item>
      </el-form>
      <!-- 其他操作 -->
      <!-- <el-row class="th-buttons table-view-table-buttons btn_g_m">
            <el-button type="primary" icon="el-icon-my-pieChart" @click="showPie">饼图</el-button>
            <el-button type="primary" icon="el-icon-my-trendChart" @click="showTrend">趋势图</el-button>
            <el-button type="primary" icon="el-icon-my-export" @click="exportEquipment">导出</el-button>
        </el-row> -->
      <!--表格-->
      <div class="table_div">
        <el-table class="th-table e_table" :data="tableData" height="100%"
          ref="table"
          @selection-change="handleSelectionChange">
          <el-table-column align="center" type="selection" width="55" fixed></el-table-column>
          <el-table-column align="center" label="序号" type="index" width="55" fixed></el-table-column>
          <el-table-column prop="orgName" align="center" label="区域" width="150" fixed> </el-table-column>
          <el-table-column prop="energyTypeName" align="center" label="能源类型" width="80" fixed>
            <template slot-scope="scope">
              <div class="energy_heat_c" v-show="scope.row.energyTypeName == '热'">热</div>
              <div class="energy_water_c" v-show="scope.row.energyTypeName == '水'">水</div>
              <div class="energy_electric_c" v-show="scope.row.energyTypeName == '电'">电</div>
              <div class="energy_gas_c" v-show="scope.row.energyTypeName == '气'">气</div>
            </template>
          </el-table-column>
          <el-table-column align="left" label="">
            <template slot="header">
              <div class="table_header">
                <div>
                  <!-- <div>时间</div> -->
                  <div>{{ queryFormData.date }} 能耗</div>
                  <div style="color: #000; font-size: 12px">能耗单位&nbsp;&nbsp;电:（kWh） 水:（t）</div>
                </div>
                <div v-if="queryFormData.orgName == ''" class="total_energy">总能耗： {{ totalEnergy }}</div>
              </div>
            </template>
            <el-table-column v-for="(item, index) in timeArr" :key="index" :label="item">
              <template slot-scope="scope">
                <span>{{ scope.row.datas[index] ? scope.row.datas[index] : "-" }}</span>
              </template>
            </el-table-column>
          </el-table-column>
          <!---->
        </el-table>
      </div>
      <pieChart :data-flag="pieChart.flag" :data-arr="pieChart.arrData" :data-title="pieChart.title"
        @close="pieChartClose" @submit="pieChartSubmit"></pieChart>
      <trendChart :data-flag="trendChart.flag" :data-arr="trendChart.arrData" :data-time="timeArr"
        :data-title="trendChart.title" @submit="trendChartSubmit" @close="trendChartClose"></trendChart>
      <!-- </wl-main-container> -->
    </section>
  </section>
</template>

<script>
import { queryList, exportArea, getAreaByEnergyType } from "@/api/energyManagement";
import trendChart from "./charts/trendChart.vue";
import pieChart from "./charts/pieChart1.vue";
import dayjs from "dayjs";

export default {
  components: { pieChart, trendChart },
  data() {
    return {
      top_btn_flag: 0,
      queryFormData: {
        energyType: "ENERGY_ELECTRIC",
        orgName: "",
        dateType: "day",
        date: dayjs(new Date()).format("YYYY-MM-DD"),
      },
      periodTimeType: "date",
      tableData: [],
      timeArr: [],
      datePickFormat: "yyyy-MM-dd",
      energyTypeList: [
        {
          value: "ENERGY_WATER",
          label: "水",
        },
        {
          value: "ENERGY_ELECTRIC",
          label: "电",
        },
        {
          value: "ENERGY_HEAT",
          label: "热",
        },
        {
          value: "ENERGY_GAS",
          label: "气",
        },
      ],
      areaList: [],
      pieChart: {
        flag: false,
        arrData: [],
        title: "区域能耗饼图",
      },
      trendChart: {
        flag: false,
        arrData: [],
        title: "区域能耗趋势图",
      },
      totalEnergy: 0,
      dateTypeList: [
        { text: "日报", value: "day" },
        { text: "月报", value: "month" },
        { text: "年报", value: "year" },
      ],
    };
  },

  computed: {},

  mounted() {
    this.init();
  },

  methods: {
    init() {
      this.getData(this.queryFormData);
      getAreaByEnergyType("ENERGY_ELECTRIC").then((res) => {
        if (res.code == 200) this.areaList = res.data;
      });
    },
    getData(data) {
      queryList(data).then((res) => {
        if (res.code == 200) {
          let data = res.data;
          this.tableData = data.details;
          this.totalEnergy = data.total;
          this.timeArr = data.times;
        } else {
          this.$message.error(res.msg);
        }
        this.$nextTick(() => {
          this.$refs.table.doLayout();
        });
      });
    },
    trendChartSubmit() { },
    energyTypeChange(e) {
      this.queryFormData.orgName = "";
      getAreaByEnergyType(e).then((res) => {
        if (res.code == 200) this.areaList = res.data;
      });
    },
    dayChange() {
      this.top_btn_flag = 0;
      this.periodTimeType = "date";
      this.queryFormData.dateType = "day";
      this.datePickFormat = "yyyy-MM-dd";
      this.queryFormData.date = dayjs(new Date()).format("YYYY-MM-DD");
    },
    monthChange() {
      this.top_btn_flag = 1;
      this.periodTimeType = "month";
      this.queryFormData.dateType = "month";
      this.datePickFormat = "yyyy-MM";
      this.queryFormData.date = dayjs(new Date()).format("YYYY-MM");
    },
    yearChange() {
      this.top_btn_flag = 2;
      this.periodTimeType = "year";
      this.queryFormData.dateType = "year";
      this.datePickFormat = "yyyy";
      this.queryFormData.date = dayjs(new Date()).format("YYYY");
    },
    reportTypeChange(val) {
      if (val === "day") {
        this.top_btn_flag = 0;
        this.periodTimeType = "date";
        this.queryFormData.dateType = "day";
        this.datePickFormat = "yyyy-MM-dd";
        this.queryFormData.date = dayjs(new Date()).format("YYYY-MM-DD");
      }
      if (val === "month") {
        this.top_btn_flag = 1;
        this.periodTimeType = "month";
        this.queryFormData.dateType = "month";
        this.datePickFormat = "yyyy-MM";
        this.queryFormData.date = dayjs(new Date()).format("YYYY-MM");
      }
      if (val === "year") {
        this.top_btn_flag = 2;
        this.periodTimeType = "year";
        this.queryFormData.dateType = "year";
        this.datePickFormat = "yyyy";
        this.queryFormData.date = dayjs(new Date()).format("YYYY");
      }
    },
    //查询
    handleTableFormQuery(data) {
      this.getData(data);
    },
    //重置
    handleQueryFormReset(data) {
      Object.keys(data).forEach((key) => (data[key] = ""));
      this.queryFormData.energyType = "ENERGY_ELECTRIC";
      this.dayChange();
      this.queryFormData.date = dayjs(new Date()).format("YYYY-MM-DD");
      this.handleTableFormQuery(this.queryFormData);
      getAreaByEnergyType("ENERGY_ELECTRIC").then((res) => {
        if (res.code == 200) this.areaList = res.data;
      });
    },
    //表格选中，返回
    handleSelectionChange(data) {
      this.pieChart.arrData = data;
      this.trendChart.arrData = data;
    },
    //饼图
    showPie() {
      let data = this.pieChart.arrData;
      if (data.length < 1) {
        this.$message.error("请选择需要展示的区域");
        return;
      } else if (data.length > 10) {
        this.$message.error("勾选的数据不能大于10条");
        return;
      } else {
        this.pieChart.flag = true;
      }
    },
    //趋势图
    showTrend() {
      let data = this.trendChart.arrData;
      if (data.length < 1) {
        this.$message.error("请选择需要展示的区域");
        return;
      } else if (data.length > 10) {
        this.$message.error("勾选的数据不能大于10条");
        return;
      } else {
        this.trendChart.flag = true;
      }
    },
    //导出
    exportEquipment() {
      const data = { ...this.queryFormData, queryType: 1 };
      exportArea(data).then((res) => {
        let data = res;
        if (!data) {
          return;
        }
        let url = window.URL.createObjectURL(new Blob([data]));
        let link = document.createElement("a");
        link.style.display = "none";
        link.href = url;
        link.setAttribute("download", "区域能耗.xls");
        document.body.appendChild(link);
        link.click();
      });
    },
    pieChartClose() {
      this.pieChart.flag = false;
    },
    pieChartSubmit() {
      this.pieChart.flag = false;
    },
    trendChartClose() {
      this.trendChart.flag = false;
    },
    trendChartSubmit() {
      this.trendChart.flag = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.container_warp {
  width: 100%;
  height: 100%;
}

.container_box {
  height: 100%;
}

.table_div {
  width: 100%;
  height: calc(100% - 47px);
  background-color: #fff !important;
  border-radius: 10px;
  box-shadow: 0 0 6px rgba(90, 151, 250, 0.3);
  padding: 20px;
}

::v-deep .e_table {
  box-shadow: none !important;
  border: none !important;
}

::v-deep ::-webkit-scrollbar {
  display: block;
}

.table_header {
  display: flex;
  align-items: center;

  .total_energy {
    margin-left: 100px;
    font-size: 20px;
  }
}

::v-deep {
  .th-container-view {
    padding: 0 20px;
    background-color: transparent !important;
  }

  .el-form-item {
    >.el-form-item__label {
      color: #000;
    }
  }

  .top_btn {

    .el-button--primary:hover,
    .el-button--primary:focus {
      border-color: transparent !important;
    }

    .el-button--primary {
      margin-left: 0;
      font-size: 14px;
      padding-top: 5px;
      padding-bottom: 5px;
    }
  }

  .th-table-header-cell {
    // background: #E6EFFF !important;
    // color: #000 !important;
  }

  .el-table--scrollable-x .el-table__body-wrapper {
    @include scrollBar;
  }

  //自定义图表的
  .el-icon-my-pieChart,
  .el-icon-my-trendChart,
  .el-icon-my-export {
    margin-left: -5px !important;
  }

  .el-dialog {

    .el-button--primary {
      border-color: none;
      color: #fff;
      margin-left: 0;
      font-size: 14px;
      padding-top: 5px;
      padding-bottom: 5px;
    }

    .el-button--primary:hover,
    .el-button--primary:focus {
      border-color: transparent !important;
    }
  }

  .e_table {
    tr {
      // background-color: #fff !important;
    }

    .el-table__fixed::before {
      display: none;
    }
  }
}

.top_btn {
  position: absolute;
  top: 5px;
  left: 200px;
  background: transparent;
  border: 1px solid #3d4d6a;
  border-radius: 14px;
}

.top_btn_active {
  background: linear-gradient(to right, #13b1ff, #146ef9);
  color: #fff;
}

.energy_water_c {
  color: #00c2cc;
}

.energy_electric_c {
  color: #0090d9;
}

.energy_heat_c {
  color: #d87789;
}

.energy_gas_c {
  color: #7e53ed;
}

.th-main-view {
  padding: 0;
}
</style>
