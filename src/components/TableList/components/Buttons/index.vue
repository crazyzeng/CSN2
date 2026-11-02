<template>
  <component class="th-buttons" :is="template" :style="{ 'float': align }">
    <el-button v-for="(item, index) in buttonList" v-bind="attribute" :key="item.id ? item.id : index" :type="item.type"
      :icon="item.icon" @click="item.onClick">{{ item.text }}</el-button>
  </component>
</template>

<script>
export default {
  name: 'Buttons',
  props: {
    group: {
      type: Boolean,
      default: false
    },
    align: {
      type: String,
      default: 'right'
    },
    attribute: {
      type: Object,
      default() { return {} }
    },
    buttonList: {
      type: Array,
      default() { return [] }
    },
  },
  data() {
    return {
      template: 'el-row'
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      if (this.group) this.template = 'el-button-group'
    }
  },
}
</script>

<style lang="scss" scoped>
.th-buttons {
  padding-bottom: 20px;
  overflow: hidden;
}
</style>
