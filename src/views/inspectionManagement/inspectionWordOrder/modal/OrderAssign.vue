<!-- 指派弹窗 -->
<template>
  <el-dialog :visible.sync="dialogVisible" title="请选择巡检人员" width="18%" @before-close="handleClose" center>
    <section class="dialog_content">
      <el-form :model="formData" ref="ruleForm" label-width="80px" :rules="rules">
        <el-form-item label="部门" prop="dept">
          <el-select v-model="formData.dept" style="width:204px" @change="deptChange">
            <el-option v-for="item in deptmentList" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="巡检员" prop="username">
          <el-select v-model="formData.username" multiple collapse-tags style="width:204px">
            <el-option v-for="item in inspectUserList" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <p style="text-align: center;margin-top:80px;" slot="footer" class="dialog-footer">
        <el-button type="text" class="customBtn submitBtn" icon="" @click="submit">确定</el-button>
        <el-button type="text" class="customBtn backBtn" icon="" @click="handleClose">返回</el-button>
      </p>
    </section>
  </el-dialog>
</template>
<script>
import { assignWorkOrder } from '@/api/inspect-workorder.js'
import { getAllDeptment, getUserByDeptment } from '@/api/deptment.js'
import { deepClone } from '@/utils/index'
export default {
  props: {},
  data() {
    return {
      dialogVisible: false,
      formData: {
        id: '',
        dept: '',
        username: [],
      },
      deptmentList: [],
      inspectUserList: [],
      rules: {
        dept: [
          { required: true, message: '请选择部门', trigger: 'change' }
        ],
        username: [
          { required: true, message: '请选择巡检员', trigger: 'change' }
        ]
      }
    }
  },
  computed: {},
  mounted() {
    this.initData()
  },
  methods: {
    initData() {
      getAllDeptment().then(res => {
        if (res.code === 200 && res.data) this.deptmentList = res.data;
      })
    },
    open(data) {
      this.dialogVisible = true;
      this.formData.id = data.id;
      this.$refs.ruleForm?.resetFields();
    },
    handleClose() {
      this.dialogVisible = false;
      this.formData.id = '';
      this.formData.dept = '';
      this.formData.username = [];
    },
    deptChange(e) {
      this.formData.username = '';
      getUserByDeptment(e).then(res => {
        if (res.code === 200 && res.data) this.inspectUserList = res.data;
      })
    },
    submit() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          let tempObj = deepClone(this.formData);
          delete tempObj.dept;
          tempObj.username = this.formData.username?.join(',');
          assignWorkOrder(this.formData).then(res => {
            if (res.code === 200) {
              this.$message.success('指派成功');
              this.handleClose()
              this.$emit('assignFinish')
            }
          })
        }
      })
    },
  }
}
</script>
<style lang="scss" scoped>
.customBtn {
  background-color: #2e6cd8;
  color: #fff;
}

.submitBtn {
  width: 60px;
  height: 30px;
}

.backBtn {
  width: 60px;
  height: 30px;
  background-color: transparent;
  border: 1px solid #2e6cd8;
}

::v-deep .el-select {
  .el-tag.el-tag--info {
    background-color: #2a3e62;
    color: #fff;
    border-color: #C0C4CC;
  }
}

.el-select-dropdown__wrap {
  .el-select-dropdown__item.selected {
    background-color: #2a3e62;
  }

  .el-select-dropdown__item.selected.hover {
    background-color: #0e2e66;
  }
}
</style>
