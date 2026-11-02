<template>
  <div class="th-pagination">
    <el-pagination @size-change="sizeChange" @current-change="pageChange" :current-page="paging.pageNum"
      :page-size="paging.pageSize" :total="paging.total" :layout="layout">
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: '',
  props: {
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    },
    paging: {
      type: Object,
      default() {
        return {
          pageNum: 1,
          pageSize: 10,
          total: 0
        }
      }
    },
    onChange: {
      type: Function,
      default(paging) {
        console.log(paging)
      }
    },
  },
  methods: {
    //分页条数改变事件
    sizeChange(val) {
      this.paging.pageSize = val
      this.onChange(this.paging, 'size')
    },
    //分页页数改变事件
    pageChange(val) {
      this.paging.pageNum = val
      this.onChange(this.paging, 'page')
    },
  },
}
</script>

<style>
.th-pagination {
  text-align: right;
}
</style>