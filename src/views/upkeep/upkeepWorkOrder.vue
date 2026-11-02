<!-- 保养工单 -->
<template>
  <div class="upkeep_work_order">
    <div class="navigation rounded-lg shadow-lg bg-white">
      <el-tabs v-model="upkeepType" @tab-click="upkeepTypeChange">
        <el-tab-pane label="常规保养" name="常规保养"></el-tab-pane>
        <el-tab-pane label="一级保养" name="一级保养"></el-tab-pane>
        <el-tab-pane label="二级保养" name="二级保养"></el-tab-pane>
      </el-tabs>
      <div class="navigation_echarts flex justify-between">
        <div class="left h-full w-1/2">
          <LeftBar :barData="barData" @monthChange="monthChange"></LeftBar>
        </div>
        <div class="right h-full w-1/2 flex justify-between relative">
          <div class="h-full w-1/2 overflow-hidden relative">
            <span style="color: #000; position: absolute;">{{ curMonth }}({{ leftPieTitle }})</span>
            <RightPie1 :rightPieData="rightPieData1"></RightPie1>
          </div>
          <div class="h-full w-1/2 overflow-hidden relative">
            <span style="color: #000; position: absolute;">同比 — {{ curMonth }}({{ rightPieTitle }})</span>
            <RightPie2 :rightPieData="rightPieData2"></RightPie2>
          </div>
        </div>
      </div>
    </div>
    <div class="search mb-4">
      <el-form ref="formRef" :inline="true" :model="formData">
        <el-row :gutter="2">
          <el-col :span="4">
            <el-form-item label="工单编号">
              <el-input v-model="formData.workNo" placeholder="请输入工单编号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="工单名称">
              <el-input v-model="formData.name" placeholder="请输入工单名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="保养类型">
              <el-select v-model="formData.type">
                <el-option v-for="item in upkeepTypeList" :key="item.value" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="保养人员">
              <el-input v-model="formData.maintainUserRealName" placeholder="保养人员"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="工单状态">
              <el-select v-model="formData.status">
                <el-option v-for="item in workOrderStatusList" :key="item.value" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="2">
          <el-col :span="8">
            <el-form-item label="工单生成时间">
              <el-date-picker v-model="formData.createTime" type="daterange" range-separator="至"
                start-placeholder="开始日期" end-placeholder="结束日期" :clearable="false"
                style="border-radius: 50px;width: 360px;" value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="">
            </el-form-item>
          </el-col>
          <el-col :span="8" style="text-align: right;">
            <el-form-item label-width="0">
              <el-button type="primary" icon="el-icon-search" @click="query">查询</el-button>
              <el-button type="primary" icon="el-icon-refresh" @click="reset">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="table">
      <el-table class="curTable" height="100%" :data="tableData">
        <el-table-column prop="workNo" align="center" label="工单编号" min-width="180"> </el-table-column>
        <el-table-column prop="name" align="center" label="工单名称" min-width="100"> </el-table-column>
        <el-table-column prop="type" align="center" label="保养类型" min-width="150">
          <template #default="{ row }">
            <div v-if="row.type == 0">常规保养</div>
            <div v-if="row.type == 1">一级保养</div>
            <div v-if="row.type == 2">二级保养</div>
          </template>
        </el-table-column>
        <el-table-column prop="source" align="center" label="工单来源" min-width="150">
          <template #default="{ row }">
            <div v-if="row.source == 0">保养计划</div>
            <div v-if="row.source == 1">健康评估</div>
          </template>
        </el-table-column>
        <el-table-column prop="generateTime" align="center" label="工单生成时间" width="200"> </el-table-column>
        <el-table-column prop="distributedTime" align="center" label="工单派发时间" width="200"> </el-table-column>
        <el-table-column prop="maintainDepart" align="center" label="责任部门" min-width="150"> </el-table-column>
        <el-table-column prop="maintainUserRealName" align="center" label="保养人员" min-width="120"> </el-table-column>
        <el-table-column prop="location" align="center" label="指派" width="80">
          <template #default="{ row }">
            <el-button type="text" class="appointBtn" @click="appointRow(row)"
              :disabled="row.status === '1'">指派</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="status" align="center" label="工单状态" min-width="100">
          <template #default="{ row }">
            <div v-if="row.status === 0">进行中</div>
            <div v-if="row.status === 1">已完成</div>
            <div v-if="row.status === 2">转单中</div>
            <div v-if="row.status === 3">已处理</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="120">
          <template #default="{ row }">
            <el-button type="text" @click="detailRow(row)">详情</el-button>
            <el-button v-if="row.status === 3" type="text" @click="doFinish(row)">完结</el-button>
            <el-button v-else type="text" @click="dealRow(row)"
              :disabled="row.status === 1 || row.maintainUserRealName === null || curUser !== row.maintainUserRealName">处理</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="th-pagination">
        <el-pagination @current-change="handleCurrentChange" background :current-page="paging.pageNo"
          :page-size="paging.pageSize" layout="total, prev, pager, next, jumper" :total="paging.total">
        </el-pagination>
      </div>
    </div>
    <AddOrEditDialog ref="AddOrEditDialogRef"></AddOrEditDialog>
    <AppointDialog ref="AppointDialogRef" @success="reset()"></AppointDialog>
    <DealOrDetailDialog ref="DealDialogRef" @success="reset()"></DealOrDetailDialog>
  </div>
