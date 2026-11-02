<!--添加分组-->
<template>
  <el-dialog title="添加设备" :visible.sync="dialogVisible" width="85%" :before-close="handleClose" append-to-body>
    <el-form :model="formData" :inline="true" ref="ruleForm" label-width="100px">
      <el-form-item label="设备名称" prop="">
        <el-input v-model="formData.equipmentName"></el-input>
      </el-form-item>
      <el-form-item label="设备编号" prop="">
        <el-input v-model="formData.equipmentNumber"></el-input>
      </el-form-item>
      <el-form-item label="设备编号" prop="">
        <el-input v-model="formData.equipmentSystem"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="query">查询</el-button>
        <el-button type="primary" icon="el-icon-refresh" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" ref="multiTable" style="width: 100%" size="mini" border
      @selection-change="handleSelectionChange" :row-key="getRowKeys">
      <el-table-column type="selection" :reserve-selection="true" label="" width="60"></el-table-column>
      <el-table-column label="序号" type="index" width="60" align="center"></el-table-column>
      <el-table-column label="ID" prop="equipmentId" width="50" align="center"></el-table-column>
      <el-table-column label="设备名称" prop="equipmentName" align="center"></el-table-column>
      <el-table-column label="设备编号" prop="equipmentNumber" align="center"></el-table-column>
      <el-table-column label="所属系统" prop="equipmentSystem" align="center"></el-table-column>
      <el-table-column label="设备类型" prop="equipmentType" align="center"></el-table-column>
      <el-table-column label="设备所在区域" prop="equipmentLocation" align="center"></el-table-column>
      <el-table-column label="安装位置" prop="installLocation" align="center"></el-table-column>
      <el-table-column label="设备运行状态点位" prop="equipmentStatusPoint" align="center"></el-table-column>
      <el-table-column label="设备故障状态点位" prop="equipmentFaultPoint" align="center"></el-table-column>
      <el-table-column label="设备有功电能点位" prop="equipmentElectricPoint" align="center"></el-table-column>
      <el-table-column label="累计运行时长点位" prop="equipmentDurationPoint" align="center"></el-table-column>
    </el-table>
    <div class="th-pagination">
      <el-pagination @size-change="sizeChange" @current-change="pageChange" :current-page="paging.pageNo"
        :page-size="paging.pageSize" :total="paging.total" layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button class="cancel-btn" type="primary" @click="dialogVisible = false">取 消</el-button>
      <el-button class="confirm-btn" type="primary" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { getEquipmentPage } from '@/api/batch-control.js'

export default {
  data() {
    return {
      dialogVisible: false,
      formData: {
        equipmentName: '',
        equipmentNumber: '',
        equipmentSystem: ''
      },
      tableData: [],
      paging: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      selectData: [],
      selectIdsArray: []
    }
  },
  methods: {
    init() {
      this.getPageData();
    },
    getPageData() {
      getEquipmentPage(this.paging, this.formData).then(res => {
        if (res.code === 200 && res.data.records) {
          this.tableData = res.data.records;
          this.paging.total = res.data.total;
          this.$nextTick(() => {
            this.echoSelectData(this.tableData)
          })
        }
      })
    },
    echoSelectData(data) {
      this.selectIdsArray.forEach(v => {
        data.forEach(w => {
          if (v == w.equipmentId) {
            this.$refs.multiTable?.toggleRowSelection(w, true);
          }
        })
      })
    },
    query() {
      this.getPageData();
    },
    reset() {
      this.paging.pageNo = 1;
      this.paging.pageSize = 10;
      this.formData.equipmentName = '';
      this.formData.equipmentNumber = '';
      this.formData.equipmentSystem = '';
      this.getPageData();
    },
    getRowKeys(row) {
      return row.equipmentId;
    },
    handleSelectionChange(e) {
      this.selectData = e;
    },
    handleClose() {
      this.dialogVisible = false
    },
    pageChange(e) {
      this.paging.pageNo = e;
      this.getPageData();
    },
    sizeChange(e) {
      this.paging.pageSize = e;
      this.getPageData();
    },
    submit() {
      this.$emit('submit', this.selectData);
      this.handleClose();
    },
    open(data) {
      this.dialogVisible = true;
      this.selectIdsArray = data;
      this.reset();
    }
  }
}
</script>
<style lang="scss">
  .dialog-footer{
    text-align: center;
  }
</style>