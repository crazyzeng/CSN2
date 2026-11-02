<!-- 设备能耗 -->
<template>
  <section class="container_warp">
    <section class="container_box">
      <el-divider class="curDivider" direction="vertical" />
      <wl-main-container data-title="设备能耗">
        <!-- <div class="top_btn">
          <el-button :class="top_btn_flag == 0 ? 'top_btn_active' : 'day'" type="primary" size="default" @click="day" style="border: none">
            日报
          </el-button>
          <el-button :class="top_btn_flag == 1 ? 'top_btn_active' : 'month'" type="primary" size="default" @click="month" style="border: none">
            月报
          </el-button>
          <el-button :class="top_btn_flag == 2 ? 'top_btn_active' : 'year'" type="primary" size="default" @click="year" style="border: none">
            年报
          </el-button>
        </div> -->
        <!-- 表单查询 -->
        <el-form class="table-view-query-form form" :inline="true" ref="queryForm" :model="queryFormData">
          <el-form-item label="设备名称" prop="select">
            <el-input placeholder="请输入设备名称" v-model="queryFormData.deviceName" clearable> </el-input>
          </el-form-item>
          <el-form-item label="设备类型" prop="select">
            <el-select v-model="queryFormData.deviceTypes" placeholder="请选择设备类型" multiple collapse-tags clearable>
              <el-option v-for="item in deviceTypeList" :key="item.itemText" :label="item.itemText"
                :value="item.itemValue"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属区域" prop="select">
            <el-select v-model="queryFormData.orgName" placeholder="请选择区域" clearable>
              <el-option v-for="item in areaList" :key="item" :label="item" :value="item"> </el-option>
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
          <el-form-item style="margin-right: 0; float: right">
            <el-button type="primary" round icon="el-icon-search"
              @click="handleTableFormQuery(queryFormData, page)">查询</el-button>
            <el-button type="primary" round icon="el-icon-refresh-left"
              @click="handleQueryFormReset(queryFormData, page)">重置</el-button>
          </el-form-item>
          <!-- 其他操作 -->
          <el-form-item style="margin-right: 0; float: right">
            <el-button class="border-btn b-b-b" type="primary" icon="el-icon-my-pieChart"
              @click="showPie">饼图</el-button>
            <el-button class="border-btn b-b-b" type="primary" icon="el-icon-my-trendChart"
              @click="showTrend">趋势图</el-button>
            <el-button class="border-btn b-b-b" type="primary" icon="el-icon-my-export"
              @click="exportEquipment">导出</el-button>
          </el-form-item>
        </el-form>
        <!--表格-->
        <div class="table_div" style="height: calc(100% - 140px)">
          <el-table class="th-table e_table" header-cell-class-name="th-table-header-cell" :data="tableData" ref="table"
            size="mini" height="100%"
            :header-cell-style="{ background: 'transparent', color: '#fff', fontSize: '14px' }"
            @selection-change="handleSelectionChange">
            <el-table-column align="center" type="selection" width="55" fixed></el-table-column>
            <el-table-column align="center" label="序号" type="index" width="55" fixed></el-table-column>
            <el-table-column prop="deviceName" align="center" label="设备名称" width="150" fixed> </el-table-column>
            <el-table-column prop="orgName" align="center" label="区域" width="150" fixed> </el-table-column>
            <el-table-column align="left" label="">
              <template slot="header">
                <!-- <div>时间</div>
                <div style="color: #ccd4ff; font-size: 12px">能耗单位（kWh）</div> -->
                <div>
                  <div>{{ queryFormData.date }} 能耗</div>
                  <div style="color: #ccd4ff; font-size: 12px">能耗单位&nbsp;&nbsp;电:（kWh） 水:（t）</div>
                </div>
              </template>
              <el-table-column v-for="(item, index) in timeArr" :key="index" :label="item" width="115">
                <template slot-scope="scope">
                  <span>{{ scope.row.datas[index] ? scope.row.datas[index] : "-" }}</span>
                </template>
              </el-table-column>
            </el-table-column>
            <!---->
          </el-table>
        </div>
        <!--分页-->
        <el-pagination style="float:right;margin-top: 60px;" @size-change="handleSizeChange"
          @current-change="handleCurrentChange" :current-page="page.pageNum" :page-size="page.pageSize"
          layout="total, sizes, prev, pager, next, jumper" :total="page.total" background>
        </el-pagination>
        <pieChart :data-flag="pieChart.flag" :data-arr="pieChart.arrData" :data-title="pieChart.title"
          @close="pieChartClose" @submit="pieChartSubmit"></pieChart>
        <trendChart :data-flag="trendChart.flag" :data-arr="trendChart.arrData" :data-time="timeArr"
          :data-title="trendChart.title" @close="trendChartClose" @submit="trendChartSubmit"></trendChart>
      </wl-main-container>
    </section>
  </section>
