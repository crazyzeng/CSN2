<template>
  <el-dialog title="离线设备详情" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
    <section>
      <el-table :data="tableData" style="width: 100%" height="calc(100% - 504px)">
        <el-table-column prop="deviceNum" label="设备编号" align="center">
        </el-table-column>
        <el-table-column prop="deviceName" label="设备名称" align="center">
        </el-table-column>
        <el-table-column prop="deviceType" label="设备类型" align="center">
        </el-table-column>
        <el-table-column prop="location" label="设备安装位置" width="200" align="center">
        </el-table-column>
        <el-table-column prop="status" label="离线时间" align="center">
        </el-table-column>
      </el-table>
    </section>
  </el-dialog>
</template>
<script>
export default {
  props: {},
  data() {
    return {
      dialogVisible: false,
      tableData: []
    }
  },
  computed: {},
  mounted() { },
  methods: {
    getData() { },
    open() {
      this.dialogVisible = true;
      this.getData()
    },
    handleClose() {
      this.dialogVisible = false;
    },
    submit() { }
  }
}
</script>