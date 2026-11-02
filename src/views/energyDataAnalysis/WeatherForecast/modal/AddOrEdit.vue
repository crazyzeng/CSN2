<template>
  <el-dialog :visible.sync="dataFlag" :title="dataTitle" width="440px" :close-on-click-modal="false">
    <template #header>
      <el-divider class="curDivider" direction="vertical" />
      <span class="el-dialog__title">{{ dataTitle }}</span>
    </template>
    <el-form ref="ruleFormRef" :model="formData" :inline="true" :rules="rules" label-width="100px">
      <el-form-item label="时间" prop="dataTime">
        <el-date-picker v-model="formData.dataTime" type="datetime" style="width:212px" placeholder="不能与已有时间重复"
          format="yyyy-MM-dd HH:ss" value-format="yyyy-MM-dd HH" :disabled="dataTitle === '编辑'"
          popper-class="custom_picker" />
      </el-form-item>
      <el-form-item label="干球温度" prop="dryBulbTemp" class="append_input">
        <el-input v-model="formData.dryBulbTemp" style="width:288px" placeholder="请输入干球温度">
          <template #append>
            摄氏度
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="露点温度" prop="dewTemp" class="append_input">
        <el-input v-model="formData.dewTemp" style="width:288px" placeholder="请输入露点温度">
          <template #append>
            摄氏度
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="相对湿度" prop="relativeHumidity" class="append_input">
        <el-input v-model="formData.relativeHumidity" style="width:263px" placeholder="请输入相对湿度">
          <template #append>
            %
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="大气压力" prop="atmosphericPressure" class="append_input">
        <el-input v-model="formData.atmosphericPressure" style="width:273px" placeholder="请输入大气压力">
          <template #append>
            hPa
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="风向" prop="windDirection" class="append_input">
        <el-input v-model="formData.windDirection" style="width:265px" clearable placeholder="请输入与正北方向的顺时针夹角">
          <template #append>
            度
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="风速" prop="windSpeed" class="append_input">
        <el-input v-model="formData.windSpeed" style="width:283px" placeholder="请输入风速">
          <template #append>
            km/h
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="云量" prop="cloudAmount" class="append_input">
        <el-input v-model="formData.cloudAmount" style="width:264px" placeholder="请输入云量">
          <template #append>
            %
          </template>
        </el-input>
      </el-form-item>
    </el-form>
    <section class="text-center">
      <el-button type="primary" @click="submit">
        确 定
      </el-button>
      <el-button @click="close">
        取 消
      </el-button>
    </section>
  </el-dialog>
</template>

<script>
import { addWeather, updateWeather } from '@/api/weather-forecast.js'
var checkNumber = (rule, value, callback) => {
  const reg = /^(\-)?\d+(\.\d{1,1})$/
  if (!value)
    return callback(new Error('请输入正确的温度'))
  if (!reg.test(value))
    callback(new Error('请输入包含一位小数的正数或负数'))
  if (value.length > 10)
    callback(new Error('长度不能超过10个字符'))
  else
    callback()
}
var cloudAmountValid = (rule, value, callback) => {
  const reg = /^\+?[0-9]\d*$/
  if (!value)
    return callback(new Error('请输入正确的云量'))
  if (!reg.test(value))
    callback(new Error('格式不正确，请重新输入'))
  if (value > 100)
    callback(new Error('不能超过100'))
  else
    callback()
};
export default {
  props: {
    dataFlag: {
      type: Boolean,
      default: false
    },
    dataTitle: {
      type: String,
      default: ''
    },
    dataItem: {
      type: Object,
      default: {}
    }
  },
  data: function () {
    return {
      dialogVisible: false,
      ruleFormRef: null,
      formData: {
        dataTime: '',
        dryBulbTemp: '',
        dewTemp: '',
        relativeHumidity: '',
        atmosphericPressure: '',
        windDirection: '',
        windSpeed: '',
        cloudAmount: '',
      },
      rules: {
        dataTime: [{ required: true, message: '请输入时间', trigger: 'change' }],
        dryBulbTemp: [{ required: true, message: '请输入干球温度', trigger: 'blur' }, { validator: checkNumber, trigger: 'blur' }],
        dewTemp: [{ required: true, message: '请输入露点温度', trigger: 'blur' }, { validator: checkNumber, trigger: 'blur' }],
        relativeHumidity: [{ required: true, message: '请输入相对湿度', trigger: 'blur' }, { validator: checkNumber, trigger: 'blur' }],
        atmosphericPressure: [{ required: true, message: '请输入大气压力', trigger: 'blur' }, { validator: checkNumber, trigger: 'blur' }],
        windDirection: [{ required: true, message: '请输入风向角度', trigger: 'blur' }, { validator: checkNumber, trigger: 'blur' }],
        windSpeed: [{ required: true, message: '请输入风速', trigger: 'blur' }, { validator: checkNumber, trigger: 'blur' }],
        cloudAmount: [{ required: true, message: '请选择云量', trigger: 'change' }, { validator: cloudAmountValid, trigger: 'blur' }],
      },
    }
  },
  watch: {
    'dataItem': function () {
      this.getData()
    },
    'dataTitle': function () {
      this.getData()
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    close() {
      Object.keys(this.formData).forEach((key) => { this.formData[key] = '' })
      this.ruleFormRef?.clearValidate()
      this.$emit('success')
    },
    submit() {
      this.$refs['ruleFormRef']?.validate((valid) => {
        if (valid) {
          if (this.formData.dataTime.length < 16)
            this.formData.dataTime += ':00'
          if (this.formData.id) {
            // 编辑
            updateWeather(this.formData).then(() => {
              this.close()
              this.$message.success('编辑成功')
            })
          }
          else {
            // 新增
            addWeather(this.formData).then(() => {
              this.close()
              this.$message.success('新增成功')
            }).catch((e) => { console.log(e) })
          }
        }
      })
    },
    getData() {
      if (this.dataTitle === '编辑') {
        Object.keys(this.dataItem).forEach(key => (this.formData[key] = this.dataItem[key]))
      } else Object.keys(this.formData).forEach((key) => { this.formData[key] = '' })
    }
  }
}
</script>

<style lang="scss" scoped></style>
