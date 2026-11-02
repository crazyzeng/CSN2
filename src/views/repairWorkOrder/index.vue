<!-- 维修工单 -->
<template>
  <div class="repair_work_order">
    <div class="navigation rounded-lg shadow-lg bg-white">
      <div class="navigation_echarts flex justify-between">
        <div class="left h-full w-1/2">
          <LeftBar :data-item="dataItem" @update="barClick"></LeftBar>
        </div>
        <div class="right h-full w-1/2 flex justify-between relative mt-4">
          <div class="h-full w-1/2 overflow-hidden relative">
            <span style="color: #000; position: absolute;">{{ curMonth }}</span>
            <RightPie1 :data-item="pieItem"></RightPie1>
          </div>
          <div class="h-full w-1/2 overflow-hidden relative">
            <span style="color: #000; position: absolute;">同比 — {{ curMonth }}</span>
            <RightPie2 :data-item="pieItem1"></RightPie2>
          </div>
        </div>
      </div>
    </div>
    <div class="search">
      <el-form :inline="true" :model="formData">
        <el-row :gutter="2">
          <el-col :span="4">
            <el-form-item label="工单编号" label-width="90px">
              <el-input v-model="formData.orderNumber" placeholder="请输入工单编号" />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="设备编号"  label-width="90px">
              <el-input v-model="formData.equipmentNumber" placeholder="请输入设备编号" />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="设备名称">
              <el-input v-model="formData.equipmentName" placeholder="请输入设备名称" />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="工单来源">
              <el-select v-model="formData.source">
                <el-option v-for="item in workOrderSourceList" :key="item.value" :label="item.label"
                  :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="工单状态">
              <el-select v-model="formData.orderStatus">
                <el-option v-for="item in workOrderStatusList" :key="item.itemValue" :label="item.itemText"
                  :value="item.itemValue" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="2">
          <el-col :span="8">
            <el-form-item label="工单创建时间">
              <el-date-picker v-model="rangeDate" type="daterange" range-separator="至" start-placeholder="开始日期"
                end-placeholder="结束日期" value-format="yyyy-MM-dd" format="yyyy-MM-dd" :clearable="false"
                 style="width: 350px; border-radius: 50px;" />
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
              <el-button type="primary" icon="el-icon-setting" @click="addFault">故障申报</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="table">
      <el-table :data="tableData" height="100%" border :default-sort="{ prop: 'createTime', order: 'descending' }">
        <el-table-column prop="orderNumber" align="center" label="工单编号" width="200"> </el-table-column>
        <el-table-column prop="equipmentNumber" align="center" label="设备编号" width=""> </el-table-column>
        <el-table-column prop="equipmentName" align="center" label="设备名称" width=""> </el-table-column>
        <el-table-column prop="installLocation" align="center" label="设备安装位置" width="120" show-overflow-tooltip
          resizable>
        </el-table-column>
        <el-table-column prop="description" align="center" label="故障描述" width="150" show-overflow-tooltip resizable>
        </el-table-column>
        <el-table-column prop="source" align="center" label="工单来源" width=""> </el-table-column>
        <el-table-column prop="createTime" align="center" label="工单创建时间" sortable width="200"> </el-table-column>
        <el-table-column prop="dept" align="center" label="责任部门" width=""> </el-table-column>
        <el-table-column prop="username" align="center" label="维修人员" width="100" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="status" align="center" label="工单状态" width="90">
          <template #default="{ row }">{{ orderStatusTrans(workOrderStatusList, row.status) }}</template>
        </el-table-column>
        <el-table-column prop="location" align="center" label="指派" width="80">
          <template #default="{ row }">
            <el-link class="blue-link" :disabled="row.status === '1' || row.status === '2'"
              @click="appointRow(row)">指派</el-link>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="250">
          <template #default="{ row }">
            <el-link class="blue-link" @click="detailRow(row)">详情</el-link>
            <el-link class="blue-link ml-1"
              :disabled="row.status === '2' || row.username === null || row.username !== curUser"
              @click="dealRow(row)">处理</el-link>
            <el-link class="yellow-link ml-1" v-if="row.status === '1'" @click="orderTransfer(row)">转单</el-link>
            <el-link class="blue-link ml-1" :disabled="row.status !== '0'" @click="editRow(row)">编辑</el-link>
            <el-link class="red-link ml-1" :disabled="row.status !== '0'" @click="deleteRow(row)">删除</el-link>
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
import LeftBar from "./charts/LeftBar.vue";
import RightPie1 from "./charts/RightPie1.vue";
import RightPie2 from "./charts/RightPie2.vue";
import resize from "@/utils/resize.js";
import AddOrEditDialog from "./dialog/AddOrEditDialog.vue";
import AppointDialog from "./dialog/AppointDialog.vue";
import DealOrDetailDialog from "./dialog/DealOrDetailDialog.vue";
import { getRepairWorkOrderByPage, deleteRepairWorkOrder, getOverViewData, handleTransfer } from "@/api/repair-workorder.js";
import { getDict, dictTrans } from "@/api/common";
import { numberTransfer } from "@/utils";
export default {
  name: "workOrder",
  components: { LeftBar, RightPie1, RightPie2, AppointDialog, DealOrDetailDialog, AddOrEditDialog },
  mixins: [resize],

  data() {
    return {
      paging: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      formData: {
        orderNumber: "",
        equipmentNumber: "",
        equipmentName: "",
        source: "",
        startTime: "",
        endTime: "",
        orderStatus: "",
        username: "",
      },
      rangeDate: "",
      tableData: [],
      workOrderSourceList: [
        { label: "自动生成", value: "自动生成" },
        { label: "人工申报", value: "人工申报" },
      ],
      workOrderStatusList: [],
      dataItem: {},
      pieItem: {},
      pieItem1: {},
      curMonth: "",
      curUser: "",
    };
  },

  computed: {},

  mounted() {
    const params = this.$route.params.orderStatus || "";
    this.formData.orderStatus = params;
    getDict("repair_status").then((res) => {
      if (res.code === 200 && res.data) this.workOrderStatusList = res.data;
    });
    this.getData();
    this.curUser = this.$store.getters.user.realName;
  },

  methods: {
    getData() {
      getOverViewData().then((res) => {
        if (res.code === 200 && res.data) {
          this.dataItem = res.data;
          this.pieItem = res.data.now.yearCompare;
          this.pieItem1 = res.data.compare.yearCompare;
        }
      });
      if (this.rangeDate.length > 0) {
        this.formData.startTime = this.rangeDate[0];
        this.formData.endTime = this.rangeDate[1];
      }
      getRepairWorkOrderByPage(this.formData, this.paging).then((res) => {
        if (res.code === 200 && res.data) {
          this.tableData = res.data.records;
          this.paging.total = res.data.total;
        }
      });
      this.curMonth = "年度";
    },
    orderTransfer(item) {
      this.$confirm("确认转单？", "提示", {
        confirmButtonClass: "confirm-btn ",
        cancelButtonClass: "cancel-btn ",
        confirmButtonClass: 'confirm-btn ',
        cancelButtonClass: 'cancel-btn ',
      })
        .then(() => {
          handleTransfer(item.id).then((res) => {
            if (res.code === 200) {
              this.$message.success("转单成功");
              this.reset();
            }
          });
        })
        .catch(() => { });
    },
    barClick(index) {
      this.pieItem = this.dataItem.now.chart[index];
      this.pieItem1 = this.dataItem.compare.chart[index];
      this.curMonth = numberTransfer(index + 1) + "月";
    },
    query() {
      this.getData();
    },
    reset() {
      this.paging.pageNo = 1;
      this.paging.pageSize = 10;
      for (let k in this.formData) this.formData[k] = "";
      this.rangeDate = "";
      this.getData();
    },
    handleCurrentChange(val) {
      this.paging.pageNo = val;
      this.query();
    },
    //故障申报
    addFault() {
      this.$refs.AddOrEditDialogRef?.open("add");
    },
    assignDone() {
      this.reset();
    },
    // 指派
    appointRow(row) {
      this.$refs.AppointDialogRef?.open(row);
    },
    // 详情
    detailRow(row) {
      this.$refs.DealDialogRef?.open("detail", row);
    },
    // 处理
    dealRow(row) {
      this.$refs.DealDialogRef?.open("deal", row);
    },
    // 编辑
    editRow(row) {
      this.$refs.AddOrEditDialogRef?.open("edit", row);
    },
    //删除
    deleteRow(data) {
      this.$confirm("删除该记录, 是否继续?", "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        confirmButtonClass: 'confirm-btn ',
        cancelButtonClass: 'cancel-btn ',
        type: "warning",
      })
        .then(() => {
          deleteRepairWorkOrder(data.id).then((res) => {
            if (res.code === 200) {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.getData();
            }
          });
        })
        .catch(() => { });
    },
    orderStatusTrans(data, code) {
      return dictTrans(data, code);
    },
  },
};
</script>
<style lang="scss" scoped>
.repair_work_order {
  width: 100%;
  height: 100%;
  position: relative;

  .navigation {
    width: 100%;
    height: calc(35% - 15px);
    margin-bottom: 15px;
    border-radius: 10px;

    .navigation_echarts {
      width: 100%;
      height: 100%;
    }
  }

  .search {
    width: 100%;
    height: calc(12% - 15px);
    margin-bottom: 15px;
  }

  .table {
    width: 100%;
    height: 53%;
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
