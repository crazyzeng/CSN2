<template>
  <el-form-item :label="dataItem.label">
    <component :is="dataItem.tag" v-model="value" :placeholder="attribute.placeholder">
      <el-option v-for="(item, index) in getChildrenData" v-bind="children.attribute ? children.attribute : {}"
        :key="item.id ? item.id : index" :label="item[children.label]" :value="item[children.value]"></el-option>
    </component>
  </el-form-item>
</template>

<script>

import ItemHandle from '../mixin/ItemHandle'

export default {
  name: 'QueryFormItemSelect',
  mixins: [ItemHandle],
  computed: {
    getChildrenData() {
      let dataArr = []
      if (Array.isArray(this.children.dataArr)) dataArr = this.dataItem.children.dataArr
      return dataArr
    }
  },
  methods: {
    init() {
      this.value = this.dataItem.defaultValue ? this.dataItem.defaultValue : ''
      this.attribute = this.dataItem.attribute ? this.dataItem.attribute : {}
      this.children = this.dataItem.children ? this.dataItem.children : {}
      this.childrenAttribute = this.children.attribute ? this.children.attribute : {}
    },
  },
}
</script>

<style lang="scss" scoped></style>