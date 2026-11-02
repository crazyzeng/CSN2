<!-- 计划巡检 -->
<template>
  <section class="container_warp">
    <!-- <el-divider class="curDivider" direction="vertical" /> -->
    <el-form :model="formData" :inline="true">
      <el-form-item label="计划编号">
        <el-input v-model="formData.inspectNumber" placeholder="请输入计划编号"></el-input>
      </el-form-item>
      <el-form-item label="巡检计划名称">
        <el-input v-model="formData.inspectName" placeholder="请输入巡检计划名称"></el-input>
      </el-form-item>
      <el-form-item label="循环方式">
        <el-select v-model="formData.circleMode">
          <el-option v-for="item in circleModeOptions" :key="item.value" :label="item.label"
            :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="计划状态">
        <el-select v-model="formData.status">
          <el-option v-for="item in statusOptions" :key="item.value" :label="item.label"
            :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item style="float: right; margin-right: 0">
        <el-button type="primary" icon="el-icon-search" @click="query">查询</el-button>
        <el-button type="primary" icon="el-icon-refresh" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="btn_group">
      <el-button type="primary" plain @click="addPlan">新增计划</el-button>
      <el-button type="primary" plain @click="batchDel">批量删除</el-button>
      <el-button type="primary" plain @click="inspectPath">巡检路线</el-button>
    </div>
    <div class="table_div">
      <el-table :data="tableData" style="width: 100%" height="calc(100% - 50px)"
        @selection-change="handleSelectionChange" :row-style="{ height: '48px' }" :header-row-style="{ height: '48px' }">
        <el-table-column type="selection" label="" width="60" align="center"> </el-table-column>
        <el-table-column prop="inspectNumber" label="计划编号" width="120" align="center"> </el-table-column>
        <el-table-column prop="inspectName" label="巡检计划名称" width="" align="center"> </el-table-column>
        <el-table-column prop="inspectType" label="巡检类型" width="100" align="center">
          <template #default="{ row }">{{ row.inspectType === "0" ? "类型一" : "类型二" }}</template>
        </el-table-column>
        <el-table-column prop="circleMode" label="循环方式" width="100" align="center">
          <template #default="{ row }">{{ row.circleMode === "DAY" ? "每日" : row.circleMode === "WEEK" ? "每周" : "每月"
          }}</template>
        </el-table-column>
        <el-table-column prop="circleTime" label="循环日期" width="" align="center"> </el-table-column>
        <el-table-column prop="executeTime" label="巡检执行时间" align="center"> </el-table-column>
        <el-table-column prop="createEmp" label="创建人" width="120" align="center"> </el-table-column>
        <el-table-column prop="status" label="计划状态" width="110" align="center">
          <template #default="{ row }">{{ row.status === 0 ? "停用" : "启用" }}</template>
        </el-table-column>
        <el-table-column prop="" label="操作" align="center" width="250">
          <template #default="{ row }">
            <el-link class="blue-link" @click="seeDetail(row)">详情</el-link>
            <el-divider direction="vertical" />
            <el-link class="green-link" @click="handleSwitch(row)" v-if="row.status === 0">启用</el-link>
            <el--link class="yellow-link" @click="handleSwitch(row)" v-if="row.status === 1">停用</el--link>
            <!-- <el-button type="text" class="switchBtn" @click="handleSwitch(row)" v-if="row.status === '0'">启用</el-button>
                <el-button type="text" class="switchBtn" @click="handleSwitch(row)" v-if="row.status === '1'">停用</el-button> -->
            <el-divider direction="vertical" />
            <el-link class="blue-link" @click="edit(row)" v-if="row.status === 0">编辑</el-link>
            <el-divider direction="vertical" />
            <el-link class="red-link" @click="del(row)" v-if="row.status === 0">删除</el-link>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination style="float: right; margin-top: 10px" @current-change="handleCurrentChange"
        :current-page="paging.pageNum" :page-size="paging.pageSize" layout="total, prev, pager, next, jumper"
        :total="paging.total">
      </el-pagination>
    </div>
    <AddOrEdit ref="addOrEditRef" @success="getData"></AddOrEdit>
    <PlanDetail ref="planDetailRef"></PlanDetail>
  </section>
