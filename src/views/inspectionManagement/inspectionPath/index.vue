<!-- 巡检路线 -->
<template>
  <section class="container_warp">
        <el-form :model="formData" :inline="true">
          <el-form-item label="路线名称">
            <el-input v-model="formData.lineName"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="query">查询</el-button>
            <el-button type="primary" icon="el-icon-refresh" @click="reset">重置</el-button>
          </el-form-item>
          <el-form-item style="float:right;margin-right: 0;">
            <el-button type="primary" @click="add">新增路线</el-button>
          </el-form-item>
        </el-form>
        <div class="table_div">
          <el-table :data="tableData" style="width: 100%" height="calc(100% - 80px)" :row-style="{ height: '48px' }">
            <el-table-column prop="lineName" label="路线名称" width="300" align="center"> </el-table-column>
            <el-table-column prop="equipmentNum" label="设备数量" width="100" align="center"> </el-table-column>
            <el-table-column prop="loopTime" label="路线起点" align="center">
              <template #default="{ row }">{{ row.siteDetails[0]?.name }}</template>
            </el-table-column>
            <el-table-column prop="startTime" label="路线终点" align="center">
              <template #default="{ row }">{{ row.siteDetails[row.siteDetails.length - 1]?.name }}</template>
            </el-table-column>
            <el-table-column prop="" label="操作" align="center">
              <template #default="{ row }">
                <el-link class="blue-link" @click="seeDetail(row)">查看路线</el-link>
                <el-divider direction="vertical" />
                <el-link class="blue-link" @click="edit(row)">编辑</el-link>
                <!-- <el-button type="text" class="delBtn" @click="del(row)">删除</el-button> -->
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
        <AddPathModal ref="addModalRef" @success="getData()"></AddPathModal>
        <PathDetail ref="pathDetailRef"></PathDetail>
  </section>
</template>

<script>
import AddPathModal from "./modal/AddPathModal.vue";
import PathDetail from "./modal/PathDetail.vue";
import { getInspectPathByPage } from "@/api/auto-inspection.js";
export default {
  data() {
    return {
      formData: { lineName: "" },
      statusOptions: [],
      tableData: [],
      paging: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
    };
  },

  components: { AddPathModal, PathDetail },

  computed: {},

  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      getInspectPathByPage(this.formData, this.paging).then((res) => {
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
      this.formData.lineName = "";
      this.paging.pageNo = 1;
      this.paging.pageSize = 10;
      this.query();
    },
    add() {
      this.$refs.addModalRef?.open();
    },
    handleCurrentChange(val) {
      this.paging.pageNo = val;
      this.getData();
    },
    seeDetail(item) {
      this.$refs.pathDetailRef?.open(item);
    },
    edit(item) {
      this.$refs.addModalRef?.open(item);
    },
    del(item) {
      this.$confirm("确认删除？", "提示", { type: "warning",confirmButtonClass:'confirm-btn ',
      cancelButtonClass:'cancel-btn ',  })
        .then(() => {})
        .catch(() => {});
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
