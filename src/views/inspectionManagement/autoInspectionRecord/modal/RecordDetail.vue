<!-- 巡检记录-详情弹窗 -->
<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="60%" :before-close="handleClose" center>
    <section class="content_box">
      <div class="btn_group">
        <el-button type="primary" class="cancel-btn" icon="" @click="exportData">导出</el-button>
        <el-button type="primary" class="confirm-btn" icon="" @click="handleClose">确定</el-button>
      </div>
      <p><span>智能巡检任务名称：</span><span>{{ detailData.inspectName }}</span></p>
      <p><span>巡检日期：</span><span>{{ detailData.createTime?.substring(0, 10) }}</span></p>
      <p><span>巡检时间：</span><span>{{ detailData.createTime?.substring(11) }}</span></p>
      <el-table :data="tableData" style="width: 100%" height="300">
        <el-table-column prop="equipmentNumber" label="设备编号" width="200" align="center">
        </el-table-column>
        <el-table-column prop="equipmentName" label="设备名称" width="100" align="center">
        </el-table-column>
        <el-table-column prop="equipmentType" label="设备类型" align="center">
          <template #default="{ row }">{{ equipmentTypeTrans(equipmentTypeOptions, row.equipmentType)
          }}</template>
        </el-table-column>
        <el-table-column prop="description" label="巡检内容" align="center">
        </el-table-column>
        <el-table-column prop="standardVal" label="标准参数" width="" align="center">
        </el-table-column>
        <el-table-column prop="actualVal" label="实际参数" width="" align="center">
        </el-table-column>
        <el-table-column prop="result" label="巡检结果" align="center">
          <template #default="{ row }">{{ row.result == 0 ? '正常' : '异常' }}</template>
        </el-table-column>
        <el-table-column prop="time" label="时间" align="center">
        </el-table-column>
      </el-table>
    </section>
  </el-dialog>
</template>
<script>
import { getAutoInspectHistoryDetail, downloadAutoHistoryData } from '@/api/auto-inspection.js'
import { getDict, dictTrans } from '@/api/common.js'
export default {
  props: {},
  data() {
    return {
      dialogVisible: false,
      tableData: [],
      detailData: {},
      equipmentTypeOptions: []
    }
  },
  computed: {
    title: function () { return '记录详情' }
  },
  mounted() { },
  methods: {
    initData(id) {
      getAutoInspectHistoryDetail(id).then(res => {
        if (res.code === 200 && res.data.length) this.tableData = res.data;
      })
      getDict('equipment_type').then(res => {
        if (res.code === 200) this.equipmentTypeOptions = res.data;
      })
    },
    open(data) {
      this.dialogVisible = true;
      this.detailData = data;
      this.initData(data.id)
    },
    handleClose() {
      this.dialogVisible = false;
    },
    exportData() {
      downloadAutoHistoryData(this.detailData.id).then(res => {
        let data = res;
        if (!data) return;
        let url = window.URL.createObjectURL(new Blob([data]));
        let link = document.createElement("a");
        link.style.display = "none";
        link.href = url;
        link.setAttribute("download", `${this.detailData.inspectName}${this.detailData.createTime}记录.xls`);
        document.body.appendChild(link);
        link.click();
      })
    },
    equipmentTypeTrans(data, code) {
      return dictTrans(data, code)
    }
  }
}
</script>

<style lang="scss" scoped>

.customBtn {
  border-radius: 3px;
}

::v-deep .el-checkbox {
  margin-right: 10px;
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

.box_title {
  margin-bottom: 10px;
  padding-left: 15px;

  >span:nth-child(1) {
    display: inline-block;
    font-size: 20px;
    font-weight: bold;
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

  >p {
    margin: 20px 0;
  }
}
</style>
