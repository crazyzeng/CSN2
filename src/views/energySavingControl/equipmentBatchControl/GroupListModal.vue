<!--分组列表弹窗-->
<template>
  <el-dialog title="分组管理" :visible.sync="dialogVisible" width="80%" :before-close="handleClose">
    <el-form :model="formData" :rules="rules" ref="ruleForm" :inline="true" label-width="100px" class="demo-ruleForm">
      <el-form-item label="分组名称" prop="name">
        <el-input v-model="formData.groupName"></el-input>
      </el-form-item>
      <el-form-item label="设备名称" prop="name">
        <el-input v-model="formData.equipmentName"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="query">查询</el-button>
        <el-button type="primary" icon="el-icon-refresh" @click="reset">重置</el-button>
      </el-form-item>
      <el-button type="primary" style="float: right;" icon="" @click="addGroup">新增分组</el-button>
    </el-form>
    <el-table ref="multipleTable" :data="tableData" style="width: 100%" height="300"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" label="序号" width="60"></el-table-column>
      <el-table-column prop="groupName" label="分组名称" width=""></el-table-column>
      <el-table-column prop="equipmentGroup" label="分组设备" width=""></el-table-column>
      <el-table-column prop="createTime" label="创建时间"></el-table-column>
      <el-table-column prop="" label="操作">
        <template #default="{ row }">
          <el-button type="text" @click="del(row)">删除</el-button>
          <el-button type="text" @click="edit(row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination style="float:right;margin-top:20px" background layout="total,prev, pager, next,sizes"
      @current-change="pageChange" :current-page.sync="paging.pageNo" :page-size="paging.pageSize"
      @size-change="handleSizeChange" :page-sizes="[10, 20, 50, 100, 500]" :total="paging.total">
    </el-pagination>
    <span slot="footer" class="dialog-footer">
      <el-button round @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </span>
    <el-dialog width="22%" title="新增分组" :visible.sync="innerVisible" append-to-body>
      <el-form :model="innerForm" :rules="rules" ref="innerForm" label-width="120px" class="demo-ruleForm">
        <el-form-item label="分组名称" prop="groupName">
          <el-input v-model="innerForm.groupName" style="width: 206px;"></el-input>
        </el-form-item>
        <el-form-item label="设备选择" prop="equipmentList">
          <el-input v-model="innerForm.equipmentList" @focus="selectEquipment" style="width: 206px;"></el-input>
        </el-form-item>
        <el-form-item label="照明回路" prop="">
          <el-radio-group v-model="innerForm.light">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="模式选择" prop="" v-show="innerForm.light === '1'">
          <el-checkbox-group v-model="innerForm.lightMode">
            <el-checkbox v-for="item in light_mode" :key="item.itemValue" :label="item.itemValue">{{ item.itemText
            }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item>
          <el-button round @click="innerVisible = false">取 消</el-button>
          <el-button type="primary" @click="innerSubmit">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <add-equipment-modal ref="addEquipmentRef"></add-equipment-modal>
  </el-dialog>
</template>

<script>
import AddEquipmentModal from './AddEquipmentModal.vue';

export default {
  components: { AddEquipmentModal },
  data() {
    return {
      dialogVisible: false,
      innerVisible: false,
      formData: {
        groupName: '',
        equipmentName: ''
      },
      tableData: [],
      paging: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      innerForm: {
        groupName: '',
        equipmentList: '',
        equipmentIds: [],
        light: '0',
        lightMode: ['0']
      },
      rules: {
        groupName: [{ required: true, message: '请输入分组名称', trigger: 'blur' }],
        equipmentList: [{ required: true, message: '请选择设备', trigger: 'change' }]
      },
      light_mode: []
    }
  },
  mounted() {
    this.getDictList('light_mode');
  },
  methods: {
    init() {
      this.getPageData();
    },
    getDictList(code) {
      getDict(code).then(res => {
        if (res) this.light_mode = res.data
      })
    },
    getPageData() {
    },
    query() {

    },
    reset() {

    },
    handleClose() {
      this.dialogVisible = false
    },
    addGroup() {
      this.innerVisible = true;
    },
    handleSelectionChange(e) {
      this.selectedData = e
    },
    del(item) {

    },
    edit(item) {

    },
    selectEquipment() {
      this.$refs.addEquipmentRef?.open()
    },
    pageChange(e) {
      this.paging.pageNo = e;
      this.getData();
    },
    handleSizeChange(e) {
      this.paging.pageSize = e;
      this.getData();
    },
    submit() {

    },
    innerSubmit() {
      this.$refs.innerForm.validate((valid) => {
        if (valid) {

        }
      })
    },
    open() {
      this.dialogVisible = true;
      this.init();
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-dialog {
  .el-dialog__footer {
    clear: both;
    padding-top: 30px;
  }
}
</style>