<template>
  <div>
    <el-form-item label="设定启动时间">
      <el-date-picker v-model="model.startTime" placeholder="选择时间" style="width: 160px" />
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: "HeatStart",
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