</template>

<script>
import { numberTransfer } from "@/utils";
import LeftBar from "./charts/LeftBar.vue";
import RightPie1 from "./charts/RightPie1.vue";
import RightPie2 from "./charts/RightPie2.vue";
import resize from "@/utils/resize.js";
import AddOrEditDialog from "./dialog/upkeepOrder/AddOrEditDialog.vue";
import AppointDialog from "./dialog/upkeepOrder/AppointDialog.vue";
import DealOrDetailDialog from "./dialog/upkeepOrder/DealOrDetailDialog.vue";
import { getWorkOrderPage, getStatisticalInfo, handleFinish } from "@/api/upkeep/workOrder.js";

export default {
  name: "workOrder",
  components: { LeftBar, RightPie1, RightPie2, AppointDialog, DealOrDetailDialog, AddOrEditDialog },
  mixins: [resize],

  data() {
    return {
      upkeepType: "常规保养",
      leftPieTitle: "常规保养",
      rightPieTitle: "常规保养",
      paging: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      formData: {
        name: "",
        workNo: "",
        type: "",
        status: "",
        maintainUserRealName: "",
        createTime: [],
      },
      tableData: [],
      upkeepTypeList: [
        { label: "常规保养", value: "0" },
        { label: "一级保养", value: "1" },
        { label: "二级保养", value: "2" },
      ],
      workOrderStatusList: [
        { label: "进行中", value: "0" },
        { label: "已完成", value: "1" },
        { label: "转单中", value: "2" },
        { label: "已处理", value: "3" },
      ],
      repairPeopleList: [],
      barData: {},
      barDataAll: {},
      rightPieData1: {},
      rightPieData2: {},
      curMonth: "年度",
      curUser: "",
    };
  },

  computed: {},

  mounted() {
    const params = this.$route.params.status || "";
    this.formData.status = params;

    this.getStatistical();
    this.query();
    this.curUser = this.$store.getters.user.realName;
  },

  methods: {
    getStatistical() {
      getStatisticalInfo().then((res) => {
        this.barDataAll = res.data;
        this.barData = {
          cur: res.data.current.normal,
          last: res.data.last.normal,
        };
        this.rightPieData1 = this.barDataAll.current.yearStatisticalMap["0"];
        this.rightPieData2 = this.barDataAll.last.yearStatisticalMap["0"];
      });
    },
    query() {
      let pushData = {
        name: this.formData.name,
        workNo: this.formData.workNo,
        type: this.formData.type,
        status: this.formData.status,
        maintainUserRealName: this.formData.maintainUserRealName,
        startDate: this.formData.createTime[0] || "",
        endDate: this.formData.createTime[1] || "",
      };
      getWorkOrderPage(this.paging, pushData).then((res) => {
        if (res.code === 200 && res.data) {
          this.tableData = res.data.records;
          this.paging.total = res.data.total;
        }
      });
    },
    reset() {
      for (const k in this.formData) {
        this.formData[k] = "";
      }
      this.paging.pageNo = 1;
      this.paging.pageSize = 10;
      this.query();
    },
    handleCurrentChange(val) {
      this.paging.pageNo = val;
      this.query();
    },
    doFinish(data) {
      this.$confirm("确定完成该工单?", "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        type: "warning",
      })
        .then(() => {
          handleFinish(data.id).then((res) => {
            if (res.code === 200) {
              this.$message.success("已完结");
              this.reset();
            }
          });
        })
        .catch(() => { });
    },
    upkeepTypeChange(val) {
      const data = val.name
      if (data === "常规保养") {
        this.barData = {
          cur: this.barDataAll.current.normal,
          last: this.barDataAll.last.normal,
        };
        this.rightPieData1 = this.barDataAll.current.yearStatisticalMap["0"];
        this.rightPieData2 = this.barDataAll.last.yearStatisticalMap["0"];
      }
      if (data === "一级保养") {
        this.barData = {
          cur: this.barDataAll.current.levelFirst,
          last: this.barDataAll.last.levelFirst,
        };
        this.rightPieData1 = this.barDataAll.current.yearStatisticalMap["1"];
        this.rightPieData2 = this.barDataAll.last.yearStatisticalMap["1"];
      }
      if (data === "二级保养") {
        this.barData = {
          cur: this.barDataAll.current.levelSecond,
          last: this.barDataAll.last.levelSecond,
        };
        this.rightPieData1 = this.barDataAll.current.yearStatisticalMap["2"];
        this.rightPieData2 = this.barDataAll.last.yearStatisticalMap["2"];
      }
      this.leftPieTitle = data;
      this.rightPieTitle = data;
    },
    monthChange(data) {
      this.curMonth = numberTransfer(data + 1) + "月";

      switch (this.upkeepType) {
        case "常规保养":
          this.rightPieData1 = this.barDataAll.current.statisticalMap[data]["0"];
          this.rightPieData2 = this.barDataAll.last.statisticalMap[data]["0"];
          break;
        case "一级保养":
          this.rightPieData1 = this.barDataAll.current.statisticalMap[data]["1"];
          this.rightPieData2 = this.barDataAll.last.statisticalMap[data]["1"];
          break;
        case "二级保养":
          this.rightPieData1 = this.barDataAll.current.statisticalMap[data]["2"];
          this.rightPieData2 = this.barDataAll.last.statisticalMap[data]["2"];
          break;
        default:
          break;
      }
    },
    // 指派
    appointRow(row) {
      this.$refs.AppointDialogRef?.open(row, this.repairPeopleList);
    },
    // 详情
    detailRow(row) {
      this.$refs.DealDialogRef?.open("detail", row);
    },
    // 处理
    dealRow(row) {
      this.$refs.DealDialogRef?.open("deal", row);
    },
  },
};
</script>
<style lang="scss" scoped>
.upkeep_work_order {
  width: 100%;
  height: 100%;
  position: relative;

  .navigation {
    width: 100%;
    height: calc(37% - 10px);
    margin-bottom: 15px;
    border-radius: 10px;

    .navigation_echarts {
      width: 100%;
      height: 100%;
    }
  }

  .search {
    width: 100%;
    height: 10%;
    // margin-bottom: 15px;

    ::v-deep .search-form {
      display: flex;
      flex-wrap: wrap;
      width: 100%;
    }
  }

  .table {
    width: 100%;
    height: 50%;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(90, 151, 250, 0.3);
    padding: 20px;
    display: flex;
    flex-direction: column;
  }
}

::v-deep .el-tabs__nav {
  margin-left: 50px;
}
</style>
