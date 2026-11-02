<!-- 冷站运行参数 -->

<template>
  <section class="container_warp">
    <section class="container_box">
      <el-divider class="curDivider" direction="vertical" />
      <wl-main-title data-title="冷站运行参数"> </wl-main-title>
      <el-main>
        <el-tabs v-model="formData.parentOrgId" style="height: 100%" @tab-click="tabsClick">
          <el-tab-pane label="武广冷热源系统" name="00010017"></el-tab-pane>
          <el-tab-pane label="沪昆冷热源系统" name="00010016"></el-tab-pane>
          <!-- <el-tab-pane label="武广冷热源系统" name="000100010001"></el-tab-pane> -->
        </el-tabs>
        <el-form :inline="true" :model="formData" class="demo-form-inline">
          <el-form-item label="">
            <el-radio-group v-model="radioType" @change="radioChange">
              <el-radio-button label="1">设备状态</el-radio-button>
              <el-radio-button label="2">传感器</el-radio-button>
              <el-radio-button label="3">运行时长</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="设备名称" class="ml-5">
            <el-popover placement="bottom" :title="activeName" width="300" trigger="click">
              <el-tree
                ref="treeRef"
                :data="treeData"
                :props="defaultProps"
                show-checkbox
                default-expand-all
                :check-strictly="false"
                node-key="id"
                @check="handleNodeClick"
                style="height: 400px; overflow-y: scroll"
              ></el-tree>
              <el-input v-model="formData.orgName" slot="reference" :readonly="true" placeholder="请选择设备" />
            </el-popover>
          </el-form-item>
          <el-form-item label="时间区间" class="ml-5">
            <el-radio-group v-model="timeType" @change="typeChange" class="custom_radio">
              <el-radio label="year">按年</el-radio>
              <el-radio label="month">按月</el-radio>
              <el-radio label="date">按日</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label=" ">
            <el-date-picker
              v-model="formData.startQueryDate"
              :type="timeType"
              :format="date_format"
              :value-format="value_format"
              placeholder="请选择日期"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="-">
            <el-date-picker
              v-model="formData.endQueryDate"
              :type="timeType"
              :format="date_format"
              :value-format="value_format"
              placeholder="请选择日期"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item class="ml-2">
            <el-button type="primary" icon="el-icon-search" @click="query">查询</el-button>
            <el-button type="primary" icon="el-icon-refresh" @click="reset">重置</el-button>
          </el-form-item>
          <el-form-item style="margin-right: 0;float:right">
            <el-button class="border-btn b-b-b" type="primary" icon="el-icon-upload2" @click="exportData">导出</el-button>
          </el-form-item>
        </el-form>
        <!---->
        <el-table
          v-if="radioType == 1"
          :data="tableData1"
          v-loading="loading1"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(30, 42, 69, 0.8)"
          class="table-class"
        >
          <el-table-column type="index" label="序号" width="100" align="center"></el-table-column>
          <el-table-column prop="pointId" label="点位ID" align="center"></el-table-column>
          <el-table-column prop="pointName" label="点位名称" min-width="150" align="center"></el-table-column>
          <el-table-column prop="startValue" label="设备状态" align="center" />
          <el-table-column prop="startTime" label="开始时间" align="center" />
          <el-table-column prop="endTime" label="结束时间" align="center" />
          <el-table-column prop="duration" label="持续时长" align="center" />
        </el-table>
        <!---->
        <el-table
          v-if="radioType == 2"
          :data="tableData2"
          v-loading="loading2"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(30, 42, 69, 0.8)"
          class="table-class"
        >
          <el-table-column type="index" label="序号" width="100" align="center"></el-table-column>
          <el-table-column prop="pointId" label="点位ID" align="center"></el-table-column>
          <el-table-column prop="pointName" label="点位名称" align="center"></el-table-column>
          <el-table-column prop="avgVal" label="点位值" align="center" />
          <el-table-column prop="recordTime" label="采集时间" align="center" />
        </el-table>
        <!---->
        <el-table
          v-if="radioType == 3"
          :data="tableData3"
          v-loading="loading3"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(30, 42, 69, 0.8)"
          class="table-class"
        >
          <el-table-column type="index" label="序号" width="100" align="center"></el-table-column>
          <el-table-column prop="pointId" label="点位ID" align="center"></el-table-column>
          <el-table-column prop="pointName" label="点位名称" align="center"></el-table-column>
          <!-- <el-table-column prop="avgVal" label="点位值" align="center" /> -->
          <el-table-column prop="duration" label="运行时长" align="center" />
        </el-table>

        <el-pagination
          style="float: right; margin-top: 20px"
          @current-change="handleCurrentChange"
          :current-page="paging.pageNo"
          :page-size="paging.pageSize"
          layout="total, prev, pager, next, jumper"
          :total="paging.total"
        />
      </el-main>
    </section>
  </section>
