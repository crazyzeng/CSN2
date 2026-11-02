<template>
  <el-dialog title="请选择" :visible.sync="dataFlag" :close-on-click-modal="false" :before-close="deviceCancel"
    append-to-body @opened="init">
    <el-form ref="form" :model="deviceFormData" :inline="true" label-width="auto" size="mini">
      <el-form-item v-for="item in searchData" :key="item.value" :label="item.label" :placeholder="item.label">
        <el-input v-model="deviceFormData[item.value]"></el-input>
      </el-form-item>
      <!-- <el-form-item label="编号" placeholder="请输入编号">
                <el-input v-model="deviceFormData.equipmentNo"></el-input>
            </el-form-item>

            <el-form-item label="名称" placeholder="请输入名称">
                <el-input v-model="deviceFormData.equipmentName"></el-input>
            </el-form-item> -->

      <div class="fr">
        <el-button @click="getDeviceList" type="primary" icon="el-icon-search" size="mini" round>查询</el-button>
        <el-button @click="deviceReset" type="primary" icon="el-icon-refresh" size="mini" round>重置</el-button>
      </div>
    </el-form>

    <el-table ref="table" :data="deviceList" highlight-current-row max-height="450" class="th-table"
      header-cell-class-name="th-table-header-cell" size="mini" @current-change="deviceSelChange"
      @selection-change="handleSelectionChange">
      <el-table-column align="center" v-if="selectType == 'multiple'" type="selection" width="55">
      </el-table-column>
      <el-table-column align="center" type="index" label="序号" width="55"></el-table-column>
      <el-table-column v-for="item in tableLabel" :key="item.value" align="center" :prop="item.value"
        :label="item.label"></el-table-column>
    </el-table>

    <!-- buttons -->
    <span slot="footer" class="dialog-footer">
      <el-button @click="deviceCancel">取 消</el-button>
      <el-button type="primary" @click="deviceSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'SelectDevice',
  props: ['dataFlag', 'deviceList', 'selectType', 'searchData', 'tableLabel'],
  data() {
    return {
      deviceFormData: {
        equipmentNo: '',
        equipmentName: '',
      },
      tableData: [],
      deviceActive: {},
      multipleSelection: [],
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() { },
    deviceSelChange(data) {
      this.deviceActive = data;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    deviceCancel() {
      this.deviceActive = {};
      this.tableData = [];
      this.$emit('close');
    },
    deviceSubmit() {
      if (this.selectType == 'multiple') {
        this.$emit('submit', this.multipleSelection);
      } else {
        this.$emit('submit', this.deviceActive);
      }
      this.deviceCancel();
    },
    deviceReset() {
      this.deviceFormData = {};
      this.getDeviceList();
    },
    getDeviceList() {
      this.$emit('queryDevice', this.deviceFormData);
    },
  },
};
</script>