</template>

<script>
import { queryDeviceList, exportEquipmentExcel, getAreaList } from "@/api/energyManagement";
import trendChart from "./charts/trendChart.vue";
import pieChart from "./charts/pieChart1.vue";
import dayjs from "dayjs";
import { getDict } from "@/api/common";

export default {
  components: { pieChart, trendChart },
  data() {
    return {
      top_btn_flag: 0,
      queryFormData: {
        deviceName: "",
        deviceTypes: '',
        orgName: "",
        dateType: "day",
        date: dayjs(new Date()).format("YYYY-MM-DD"),
      },
      periodTimeType: "date",
      page: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
      tableData: [],
      timeArr: [],
      datePickFormat: "yyyy-MM-dd",
      deviceTypeList: [],
      areaList: [],
      pieChart: {
        flag: false,
        arrData: [],
        title: "设备能耗饼图",
      },
      trendChart: {
        flag: false,
        arrData: [],
        title: "设备能耗趋势图",
      },
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
      this.getData(this.queryFormData, this.page);
      this.getArea();
      this.getDeviceType();
    },
    getData(data, page) {
      queryDeviceList(data, page).then((res) => {
        if (res.code == 200) {
          let data = res.data;
          this.tableData = data.details.list;
          this.page.total = data.details.total;
          this.timeArr = data.times;
        } else {
          this.$message.error(res.msg);
        }
        this.$nextTick(() => {
          this.$refs.table.doLayout();
        });
      });
    },
    //获取时间段
    getTime(data) {
      getDeviceTime(data).then((res) => {
        if (res.code == 200) {
          console.log(res.data);
          this.timeArr = res.data;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    //设备类型
    getDeviceType() {
      getDict("equipment_type").then((res) => {
        if (res.code == 200 && res.data) {
          this.deviceTypeList = res.data;
        }
      });
    },
    getArea() {
      getAreaList().then((res) => {
        if (res.code == 200) {
          this.areaList = res.data;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    day() {
      this.top_btn_flag = 0;
      this.periodTimeType = "date";
      this.queryFormData.dateType = "day";
      this.datePickFormat = "yyyy-MM-dd";
      this.queryFormData.date = dayjs(new Date()).format("YYYY-MM-DD");
    },
    month() {
      this.top_btn_flag = 1;
      this.periodTimeType = "month";
      this.queryFormData.dateType = "month";
      this.datePickFormat = "yyyy-MM";
      this.queryFormData.date = dayjs(new Date()).format("YYYY-MM");
    },
    year() {
      this.top_btn_flag = 2;
      this.periodTimeType = "year";
      this.queryFormData.dateType = "year";
      this.datePickFormat = "yyyy";
      this.queryFormData.date = dayjs(new Date()).format("YYYY");
    },
    //
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
    handleTableFormQuery(data, page) {
      this.getData(data, page);
    },
    //重置
    handleQueryFormReset(data) {
      Object.keys(data).forEach((key) => (data[key] = ""));
      this.day();
      this.queryFormData.date = dayjs(new Date()).format("YYYY-MM-DD");
      this.page.pageNum = 1;
      this.page.pageSize = 10;
      this.handleTableFormQuery(this.queryFormData, this.page);
    },
    /****
     * 分页
     */
    // 切换分页大小查询
    handleSizeChange(data) {
      this.page.pageSize = data;
      this.handleTableFormQuery(this.queryFormData, this.page);
    },
    // 切换页码
    handleCurrentChange(data) {
      this.page.pageNum = data;
      this.handleTableFormQuery(this.queryFormData, this.page);
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
        this.$message.error("请选择需要展示的设备");
        return;
      } else if (data.length > 10) {
        this.$message.error("最多可选择10台设备");
        return;
      } else {
        this.pieChart.flag = true;
      }
    },
    //趋势图
    showTrend() {
      let data = this.trendChart.arrData;
      if (data.length < 1) {
        this.$message.error("请选择需要展示的设备");
        return;
      } else if (data.length > 10) {
        this.$message.error("最多可选择10台设备");
        return;
      } else {
        this.trendChart.flag = true;
      }
    },
    //导出
    exportEquipment() {
      const tempObj = { 
        ...this.queryFormData, 
        deviceTypes: this.queryFormData.deviceTypes.join(','),
        queryType: 2 
      };
      exportEquipmentExcel(tempObj).then((res) => {
        let data = res;
        if (!data) {
          return;
        }
        let url = window.URL.createObjectURL(new Blob([data]));
        let link = document.createElement("a");
        link.style.display = "none";
        link.href = url;
        link.setAttribute("download", "设备能耗.xls");
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
::v-deep ::-webkit-scrollbar {
  display: block;
}

::v-deep {
  .el-tag.el-tag--info {
    background-color: rgb(19, 63, 124);
    color: #fff;
    border-color: #3067af;
  }
}

::v-deep {
  .th-container-view {
    padding: 0 20px;
    background-color: transparent !important;
  }

  .el-form-item {
    >.el-form-item__label {
      color: #fff;
    }
  }

  // .el-button--primary {
  //   background: transparent;
  //   border-color: none;
  //   color: #5b75a6;
  //   margin-left: 0;
  //   font-size: 14px;
  //   padding-top: 5px;
  //   padding-bottom: 5px;
  // }

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

  // .btn_g_m,
  // .form {
  //   .el-button--primary {
  //     border: 1px solid #5b75a6;
  //     color: #fff;
  //     margin-left: 30px;
  //     font-size: 12px;
  //   }
  // }

  .tba .th-table-header-cell {
    background: transparent !important;
  }

  .e_table {
    tr {
      background-color: #1e2a45 !important;
    }

    .el-table__fixed::before {
      display: none;
    }

    th.el-table__cell.is-leaf,
    .el-table td.el-table__cell {
      background: #1e2a45 !important;
      border-color: #5a87a9;
    }
  }

  .th-table-header-cell {
    background-color: transparent !important;
  }

  .el-table--scrollable-x .el-table__body-wrapper {
    @include scrollBar;
    // height: 400px !important;
  }

  //自定义图表的
  .el-icon-my-pieChart,
  .el-icon-my-trendChart,
  .el-icon-my-export {
    margin-left: -5px !important;
  }

  .el-dialog {
    background-color: #1e2a45;

    .el-button--primary {
      background: transparent;
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

  .btn-prev,
  button.btn-next {
    border: 1px solid #364d79;
  }
}

.el-main {
  @include scrollBar;
}

.top_btn {
  position: absolute;
  top: 2px;
  left: 200px;
  background: transparent;
  border: 1px solid #3d4d6a;
  border-radius: 14px;
}

.top_btn_active {
  background: linear-gradient(to right, #13b1ff, #146ef9);
  color: #fff;
}

.e_table {
  margin-top: 20px;
  background-color: #1e2a45;
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

::v-deep .el-table {
  .el-table__fixed-body-wrapper .el-table__body {
    padding-bottom: 10px;
  }

  .el-table__fixed {
    height: calc(100% - 10px) !important;
  }
}

//
.th-main-view {
  padding: 0;
}
</style>
