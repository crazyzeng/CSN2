<!-- 巡检记录-详情弹窗 -->
<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="60%" :before-close="handleClose" center>
    <section class="content_box">
      <div class="btn_group">
        <el-button type="primary" class="customBtn" icon="" @click="query">导出</el-button>
        <el-button type="primary" class="customBtn" icon="" @click="handleClose">确定</el-button>
      </div>
      <p><span>智能巡检任务名称：</span><span>空调机组巡检</span></p>
      <p><span>巡检日期：</span><span>2023-03-08</span></p>
      <p><span>巡检时间：</span><span>09:00:00</span></p>
      <el-table :data="tableData" style="width: 100%" height="300">
        <el-table-column prop="inspectionName" label="设备编号" width="200" align="center">
        </el-table-column>
        <el-table-column prop="mode" label="设备名称" width="100" align="center">
        </el-table-column>
        <el-table-column prop="loopTime" label="设备类型" align="center">
        </el-table-column>
        <el-table-column prop="startTime" label="巡检内容" align="center">
        </el-table-column>
        <el-table-column prop="inspectionName" label="标准参数" width="" align="center">
        </el-table-column>
        <el-table-column prop="mode" label="实际参数" width="" align="center">
        </el-table-column>
        <el-table-column prop="loopTime" label="巡检结果" align="center">
        </el-table-column>
        <el-table-column prop="startTime" label="时间" align="center">
        </el-table-column>
      </el-table>
    </section>
  </el-dialog>
</template>
<script>
export default {
  props: {

  },
  data() {
    return {
      dialogVisible: false,
      tableData: [],
    }
  },
  computed: {
    title: function () {
      return ''
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    initData() {

    },
    open(data) {
      this.dialogVisible = true;
    },
    handleClose() {
      this.dialogVisible = false;
    },
  }
}
</script>

<style lang="scss" scoped>
.saveBtn {
  background-color: #2e6cd8;
  border-radius: 3px;
}

.backBtn {
  color: #fff;
}

.customBtn {
  border-radius: 3px;
}

::v-deep .el-checkbox {
  margin-right: 10px;
  color: #fff;
}

.btn_group {
  float: right;
}

::v-deep .el-dialog {
  .el-dialog__header {
    background-color: transparent;
    height: 60px;
  }

  .dialog-footer {}

  .el-dialog__body {
    padding-top: 10px;
  }
}

::v-deep .el-table {
  background-color: #233855;
}

.box_title {
  margin-bottom: 10px;
  padding-left: 15px;

  >span:nth-child(1) {
    display: inline-block;
    font-size: 20px;
    font-weight: bold;
    color: #fff;
    vertical-align: middle;
  }
}

.opSetting {
  display: flex;
  margin-top: 150%;
  flex-wrap: nowrap;
  justify-content: space-evenly;
}

.custom_arrow_btn {
  width: 30px;
  height: 30px;
  border: 1px solid #2e6cd8;
}

.content_box {
  color: #fff;

  >p {
    margin: 20px 0;
  }
}
</style>
