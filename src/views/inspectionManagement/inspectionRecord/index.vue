<!-- 巡检记录 -->
<template>
  <section class="container_warp">
    <section class="container_box">
      <el-form :model="formData" :inline="true">
        <el-form-item>
          <span class="top_block"></span><span class="title_text">巡检记录</span>
        </el-form-item>
        <el-form-item label="巡检日期">
          <el-date-picker v-model="formData.date" type="daterange" range-separator="至" start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item style="float:right">
          <el-button type="primary" class="customBtn" icon="el-icon-search" @click="query">查询</el-button>
          <el-button type="primary" class="customBtn" icon="el-icon-refresh" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="tableData" style="width: 100%" height="calc(100% - 50px)" :row-style="{ height: '48px' }"
        :header-row-style="{ height: '48px' }">
        <el-table-column prop="inspectionName" label="智能巡检任务名称" width="200" align="center">
        </el-table-column>
        <el-table-column prop="time" label="巡检时间" width="100" align="center">
        </el-table-column>
        <el-table-column prop="date" label="巡检日期" align="center">
        </el-table-column>
        <el-table-column prop="warnNum" label="告警设备数" align="center">
        </el-table-column>
        <el-table-column prop="warnTime" label="告警次数" align="center">
        </el-table-column>
        <el-table-column prop="" label="操作" align="center">
          <template #default="{ row }">
            <el-button type="text" class="detailBtn" @click="seeDetail(row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination style="float:right;margin-top: 10px;" @current-change="handleCurrentChange"
        :current-page="paging.pageNum" :page-size="paging.pageSize" layout="total, prev, pager, next, jumper"
        :total="paging.total">
      </el-pagination>
    </section>
    <RecordDetail ref="recordDetailRef"></RecordDetail>
  </section>
</template>

<script>
import RecordDetail from './modal/RecordDetail.vue';
export default {
  data() {
    return {
      formData: { date: '' },
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
      ]
    };
  },

  components: { RecordDetail },

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
    seeDetail() {
      this.$refs.recordDetailRef?.open();
    },
    handleCurrentChange(val) {
      this.paging.pageNum = val;
    },
  }
}

</script>
<style lang='scss' scoped>
.container_warp {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.container_box {
  width: 100%;
  height: 100%;
  overflow: auto;
  padding: 0 10px;

  span {
    vertical-align: middle;
  }
}

.customBtn {
  background-color: #2a3e62;
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
}

.title_text {
  font-size: 20px;
  color: #fefeff;
  margin-right: 40px;
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