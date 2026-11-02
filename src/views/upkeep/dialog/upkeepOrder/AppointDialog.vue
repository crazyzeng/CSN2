<!-- 指派dialog -->
<template>
  <div>
    <el-dialog title="指派保养人员" :visible.sync="dialogVisible" width="350px" :before-close="handleClose"
      :close-on-click-modal="false">
      <el-form ref="formRef" :inline="true" :rules="rules" label-width="80px" :model="formData" class="demo-form-inline">
        <el-form-item label="部门" prop="dept">
          <el-select v-model="formData.dept" style="width:204px" @change="deptChange">
            <el-option v-for="item in deptmentList" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="保养人员" prop="people">
          <el-select v-model="formData.people" style="width:204px" placeholder="请选择保养人员">
            <el-option v-for="item in userList" :key="item" :label="item" :value="item">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirm">确 定</el-button>
        <el-button type="primary" @click="cancel">返 回</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { doAssign } from '@/api/upkeep/workOrder.js'
import { getAllDeptment, getUserByDeptment } from '@/api/deptment.js'
import { deepClone } from '@/utils'

export default {
  data() {
    return {
      dialogVisible: false,
      formData: {
        dept: '',
        people: ''
      },
      deptmentList: [],
      userList: [],
      rules: {
        dept: [{ required: true, message: '请选择部门', trigger: 'change' }],
        people: [{ required: true, message: '请选择保养人员', trigger: 'change' }],
      }
    };
  },

  components: {},

  computed: {},

  mounted() {
    getAllDeptment().then(res => {
      if (res.code === 200 && res.data) this.deptmentList = res.data;
    })
  },

  methods: {
    open(data, list) {
      this.curId = data.id
      this.dialogVisible = true
    },
    handleClose(done) {
      this.$refs.formRef?.resetFields()
      done();
    },
    deptChange(e) {
      this.formData.username = '';
      getUserByDeptment(e).then(res => {
        if (res.code === 200 && res.data) this.userList = res.data;
      })
    },
    async confirm() {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          let tempObj = deepClone(this.formData);
          delete tempObj.dept;
          doAssign(this.curId, tempObj.people).then(res => {
            if (res.code === 200) {
              this.$message.success('指派成功')
              this.$emit('success')
            } else {
              this.$message.success(res.msg || '指派失败')
            }
          })
          this.dialogVisible = false
          this.$refs.formRef?.resetFields()
        }
      });

    },
    cancel() {
      this.$refs.formRef?.resetFields()
      this.dialogVisible = false
    }
  }
}

</script>
<style lang='scss' scoped></style>