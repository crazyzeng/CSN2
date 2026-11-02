<!-- 巡检工单 -->
<template>
  <section class="container_warp">
    <el-form :model="formData" :inline="true">
      <el-form-item label="工单编号">
        <el-input v-model="formData.orderNumber" placeholder="请输入工单编号"></el-input>
      </el-form-item>
      <el-form-item label="工单名称">
        <el-input v-model="formData.orderName" placeholder="请输入工单名称"></el-input>
      </el-form-item>
      <el-form-item label="工单来源">
        <el-input v-model="formData.source" placeholder="请输入工单来源"></el-input>
      </el-form-item>
      <el-form-item label="工单状态">
        <el-select v-model="formData.status">
          <el-option v-for="item in orderStatusOptions" :key="item.itemValue" :label="item.itemText"
            :value="item.itemValue"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="工单派发时间">
        <el-date-picker v-model="timeRange" type="daterange" range-separator="至" start-placeholder="开始日期"
          end-placeholder="结束日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 320px">
        </el-date-picker>
      </el-form-item>
      <el-form-item style="float: right;margin-right:0">
        <el-button type="primary" icon="el-icon-search" @click="query">查询</el-button>
        <el-button type="primary" icon="el-icon-refresh" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="btn_group">
      <el-button type="primary" plain @click="add">新增工单</el-button>
    </div>
    <div class="table_div">
      <el-table :data="tableData" style="width: 100%" height="calc(100% - 50px)" :row-style="{ height: '48px' }"
        :header-row-style="{ height: '48px' }">
        <el-table-column prop="orderNumber" label="工单编号" width="120" align="center"> </el-table-column>
        <el-table-column prop="orderName" label="工单名称" width="" align="center"> </el-table-column>
        <el-table-column prop="source" label="工单来源" align="center"> </el-table-column>
        <el-table-column prop="createTime" label="工单创建时间" width="180" align="center"> </el-table-column>
        <el-table-column prop="distributeTime" label="工单派发时间" width="180" align="center"> </el-table-column>
        <el-table-column prop="dept" label="责任部门" align="center"> </el-table-column>
        <el-table-column prop="inspectUsername" label="巡检员" align="center"> </el-table-column>
        <el-table-column prop="warnTime" label="指派" align="center">
          <template #default="{ row }">
            <el-button type="text" class="appointBtn" :disabled="row.status !== '-1'"
              @click="handleAppoint(row)">指派</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="工单状态" align="center">
          <template #default="{ row }">{{ orderStatusTrans(orderStatusOptions, row.status) }}</template>
        </el-table-column>
        <el-table-column prop="" label="操作" align="center" width="250">
          <template #default="{ row }">
            <el-link class="blue-link" @click="viewDetail(row)">查看路线</el-link>
            <el-divider direction="vertical" />
            <el-link class="green-link" @click="viewCurrent(row)">巡检实况</el-link>
            <el-divider direction="vertical" />
            <el-link class="yellow-link" :disabled="row.status === '-1'" @click="orderTransfer(row)">转单</el-link>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination style="float: right; margin-top: 10px" @current-change="handleCurrentChange"
        :current-page="paging.pageNo" :page-size="paging.pageSize" layout="total, prev, pager, next, jumper"
        :total="paging.total">
      </el-pagination>
    </div>
    <AddOrder ref="addOrderRef" @success="reset()"></AddOrder>
    <OrderAssign ref="orderAssignRef" @assignFinish="reset()"></OrderAssign>
    <PathDetail ref="pathDetailRef"></PathDetail>
  </section>
</template>

<script>
import { getInspectWorkOrderByPage, transferWorkOrder } from "@/api/inspect-workorder.js";
import OrderAssign from "./modal/OrderAssign.vue";
import AddOrder from "./modal/AddOrder.vue";
import PathDetail from "./modal/PathDetail.vue";
import { getDict, dictTrans } from "@/api/common";
export default {
  data() {
    return {
      formData: {
        orderNumber: "",
        orderName: "",
        source: "",
        startTime: "",
        endTime: "",
        status: "",
      },
      timeRange: "",
      paging: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      tableData: [],
      orderStatusOptions: [],
    };
  },

  components: { AddOrder, OrderAssign, PathDetail },

  computed: {},

  mounted() {
    this.formData.orderNumber = this.$route.params.orderNumber || "";
  },
  created() {
    this.$nextTick(() => {
      this.init();
    });
  },
  methods: {
    init() {
      this.getData();
      getDict("inspect_order_status").then((res) => {
        if (res.code === 200 && res.data) this.orderStatusOptions = res.data;
      });
    },
    //查询
    query() {
      this.getData();
    },
    //重置
    reset() {
      for (let key in this.formData) this.formData[key] = "";
      this.timeRange = "";
      this.paging.pageNo = 1;
      this.paging.pageSize = 10;
      this.getData();
    },
    getData() {
      if (this.timeRange.length) {
        this.formData.startTime = this.timeRange[0];
        this.formData.endTime = this.timeRange[1];
      }
      getInspectWorkOrderByPage(this.formData, this.paging).then((res) => {
        if (res.code === 200 && res.data) {
          this.tableData = res.data.records;
          this.paging.total = res.data.total;
        }
      });
    },
    add() {
      this.$refs.addOrderRef?.open();
    },
    handleAppoint(item) {
      this.$refs.orderAssignRef?.open(item);
    },
    viewDetail(item) {
      this.$refs.pathDetailRef?.open(item);
    },
    viewCurrent(item) {
      this.$router.push({
        path: "currentTrajectory",
        query: { data: item },
      });
    },
    orderTransfer(item) {
      this.$confirm("确认转单？", "提示", {
        confirmButtonClass: "confirm-btn ",
        cancelButtonClass: "cancel-btn ",
      })
        .then(() => {
          transferWorkOrder(item.id).then((res) => {
            if (res.code === 200) {
              this.$message.success("转单成功");
              this.reset();
            }
          });
        })
        .catch(() => { });
    },
    orderStatusTrans(data, code) {
      return dictTrans(data, code);
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
  height: calc(100% - 97px);
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 0 6px rgba(90, 151, 250, 0.3);
  padding: 10px;
  margin-top: 20px;
}
</style>
