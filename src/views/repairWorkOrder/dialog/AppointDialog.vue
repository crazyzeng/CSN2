<!-- 指派dialog -->
<template>
  <div>
    <el-dialog title="指派维修人员" :visible.sync="dialogVisible" width="18%" :before-close="handleClose"
      :close-on-click-modal="false">
      <el-form ref="formRef" :inline="true" :rules="rules" label-width="80px" :model="formData" class="demo-form-inline">
        <el-form-item label="部门" prop="dept">
          <el-select v-model="formData.dept" style="width:204px" @change="deptChange">
            <el-option v-for="item in deptmentList" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="维修人员" prop="username">
          <el-select v-model="formData.username" multiple collapse-tags style="width:204px">
            <el-option v-for="item in inspectUserList" :key="item" :label="item" :value="item"></el-option>
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
import { assignRepairWorkOrder } from '@/api/repair-workorder.js'
import { getAllDeptment, getUserByDeptment } from '@/api/deptment.js'
import { deepClone } from '@/utils'
export default {
  data() {
    return {
      dialogVisible: false,
      formData: {
        id: '',
        dept: '',
        username: ''
      },
      deptmentList: [],
      repairPeopleArr: [
        { label: '人员1', value: '1' },
        { label: '人员2', value: '2' },
      ],
      inspectUserList: [],
      rules: {
        dept: [
          { required: true, message: '请选择部门', trigger: 'change' }
        ],
        username: [{ required: true, message: '请选择维修人员', trigger: 'blur' }],
      }
    };
  },

  components: {},

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
    },
    handleClose() {
      this.$refs.formRef?.resetFields()
      this.formData.id = '';
      this.formData.username = '';
      this.formData.dept = '';
      this.dialogVisible = false
    },
    deptChange(e) {
      this.formData.username = '';
      getUserByDeptment(e).then(res => {
        if (res.code === 200 && res.data) this.inspectUserList = res.data;
      })
    },
    async confirm() {
      this.$refs['formRef'].validate((valid) => {
        if (valid) {
          let tempObj = deepClone(this.formData);
          delete tempObj.dept;
          tempObj.username = this.formData.username?.join(',');
          assignRepairWorkOrder(this.formData).then(res => {
            if (res.code === 200) {
              this.$message.success('指派成功')
              this.$emit('success')
              this.handleClose()
            }
          })
        }
      })
    },
    cancel() {
      this.$refs.formRef?.resetFields()
      this.dialogVisible = false
    }
  }
}

</script>
<style lang='scss' scoped>
::v-deep .el-select {
  .el-tag.el-tag--info {
    color: #000;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(90, 151, 250, 0.3);
  }
}
</style>