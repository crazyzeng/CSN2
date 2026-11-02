<template>
  <el-dialog title="打印提示" :visible.sync="dialogVisible" width="22%" :before-close="handleClose">
    <section class="dialog_content">
      <el-radio-group v-model="printMode">
        <el-radio :label="0">打印全部二维码</el-radio>
        <el-radio :label="1">打印查询数据二维码</el-radio>
      </el-radio-group>
    </section>
    <span slot="footer" class="dialog-footer">
      <el-button round type="primary" @click="submit" :loading="isLoading">确 定</el-button>
      <el-button round @click="handleClose">返 回</el-button>
    </span>
    <el-dialog title="打印详情" :visible.sync="innerDialogVisible" width="60%" :before-close="innerClose" append-to-body>
      <PrintDetail ref="printDetailRef" :print-data="listData" @close="innerClose"></PrintDetail>
    </el-dialog>
  </el-dialog>
</template>
<script>
import { getAccountListByPage } from '@/api/account-list.js'
import PrintDetail from './PrintDetail.vue'
export default {
  props: {
    formData: {
      type: Object,
      default: {}
    }
  },
  components: { PrintDetail },
  data() {
    return {
      dialogVisible: false,
      innerDialogVisible: false,
      printMode: 0,
      listData: [],
      paging: {
        pageNo: 1,
        pageSize: 99999,
      },
      propSize: 100,
      isLoading: false
    }
  },
  computed: {},
  mounted() { },
  methods: {
    async query(data) {
      await getAccountListByPage(data, this.paging).then(res => {
        this.isLoading = false;
        if (res.code === 200 && res.data) {
          this.listData = res.data.records;
        }
      })
    },
    open(data) {
      this.dialogVisible = true;
      this.propSize = data;
    },
    handleClose() {
      this.dialogVisible = false;
    },
    innerClose() {
      this.innerDialogVisible = false;
    },
    submit() {
      this.isLoading = true;
      let tempFormData = {};
      if (this.printMode === 0) {
        tempFormData = {};
        this.paging.pageSize = 99999;
      }
      else {
        this.paging.pageSize = this.propSize;
        tempFormData = this.formData;
      }
      this.query(tempFormData)
      this.innerDialogVisible = true;
    },
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-dialog {

  .el-dialog__body {
    padding-top: 10px;
  }
}

::v-deep .el-radio {
  color: #fff;
}
</style>