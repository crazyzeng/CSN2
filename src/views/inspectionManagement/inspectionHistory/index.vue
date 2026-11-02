<!-- 巡检记录 -->
<template>
  <section class="container_warp">
        <el-form :model="formData" :inline="true" class="flex">
          <el-form-item label="工单编号">
            <el-input v-model="formData.orderNumber" placeholder="请输入工单编号"></el-input>
          </el-form-item>
          <el-form-item label="工单名称">
            <el-input v-model="formData.orderName" placeholder="请输入工单名称"></el-input>
          </el-form-item>
          <el-form-item label="工单来源">
            <el-input v-model="formData.source" placeholder="请输入工单来源"></el-input>
          </el-form-item>
          <el-form-item label="巡检员">
            <el-input v-model="formData.inspectUser" placeholder="请输入巡检员"></el-input>
          </el-form-item>
          <el-form-item label="巡检执行时间">
            <el-date-picker
              v-model="timeRange"
              style="width: 250px;"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item style="margin-left: 20px;">
            <el-button type="primary" icon="el-icon-search" @click="query">查询</el-button>
            <el-button type="primary" icon="el-icon-refresh" @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
        <div class="table_div">
          <el-table
            :data="tableData"
            style="width: 100%"
            height="calc(100% - 80px)"
            :row-style="{ height: '48px' }"
            :header-row-style="{ height: '48px' }"
          >
            <el-table-column prop="orderNumber" label="工单编号" width="200" align="center"> </el-table-column>
            <el-table-column prop="orderName" label="工单名称" width="130" align="center"> </el-table-column>
            <el-table-column prop="source" label="工单来源" align="center"> </el-table-column>
            <el-table-column prop="distributeTime" label="工单派发时间" align="center"> </el-table-column>
            <el-table-column prop="inspectUser" label="巡检员" align="center"> </el-table-column>
            <el-table-column prop="executionTime" label="巡检执行时间" align="center"> </el-table-column>
            <el-table-column prop="completionTime" label="工单完成时间" align="center"> </el-table-column>
            <el-table-column prop="duration" label="巡检用时" align="center"> </el-table-column>
            <el-table-column prop="" label="操作" align="center">
              <template #default="{ row }">
                <el-link class="blue-link" @click="seeDetail(row)">详情</el-link>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            style="float: right; margin-top: 10px"
            @current-change="handleCurrentChange"
            :current-page="paging.pageNo"
            :page-size="paging.pageSize"
            layout="total, prev, pager, next, jumper"
            :total="paging.total"
          >
          </el-pagination>
        </div>
        <HistoryDetail ref="historyDetailRef"></HistoryDetail>
  </section>
</template>

<script>
import HistoryDetail from "./modal/HistoryDetail.vue";
import { getInspectHistoryByPage } from "@/api/inspection-content.js";
export default {
  data() {
    return {
      formData: {
        orderNumber: "",
        orderName: "",
        source: "",
        inspectUser: "",
      },
      time: {
        startDate: "",
        endDate: "",
      },
      timeRange: "",
      paging: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      tableData: [],
      statusOptions: [],
    };
  },

  components: { HistoryDetail },

  computed: {},

  mounted() {},
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
      this.timeRange = "";
      this.time = { startDate: "", endDate: "" };
      this.paging.pageNo = 1;
      this.paging.pageSize = 10;
      this.getData();
    },
    getData() {
      if (this.timeRange.length) {
        this.time.startDate = this.timeRange[0];
        this.time.endDate = this.timeRange[1];
      }
      getInspectHistoryByPage(this.formData, this.paging, this.time).then((res) => {
        if (res.code === 200 && res.data) {
          this.tableData = res.data.records;
          this.paging.total = res.data.total;
        }
      });
    },
    seeDetail(item) {
      this.$refs.historyDetailRef?.open(item);
    },
    handleCurrentChange(e) {
      this.paging.pageNo = e;
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

.detailBtn {
  color: #00aaff;
  font-size: 16px;
}

.el-date-editor.el-input__inner {
  width: 360px;
}

</style>
