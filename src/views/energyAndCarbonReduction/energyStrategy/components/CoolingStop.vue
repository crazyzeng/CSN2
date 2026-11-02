<template>
  <div>
    <el-form-item label="设定关机时间" label-width="155px">
      <el-date-picker v-model="model.endTime" placeholder="选择时间" style="width: 160px" />
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: "CoolingStop",
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