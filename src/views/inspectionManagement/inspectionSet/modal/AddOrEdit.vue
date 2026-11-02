<!-- 配置新增弹窗 -->
<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="22%" :before-close="handleClose" center>
    <section class="dialog_content">
      <el-form :model="formData" ref="ruleForm" label-width="120px" :rules="rules">
        <el-form-item label="设备名称" prop="equipmentName">
          <el-input v-model="formData.equipmentName" :disabled="isEdit" @focus="getEquipment()"
            style="width:180px"></el-input>
        </el-form-item>
        <el-form-item label="设备编号">
          <el-input v-model="formData.equipmentNumber" disabled style="width:180px"></el-input>
        </el-form-item>
        <el-form-item label="设备类型">
          <el-input v-model="formData.equipmentType" style="width:180px" disabled></el-input>
        </el-form-item>
        <el-form-item label="项ID" prop="pointId">
          <el-input v-model="formData.pointId" :disabled="isEdit" @focus="getPoint()" style="width:180px"></el-input>
        </el-form-item>
        <el-form-item label="项名称">
          <el-input v-model="formData.description" disabled style="width:180px"></el-input>
        </el-form-item>
        <el-form-item label="标准最小值" prop="minVal">
          <el-input v-model.number="formData.minVal" style="width:180px"></el-input>
        </el-form-item>
        <el-form-item label="标准最大值" prop="maxVal">
          <el-input v-model.number="formData.maxVal" style="width:180px"></el-input>
        </el-form-item>
      </el-form>
    </section>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" class="saveBtn" @click="submit">保 存</el-button>
      <el-button class="backBtn" @click="handleClose">返 回</el-button>
    </span>
    <EquipmentModal ref="equipmentRef" @data="receiveEquipment"></EquipmentModal>
    <PointModal ref="pointRef" :data-flag="dataFlag" @data="receviePoint" @close="dataFlag = false"></PointModal>
  </el-dialog>
</template>
<script>
import { updateSettingParams, addSettingParams } from '@/api/auto-inspection.js';
import EquipmentModal from './EquipmentModal.vue';
import PointModal from './PointModal.vue';
import { deepClone } from '@/utils/index';
import { getDict, dictTrans } from '@/api/common.js'
export default {
  props: {},
  components: { EquipmentModal, PointModal },
  data() {
    return {
      title:'新增',
      dialogVisible: false,
      tableData: [],
      deviceTypeOptions: [],
      formData: {
        id: '',
        equipmentNumber: '',
        equipmentName: '',
        equipmentType: '',
        equipmentId: '',
        pointId: '',
        description: '',
        minVal: '',
        maxVal: ''
      },
      dataFlag: false,
      isEdit: false,
      rules: {
        equipmentName: [{ required: true, message: '请选择设备', trigger: 'change' }],
        pointId: [{ required: true, message: '请选择点位', trigger: 'change' }],
        minVal: [{ required: true, message: '请输入最小值', trigger: 'blur' }],
        maxVal: [{ required: true, message: '请输入最大值', trigger: 'blur' }]
      }
    }
  },
  // computed: {
  //   title: function () { return '' }
  // },
  mounted() {
    this.initData()
  },
  methods: {
    initData() {
      getDict('equipment_type').then(res => {
        this.deviceTypeOptions = res.data;
      })
    },
    open(data) {
      this.dialogVisible = true;
      if (data) {
        this.title = '编辑'
        this.isEdit = true;
        for (let k in this.formData) {
          this.formData[k] = data[k]
          if (k == 'equipmentType') this.formData.equipmentType = dictTrans(this.deviceTypeOptions, data[k]);
        }
      } else{
        this.isEdit = false;
        this.title = '新增'
      }
    },
    handleClose() {
      this.$refs.ruleForm?.resetFields();
      for (let k in this.formData) this.formData[k] = '';
      this.dialogVisible = false;
    },
    submit() {
      const tempObj = deepClone(this.formData);
      delete tempObj.equipmentName;
      delete tempObj.equipmentNumber;
      delete tempObj.equipmentType;

      const editObj = {
        id: this.formData.id,
        minVal: this.formData.minVal,
        maxVal: this.formData.maxVal
      }
      if (this.formData.minVal > this.formData.maxVal) {
        this.$message.warning('最大值不能小于最小值')
        return;
      }
      if (this.isEdit) {
        updateSettingParams(editObj).then(res => {
          if (res.code === 200) {
            this.$message.success('编辑成功');
            this.handleClose();
            this.$emit('update')
          }
        })
      } else {
        addSettingParams(tempObj).then(res => {
          if (res.code === 200) {
            this.$message.success('新增成功');
            this.handleClose();
            this.$emit('update')
          }
        })
      }
    },
    getEquipment() {
      this.$refs.equipmentRef?.open();
    },
    getPoint() {
      this.dataFlag = true;
    },
    receviePoint(data) {
      this.formData.pointId = data[0].pointId;
      this.formData.description = data[0].name;
    },
    receiveEquipment(data) {
      this.formData.equipmentName = data[0].equipmentName;
      this.formData.equipmentId = data[0].equipmentId;
      this.formData.equipmentNumber = data[0].equipmentNumber;
      this.formData.equipmentType = dictTrans(this.deviceTypeOptions, data[0].equipmentType);
    }
  }
}
</script>


<style lang="scss" scoped>

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