</template>

<script>
import dayjs from "dayjs";
import { getColdStationTree, getStatusList, getSensorList, exportExcel, getRunTimeList } from "@/api/cold-station";

export default {
  data() {
    return {
      date_format: "yyyy-MM",
      value_format: "yyyy-MM",
      radioType: "1",
      timeType: "month",
      formData: {
        parentOrgId: "00010017",
        orgIdList: [],
        dateType: "month",
        orgName: "",
        startQueryDate: dayjs(new Date()).format("YYYY-MM"),
        endQueryDate: dayjs(new Date()).format("YYYY-MM"),
      },
      tableData1: [],
      tableData2: [],
      tableData3: [],
      treeData: [
        {
          label: "一级 1",
          children: [
            {
              label: "二级 1-1",
            },
          ],
        },
        {
          label: "一级 2",
          children: [
            {
              label: "二级 2-1",
            },
            {
              label: "二级 2-2",
            },
          ],
        },
        {
          label: "一级 3",
          children: [
            {
              label: "二级 3-1",
            },
            {
              label: "二级 3-2",
            },
          ],
        },
      ],
      activeName: "武广冷站",
      defaultProps: {
        children: "children",
        label: "name",
      },
      selectedList: [],
      paging: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      loading1: false,
      loading2: false,
      loading3: false,
    };
  },
  created() {
    this.getTreeData();
    this.getStatusData();
  },

  methods: {
    typeChange() {
      console.log(this.timeType, "t");
      if (this.timeType == "month") {
        this.date_format = "yyyy-MM";
        this.value_format = "yyyy-MM";
        this.formData.dateType = "month";
        this.formData.startQueryDate = dayjs(new Date()).format("YYYY-MM");
        this.formData.endQueryDate = dayjs(new Date()).format("YYYY-MM");
      } else if (this.timeType == "year") {
        this.date_format = "yyyy";
        this.value_format = "yyyy";
        this.formData.dateType = "year";
        this.formData.startQueryDate = dayjs(new Date()).format("YYYY");
        this.formData.endQueryDate = dayjs(new Date()).format("YYYY");
      } else {
        this.date_format = "yyyy-MM-dd";
        this.value_format = "yyyy-MM-dd";
        this.formData.dateType = "day";
        this.formData.startQueryDate = dayjs(new Date()).format("YYYY-MM-DD");
        this.formData.endQueryDate = dayjs(new Date()).format("YYYY-MM-DD");
      }
    },

    // tab栏点击
    tabsClick(val) {
      this.activeName = val.label;
      this.formData.parentOrgId = val.name;
      this.tableData1 = [];
      this.tableData2 = [];
      this.formData.orgName = "";
      this.formData.orgIdList = [];
      this.$refs.treeRef.setCheckedNodes([]);
      this.getTreeData();
      if (this.radioType == 1) {
        this.getStatusData();
      } else if (this.radioType == 2) {
        this.getSensorData();
      } else {
        this.getRunTimeData();
      }
    },

    // 列表切换
    radioChange(val) {
      this.paging = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      };
      if (val == 1) {
        this.getStatusData();
      } else if (val == 2) {
        this.getSensorData();
      } else {
        this.getRunTimeData();
      }
    },

    // 复选框点击
    handleNodeClick(val, nodes) {
      console.log(nodes.checkedNodes, "node");
      this.selectedList = nodes.checkedNodes;
      this.formData.orgIdList = nodes.checkedNodes.map((item) => item.id);
      this.formData.orgName = nodes.checkedNodes.map((item) => item.name).join(",");
      console.log(this.formData.orgName, "name");
    },

    // 获取树状数据
    getTreeData() {
      getColdStationTree(this.formData.parentOrgId).then((res) => {
        this.treeData = res.data;
      });
    },

    // 获取设备状态列表
    getStatusData() {
      this.loading1 = true;
      const data = {
        // ...this.formData,
        startQueryDate: this.formData.startQueryDate,
        endQueryDate: this.formData.endQueryDate,
        orgIdList: this.formData.orgIdList,
        dateType: this.formData.dateType,
        parentOrgId: this.formData.parentOrgId,
        pageNo: this.paging.pageNo,
        pageSize: this.paging.pageSize,
      };
      getStatusList(data).then((res) => {
        console.log(res, "status");
        this.tableData1 = res.data.records;
        this.paging.total = res.data.total;
        this.loading1 = false;
      });
    },

    // 获取传感器列表
    getSensorData() {
      this.loading2 = true;
      const data = {
        startQueryDate: this.formData.startQueryDate,
        endQueryDate: this.formData.endQueryDate,
        orgIdList: this.formData.orgIdList,
        dateType: this.formData.dateType,
        parentOrgId: this.formData.parentOrgId,
        pageNo: this.paging.pageNo,
        pageSize: this.paging.pageSize,
      };
      getSensorList(data).then((res) => {
        console.log(res, "sensor");
        this.tableData2 = res.data.records;
        this.paging.total = res.data.total;
        this.loading2 = false;
      });
    },

    // 运行时长列表
    getRunTimeData() {
      this.loading3 = true;
      const data = {
        startQueryDate: this.formData.startQueryDate,
        endQueryDate: this.formData.endQueryDate,
        orgIdList: this.formData.orgIdList,
        dateType: this.formData.dateType,
        parentOrgId: this.formData.parentOrgId,
        pageNo: this.paging.pageNo,
        pageSize: this.paging.pageSize,
      };
      getRunTimeList(data).then((res) => {
        console.log(res, "runTime");
        this.tableData3 = res.data.records;
        this.paging.total = res.data.total;
        this.loading3 = false;
      });
    },

    // 分页
    handleCurrentChange(newPage) {
      this.paging.pageNo = newPage;
      this.query();
    },

    //查询
    query() {
      if (this.radioType == 1) {
        this.getStatusData();
      } else if (this.radioType == 2) {
        this.getSensorData();
      } else {
        this.getRunTimeData();
      }
    },
    //重置
    reset() {
      this.timeType = "month";
      this.formData.startQueryDate = dayjs(new Date()).format("YYYY-MM");
      this.formData.endQueryDate = dayjs(new Date()).format("YYYY-MM");
      this.formData.dateType = "month";
      this.value_format = "yyyy-MM";
      this.date_format = "yyyy-MM";
      this.formData.orgName = "";
      this.formData.orgIdList = [];
      this.$refs.treeRef.setCheckedNodes([]);
      this.getStatusData();
    },

    // 导出
    exportData() {
      const data = {
        startQueryDate: this.formData.startQueryDate,
        endQueryDate: this.formData.endQueryDate,
        orgIdList: this.formData.orgIdList,
        dateType: this.formData.dateType,
        parentOrgId: this.formData.parentOrgId,
        type: this.radioType == 1 ? "status" : this.radioType == 2 ? "sensor" : "runtime",
      };
      exportExcel(data).then((res) => {
        let data = res;
        if (!data) {
          return;
        }
        let url = window.URL.createObjectURL(new Blob([data]));
        let link = document.createElement("a");
        link.style.display = "none";
        link.href = url;
        link.setAttribute("download", "冷站运行参数.xls");
        document.body.appendChild(link);
        link.click();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.container_warp {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.container_box {
  // width: 1740px;
  height: 100%;
  overflow: auto;
  min-width: 1740px;
}

.el-main {
  margin: 0 20px;
}

::v-deep.el-tabs {
  background: none !important;
  border: none;

  .el-tabs__nav-wrap::after {
    background-color: #2a3e62;
  }

  .el-tabs__content {
    // padding-top: 15px !important;
  }

  > .el-tabs__header {
    border-color: #2a3e62;
    background: none !important;

    .el-tabs__item.is-active {
      background-color: transparent;
      border: none;
      color: #409eff !important;
    }

    .el-tabs__item {
      border: none;
      color: #fff;
    }
  }
}

::v-deep.el-form-item {
  > .el-form-item__label {
    color: #fff;
  }
}

::v-deep.el-radio-group {
  > .is-active {
    .el-radio-button__inner {
      background-color: #409eff !important;
    }
  }

  .el-radio-button__inner {
    background: #2a3e62 !important;
    color: #fff !important;
    border: none !important;
  }
}

.el-form {
  margin: 10px 0;
}

::v-deep.el-input > .el-input__inner {
  text-overflow: ellipsis;
}
.table-class{
    height: calc(100vh - 360px);
}
</style>
