<template>
  <el-table class="th-table" v-bind="tableConfig.attribute" :data="tableData" :style="{ 'width': tableConfig.width }"
    @current-change="handleCurrentChange" @selection-change="handleSelectionChange">

    <template v-for="(item, index) in columnConfig">
      <el-table-column v-if="item.type == 'selection'" type="selection" :key="item.id ? item.id : index" />

      <el-table-column v-else-if="item.type == 'index'" type="index" :label="item.label"
        :key="item.id ? item.id : index" />

      <el-table-column v-else-if="item.type == 'btn'" v-bind="item.attribute ? item.attribute : {}" :label="item.label"
        :key="item.id ? item.id : index">

        <template slot-scope="scope">
          <template v-for="(btn, btnIndex) in item.buttonList">
            <el-button size="mini" v-if="btn.if(scope)" :type="btn.type" :icon="btn.icon"
              :key="btn.id ? btn.id : btnIndex" @click="btn.onClick(scope)">{{ btn.text }}</el-button>
          </template>
        </template>
      </el-table-column>

      <el-table-column v-else v-bind="item.attribute ? item.attribute : {}" :label="item.label" :prop="item.prop"
        :key="item.id ? item.id : index"></el-table-column>
    </template>
  </el-table>
</template>

<script>
export default {
  name: 'TableList',
  props: {
    tableData: {
      type: Array,
      default() { return [] }
    },
    tableConfig: {
      type: Object,
      default() {
        return {
          width: '100%',
          attribute: { border: true, 'max-height': '500px' }
        }
      }
    },
    columnConfig: {
      type: Array,
      default() { return [] }
    },
  },
  methods: {
    handleCurrentChange() {
      const handleCurrentChange = this.tableConfig.handleCurrentChange
      if (Object.prototype.toString.call(handleCurrentChange) === '[object Function]')
        handleCurrentChange(...arguments)
    },

    handleSelectionChange() {
      const handleSelectionChange = this.tableConfig.handleSelectionChange
      if (Object.prototype.toString.call(handleSelectionChange) === '[object Function]')
        handleSelectionChange(...arguments)
    }
  },
}
</script>

<style lang="scss" scoped>
.th-table {
  margin-bottom: 20px;
}
</style>


