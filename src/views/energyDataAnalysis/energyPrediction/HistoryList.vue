<template>
  <el-dialog title="历史记录" :visible.sync="dataFlag" width="55%" :before-close="handleClose">
    <el-form ref="form" :model="formData" label-width="80px" :inline="true">
      <el-form-item label="时间:">
        <el-date-picker type="date" placeholder="选择日期" v-model="formData.startDate" style="width: 100%;"
          value-format="yyyyMMdd"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" round icon="el-icon-search" @click="query">查询</el-button>
        <el-button type="primary" round icon="el-icon-refresh-left" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" style="width: 100%" height="400">
      <el-table-column type="index" label="序号" width="60">
      </el-table-column>
      <el-table-column prop="" label="模式" width="180">
        <template #default="{ row }">{{ modeTrans(row.mode) }}</template>
      </el-table-column>
      <el-table-column prop="energyType" label="能源类型" width="180">
        <template #default="{ row }">{{ modeTrans(dataType) }}</template>
      </el-table-column>
      <el-table-column prop="dataDate" label="日期" width="180">
      </el-table-column>
      <el-table-column prop="" label="线路">
        <template #default="{ row }">
          {{ row.buildType === 'WG' ? '武广' : '沪昆' }}
        </template>
      </el-table-column>
      <el-table-column prop="" label="操作">
        <template #default="{ row }">
          <el-button type="text" class="detail_btn" @click="toDetail(row)">
            查看详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination style="float:right;margin-top: 0px;" background layout="prev, pager, next"
      :current-page="paging.pageNum" :page-size="paging.pageSize" :total="paging.total" @size-change="sizeChange"
      @current-change="pageChange">
    </el-pagination>
    <el-dialog title="详情" :visible.sync="dataInnerFlag" width="55%" :before-close="handleInnerClose" append-to-body>
      <DetailModal :data="dataList" :type="dataType" @close="modalClose"></DetailModal>
    </el-dialog>
  </el-dialog>
</template>
<script>
import { fetchEnergyPredictionRecord, fetchRecordListDetail } from '@/api/energy-prediction.js'
import { getDict, dictTrans } from '@/api/common.js'
import DetailModal from './DetailModal.vue'
export default {
  props: {
    dataFlag: {
      type: Boolean,
      default: false
    },
    dataType: {
      type: String,
      default: '2'
    },
    dataBuild: {
      type: String,
      default: 'WG'
    }
  },
  components: { DetailModal },
  data() {
    return {
      formData: { startDate: '' },
      modeDict: {
        0: '冷',
        1: '热',
        2: '电',
        3: '水'
      },
      dataInnerFlag: false,
      dataList: null,
      tableData: [],
      energyMode: [],
      paging: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  watch: {
    'dataType': function () {
      this.getData()
    }
  },
  mounted() {
    this.init()
  },

  methods: {
    init() {
      this.getData()
      getDict('energy_type').then(res => {
        if (res && res.data) this.energyMode = res.data;
      });
    },
    getData() {
      const data = Object.assign(this.formData, this.paging);
      data.energyType = this.dataType;
      data.buildType = this.dataBuild;
      fetchEnergyPredictionRecord(data).then(res => {
        if (res && res.data) {
          this.tableData = res.data.records;
          this.paging.total = res.data.total;
        }
      })
    },
    modeTrans(data) {
      return this.modeDict[data]
    },
    handleClose() {
      this.$emit('close');
    },
    handleInnerClose() {
      this.dataInnerFlag = false;
    },
    sizeChange(val) {
      this.paging.pageSize = val;
      this.getData()
    },
    pageChange(val) {
      this.paging.pageNum = val;
      this.getData()
    },
    toDetail(item) {
      const data = {
        startDate: item.dataDate,
        buildType: this.dataBuild,
        energyType: this.dataType
      }
      fetchRecordListDetail(data).then(res => { if (res && res.data) this.dataList = res.data })
      this.dataInnerFlag = true;
    },
    modalClose() { },
    query() {
      this.getData()
    },
    reset() {
      this.paging.pageSize = 10;
      this.paging.pageNum = 1;
      this.formData.startDate = '';
      this.getData()
    }
  }
}
</script>
<style lang="scss" scoped>
.radio_group {
  .el-radio {
    color: #fff;
  }
}

.detail_btn {
  font-size: 16px;
}
</style>