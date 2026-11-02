<template>
  <el-form :inline="true" :model="formData">

    <template v-for="item in formList">

      <query-form-item-select v-if="item.tag == 'el-select'" v-model="formData[item.modelName]"
        :model-value="formData[item.modelName]" :key="getKey(item)" :data-item="item"></query-form-item-select>

      <query-form-item-time v-else-if="item.tag == 'el-date-picker'" v-model="formData[item.modelName]"
        :model-value="formData[item.modelName]" :key="getKey(item)" :data-item="item"></query-form-item-time>

      <query-form-item v-else v-model="formData[item.modelName]" :model-value="formData[item.modelName]"
        :key="getKey(item)" :data-item="item"></query-form-item>
    </template>


    <el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="onQuery(formData)">查询</el-button>
      <el-button type="primary" icon="el-icon-refresh-left" @click="onReset(formData)">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>

import { consoleLog } from '@/utils'
import QueryFormItem from './components/Item.vue'
import QueryFormItemSelect from './components/ItemSelect.vue'
import QueryFormItemTime from './components/ItemTime.vue'

export default {
  name: 'QueryForm',
  components: { QueryFormItem, QueryFormItemSelect, QueryFormItemTime },
  props: {
    formList: {
      type: Array,
      default() { return [] }
    },
    onQuery: {
      type: Function,
      default(formData) {
        consoleLog('query...', formData)
      }
    },
    onReset: {
      type: Function,
      default(formData) {
        for (const key in formData) { const item = formData[key] = '' }
        this.onQuery(formData)
      }
    }
  },
  data() {
    return {
      formData: {}
    }
  },
  watch: {
    formList: {
      handler(newValue) {
        newValue.forEach(item => {
          if (!this.formData.hasOwnProperty(item.modelName)) {
            this.$set(
              this.formData,
              item.modelName,
              item.defaultValue != undefined ? item.defaultValue : '',
            )
          }
        })
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    getKey(item) {
      return item.attribute ? item.attribute.key ? item.attribute.key : item.tag : item.tag
    }
  },
}
</script>

<style lang="scss" scoped></style>
