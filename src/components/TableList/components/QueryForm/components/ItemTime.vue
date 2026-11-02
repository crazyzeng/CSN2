<template>
  <el-form-item :label="dataItem.label">
    <component :is="dataItem.tag" v-model="value" v-bind="attribute"></component>
  </el-form-item>
</template>

<script>

import ItemHandle from '../mixin/ItemHandle'

export default {
  name: 'QueryFormItemTime',
  mixins: [ItemHandle]
}
</script>

<style lang="scss" scoped></style>