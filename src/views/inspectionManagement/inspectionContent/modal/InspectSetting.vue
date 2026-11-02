<!-- 巡检内容配置-弹窗 -->
<template>
  <el-dialog title="配置" :visible.sync="dialogVisible" width="60%" :before-close="handleClose">
    <section class="dialog_content">
      <p style="float: left; margin-bottom: 10px;" class="dialog-footer">
        <el-button type="primary" plain icon="el-icon-plus" @click="add">新增项目</el-button>
      </p>
      <el-table ref="table" :data="tableData" style="width: 100%;height: 300px;">
        <el-table-column align="center" type="index" label="序号" width="60">
        </el-table-column>
        <el-table-column align="center" prop="itemName" label="巡检项目" width="">
          <template #default="{ row }">
            <el-input v-if="row.isEdit" v-model="row.itemName"></el-input>
            <span v-else>{{ row.itemName }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="expect" label="巡检要求" width="">
          <template #default="{ row }">
            <el-input v-if="row.isEdit" v-model="row.expect"></el-input>
            <span v-else>{{ row.expect }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="=" label="操作" width="">
          <template #default="{ row, $index }">
            <el-button type="text" class="delBtn" @click="del(row, $index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </section>
    <p style="text-align: center;margin-top: 20px;" slot="footer" class="dialog-footer">
      <el-button type="primary" icon="" @click="submit">保存</el-button>
      <el-button icon="" @click="handleClose">返回</el-button>
    </p>
  </el-dialog>
</template>
<script>
import { addInspectContent, getInspectContentDetail, deleteInspectContent } from '@/api/inspection-content.js'
export default {
  props: {},
  data() {
    return {
      dialogVisible: false,
      tableData: [],
      addConfigList: []
    }
  },
  computed: {},
  mounted() { },
  methods: {
    initData(code) {
      getInspectContentDetail(code).then(res => {
        if (res.code === 200 && res.data) this.tableData = res.data;
      })
    },
    add() {
      const tempObj = {
        itemName: '',
        expect: '',
        equipmentType: this.equipmentType,
        isEdit: true
      }
      this.addConfigList.push(tempObj)
      this.tableData.push(tempObj)
    },
    del(item, index) {
      this.$confirm('确认删除?', '提示',{
        confirmButtonClass:'confirm-btn ',
        cancelButtonClass:'cancel-btn ',
      }).then(() => {
        if (item.isEdit) {
          this.addConfigList.splice(index, 1);
          this.tableData.splice(index, 1);
        }
        else {
          deleteInspectContent(item.id).then(res => {
            if (res.code === 200) {
              this.$message.success('删除成功');
              this.initData(this.equipmentType);
            }
          })
        }
      }).catch(() => { })
    },
    open(data) {
      this.dialogVisible = true;
      this.equipmentType = data.equipmentType;
      this.initData(this.equipmentType)
    },
    submit() {
      let isEmpty = false;
      this.addConfigList.forEach(v => { if (v.itemName === '') isEmpty = true; })
      if (!isEmpty) {
        addInspectContent(this.addConfigList).then(res => {
          if (res.code === 200) {
            this.$message.success('新增成功');
            this.initData(this.equipmentType);
            this.handleClose();
            this.$emit('success');
          }
        })
      } else this.$message.warning('巡检项目不能为空')
    },
    handleClose() {
      this.dialogVisible = false;
      this.addConfigList = [];
    },
  }
}
</script>
<style lang="scss" scoped>

.delBtn {
  color: #ff3c00;
  font-size: 16px;
  padding: 0 5px;
}

.submitBtn {
  width: 60px;
  height: 30px;
  color: #fff;
  background-color: #2e6cd8;
}

.backBtn {
  width: 60px;
  height: 30px;
  background-color: transparent;
  border: 1px solid #2e6cd8;
  color: #fff;
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