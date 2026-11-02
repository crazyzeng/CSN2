<!-- 工单-查看路线弹窗 -->
<template>
  <el-dialog title="查看路线" :visible.sync="dialogVisible" width="60%" :before-close="handleClose">
    <section class="dialog_content">
      <el-table ref="table" :data="tableData" style="width: 100%;height: 300px;">
        <el-table-column align="center" type="index" label="序号" width="60">
        </el-table-column>
        <el-table-column align="center" prop="equipmentNumber" label="设备编号" width="200">
        </el-table-column>
        <el-table-column align="center" prop="equipmentName" label="设备名称" width="300">
        </el-table-column>
        <el-table-column align="center" prop="equipmentType" label="设备类型" width="200">
          <template #default="{ row }">{{ equipmentTypeTrans(equipmentTypeOptions, row.equipmentType)
          }}</template>
        </el-table-column>
        <el-table-column align="center" prop="installLocation" label="设备安装位置">
        </el-table-column>
      </el-table>
      <p style="text-align: center;margin-top: 50px;" slot="footer" class="dialog-footer">
        <el-button type="primary" icon="" @click="handleClose">返回</el-button>
      </p>
    </section>
  </el-dialog>
</template>
<script>
import { getEquipmentByLineId } from '@/api/inspection-content.js'
import { getDict, dictTrans } from '@/api/common.js'
export default {
  props: {},
  data() {
    return {
      dialogVisible: false,
      tableData: [],
      equipmentTypeOptions: []
    }
  },
  computed: {},
  mounted() {
    getDict('equipment_type').then(res => {
      if (res.code === 200 && res.data) this.equipmentTypeOptions = res.data;
    })
  },
  methods: {
    initData(data) {
      getEquipmentByLineId(data.inspectLineId).then(res => {
        if (res.code === 200 && res.data) this.tableData = res.data;
      })
    },
    open(data) {
      this.dialogVisible = true;
      this.initData(data)
    },
    handleClose() {
      this.dialogVisible = false;
    },
    equipmentTypeTrans(data, code) {
      return dictTrans(data, code)
    }
  }
}
</script>
<style lang="scss" scoped>
.customBtn {
  background-color: #2e6cd8;
  color: #fff;
}

.backBtn {
  width: 60px;
  height: 30px;
  background-color: transparent;
  border: 1px solid #2e6cd8;
}

::v-deep .el-dialog {
  .el-dialog__header {
    background-color: transparent;
    height: 60px;
  }

  .el-dialog__body {
    padding-top: 10px;
  }
}
</style>