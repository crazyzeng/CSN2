<!-- 智能巡检详情弹窗 -->
<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="60%" :before-close="handleClose" center>
    <section class="content_box">
      <p><span>智能巡检任务名称：</span><span>{{ insptectDetail.inspectName }}</span></p>
      <p><span>巡检日期：</span><span>{{ insptectDetail.circleMode === 'DAY' ? '每日' : insptectDetail.circleMode ===
        'WEEK' ? `每周${insptectDetail.circleTime}` : `${insptectDetail.circleTime}` }}</span></p>
      <p><span>巡检时间：</span><span>{{ insptectDetail.startTime }}</span></p>
      <el-table :data="tableData" style="width: 100%" height="300">
        <el-table-column prop="equipmentNumber" label="设备编号" min-width="100" align="center">
        </el-table-column>
        <el-table-column prop="equipmentName" label="设备名称" min-width="100" align="center">
        </el-table-column>
        <el-table-column prop="equipmentType" label="设备类型" min-width="100" align="center">
          <template #default="{ row }">{{ equipmentTypeTrans(equipmentTypeOptions, row.equipmentType)
          }}</template>
        </el-table-column>
        <el-table-column prop="" label="巡检内容" align="center" min-width="200">
          <template #default="{ row }">
            <span v-for="item in row.config" style="padding:0 5px;" :key="item.id"><i
                style="font-style:normal">•&nbsp;</i>{{
                  item.description
                }}</span>
          </template>
        </el-table-column>
      </el-table>
    </section>
  </el-dialog>
</template>
<script>
import { autoInspectDetail } from '@/api/auto-inspection.js'
import { getDict, dictTrans } from '@/api/common.js'
export default {
  props: {

  },
  data() {
    return {
      dialogVisible: false,
      tableData: [],
      insptectDetail: {},
      equipmentTypeOptions: []
    }
  },
  computed: {
    title: function () { return '详情' }
  },
  mounted() { },
  methods: {
    initData(id) {
      autoInspectDetail(id).then(res => {
        if (res.code === 200 && res.data.length > 0) this.tableData = res.data;
      })
      getDict('equipment_type').then(res => {
        if (res.code === 200 && res.data.length > 0) this.equipmentTypeOptions = res.data;
      })
    },
    open(data) {
      this.dialogVisible = true;
      this.initData(data.id);
      Object.assign(this.insptectDetail, data);
    },
    handleClose() {
      this.dialogVisible = false;
    },
    equipmentTypeTrans(data, code) {
      return dictTrans(data, code);
    }
  }
}
</script>

<style lang="scss" scoped>

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
    color: #333;
    vertical-align: middle;
  }
}

.opSetting {
  display: flex;
  margin-top: 150%;
  flex-wrap: nowrap;
  justify-content: space-evenly;
}

.content_box {
  // color: #333;

  >p {
    margin: 20px 0;
  }
}
</style>
