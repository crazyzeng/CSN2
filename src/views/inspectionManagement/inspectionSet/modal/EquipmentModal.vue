<!-- 台账 -->
<!-- 配置新增弹窗 -->
<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="65%" :before-close="handleClose" center append-to-body>
    <section class="dialog_content">
      <el-form :model="formData" label-width="120px" :inline="true">
        <el-form-item label="设备编号">
          <el-input v-model="formData.equipmentNumber" ></el-input>
        </el-form-item>
        <el-form-item label="设备名称">
          <el-input v-model="formData.equipmentName" ></el-input>
        </el-form-item>
        <el-form-item label="设备类型">
          <el-select v-model="formData.equipmentType" >
            <el-option v-for="item in deviceTypeOptions" :key="item.itemValue" :label="item.itemText"
              :value="item.itemValue"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="query">查询</el-button>
          <el-button type="primary" icon="el-icon-refresh-left" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%"
        @selection-change="handleSelectionChange" @select-all="handleSelectAll">
        <el-table-column  align="center" type="selection" width="60">
        </el-table-column>
        <el-table-column align="center" type="index" label="序号" width="60">
        </el-table-column>
        <el-table-column  align="center" prop="equipmentNumber" label="设备编号" width="120">
        </el-table-column>
        <el-table-column  align="center" prop="equipmentName" label="设备名称" show-overflow-tooltip>
        </el-table-column>
        <el-table-column  align="center" prop="" label="设备类型" width="120">
          <template #default="{ row }">
            {{ equipmentTypeTrans(deviceTypeOptions, row.equipmentType) }}
          </template>
        </el-table-column>
        <el-table-column  align="center" prop="installLocation" label="设备安装位置" show-overflow-tooltip>
        </el-table-column>
      </el-table>
      <div class="th-pagination">
        <el-pagination @size-change="sizeChange" @current-change="pageChange" :current-page="paging.pageNo"
          :page-size="paging.pageSize" :total="paging.total"
          layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </div>
    </section>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" class="saveBtn" @click="submit">保 存</el-button>
      <el-button class="backBtn" @click="dialogVisible = false">返 回</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { getEquipmentList } from '@/api/auto-inspection.js';
import { getDict, dictTrans } from '@/api/common.js'

export default {
  props: {},
  data() {
    return {
      dialogVisible: false,
      tableData: [],
      deviceTypeOptions: [],
      formData: {
        equipmentNumber: '',
        equipmentName: '',
        equipmentType: '',
        subjectId: '',
        subjectName: '',
        minVal: '',
        maxVal: ''
      },
      paging: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      tableCheckedData: []
    }
  },
  computed: {
    title: function () { return '设备' },
  },
  mounted() {
    this.initData()
  },
  methods: {
    getData() {
      getEquipmentList(this.formData, this.paging).then(res => {
        if (res.code === 200 && res.data) {
          this.tableData = res.data.records;
          this.paging.total = res.data.total;
        }
      })
    },
    initData() {
      this.getData()
      getDict('equipment_type').then(res => {
        this.deviceTypeOptions = res.data;
      })
    },
    open(data) {
      this.dialogVisible = true;
    },
    handleClose() {
      this.dialogVisible = false;
    },
    submit() {
      this.handleClose();
      this.$emit('data', this.tableCheckedData)
    },
    handleSelectionChange(val) {
      if (val.length > 1) {
        this.$refs.multipleTable.toggleRowSelection(val[1], false);
        return
      }
      this.tableCheckedData = val;
    },
    handleSelectAll() {
      this.$message.warning('只能选择一个设备')
    },
    query() {
      this.getData();
    },
    reset() {
      this.formData.equipmentName = '';
      this.formData.equipmentNumber = '';
      this.formData.equipmentType = '';
      this.paging.pageNo = 1;
      this.paging.pageSize = 10;
      this.getData();
    },
    // 显示多少条发生改变
    sizeChange(val) {
      this.paging.pageSize = val;
      this.getData(this.formData);
    },

    // 页数发生变化
    pageChange(val) {
      this.paging.pageNo = val;
      this.getData(this.formData);
    },
    equipmentTypeTrans(data, code) {
      return dictTrans(data, code);
    },
  }
}
</script>


<style lang="scss" scoped>
.saveBtn {
  background-color: #2e6cd8;
  border-radius: 3px;
}

.backBtn {
  color: #fff;
}
</style>
