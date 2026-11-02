<!-- 设备告警 -->
<template>
  <div class="table-list-container">
  <!-- 查询表单 -->
  <query-from :data-options="getOptions" :buttons="buttons" alarmType="warning" @dels="handleBatchDelete" @query="query"
    @reset="reset" @exportData="exportData" />

  <!-- 表格列表 -->
  <table-list :data-list="tableData" :data-options="getOptions" :buttons="buttons" alarmType="warning"
    @delete="handleDel" @handle="handleWarn" @detail="handleDetail" @selectionChange="handleSelectionChange" />

  <!-- 分页 -->
  <div class="th-pagination">
    <el-pagination @size-change="sizeChange" @current-change="pageChange" :current-page="paging.pageNum"
      :page-size="paging.pageSize" :total="paging.total" :page-sizes="[5, 10, 20, 50, 100]" background
      layout="total, sizes, prev, pager, next, jumper" />
  </div>

  <handle-warn v-model="handleWarnData" alarmType="warning" @submit="handleWarnSubmit" />
  </div>
</template>

<script>
import fileDownload from 'js-file-download';
import { resetFormData } from '@/utils';
import CommonQueryListMixin from '@/mixins/common-query-list-mixin';
import QueryFrom from '../components/QueryFrom/index.vue';
import TableList from '../components/TableList/index.vue';
import HandleWarn from '../components/HandleWarn/index.vue';
import { getDict } from '@/api/common.js'

import { queryWarnList, getWarnMasterPlate, batchDeleteAlarmRecord, exportDeviceWarns } from '@/api/warn';
export default {
  name: 'Warn',
  mixins: [CommonQueryListMixin],
  components: { QueryFrom, TableList, HandleWarn },
  data() {
    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);

    // 格式化日期为 yyyy-MM-dd 格式
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    return {
      childSystem: [],
      warnType: [],
      warnLevel: [],
      warnState: [],
      buttons: [], //本页面拥有权限的按钮

      handleWarnData: {
        flag: false,
        warnId: null,
      },
      queryData: {
        orgId: null,
        masterPlateId: null,
        alarmLevel: null,
        alarmStatus: null,
        queryStartTime: formatDate(oneMonthAgo),
        queryEndTime: formatDate(today),
      },
      paging: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      }
    };
  },
  computed: {
    getOptions() {
      return {
        warnType: this.warnType,
        warnLevel: this.warnLevel,
        warnState: this.warnState,
      };
    },
  },
  watch: {},
  mounted() {
  },
  methods: {
    // 初始化
    async init() {
      await this.getTypeData();
      this.getData(this.queryData);
    },

    // 重置
    reset() {
      this.paging.pageNum = 1;
      resetFormData(this.queryData, null);
      this.queryData.queryStartTime = formatDate(oneMonthAgo)
      this.queryData.queryEndTime = formatDate(today)
      this.getData(this.queryData);
    },
    // 处理 删除
    handleDel(warnId) {
      this.$confirm('确认删除该条内容？', '提示', { type: 'warning' }).then(async () => {
        await batchDeleteAlarmRecord([warnId]);
        this.getData(this.queryData);
        this.$message.success('删除成功');
      });
    },

    // 处理 批量删除
    handleBatchDelete() {
      if (!this.tableSelection.length) return this.$message.warning('请选择要删除的数据');
      const idArray = this.tableSelection.map(item => item.alarmRecordId);
      this.$confirm('确认删除选中的内容？', '提示', { type: 'warning' }).then(async () => {
        await batchDeleteAlarmRecord(idArray);
        this.getData(this.queryData);
        this.$message.success('删除成功');
      });
    },

    // 处理 告警
    handleWarn(warnId) {
      this.handleWarnData.flag = true;
      this.handleWarnData.warnId = warnId;
    },

    // 处理 详情
    handleDetail(warnId) {
      this.$router.push({ name: 'WarnDetail', params: { id: warnId } });
    },

    // 处理 告警提交
    handleWarnSubmit() {
      this.getData(this.queryData);
    },

    // 处理 导出
    exportData() {
      if (this.queryData.queryStartTime == '' || this.queryData.queryEndTime == '') {
        return this.$message.warning('请选择时间范围');
      }
      exportDeviceWarns(this.queryData).then(res => {
        fileDownload(res, '设备告警.xlsx');
      });
    },

    // 获取数据
    getData(data = {}) {
      const _data = JSON.parse(JSON.stringify(data));
      _data.masterPlateId ? (_data.masterPlateId = [_data.masterPlateId]) : (_data.masterPlateId = null);
      queryWarnList(_data, this.paging).then(res => {
        if (res.data) {
          this.tableData = res.data.records;
          this.paging.total = res.data.total;
        } else {
          this.tableData = [];
          this.paging.total = 0;
        }
      });
    },
    pageChange(e) {
      this.paging.pageNum = e;
      this.getData(this.queryData)
    },
    async getTypeData() {
      const _warnTypeRes = await getWarnMasterPlate();
      const _warnLevelRes = await getDict('alarm_level');
      const _warnStateRes = await getDict('alarm_status');
      let arr = _warnTypeRes.data.map(item => ({ code: item.masterplateId, value: item.masterplateName }));
      arr.forEach((e, index) => {
        if (e.value == '通讯告警') {
          arr.splice(index, 1)
        }
      });
      this.warnType = arr
      this.warnLevel = _warnLevelRes.data;
      this.warnState = _warnStateRes.data;
      return Promise.resolve();
    },
  },
};
</script>

<style lang="scss" scoped>
.table-list-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

}

</style>
