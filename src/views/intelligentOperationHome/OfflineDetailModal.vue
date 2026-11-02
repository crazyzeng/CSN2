<template>
  <el-dialog title="离线设备详情" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
    <el-table :data="tableData" height="100%" style="width: 100%;">
      <el-table-column prop="equipmentNumber" label="设备编号" align="center">
      </el-table-column>
      <el-table-column prop="equipmentName" label="设备名称" align="center">
      </el-table-column>
      <el-table-column prop="equipmentType" label="设备类型" align="center">
        <template #default="{ row }">{{ equipmentTypeTrans(equipmentTypeOptions, row.equipmentType)
        }}</template>
      </el-table-column>
      <el-table-column prop="installLocation" label="设备安装位置" width="200" align="center">
      </el-table-column>
      <el-table-column prop="offlineTime" label="离线时间" align="center">
      </el-table-column>
    </el-table>
  </el-dialog>
</template>
<script>
import { getDict, dictTrans } from '@/api/common'
export default {
  props: {
    data: {
      type: Array,
      default: () => { return [] }
    }
  },
  data() {
    return {
      dialogVisible: false,
      tableData: [],
      equipmentTypeOptions: []
    }
  },
  watch: {
    'data': function () {
      this.getData()
    }
  },
  computed: {
  },
  mounted() {
    getDict('equipment_type').then(res => {
      if (res.code === 200) this.equipmentTypeOptions = res.data
    })
  },
  methods: {
    getData() {
      this.tableData = this.data;
    },
    open() {
      this.dialogVisible = true;
      this.getData()
    },
    handleClose() {
      this.dialogVisible = false;
    },
    submit() { },
    equipmentTypeTrans(data, code) {
      return dictTrans(data, code)
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .el-dialog {
    height: 80%;
  }

  .el-dialog__body {
    height: calc(100% - 55px);
    overflow-y: scroll;
  }

}
</style>