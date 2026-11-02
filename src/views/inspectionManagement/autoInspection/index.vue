<!-- 智能巡检 -->
<template>
  <section class="container_warp h-full">
    <el-form :model="formData" :inline="true">
      <el-form-item label="任务名称">
        <el-input v-model="formData.inspectName" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="formData.inspectStatus">
          <el-option v-for="item in statusOptions" :key="item.itemValue" :label="item.itemText"
            :value="item.itemValue"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="query">查询</el-button>
        <el-button type="primary" icon="el-icon-refresh" @click="reset">重置</el-button>
      </el-form-item>
      <el-button type="primary" plain style="float: right" icon="el-icon-setting" @click="setting">配置</el-button>
      <div class="btn_group">
        <el-button type="primary" plain @click="add">新增任务</el-button>
        <el-button type="primary" plain @click="singleInspection">单检</el-button>
        <el-button type="primary" plain @click="record">巡检记录</el-button>
      </div>
    </el-form>
    <div class="table_div">
      <el-table :data="tableData" style="width: 100%" height="calc(100% - 50px)" :row-style="{ height: '48px' }"
        :header-row-style="{ height: '48px' }">
        <el-table-column prop="inspectName" label="智能巡检任务名称" width="200" align="center"> </el-table-column>
        <el-table-column prop="circleMode" label="循环模式" width="100" align="center">
          <template #default="{ row }">{{ row.circleMode === "DAY" ? "每日" : row.circleMode === "WEEK" ? "每周" : "每月"
          }}</template>
        </el-table-column>
        <el-table-column prop="circleTime" label="循环时间" align="center"> </el-table-column>
        <el-table-column prop="startTime" label="巡检启动时间" align="center"> </el-table-column>
        <el-table-column prop="inspectStatus" label="状态" align="center">
          <template #default="{ row }">{{ row.inspectStatus == 0 ? "停用中" : "启用中" }}</template>
        </el-table-column>
        <el-table-column prop="" label="操作" align="center">
          <template #default="{ row }">
            <el-link class="blue-link" @click="seeDetail(row)">详情</el-link>
            <el-divider direction="vertical" />
            <el-link class="green-link" @click="handleSwitchOn(row)" v-if="row.inspectStatus == 0">启用</el-link>
            <el-link class="yellow-link" @click="handleSwitchOff(row)" v-else>停用</el-link>
            <el-divider v-if="row.inspectStatus == 0" direction="vertical" />
            <el-link class="blue-link" @click="edit(row)" v-if="row.inspectStatus == 0">编辑</el-link>
            <el-divider v-if="row.inspectStatus == 0" direction="vertical" />
            <el-link class="red-link" @click="del(row)" v-if="row.inspectStatus == 0">删除</el-link>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination style="float: right; margin-top: 10px" @current-change="handleCurrentChange"
        :current-page="paging.pageNo" :page-size="paging.pageSize" layout="total, prev, pager, next, jumper"
        :total="paging.total">
      </el-pagination>
    </div>
    <AddModal ref="addModalRef" @success="query()"></AddModal>
    <SingleInspection ref="singleInspectionRef" @success="query()"></SingleInspection>
    <InspectionDetail ref="inspectionDetailRef"></InspectionDetail>
  </section>
</template>

<script>
import AddModal from "./modal/AddModal.vue";
import SingleInspection from "./modal/SingleInspection.vue";
import InspectionDetail from "./modal/InspectionDetail.vue";
import { getAutoInspectList, switchAutoInspec, delAutoInspect } from "@/api/auto-inspection.js";
export default {
  data() {
    return {
      formData: {
        inspectName: "",
        inspectStatus: "",
      },
      statusOptions: [
        {
          itemText: "停用中",
          itemValue: 0,
        },
        {
          itemText: "启用中",
          itemValue: 1,
        },
      ],
      tableData: [],
      paging: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
    };
  },

  components: { AddModal, SingleInspection, InspectionDetail },

  computed: {},

  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      getAutoInspectList(this.formData, this.paging).then((res) => {
        if (res.code === 200 && res.data) {
          this.tableData = res.data.records;
          this.paging.total = res.data.total;
        }
      });
    },
    query() {
      this.getData();
    },
    reset() {
      this.formData.inspectName = "";
      this.formData.inspectStatus = "";
      this.paging.pageNo = 1;
      this.paging.pageSize = 10;
      this.query();
    },
    add() {
      this.$refs.addModalRef?.open();
    },
    singleInspection() {
      this.$refs.singleInspectionRef?.open();
    },
    setting() {
      this.$router.push("inspectionSet");
    },
    record() {
      this.$router.push("autoInspectionRecord");
    },
    handleCurrentChange(val) {
      this.paging.pageNo = val;
      this.getData();
    },
    seeDetail(item) {
      this.$refs.inspectionDetailRef?.open(item);
    },
    handleSwitchOn(item) {
      this.$confirm("确认启用？", "提示", {
        type: "warning", confirmButtonClass: 'confirm-btn ',
        cancelButtonClass: 'cancel-btn ',
      })
        .then(() => {
          switchAutoInspec(item.id, !item.inspectStatus - 0).then((res) => {
            if (res.code === 200) {
              this.$message.success("启用成功");
              this.getData();
            }
          });
        })
        .catch(() => { });
    },
    handleSwitchOff(item) {
      this.$confirm("确认停用？", "提示", {
        type: "warning", confirmButtonClass: 'confirm-btn ',
        cancelButtonClass: 'cancel-btn ',
      })
        .then(() => {
          switchAutoInspec(item.id, !item.inspectStatus - 0).then((res) => {
            if (res.code === 200) {
              this.$message.success("停用成功");
              this.getData();
            }
          });
        })
        .catch(() => { });
    },
    edit(item) {
      this.$refs.addModalRef?.open(item);
    },
    del(item) {
      this.$confirm("确认删除？", "提示", {
        type: "warning", confirmButtonClass: 'confirm-btn ',
        cancelButtonClass: 'cancel-btn ',
      })
        .then(() => {
          delAutoInspect([item.id]).then((res) => {
            if (res.code === 200) {
              this.$message.success("删除成功");
              this.getData();
            }
          });
        })
        .catch(() => { });
    },
  },
};
</script>
<style lang="scss" scoped>
.table_div {
  height: calc(100% - 96px);
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 0 6px rgba(90, 151, 250, 0.3);
  padding: 10px;
  margin-top: 20px;
}

</style>
