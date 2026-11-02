<!-- 巡检路线 -->
<template>
  <section class="container_warp">
    <el-form :model="formData" :inline="true">
      <el-form-item label="路线名称">
        <el-input v-model="formData.deviceNo"></el-input>
      </el-form-item>
      <el-form-item style="float:right">
        <el-button type="primary" class="customBtn" icon="el-icon-search" @click="query">查询</el-button>
        <el-button type="primary" class="customBtn" icon="el-icon-refresh" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="btn_group">
      <el-button type="primary" class="customBtn" @click="addPath">新增路线</el-button>
    </div>
    <el-table :data="tableData" style="width: 100%;" height="calc(100% - 50px)">
      <el-table-column prop="inspectionName" label="路线名称" width="200" align="center">
      </el-table-column>
      <el-table-column prop="time" label="设备数量" width="130" align="center">
      </el-table-column>
      <el-table-column prop="date" label="路线起点" align="center">
      </el-table-column>
      <el-table-column prop="warnNum" label="路线终点" align="center">
      </el-table-column>
      <el-table-column prop="" label="操作" align="center">
        <template #default="{ row }">
          <el-button type='text' class="detailBtn" @click="seeDetail(row)">查看路线</el-button>
          <el-button type="text" class="editBtn" @click="edit(row)">编辑</el-button>
          <el-button type="text" class="delBtn" @click="del(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination style="float:right;margin-top: 10px;" @current-change="handleCurrentChange"
      :current-page="paging.pageNum" :page-size="paging.pageSize" layout="total, prev, pager, next, jumper"
      :total="paging.total">
    </el-pagination>
  </section>
</template>
  
<script>
export default {
  data() {
    return {
      formData: {
        deviceNo: '',
        planName: '',
        deviceType: '',
        subjectId: '',
        subjectName: ''
      },
      paging: {
        pageNum: 1,
        pageSize: 10,
        total: 100
      },
      tableData: [
        {
          inspectionName: '空调巡检',
          time: '10:00',
          date: '2023-03-02',
          warnNum: '10',
          warnTime: '100'
        }
      ],
      statusOptions: []
    };
  },

  components: {},

  computed: {},

  mounted() {
    let _this = this;
    window.onresize = function () {
      _this.bar_chart.resize();
    }
  },
  created() {
    this.$nextTick(() => {
      this.init();
    })
  },
  methods: {
    init() {
      this.getData();
    },
    //查询
    query() {
    },
    //重置
    reset() {
    },
    getData() {
    },
    addPath() {
      this.$refs.addOrEditRef?.open();
    },
    seeDetail() {
      this.$refs.planDetailRef?.open();
    },
    edit() { },
    batchDel() { },
    pathSet() { },
    del() {

    },
    handleCurrentChange(val) {
      this.paging.pageNum = val;
    },
    handleSelectionChange(val) {
    }
  }
}

</script>
<style lang='scss' scoped>
.container_warp {
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding: 0 10px;
}


.btn_group {
  margin-bottom: 20px;

  .customBtn {
    background-color: transparent;
    border: 1px solid #2a3e62;
  }
}

.customBtn {
  background-color: #2a3e62;
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

::v-deep .el-pagination {
  button {
    background-color: transparent;
    border: 1px solid #364d79;
    color: #fff;
    border-radius: 4px;
  }

  .el-input__inner {
    border-radius: 0%;
  }
}

::v-deep .el-pager {
  li {
    background-color: transparent;
    border: 1px solid #364d79;
    color: #fff;
    margin: 0 2.5px;
    border-radius: 4px;
  }

  li.active+li {
    border-left: 1px solid #364d79;
  }

  li.active {
    background-image: linear-gradient(180deg, #66ffff, #0073e5);
  }
}
</style>
  