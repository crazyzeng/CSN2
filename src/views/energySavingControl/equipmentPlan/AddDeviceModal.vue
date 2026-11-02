<!-- 添加设备 -->
<template>
  <el-dialog title="设备选择" :visible="dialogVisible" width="70%" :before-close="handleClose">
    <section class="content_box">
      <el-form :inline="true" :model="formData" class="demo-form-inline">
        <el-form-item label="设备编号">
          <el-input v-model="formData.equipmentNumber" placeholder="请输入设备编号"></el-input>
        </el-form-item>
        <el-form-item label="设备名称">
          <el-input v-model="formData.equipmentName" placeholder="请输入设备名称"></el-input>
        </el-form-item>
        <el-form-item label="系统类型">
          <el-select v-model="formData.equipmentSystem">
            <el-option v-for="item in systemTypeList" :key="item.itemValue" :label="item.itemText"
              :value="item.itemValue"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备类型">
          <el-select v-model="formData.equipmentType">
            <el-option v-for="item in deviceTypeOptions" :key="item.itemValue" :label="item.itemText"
              :value="item.itemValue"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="使用状态">
          <el-select v-model="formData.equipmentStatus">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label"
              :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="customBtn" icon="el-icon-search" @click="query">查询</el-button>
          <el-button type="primary" class="customBtn" icon="el-icon-refresh" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="tableData" ref="multipleTable" style="width: 100%" height="450" @select="handleSelectionChange"
        @select-all="handleSelectAll">
        <el-table-column type="selection" width="60">
        </el-table-column>
        <el-table-column prop="equipmentNumber" label="设备编号" width="">
        </el-table-column>
        <el-table-column prop="equipmentName" label="设备名称" width="">
        </el-table-column>
        <el-table-column prop="equipmentSystem" label="系统类型">
          <template #default="{ row }">{{ equipmentSystemLabel(row.equipmentSystem) }}</template>
        </el-table-column>
        <el-table-column prop="equipmentType" label="设备类型" width="">
          <template #default="{ row }">{{ equipmentTypeLabel(row.equipmentType) }}</template>
        </el-table-column>
        <el-table-column prop="installLocation" label="安装位置" width="">
        </el-table-column>
        <el-table-column prop="equipmentStatus" label="使用状态">
          <template #default="{ row }">{{ row.equipmentStatus === 0 ? '使用中' : '报废' }}</template>
        </el-table-column>
      </el-table>
      <el-pagination style="float:right;margin-top: 10px;" @current-change="handleCurrentChange"
        @size-change="handleSizeChange" :current-page.sync="paging.pageNo" :page-sizes="[10, 20, 50, 100, 500]"
        :page-size="paging.pageSize" layout="prev,pager,next,total,sizes" :total="paging.total">
      </el-pagination>
      <section class="btn_group">
        <el-button round @click="handleClose">取 消</el-button>
        <el-button round type="primary" @click="next">下一步</el-button>
      </section>
    </section>
    <AddOperationModal ref="addOperationRef" @update-data="getExecuteDetail"></AddOperationModal>
  </el-dialog>
</template>
<script>
import { getDict, dictTrans } from '@/api/common.js'
import { getAccountListByPage } from '@/api/account-list.js';
import AddOperationModal from './AddOperationModal.vue'
export default {
  data() {
    return {
      dialogVisible: false,
      formData: {
        equipmentNumber: '',
        equipmentName: '',
        equipmentSystem: '',
        equipmentType: '',
        equipmentStatus: '',
      },
      systemTypeList: [],
      deviceTypeOptions: [],
      statusOptions: [
        {
          label: '使用中',
          value: 0,
        },
        {
          label: '报废',
          value: 7,
        },
      ],
      tableData: [],
      paging: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
        status: '',
        canControl: '1'
      },
      checkedData: [],
      details: []
    }
  },
  components: { AddOperationModal },
  mounted() {
    this.initData()
  },
  methods: {
    initData() {
      this.getDictList()
      this.query()
    },
    async getDictList() {
      await getDict('equipment_type').then(res => {
        if (res.code === 200 && res.data.length > 0)
          this.deviceTypeOptions = res.data
      })
      await getDict('system_type').then(res => {
        if (res.code === 200 && res.data.length > 0)
          this.systemTypeList = res.data
      })
    },
    handleClose() {
      this.dialogVisible = false;
      this.$refs.multipleTable.clearSelection();
    },
    query() {
      getAccountListByPage(this.formData, this.paging).then(res => {
        if (res.code === 200 && res.data) {
          this.tableData = res.data.records;
          this.paging.total = res.data.total;
          this.paging.pageNo = res.data.current;
        }
      })
    },
    reset() {
      for (let k in this.formData) this.formData[k] = ''
      this.paging.pageNo = 1;
      this.paging.pageSize = 10;
      this.query()
    },
    handleSelectionChange(e) {
      if (e.length > 1) {
        this.$message.warning('只能选择一个设备')
        this.$refs.multipleTable.toggleRowSelection(e[e.length - 1], false)
        return
      } else this.checkedData = e.length > 0 ? [e[e.length - 1]] : e
    },
    handleSelectAll() {
      this.$message.warning('只能选择一个设备')
      this.$refs.multipleTable.clearSelection()
      return
    },
    equipmentSystemLabel() { },
    equipmentTypeLabel() { },
    next() {
      if (this.checkedData.length > 0) this.$refs.addOperationRef?.open(this.checkedData);
      else this.$message.warning('请选择设备'); return
    },
    handleCurrentChange(val) {
      this.paging.pageNo = val || 1;
      this.query();
    },
    handleSizeChange(val) {
      this.paging.pageNo = 1;
      this.paging.pageSize = val;
      this.query();
    },
    equipmentTypeLabel(val) {
      return dictTrans(this.deviceTypeOptions, val)
    },
    equipmentSystemLabel(val) {
      return dictTrans(this.systemTypeList, val)
    },
    open(data) {
      this.dialogVisible = true
    },
    getExecuteDetail(e) {
      this.details = []
      const tempObj = {
        equipmentId: this.checkedData[0].equipmentId,
        executeDetail: e
      }
      this.details.push(tempObj);
      this.$emit('update-data', this.details, this.checkedData);
      this.handleClose();
    }
  }
}
</script>
<style lang="scss" scoped>
.btn_group {
  clear: both;
  height: 40px;
  text-align: right;
  padding-top: 20px;
}
</style>