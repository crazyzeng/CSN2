<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="40%" :before-close="handleClose">
    <section class="dialog_content">
      <section class="top_box">
        <el-row>
          <el-col :span="6">
            <span>单号：</span><span>{{ detailData.orderNumber }}</span>
          </el-col>
          <el-col :span="6">
            <span>类型：</span><span>{{ orderTypeTrans(detailData.stockOrderType) }}</span>
          </el-col>
          <el-col :span="6">
            <span>操作仓库：</span><span>{{ responsitoryTrans(detailData.fromRepository) }}</span>
          </el-col>
          <el-col :span="6">
            <span>时间：</span><span>{{ detailData.createTime }}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <span>操作项目数量：</span><span>{{ detailData.itemNum }}项</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <span>操作物品数量：</span><span>{{ detailData.opratorNum }}件</span>
          </el-col>
        </el-row>
      </section>
      <el-table :data="tableData" style="margin-top:20px">
        <el-table-column prop="stockNumber" label="设备编号"></el-table-column>
        <el-table-column prop="stockName" label="设备名称"></el-table-column>
        <el-table-column prop="stockType" label="设备类型">
          <template #default="{ row }">{{ stockTypeTrans(stockTypeOptions, row.stockType) }}</template>
        </el-table-column>
        <el-table-column prop="belong" label="物品归属"></el-table-column>
        <el-table-column v-if="isTransfer" prop="fromRepository" label="调拨仓库">
        </el-table-column>
        <el-table-column v-if="isTransfer" prop="toRepository" label="目标仓库">
        </el-table-column>
        <el-table-column prop="oldNum" label="操作前库存"></el-table-column>
        <el-table-column prop="newNum" label="操作后库存"></el-table-column>
        <el-table-column prop="operateNum" label="差值"></el-table-column>
      </el-table>
    </section>
  </el-dialog>
</template>
<script>
import { getStockOrderDetail, getAllReponsitory } from '@/api/warehouse.js'
import { getDict, dictTrans } from '@/api/common'
export default {
  props: {},
  data() {
    return {
      dialogVisible: false,
      tableData: [],
      detailData: {},
      typeOptions: [
        {
          label: '出库',
          value: 0
        },
        {
          label: '入库',
          value: 1
        },
        {
          label: '调拔',
          value: 2
        },
        {
          label: '报废',
          value: 3
        },
        {
          label: '盘点',
          value: 4
        },
      ],
      stockTypeOptions: [],
      responsitoryList: [],
      isTransfer: false
    }
  },
  computed: {
    title: function () {
      return this.detailData?.orderNumber || ''
    }
  },
  created() {
    this.initData()
  },
  mounted() {
  },
  methods: {
    stockTypeTrans(data, code) {
      return dictTrans(data, code)
    },
    initData() {
      getDict('stock_type').then(res => {
        if (res.code === 200 && res.data) this.stockTypeOptions = res.data;
      })
      getAllReponsitory().then(res => {
        if (res.code === 200 && res.data) this.responsitoryList = res.data;
      })
    },
    getDetail(id) {
      getStockOrderDetail(id).then(res => {
        if (res.code === 200 && res.data) {
          this.detailData = res.data;
          this.tableData = res.data.details.map(v => ({
            ...v,
            toRepository: this.responsitoryTrans(res.data.toRepository),
            fromRepository: this.responsitoryTrans(res.data.fromRepository)
          }
          ))
        }
      })
    },
    orderTypeTrans(code) {
      let tempLabel = '';
      this.typeOptions.forEach(v => { if (v.value === code) tempLabel = v.label; })
      return tempLabel;
    },
    responsitoryTrans(code) {
      let tempLabel = '';
      this.responsitoryList.forEach(v => { if (v.id === code) tempLabel = v.repoName; })
      return tempLabel;
    },
    open(data) {
      this.dialogVisible = true;
      this.getDetail(data.id);
      this.isTransfer = data.stockOrderType === '调拔' ? true : false
    },
    handleClose() {
      this.dialogVisible = false;
    },
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-table {

  th.el-table__cell.is-leaf,
  .el-table td.el-table__cell {
    border: none;
  }
}

::v-deep .el-dialog {
  .el-dialog__header {
    background-color: #fff;
  }

  .el-dialog__body {
    padding-top: 10px;
  }
}

.custom_tab {
  margin-bottom: 10px;

  >span {
    display: inline-block;
    height: 30px;
    line-height: 30px;
    cursor: pointer;
    font-size: 16px;
    padding: 0 15px;
  }

  >span.active {
    border-bottom: 1px solid #0084ff;
  }
}

.dialog_content {
  color: #000;

  .top_box {
    padding-bottom: 30px;
    border-bottom: 1px solid #355271;

    >div:first-child {
      margin-top: 20px;
    }

    >div:nth-child(2) {
      margin: 20px 0;
    }
  }

}
</style>