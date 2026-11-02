<template>
  <div>
    <el-form-item label="设定停止时间">
      <el-date-picker v-model="model.endTime" placeholder="选择时间" style="width: 160px" />
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: "HeatStop",
  props: {
    value: Object
  },
  computed: {
    model: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  }
}
</script>