<!-- 新增 -->
<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="380px" :before-close="handleClose" center>
    <section class="content_box">
      <el-form ref="basicForm" :inline="true" :rules="rules" :model="formData" class="">
        <el-row>
          <el-col>
            <el-form-item label="表计名称：" prop="stockNumber">
              <el-input v-model="formData.stockNumber" placeholder="请输入表计名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="分项名称：" prop="stockType">
              <el-select v-model="formData.stockType"  placeholder="请输入分项名称">
                <el-option v-for="item in stockTypeOptions" :key="item.itemValue" :label="item.itemText"
                  :value="item.itemValue"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="所在区域：" prop="belong">
              <el-input v-model="formData.belong"  placeholder="请输入所在区域"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="安装位置：" prop="curNum">
              <el-input v-model="formData.curNum"  placeholder="请输入安装位置"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </section>
    <span slot="footer" class="dialog-footer">
      <el-button class="confirm-btn" @click="submit">保 存</el-button>
      <el-button class="cancel-btn" @click="handleClose">返 回</el-button>
    </span>
  </el-dialog>
</template>
<script>
// import { addStock } from '@/api/warehouse.js'
// import { getStorehouseList } from '@/api/warehouse/check.js'
// import { getDict } from '@/api/common'
export default {
  props: {},
  data() {
    var validateNumber = (rule, value, callback) => {
      const reg = /^[0-9]+(.[0-9]{1,2})?$/;
      if (value === '') {
        callback(new Error('请输入值'));
      } else if (!reg.test(value)) {
        callback(new Error('输入格式不正确'))
      } else {
        callback();
      }
    };
    return {
      dialogVisible: false,
      deviceStatusList: [
        {
          label: '状态1',
          value: '状态1'
        }
      ],
      imageUrl: '',
      formData: {
        stockNumber: '',
        stockName: '',
        stockType: '',
        belong: '',
        repository: '',
        spec: '',
        curNum: '',
        threshold: ''
      },
      rules: {
        stockNumber: [{ required: true, message: '请输入设备编号', tirgger: 'blur' }],
        stockName: [{ required: true, message: '请输入设备名称', tirgger: 'blur' }],
      },
      storehouseList: [],
      stockTypeOptions: []
    }
  },
  computed: {
    title: function () { return '新增表计配置' }
  },
  mounted() {
    this.initData()
  },
  methods: {
    initData() {
    },
    open(data) {
      this.dialogVisible = true;
    },
    handleClose() {
      for (let k in this.formData) this.formData[k] = '';
      this.$refs.basicForm.clearValidate();
      this.dialogVisible = false;
    },
    submit() {
      this.$refs.basicForm.validate(valid => {
        if (valid) {
          // addStock(this.formData).then(res => {
          //   if (res.code === 200) {
          //     this.$message.success('新增成功');
          //     this.handleClose();
          //     this.$emit('success');
          //   }
          // })
        }
      })
    },
    handleAvatarSuccess() { },
    beforeAvatarUpload() { }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog {
  .el-dialog__header {
    text-align: left;
  }

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
    color: #fff;
    vertical-align: middle;
  }
}

.content_box {}
</style>