</template>

<script>
import AddOrEdit from "./modal/AddOrEdit.vue";
import PlanDetail from "./modal/PlanDetail.vue";
import { getInspectPlanByPage, deleteInspectPlan, switchInspectPlan } from "@/api/inspection-content.js";
export default {
  data() {
    return {
      formData: {
        inspectNumber: "",
        inspectName: "",
        circleMode: "",
        status: "",
      },
      paging: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      tableData: [],
      statusOptions: [
        {
          label: "启用",
          value: "1",
        },
        {
          label: "停用",
          value: "0",
        },
      ],
      circleModeOptions: [
        {
          label: "日",
          value: "DAY",
        },
        {
          label: "周",
          value: "WEEK",
        },
        {
          label: "月",
          value: "MONTH",
        },
      ],
      checkedData: [],
    };
  },

  components: { AddOrEdit, PlanDetail },

  computed: {},

  mounted() { },
  created() {
    this.$nextTick(() => {
      this.init();
    });
  },
  methods: {
    init() {
      this.getData();
    },
    //查询
    query() {
      this.getData();
    },
    //重置
    reset() {
      for (let key in this.formData) this.formData[key] = "";
      this.paging.pageNo = 1;
      this.paging.pageSize = 10;
      this.getData();
    },
    getData() {
      getInspectPlanByPage(this.formData, this.paging).then((res) => {
        if (res.code === 200 && res.data) {
          this.tableData = res.data.records;
          this.paging.total = res.data.total;
        }
      });
    },
    addPlan() {
      this.$refs.addOrEditRef?.open();
    },
    seeDetail(item) {
      this.$refs.planDetailRef?.open(item);
    },
    edit(item) {
      this.$refs.addOrEditRef?.open(item);
    },
    handleSwitch(item) {
      switchInspectPlan(item.id, !item.status - 0).then((res) => {
        if (res.code === 200) {
          this.$message.success(`${item.status === 0 ? "启用" : "停用"}成功`);
          this.getData();
        }
      });
    },
    doDelete(data) {
      deleteInspectPlan(data).then((res) => {
        if (res.code === 200) {
          this.$message.success("删除成功");
          this.getData();
        }
      });
    },
    batchDel() {
      if (this.checkedData.length === 0) {
        this.$message.warning("请至少选择一条数据");
        return;
      } else {
        this.$confirm("确认删除？", "提示")
          .then(() => {
            const tempArr = this.checkedData.map((v) => {
              return v.id;
            });
            this.doDelete(tempArr);
          })
          .catch(() => { });
      }
    },
    inspectPath() {
      this.$router.push("inspectionPath");
    },
    del(item) {
      this.$confirm("确认删除？", "提示")
        .then(() => {
          this.doDelete([item.id]);
        })
        .catch(() => { });
    },
    handleCurrentChange(val) {
      this.paging.pageNo = val;
      this.getData();
    },
    handleSelectionChange(val) {
      this.checkedData = val;
    },
  },
};
</script>
<style lang="scss" scoped>
.container_warp {
  width: 100%;
  height: 100%;
}

.btn_group {
  margin-bottom: 20px;
}

.table_div {
  height: calc(100% - 97px);
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 0 6px rgba(90, 151, 250, 0.3);
  padding: 10px;
  margin-top: 20px;
}

.editBtn {
  color: #34e15d;
  font-size: 16px;
  border-left: 2px solid #fff;
  padding: 0 5px;
}

.delBtn {
  color: #ff3c00;
  font-size: 16px;
  border-left: 2px solid #fff;
  padding: 0 5px;
}

.switchBtn {
  color: #fec20e;
  font-size: 16px;
  border-left: 2px solid #fff;
  padding: 0 5px;
}

.detailBtn {
  color: #00aaff;
  font-size: 16px;
}

.top_block {
  width: 4px;
  height: 20px;
  display: inline-block;
  background: #fff;
  border-radius: 5px;
  margin-right: 10px;
  vertical-align: middle;
}

.title_text {
  font-size: 20px;
  color: #fefeff;
  margin-right: 40px;
  vertical-align: middle;
}
</style>
