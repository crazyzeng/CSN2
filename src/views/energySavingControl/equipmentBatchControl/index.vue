<!-- 设备批量控制 -->
<template>
  <section class="container_warp">
    <section class="container_box">
      <el-divider class="curDivider" direction="vertical" />
      <wl-main-title data-title="设备批量控制">
        <el-form :inline="true" :model="formData" class="form-inline">
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
          <el-form-item style="margin-right: 0;float:right">
            <el-button type="primary" icon="" class="border-btn b-b-b" @click="addGroup">新增分组</el-button>
          </el-form-item>
        </el-form>
      </wl-main-title>
      <section style="padding:0 20px;height:calc(100% - 160px)">
        <!-- <section class="header-extend">
          <span style="padding-left:10px;color:#eee;">表格项配置</span><el-cascader placeholder="" :options="tableItemParams"
            @change="tableAttrChange" :props="{ multiple: true, label: 'name', value: 'prop', emitPath: false }"
            collapse-tags v-model="tableAttr" popper-class="custom_poper"></el-cascader>
          <p style="float:right;color: #eee;margin-top: 12px;">
            <span class="execute_status execute_finish">已执行完成</span>
            <span class="execute_status execute_error">执行失败</span>
            <span class="execute_status execute_wait">未执行</span>
          </p>
        </section> -->
        <el-table :data="tableData" ref="tableRef" :key="Math.random()" height="calc(100%)" border style="width: 100%;border-radius: 14px;"
          @select="selectChange" @selection-change="handleSelectionChange">
          <el-table-column align="center" type="selection" width="55"></el-table-column>
          <el-table-column align="center" type="index" label="序号" width="80"></el-table-column>
          <el-table-column align="center" prop="groupName" label="分组名称" width="">
          </el-table-column>
          <el-table-column align="center" prop="equipmentGroup" label="分组设备" width="350">
            <template #default="{ row }">
              <el-tooltip popper-class="custom_tips" placement="right" :content="row.equipmentNames?.join(',')">
                <p class="custom_p">{{ row.equipmentNames?.join(',') }}</p>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="lastTime" label="执行时间" width="200"></el-table-column>
          <el-table-column align="center" prop="value" label="上次执行值" width="120">
            <template #default="{ row }">{{ executeValueTrans(row.value, row.light) }}</template>
          </el-table-column>
          <el-table-column align="center" prop="" label="执行命令" width="300">
            <template #default="{ row }">
              <el-select v-model="row.writeValue">
                <el-option v-for="item in row.writeList" :key="item.itemValue" :label="item.itemText"
                  :value="item.itemValue"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="" label="操作" width="200">
            <template #default="{ row }">
              <el-link class="red-link" :disabled="row.running === 1" @click="del(row)">删除</el-link>
              <el-divider direction="vertical" />
              <el-link class="blue-link" @click="edit(row)">编辑</el-link>
              <el-divider direction="vertical" />
              <el-link class="blue-link" icon="" @click="handleExecute(row)">执行</el-link>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination style="float:right;margin-top:20px" background layout="total, sizes, prev, pager, next, jumper"
          @current-change="pageChange" :current-page.sync="paging.pageNo" :page-size="paging.pageSize"
          @size-change="handleSizeChange" :page-sizes="[10, 20, 50, 100, 500]" :total="paging.total">
        </el-pagination>
      </section>
    </section>
    <el-dialog width="400px" :title="dialogTitle" :visible.sync="innerVisible" append-to-body @before-close="innerClose">
      <el-form :model="innerForm" :rules="rules" ref="innerForm" label-width="120px" class="demo-ruleForm">
        <el-form-item label="分组名称" prop="groupName">
          <el-input v-model="innerForm.groupName" style="width: 206px;"></el-input>
        </el-form-item>
        <el-form-item label="设备选择" prop="equipmentList">
          <el-input v-model="innerForm.equipmentList" @focus="selectEquipment" style="width: 206px;"></el-input>
        </el-form-item>
        <el-form-item label="照明回路" prop="">
          <el-radio-group v-model="innerForm.light">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="模式选择" prop="" v-show="innerForm.light === 1">
          <el-checkbox-group v-model="innerForm.lightMode">
            <el-checkbox v-for="item in light_mode" :key="item.itemValue" :label="item.itemValue">{{ item.itemText
            }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="cancel-btn" @click="innerClose()">取 消</el-button>
          <el-button type="primary" class="confirm-btn" @click="innerSubmit">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <add-equipment-modal ref="addEquipmentRef" @submit="equipmentSelected"></add-equipment-modal>
  </section>
</template>
  
<script>
import { getAccountListByPage } from '@/api/account-list.js';
import { getDict, dictTrans } from '@/api/common.js'
import { deepClone, getWebSocketURlConfigUration } from '@/utils/index';
import { getLatestStatus, getGroupPage, saveGroupConfig, deleteGroupConfig, doExcute, updateGroupConfig } from '@/api/batch-control.js';
import { getWebSocket } from '@/utils/websocket'
import AddEquipmentModal from './AddEquipmentModal.vue';

export default {
  data() {
    return {
      formData: {
        groupName: '',
        equipmentName: ''
      },
      dialogTitle:'新增分组',
      tableData: [],
      paging: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      equipmentStatusOptions: [
        { itemText: '启动', itemValue: '1' },
        { itemText: '停止', itemValue: '0' },
      ],
      equipmentSystemOptions: [],
      fixedTabelItem: [
        { name: '批量全选', value: '', prop: 'selection', width: '100px', disabled: true },
        { name: '序号', value: '', prop: 'index', width: '250px', disabled: true },
      ],
      tableDataItem: [
        { name: 'ID', value: '', prop: 'equipmentId', width: '100px' },
        { name: '分组名称', value: '', prop: 'groupName', width: '250px' },
        { name: '分组设备', value: '', prop: 'equipmentGroup', width: '' },
        { name: '执行时间', value: '', prop: 'excutetime', width: '' },
        { name: '上次执行值', value: '', prop: '', width: '' },
        { name: '所属系统', value: '', prop: 'equipmentSystem', width: '' },
        { name: '状态', value: '', prop: 'ws_status', width: '' },
        { name: '运行状态', value: '', prop: 'ws_runningStatus', width: '' },
        { name: '执行命令', value: '', prop: 'writeValue', width: '' },
        { name: '执行状态', value: '', prop: 'executeStatus', width: '' },
      ],
      tableItemParams: [],
      tableAttr: ['selection', 'index', 'equipmentId', 'equipmentName', 'equipmentNumber', 'equipmentLocation', 'installLocation', 'dept', 'equipmentSystem', 'ws_status', 'ws_runningStatus', 'writeValue', 'executeStatus'],
      webSocket: null,
      pointValueList: [],
      checkedData: [],
      light_mode: [],
      isEnabled: false,
      innerVisible: false,
      innerForm: {
        id: '',
        groupName: '',
        equipmentList: '',
        equipmentIds: [],
        light: 0,
        lightMode: ['0'],
        running: null
      },
      rules: {
        groupName: [{ required: true, message: '请输入分组名称', trigger: 'blur' }],
        equipmentList: [{ required: true, message: '请选择设备', trigger: 'change' }]
      },
      defaultList: [{ itemText: '启动', itemValue: 1 }, { itemText: '停止', itemValue: 0 }],
      equipmentIdList: [],
      isEdit: false,
    };
  },

  components: { AddEquipmentModal },

  computed: {},

  mounted() {
    this.init();
  },
  watch: {},
  methods: {
    init() {
      this.getData();
      this.getDictList('light_mode');
      this.allTabelPropsInit();
    },

    getLatestExecuteStatus() {
      getLatestStatus().then(res => {
        if (res.code === 200 && res.data) {
          this.isEnabled = res.data.status;
          this.getExecuteFisish(res.data.detail)
        }
      })
    },
    getExecuteFisish(data) {
      this.tableData.map(v => { v.executeStatus = '2' })
      if (data && Object.keys(data).length > 0) {
        for (let key in data)
          this.tableData.forEach(v => {
            if (v.equipmentId.toString() === key) v.executeStatus = data[key] ? '0' : '1'
          })
      }
      //表格视图更新
      this.tableDataItem = deepClone(this.tableDataItem)
      this.tableData = deepClone(this.tableData)
    },
    addGroup() {
      this.innerVisible = true;
      this.isEdit = false;
      this.dialogTitle='新增分组'
      this.$refs.innerForm?.clearValidate();
    },
    innerClose() {
      this.innerForm.groupName = '';
      this.innerForm.light = 0;
      this.innerForm.lightMode = [];
      this.innerForm.equipmentList = '';
      this.innerForm.equipmentIds = [];
      this.innerVisible = false;
    },
    allTabelPropsInit() {
      const tempArray = deepClone(this.tableDataItem);
      this.tableItemParams = tempArray.concat(this.fixedTabelItem);
    },
    selectEquipment() {
      this.$refs.addEquipmentRef?.open(this.equipmentIdList)
    },
    equipmentSelected(data) {
      if (data && data.length > 0) {
        const tempArr = data.map(v => { return v.equipmentName })
        const tempIds = data.map(v => { return v.equipmentId })
        this.innerForm.equipmentIds = tempIds
        this.innerForm.equipmentList = tempArr.join()
      }
    },
    innerSubmit() {
      this.$refs.innerForm.validate((valid) => {
        if (valid) {
          const tempObj = deepClone(this.innerForm);
          delete tempObj.equipmentList;
          if (tempObj.light === 0) tempObj.lightMode = '';
          else tempObj.lightMode = this.innerForm.lightMode.join(',');
          if (!this.isEdit) {
            tempObj.id = '';
            saveGroupConfig(tempObj).then(res => {
              if (res.code === 200) {
                this.$message.success('保存成功');
                this.reset();
                this.innerClose();
              }
            })
          } else {
            updateGroupConfig(tempObj).then(res => {
              if (res.code === 200) {
                this.$message.success('编辑成功');
                this.reset();
                this.innerClose();
              }
            })
          }
        }
      })
    },
    tableAttrChange(e) {
      const tempArray = [];
      e.forEach(v => {
        this.tableItemParams.forEach(w => {
          if (v === w.prop) tempArray.push(w)
        })
      })
      tempArray.splice(tempArray.length - 2, 2)
      this.tableDataItem = tempArray
    },
    getDictList(code) {
      getDict(code).then(res => {
        if (res) this[code] = res.data
      })
    },
    getPointIds() {
      let pointIds = [];
      this.tableData.forEach(v => {
        pointIds.push(v.equipmentStatusPoint);
      });
      return pointIds;
    },
    //查询
    query() {
      this.getData();
    },
    //重置
    reset() {
      this.formData.groupName = '';
      this.formData.equipmentName = '';
      this.paging.pageNo = 1;
      this.paging.pageSize = 10;
      this.getData();
    },
    equipmentSystemTrans(code) {
      return dictTrans(this.equipmentSystemOptions, code)
    },
    executeValueTrans(code, light) {
      const tempArray = light === 1 ? this.light_mode : this.defaultList;
      return dictTrans(tempArray, code)
    },
    getLigthModeList(data) {
      const lightModeArr = data.split(',')
      let tempArray = []
      lightModeArr.forEach(v => {
        let tempObj = {}
        this.light_mode.map(w => {
          if (v === w.itemValue) {
            tempObj.itemText = w.itemText
            tempObj.itemValue = w.itemValue
            tempArray.push(tempObj)
          }
        })
      })
      return tempArray;
    },
    getData() {
      const tempObj = Object.assign(this.formData, this.paging);
      getGroupPage(tempObj).then(res => {
        if (res.code === 200 && res.data.records.length > 0) {
          this.tableData = res.data.records.map(v => ({ writeValue: '', writeList: v.light === 0 ? this.defaultList : this.getLigthModeList(v.lightMode), ...v }))
          this.paging.total = res.data.total;
        }
      })
    },
    pageChange(e) {
      this.paging.pageNo = e;
      this.getData();
    },
    handleSizeChange(e) {
      this.paging.pageSize = e;
      this.getData();
    },
    selectChange(e) {
      this.checkedData.push(e)
    },
    handleSelectionChange(e) {
      this.checkedData = []
      for (let i = 0; i < e.length; i++) {
        if (e[i].equipmentStatusPoint === null || e[i].equipmentStatusPoint === '' || e[i].ws_status === '未知' || e[i].ws_status === '离线') {
          this.$refs.tableRef.toggleRowSelection(e[i], false);
        } else {
          this.$refs.tableRef.toggleRowSelection(e[i], true);
          this.checkedData.push(e[i]);
        }
      }
    },
    handleGroup() {
      this.$refs.groupListRef?.open()
    },
    handleDelete(data) {
      deleteGroupConfig(data).then(res => {
        if (res.code === 200) {
          this.$message.success('删除成功');
          this.getData();
        }
      })
    },
    del(item) {
      this.$confirm('确定删除？', '提示', { type: 'warning' , 
      confirmButtonClass:'confirm-btn ',
      cancelButtonClass:'cancel-btn '}).then(() => {
        this.handleDelete([item.id])
      }).catch(() => { })
    },
    edit(item) {
      this.dialogTitle = '编辑分组';
      this.innerVisible = true;
      this.isEdit = true;
      this.innerForm.id = item.id;
      this.innerForm.groupName = item.groupName;
      this.innerForm.equipmentList = item.equipmentNames.join();
      this.innerForm.light = item.light;
      this.innerForm.lightMode = item.lightMode?.split(',');
      this.innerForm.equipmentIds = item.equipmentIds;
      this.equipmentIdList = item.equipmentIds;
    },
    handleExecute(item) {
      let tempObj = {}
      tempObj.id = item.id
      tempObj.value = item.writeValue
      if (item.writeValue !== '') {
        this.$confirm('确定执行所选命令？', '提示', { type: 'warning',
         confirmButtonClass:'confirm-btn ',
        cancelButtonClass:'cancel-btn ', }).then(() => {
          doExcute(tempObj).then(res => {
            if (res.code === 200) {
              this.$message.success('执行请求成功')
              this.getData()
            }
          })
        }).catch(() => { })
      } else this.$message.warning('请选择执行命令')
    },
  }
}

</script>
<style lang='scss' scoped>
::v-deep.el-form-item {
  >.el-form-item__label {
    color: #fff;
  }
}

.el-form.form-inline {
  margin: 0px 0 0 40px;
}

.container_warp {
  width: 100%;
  height: 100%;
  overflow: auto;
}

::-webkit-scrollbar-track-piece {
  background: transparent;
}

::-webkit-scrollbar {
  width: 6px;
  height: 10px;
}

::-webkit-scrollbar-thumb {
  background: $light-blue;
  border-radius: 20px;
}

::-webkit-scrollbar-corner {
  background: transparent;
}

.edit_btn {
  font-size: 16px;
}

.container_box {
  width: 100%;
  height: 100%
}

::v-deep.el-cascader {
  margin: 7.5px;

  .el-tag {
    background: #1a53a9 !important;
  }

  .el-tag--info {
    color: #fff;
  }
}

::v-deep.el-table {
  border-radius: 0 0 8px 8px;
}

.header-extend {
  background-color: #1e2a45 !important;
  height: 45px;
}

.execute_status {
  padding-left: 25px;
  background-repeat: no-repeat;
  display: inline-block;
  margin: 0 8px;
}

.execute_finish {
  background-image: url(../../../assets/icon/finish.png);
}

.execute_error {
  background-image: url(../../../assets/icon/error.png);
}

.execute_wait {
  background-image: url(../../../assets/icon/wait.png);
}

.execute_span {
  display: inline-block;
  width: 20px;
  height: 20px;
}

.custom_p {
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

::v-deep .el-checkbox {
  color: #fff;
}

::v-deep .el-radio {
  color: #fff;
  ;
}
</style>
<style lang="scss">
.custom_tips {
  background-color: #3c61a3 !important;
}

.custom_poper {
  border: none;

  .el-cascader-menu {
    color: #fff;
  }

  .el-cascader-node:not(.is-disabled):hover,
  .el-cascader-node:not(.is-disabled):focus {
    background: #41618f !important;
  }
}
</style>