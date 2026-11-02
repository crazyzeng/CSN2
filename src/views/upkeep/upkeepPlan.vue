<!-- 保养计划 -->
<template>
  <section class="container_warp">
    <el-form :inline="true" :model="formData" class="">
      <el-form-item label="计划编号">
        <el-input v-model="formData.planNo" placeholder="请输入计划编号"></el-input>
      </el-form-item>
      <el-form-item label="计划名称">
        <el-input v-model="formData.name" placeholder="请输入计划名称"></el-input>
      </el-form-item>
      <el-form-item label="保养类型">
        <el-select v-model="formData.type">
          <el-option v-for="item in upkeepTypeList" :key="item.value" :label="item.label"
            :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="计划状态">
        <el-select v-model="formData.status">
          <el-option v-for="item in planStatusList" :key="item.value" :label="item.label"
            :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="" style="float:right;margin-right: 0;">
        <el-button type="primary" icon="el-icon-search" @click="query">查询</el-button>
        <el-button type="primary" icon="el-icon-refresh" @click="reset">重置</el-button>
      </el-form-item>
      <el-row>
        <el-form-item label="">
          <el-button type="primary" icon="el-icon-plus" @click="addPlan">新增计划</el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <!--表格-->
    <div class="table_div">
      <el-table :data="tableData" height="100%">
        <el-table-column prop="planNo" align="center" label="计划编号" width="200"> </el-table-column>
        <el-table-column prop="name" align="center" label="计划名称" min-width="100"> </el-table-column>
        <el-table-column prop="type" align="center" label="保养类型" min-width="120">
          <template #default="{ row }">
            <div>
              {{ transType(row.type) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" align="center" label="计划生成时间" width="200"> </el-table-column>
        <el-table-column prop="stopTime" align="center" label="计划停止时间" width="200"> </el-table-column>
        <el-table-column prop="status" align="center" label="计划状态" width="100">
          <template #default="{ row }">
            <div>
              {{ transStatus(row.status) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="">
          <template #default="{ row }">
            <el-button type="text" class="detailBtn" @click="detailRow(row)">详情</el-button>
            <el-button type="text" class="startBtn" @click="startRow(row)" :disabled="row.status !== 0">启用</el-button>
            <el-button type="text" class="stopBtn" @click="stopRow(row)" :disabled="row.status !== 1">停用</el-button>
            <el-button type="text" class="editBtn" @click="editRow(row)" :disabled="row.status === 2">编辑</el-button>
            <el-button type="text" class="delBtn" @click="deleteRow(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="th-pagination">
        <el-pagination style="float: right; margin-top: 10px" @current-change="handleCurrentChange" background
          :current-page="paging.pageNo" :page-size="paging.pageSize" layout="total, prev, pager, next, jumper"
          :total="paging.total">
        </el-pagination>
      </div>
    </div>
    <AddOrEditDialog ref="AddOrEditDialogRef" @submit="submit"></AddOrEditDialog>
    <DetailDialog ref="DealDialogRef"></DetailDialog>
  </section>
</template>

<script>
import resize from "@/utils/resize.js";
import AddOrEditDialog from "./dialog/plan/AddOrEditDialog.vue";
import DetailDialog from "./dialog/plan/DetailDialog.vue";
import { getPlanPage, startStop, delPlan } from "@/api/upkeep/plan.js";

export default {
  name: "planOrder",
  components: { DetailDialog, AddOrEditDialog },
  mixins: [resize],

  data() {
    return {
      paging: {
        pageNo: 1,
        pageSize: 10,
        total: 10,
      },
      formData: {
        planNo: "",
        name: "",
        type: "",
        status: "",
      },
      tableData: [],
      upkeepTypeList: [
        { label: "常规保养", value: "0" },
        { label: "一级保养", value: "1" },
        { label: "二级保养", value: "2" },
      ],
      planStatusList: [
        { label: "启用中", value: "1" },
        { label: "停用中", value: "0" },
        { label: "过期", value: "2" },
      ],
      repairPeopleList: [],
    };
  },

  computed: {},

  mounted() {
    this.query();
  },

  methods: {
    query() {
      getPlanPage(this.paging, this.formData).then((res) => {
        this.tableData = res.data.records;
        this.paging.total = res.data.total;
      });
    },
    reset() {
      for (let k in this.formData) this.formData[k] = "";
      this.paging.pageNo = 1;
      this.paging.pageSize = 10;
      this.query();
    },
    handleCurrentChange(val) {
      this.paging.pageNo = val;
      this.query();
    },
    // 新增
    addPlan() {
      this.$refs.AddOrEditDialogRef?.open("add", "");
    },
    // 详情
    detailRow(row) {
      this.$refs.DealDialogRef?.open(row);
    },
    //启用
    startRow(data) {
      this.$confirm("启用该计划, 是否继续?", "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        type: "warning",
      })
        .then(() => {
          let status = data.status ? 0 : 1;
          startStop(data.id, status).then((res) => {
            if (res.code === 200) {
              this.$message({ type: "success", message: "启用成功!" });
              this.query();
            } else {
              this.$message({ type: "error", message: res.msg || "启用失败!" });
            }
          });
        })
        .catch(() => { });
    },
    //停用
    stopRow(data) {
      this.$confirm("停用该计划, 是否继续?", "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        type: "warning",
      })
        .then(() => {
          let status = data.status ? 0 : 1;
          startStop(data.id, status).then((res) => {
            if (res.code === 200) {
              this.$message({ type: "success", message: "停用成功!" });
              this.query();
            } else {
              this.$message({ type: "error", message: res.msg || "停用失败!" });
            }
          });
        })
        .catch(() => { });
    },
    //编辑
    editRow(row) {
      this.$refs.AddOrEditDialogRef?.open("edit", row);
    },
    // 删除
    deleteRow(data) {
      this.$confirm("删除该记录, 是否继续?", "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        type: "warning",
      })
        .then(() => {
          delPlan(data.id).then((res) => {
            if (res.code === 200) {
              this.$message({ type: "success", message: "删除成功!" });
            } else {
              this.$message({ type: "success", message: res.msg || "删除失败!" });
            }
          });
          this.query();
        })
        .catch(() => { });
    },
    submit() {
      this.query();
    },
    // 翻译table中保养类型，计划状态
    transType(val) {
      for (let i = 0; i < this.upkeepTypeList.length; i++) {
        if (val == this.upkeepTypeList[i].value) return this.upkeepTypeList[i].label;
      }
    },
    transStatus(val) {
      for (let i = 0; i < this.planStatusList.length; i++) {
        if (val == this.planStatusList[i].value) return this.planStatusList[i].label;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.container_warp {
  width: 100%;
  height: 100%;
}


.table_div {
  width: 100%;
  height: calc(100vh - 204px);
  min-height: 400px;
  background-color: #fff !important;
  border-radius: 10px;
  box-shadow: 0 0 6px rgba(90, 151, 250, 0.3);
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.curTable {
  height: calc(100% - 140px) !important;
}

::v-deep.el-table--scrollable-x .el-table__body-wrapper {
  height: calc(100% - 130px) !important;
}

//

::v-deep.el-range-editor--mini .el-range-input {
  margin-left: 10px;
}

//
.th-main-view {
  // padding: 0 20px;
  padding-top: 0;
}

::v-deep(.th-main-title) {
  h2 {
    line-height: normal !important;
    margin-left: 5px !important;
  }
}
</style>
