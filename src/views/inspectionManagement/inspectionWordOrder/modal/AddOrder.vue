<!-- 新增工单 -->
<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="65%" :before-close="handleClose">
    <section class="dialog_content">
      <el-form :model="formData" :inline="true" label-width="80px" :rules="rules" ref="formRef">
        <el-row>
          <el-col :span="8">
            <el-form-item label="工单名称" prop="orderName">
              <el-input v-model="formData.orderName" maxlength="10" show-word-limit></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="工单来源">
              <el-input v-model="formData.source" placeholder="默认人工派发" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="责任部门" prop="dept">
              <el-select v-model="formData.dept" @change="deptChange">
                <el-option v-for="item in deptmentList" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span='8'>
            <el-form-item label="巡检员" prop="inspectUser">
              <el-select v-model="formData.inspectUser" multiple collapse-tags placeholder="请选择">
                <el-option v-for="item in inspectUserList" :key="item" :label="item" :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="巡检时间">
              <el-time-picker v-model="formData.executeTime" popper-class="custom_time_picker" is-range
                style="width:400px" placeholder="选择时间范围" value-format="HH:mm" format="HH:mm" range-separator="至"
                start-placeholder="开始时间" end-placeholder="结束时间" @change="executeTimeChange">
              </el-time-picker>
              <el-tag v-for="tag in executeTime" :key="tag" class="custom_tag" closable :disable-transitions="false"
                @close="tagClose(tag)">
                {{ tag }}
              </el-tag>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="巡检路线" prop="inspectLineId">
              <el-select v-model="formData.inspectLineId" @change="inspectLineChange">
                <el-option v-for="item in inspectLineList" :key="item.id" :label="item.lineName"
                  :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-table ref="table" :data="tableData" tooltip-effect="dark" style="width: 100%;" height="300px">
        <el-table-column align="center" type="index" label="序号" width="60">
        </el-table-column>
        <el-table-column align="center" prop="equipmentNumber" label="设备编号" width="">
        </el-table-column>
        <el-table-column align="center" prop="equipmentName" label="设备名称">
        </el-table-column>
        <el-table-column align="center" prop="deviceType" label="设备类型" width="">
          <template #default="{ row }">{{ equipmentTypeTrans(equipmentTypeOptions, row.equipmentType)
          }}</template>
        </el-table-column>
        <el-table-column align="center" prop="installLocation" label="设备安装位置">
        </el-table-column>
      </el-table>
      <p style="text-align: center;margin-top: 20px;" slot="footer" class="dialog-footer">
        <el-button type="primary" icon="" @click="submit">确定</el-button>
        <el-button icon="" @click="cancel">返回</el-button>
      </p>
    </section>
  </el-dialog>
</template>
<script>
import { getInspectPathByPage } from '@/api/auto-inspection.js'
import { getDict, dictTrans } from '@/api/common'
import { getAllDeptment, getUserByDeptment } from '@/api/deptment.js'
import { addInspectWorkOrder, getInspectWorkOrderNumber, getPathEquipmentByLineId } from '@/api/inspect-workorder.js'
import { deepClone } from '@/utils/index'
export default {
  props: {},
  data() {
    return {
      dialogVisible: false,
      time: '',
      inspectUserList: [],
      inspectLineList: [],
      formData: {
        orderNumber: '',
        orderName: '',
        source: '',
        executeTime: '',
        dept: '',
        inspectUser: '',
        inspectLineId: ''
      },
      tableData: [],
      executeTime: [],
      equipmentTypeOptions: [],
      deptmentList: [],
      paging: {
        pageNo: 1,
        pageSize: 9999
      },
      rules: {
        orderName: [{ required: true, message: '请输入工单名称', trigger: 'blur' }],
        dept: [{ required: true, message: '请选择部门', trigger: 'change' }],
        inspectUser: [{ required: true, message: '请选择巡检员', trigger: 'change' }],
        inspectLineId: [{ required: true, message: '请选择巡检路线', trigger: 'change' }]
      }
    }
  },
  computed: {
    title: function () {
      return '新增巡检工单'
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    initData() {
      const tempObj = {
        lineName: ''
      }
      //获取巡检路线列表
      getInspectPathByPage(tempObj, this.paging).then(res => {
        if (res.code === 200 && res.data.records.length) this.inspectLineList = res.data.records;
      })

      getDict('equipment_type').then(res => {
        if (res.code === 200 && res.data.length) this.equipmentTypeOptions = res.data;
      })

      getAllDeptment().then(res => {
        if (res.code === 200 && res.data) this.deptmentList = res.data;
      })
    },
    deptChange(e) {
      this.formData.inspectUser = '';
      getUserByDeptment(e).then(res => {
        if (res.code === 200 && res.data) this.inspectUserList = res.data;
      })
    },
    open() {
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.formRef?.clearValidate()
      })
    },
    handleClose() {
      this.dialogVisible = false;
      for (let k in this.formData) this.formData[k] = '';
      this.executeTime = [];
      this.tableData = [];
    },
    submit() {
      this.$refs.formRef?.validate(async valid => {
        if (valid) {
          let tempObj = deepClone(this.formData);
          tempObj.executeTime = this.executeTime.join(',');
          delete tempObj.source;
          const res = await getInspectWorkOrderNumber();
          if (res.code === 200 && res.data !== '')
            tempObj.orderNumber = res.data;
          tempObj.inspectUser = this.formData.inspectUser.join(',');
          addInspectWorkOrder(tempObj).then(res => {
            if (res.code === 200) {
              this.$message.success('新增成功');
              this.handleClose();
              this.$emit('success');
            }
          })
        }
      })
    },
    executeTimeChange(e) {
      let tempStr = `${this.formData.executeTime[0]}-${this.formData.executeTime[1]}`;
      this.formData.executeTime = '';
      var result = this.executeTime.indexOf(tempStr)
      if (result === -1) {
        this.executeTime.push(tempStr);
      } else return
    },
    tagClose(tag) {
      this.executeTime.splice(this.executeTime.indexOf(tag), 1);
    },
    cancel() { this.handleClose() },
    inspectLineChange(e) {
      getPathEquipmentByLineId(e).then(res => {
        if (res.code === 200 && res.data) {
          this.tableData = res.data;
        }
      })
    },
    equipmentTypeTrans(data, code) {
      return dictTrans(data, code)
    }
  }
}
</script>