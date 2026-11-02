<!-- 库存信息记录 -->
<template>
  <div class="content_box">
    <el-form :model="formData" :inline="true">
      <el-form-item label="单号">
        <el-input v-model="formData.orderNumber"></el-input>
      </el-form-item>
      <el-form-item label="类型">
        <el-select v-model="formData.stockOrderType">
          <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="时间">
        <el-date-picker v-model="timeRange" type="daterange" range-separator="至" start-placeholder="开始日期"
          end-placeholder="结束日期" value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="query">查询</el-button>
        <el-button type="primary" icon="el-icon-refresh" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" style="width: 100%" height="calc(100% - 90.5px)">
      <el-table-column prop="orderNumber" label="单号" width="" align="center">
      </el-table-column>
      <el-table-column prop="stockOrderType" label="类型" width="" align="center">
        <!-- <template #default="{ row }">{{ orderTypeTrans(row.stockOrderType) }}</template> -->
      </el-table-column>
      <el-table-column prop="createTime" label="时间" align="center">
      </el-table-column>
      <el-table-column prop="comm" label="备注" align="center">
      </el-table-column>
      <el-table-column prop="" label="操作" align="center">
        <template #default="{ row }">
          <el-button type="text" @click="addCommit(row)">备注</el-button>
          <el-button type="text" @click="seeDetail(row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination style="float:right;margin-top: 10px;" @current-change="handleCurrentChange"
      :current-page="paging.pageNo" :page-size="paging.pageSize" layout="total, prev, pager, next, jumper"
      :total="paging.total">
    </el-pagination>
    <DetailModal ref="detailRef"></DetailModal>
  </div>
</template>

<script>
import DetailModal from './modal/DetailModal.vue';
import { getStockOrderRecord, addCommit } from '@/api/warehouse.js'
export default {
  data() {
    return {
      paging: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      timeRange: '',
      formData: {
        orderNumber: '',
        stockOrderType: '',
        startTime: '',
        endTime: ''
      },
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
      tableData: [],
    };
  },

  components: { DetailModal },

  computed: {},

  mounted() {
    this.init();
  },

  methods: {
    getData() {
      if (this.timeRange.length > 0) {
        this.formData.startTime = this.timeRange[0];
        this.formData.endTime = this.timeRange[1];
      }
      getStockOrderRecord(this.formData, this.paging).then(res => {
        if (res.code === 200 && res.data) {
          this.tableData = res.data.records.map(v => ({ ...v, stockOrderType: this.orderTypeTrans(v.stockOrderType) }))
          this.paging.total = res.data.total;
        }
      })
    },
    orderTypeTrans(code) {
      let tempLabel = '';
      this.typeOptions.forEach(v => { if (v.value === code) tempLabel = v.label; })
      return tempLabel;
    },
    init() {
      this.getData();
    },
    query() {
      this.getData();
    },
    reset() {
      for (let key in this.formData) this.formData[key] = '';
      this.timeRange = '';
      this.paging.pageNo = 1;
      this.paging.pageSize = 10;
      this.getData();
    },
    seeDetail(data) {
      this.$refs.detailRef?.open(data)
    },
    handleCurrentChange(val) {
      this.paging.pageNo = val;
      this.getData();
    },
    addCommit(data) {
      this.$prompt('请输入备注信息', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        confirmButtonClass:'confirm-btn ',
        cancelButtonClass:'cancel-btn ',
        inputValue: data.comm,
      }).then(({ value }) => {
        if (value != null) {
          const tempObj = {
            id: data.id,
            comm: value
          }
          addCommit(tempObj).then(res => {
            if (res.code === 200) {
              this.$message.success('添加成功');
              this.reset();
            }
          })
        }
      }).catch(() => { });
    }
  }
}

</script>
<style lang='scss' scoped>
.content_box {
  width: 100%;
  height: 100%;
  padding: 0 10px;
}

::v-deep .el-pagination {
  button {
    background-color: transparent;
    border: 1px solid #364d79;
    color: #fff;
    border-radius: 4px;
  }

  .el-input__inner {
    border-radius: 0%;
  }
}

::v-deep .el-pager {
  li {
    background-color: transparent;
    border: 1px solid #364d79;
    color: #fff;
    margin: 0 2.5px;
    border-radius: 4px;
  }

  li.active+li {
    border-left: 1px solid #364d79;
  }

  li.active {
    background-image: linear-gradient(180deg, #66ffff, #0073e5);
  }
}

.customBtn {
  background-color: #2a3e62;
}

.remarkBtn {
  color: #7faaff;
}

.detailBtn {
  color: #1ec695;
}
.el-date-editor.el-input__inner{
  width: 450px;
}
</style>