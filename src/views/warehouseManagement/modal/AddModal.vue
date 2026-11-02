<!-- 新增 -->
<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="800px" :before-close="handleClose" center>
    <section class="content_box">
      <el-form ref="basicForm" :inline="true" :rules="rules" :model="formData" class="">
        <el-row>
          <el-col :span="12">
            <el-form-item label="设备编号" prop="stockNumber">
              <el-input v-model="formData.stockNumber" style="width: 200px" placeholder="请输入设备编号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备名称" prop="stockName">
              <el-input v-model="formData.stockName" style="width: 200px" placeholder="请输入设备名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="设备类型" prop="stockType">
              <el-select v-model="formData.stockType" style="width: 200px">
                <el-option v-for="item in stockTypeOptions" :key="item.itemValue" :label="item.itemText"
                  :value="item.itemValue"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="规格型号" prop="spec">
              <el-input v-model="formData.spec" style="width: 200px" placeholder="请输入设备规格型号"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="物品归属" prop="belong">
              <el-input v-model="formData.belong" style="width: 200px" placeholder="请输入物品归属"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="库存位置" prop="repository">
              <el-select v-model="formData.repository" style="width: 200px">
                <el-option v-for="item in storehouseList" :key="item.id" :label="item.repoName"
                  :value="item.id.toString()"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="当前库存" prop="curNum">
              <el-input v-model="formData.curNum" style="width: 200px" placeholder="请输入当前库存量"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="库存阈值" prop="threshold">
              <el-input v-model="formData.threshold" style="width: 200px" placeholder="请输入库存阈值"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </section>
    <span slot="footer">
      <el-button type="primary" @click="submit">保 存</el-button>
      <el-button type="primary" @click="handleClose">返 回</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { addStock } from '@/api/warehouse.js'
import { getStorehouseList } from '@/api/warehouse/check.js'
import { getDict } from '@/api/common'
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
        stockType: [{ required: true, message: '请选择设备类型', tirgger: 'change' }],
        belong: [{ required: true, message: '请输入物品归属', tirgger: 'blur' }],
        repository: [{ required: true, message: '请选择库存位置', tirgger: 'change' }],
        spec: [{ required: true, message: '请输入设备规格型号', tirgger: 'blur' }],
        curNum: [{ required: true, message: '请输入当前库存量', tirgger: 'blur' }, { validator: validateNumber, tirgger: 'blur' }],
        threshold: [{ required: true, message: '请输入库存阈值', tirgger: 'blur' }, { validator: validateNumber, tirgger: 'blur' }],
      },
      storehouseList: [],
      stockTypeOptions: []
    }
  },
  computed: {
    title: function () { return '新增备件' }
  },
  mounted() {
    this.initData()
  },
  methods: {
    initData() {
      getStorehouseList().then(res => {
        if (res.code === 200 && res.data) this.storehouseList = res.data
      })
      getDict('stock_type').then(res => {
        if (res.code === 200 && res.data) this.stockTypeOptions = res.data;
      })
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
          addStock(this.formData).then(res => {
            if (res.code === 200) {
              this.$message.success('新增成功');
              this.handleClose();
              this.$emit('success');
            }
          })
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