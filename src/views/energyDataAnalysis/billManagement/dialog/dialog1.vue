<!--  -->
<template>
  <el-dialog :visible.sync="dataFlag" width="450px" :before-close="dialogClose" :close-on-click-modal="false"
    :show-close="false" center>
    <div slot="title" class="dialog-header">计价规则</div>
    <el-form ref="form" :model="form" :rules="rules" label-width="220px">
      <el-form-item label="最大需量（千伏安）" prop="maximumDemand">
        <el-input v-model="form.maximumDemand"></el-input>
      </el-form-item>
      <el-form-item label="按最大需量（元/千瓦.月）" prop="maximumDemandPrice">
        <el-input v-model="form.maximumDemandPrice"></el-input>
      </el-form-item>
      <el-form-item label="变压器容量（kva）" prop="transformerCapacity">
        <el-input v-model="form.transformerCapacity"></el-input>
      </el-form-item>
      <el-form-item label="按变压器容量（元/千伏安.月）" prop="transformerCapacityPrice">
        <el-input v-model="form.transformerCapacityPrice"></el-input>
      </el-form-item>
      <el-form-item label="" class="singleChoice">
        <el-radio-group v-model="form.type">
          <el-radio label="按需量计算"></el-radio>
          <el-radio label="按容量计算"></el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="save" size="mini">保存</el-button>
      <el-button type="primary" @click="dialogClose" size="mini">返回</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { fetchBaseRule, updateBaseRule } from '@/api/bill-management.js'
export default {
  components: {},
  props: {
    dataFlag: {
      type: Boolean,
      required: false,
    },
  },
  data() {
    var validatePrice = (rule, value, callback) => {
      const reg = /(?:^[1-9]([0-9]+)?(?:\.[0-9]{1,2})?$)|(?:^(?:0)$)|(?:^[0-9]\.[0-9](?:[0-9])?$)/
      if (value === '') {
        callback(new Error('请输入'));
      } else if (!reg.test(value)) {
        callback(new Error('请输入正确的值'));
      } else {
        callback();
      }
    }
    return {
      dialogVisible: true,
      form: {
        type: '按需量计算',
        maximumDemand: '',
        maximumDemandPrice: '',
        transformerCapacity: '',
        transformerCapacityPrice: '',
      },
      rules: {
        maximumDemand: [{ required: true, message: '请输入最大需量', trigger: 'blur' }, { validator: validatePrice, trigger: 'blur' }],
        maximumDemandPrice: [{ required: true, message: '请输入最大需量单价', trigger: 'blur' }, { validator: validatePrice, trigger: 'blur' }],
        transformerCapacity: [{ required: true, message: '请输入变压器容量', trigger: 'blur' }, { validator: validatePrice, trigger: 'blur' }],
        transformerCapacityPrice: [{ required: true, message: '请输入变压器容量单价', trigger: 'blur' }, { validator: validatePrice, trigger: 'blur' }],
      }
    };
  },

  computed: {},

  mounted() {
    this.getData()
  },

  methods: {
    getData() {
      fetchBaseRule().then(res => { if (res && res.data) this.form = res.data })
    },
    save() {
      updateBaseRule(this.form).then(() => {
        this.$message.success('保存成功')
        this.$emit('dialog1Save');
      })
    },
    dialogClose() {
      this.$emit('dialog1Cancel');
      this.$refs['form'].resetFields();
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep {
  .el-dialog {
    border-radius: 10px 10px 10px 10px;
    background-color: #1d2f4b;
  }

  .el-dialog__header {
    background: #243e62;
    border-radius: 10px 10px 0px 0px;
    color: #fff;
    // text-align: center;
    padding-top: 0;
    padding-bottom: 0;
    height: 44px;
    font-size: 20px;
  }

  .el-form-item__label {
    text-align: left;
  }

  .el-input {
    width: 160px;
  }

  .singleChoice {
    .el-form-item__content {
      margin-left: 0 !important;
      text-align: center;

      .el-radio {
        color: #fff;
      }
    }
  }
}

.dialog-header {
  height: 44px;
  line-height: 44px;
}
</style>
