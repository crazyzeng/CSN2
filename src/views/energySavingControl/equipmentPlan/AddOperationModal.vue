<!-- 日程设置 -->
<template>
  <el-dialog title="日程设置" :visible="dialogVisible" width="35%" :before-close="handleClose" append-to-body>
    <section class="content_box">
      <el-table :data="tableData" ref="tableRef" style="width: 100%" height="400">
        <el-table-column prop="" label="时间">
          <template #default="{ row }">
            <el-time-picker v-model="row.executeTime" value-format='HH:mm:ss' :picker-options="{}" placeholder="任意时间点">
            </el-time-picker>
          </template>
        </el-table-column>
        <el-table-column prop="" label="操作" width="">
          <template #default="{ row, $index }">
            <el-select v-model="row.valueSet" placeholder="请选择" style="padding-right:20px;">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
            <el-button icon="el-icon-plus" circle @click="add()" style="color:#fff" :disabled="disabled"></el-button>
            <el-button v-if="$index !== 0" circle type="danger" icon="el-icon-delete" @click="del($index)"
              :disabled="disabled"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <section class="btn_group">
        <el-button round @click="handleClose">取 消</el-button>
        <el-button round type="primary" @click="confirm">确 定</el-button>
      </section>
    </section>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      dialogVisible: false,
      formData: {
        equipmentNumber: '',
        equipmentName: '',
        equipmentSystem: '',
        equipmentType: '',
        equipmentStatus: ''
      },
      tableData: [{
        pointId: '',
        executeTime: '',
        valueSet: ''
      }],
      options: [{
        value: 1,
        label: '开启'
      }, {
        value: 0,
        label: '关闭'
      }],
      disabled: false,
      pointId: ''
    }
  },
  mounted() { },
  methods: {
    handleClose() {
      this.dialogVisible = false;
    },

    confirm() {
      this.$emit('update-data', this.tableData)
      this.dialogVisible = false;
    },
    add() {
      this.tableData.push(
        {
          executeTime: '',
          valueSet: '',
          pointId: this.pointId
        }
      )
    },
    del(index) {
      this.tableData.splice(index, 1);
    },
    open(data) {
      this.dialogVisible = true;
      this.pointId = data[0].equipmentOnOffPoint;
      this.tableData.forEach(v => {
        v.pointId = this.pointId;
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.btn_group {
  clear: both;
  height: 40px;
  text-align: right;
  padding-top: 20px;
}
</style>