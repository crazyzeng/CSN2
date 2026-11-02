<!-- 智能巡检记录 -->
<template>
  <section class="container_warp">
    <el-form :model="formData" :inline="true">
      <el-form-item label="巡检日期">
        <el-date-picker v-model="formData.date" type="daterange" range-separator="至" start-placeholder="开始日期"
          end-placeholder="结束日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width:400px;">
        </el-date-picker>
      </el-form-item>
      <el-form-item style="float: right;margin-right: 0;">
        <el-button type="primary" icon="el-icon-search" @click="query">查询</el-button>
        <el-button type="primary" icon="el-icon-refresh" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="table_div">
      <el-table :data="tableData" style="width: 100%" height="calc(100% - 50px)" :row-style="{ height: '48px' }"
        :header-row-style="{ height: '48px' }">
        <el-table-column prop="inspectName" label="智能巡检任务名称" width="200" align="center"> </el-table-column>
        <el-table-column prop="createTime" label="巡检时间" width="100" align="center">
          <template #default="{ row }">{{ row.createTime?.substring(11) }}</template>
        </el-table-column>
        <el-table-column prop="createTime" label="巡检日期" align="center">
          <template #default="{ row }">{{ row.createTime?.substring(0, 10) }}</template>
        </el-table-column>
        <el-table-column prop="alarmDeviceNum" label="告警设备数" align="center"> </el-table-column>
        <el-table-column prop="alarmNum" label="告警次数" align="center"> </el-table-column>
        <el-table-column prop="" label="操作" align="center">
          <template #default="{ row }">
            <el-link class="blue-link" @click="seeDetail(row)">详情</el-link>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination style="float: right; margin-top: 10px" @current-change="handleCurrentChange"
        :current-page="paging.pageNo" :page-size="paging.pageSize" layout="total, prev, pager, next, jumper"
        :total="paging.total">
      </el-pagination>
    </div>
    <RecordDetail ref="recordDetailRef"></RecordDetail>
  </section>
</template>

<script>
import { getAutoInspectHistory } from "@/api/auto-inspection.js";
import RecordDetail from "./modal/RecordDetail.vue";
export default {
  data() {
    return {
      formData: { date: "" },
      paging: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      tableData: [],
    };
  },

  components: { RecordDetail },

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
      this.formData.date = [];
      this.paging.pageNo = 1;
      this.paging.pageSize = 10;
      this.query();
    },
    getData() {
      const tempObj = {
        startDate: this.formData.date[0] || "",
        endDate: this.formData.date[1] || "",
        pageNo: this.paging.pageNo,
        pageSize: this.paging.pageSize,
      };
      getAutoInspectHistory(tempObj).then((res) => {
        if (res.code === 200 && res.data) {
          this.tableData = res.data.records;
          this.paging.total = res.data.total;
        }
      });
    },
    seeDetail(item) {
      this.$refs.recordDetailRef?.open(item);
    },
    handleCurrentChange(val) {
      this.paging.pageNo = val;
      this.getData();
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
  height: calc(100% - 47px);
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 0 6px rgba(90, 151, 250, 0.3);
  padding: 10px;
}
</style>
