<!-- 配置新增弹窗 -->
<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="800px" :before-close="handleClose" center>
    <section class="dialog_content">
      <el-steps :active="stepActive" finish-status="finish" :align-center="true">
        <el-step title="计划基础信息"></el-step>
        <el-step title="计划执行时间"></el-step>
        <el-step title="工单生成设置"></el-step>
      </el-steps>
      <section class="step_1" v-if="stepActive === 0">
        <el-form :model="stepForm1" :rules="rules1" ref="form1" inline>
          <el-form-item label="巡检计划名称" prop="inspectName">
            <el-input v-model="stepForm1.inspectName"></el-input>
          </el-form-item>
          <el-form-item label="巡检路线" prop="inspectLineId">
            <el-select v-model="stepForm1.inspectLineId" @change="inspectLineChange">
              <el-option v-for="item in pathList" :key="item.id" :label="item.lineName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <el-table :data="tableData" style="width: 100%" height="300px">
          <el-table-column type="index" label="序号" width="60" align="center">
          </el-table-column>
          <el-table-column prop="equipmentNumber" label="设备编号" width="200" align="center">
          </el-table-column>
          <el-table-column prop="equipmentName" label="设备名称" width="130" align="center">
          </el-table-column>
          <el-table-column prop="equipmentType" label="设备类型" align="center">
            <template #default="{ row }">{{ equipmentTypeTrans(equipmentTypeOptions, row.equipmentType)
            }}</template>
          </el-table-column>
          <el-table-column prop="installLocation" label="设备安装位置" align="center">
          </el-table-column>
        </el-table>
      </section>
      <section class="step_2" v-if="stepActive === 1">
        <el-form :model="stepForm2" label-width="164px" :rules="rules2" ref="form2">
          <el-form-item label="巡检计划首次开始时间" prop="startDate">
            <el-date-picker type="date" v-model="stepForm2.startDate"  format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
          <el-form-item label="巡检循环方式" prop="circleMode">
            <el-select v-model="stepForm2.circleMode"  @change="circleModeChange">
              <el-option v-for="item in loopModeOptions" :key="item.value" :label="item.label"
                :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="循环日期" prop="circleTime">
            <el-checkbox-group style="" v-model="weekChecked" v-if="stepForm2.circleMode === 'WEEK'">
              <el-checkbox label="1">周一</el-checkbox>
              <el-checkbox label="2">周二</el-checkbox>
              <el-checkbox label="3">周三</el-checkbox>
              <el-checkbox label="4">周四</el-checkbox>
              <el-checkbox label="5">周五</el-checkbox>
              <el-checkbox label="6">周六</el-checkbox>
              <el-checkbox label="7">周日</el-checkbox>
            </el-checkbox-group>
            <el-date-picker type="date" v-model="stepForm2.circleTime"  format="d" value-format="d"
              @change="monthChange" :disabled="stepForm2.circleMode === 'DAY'" v-else></el-date-picker>
            <el-tag v-for="tag in monthTag" :key="tag" class="custom_tag" closable :disable-transitions="false"
              @close="monthTagClose(tag)">
              {{ tag }}
            </el-tag>
          </el-form-item>
          <el-form-item label="巡检类型" prop="inspectType">
            <el-select v-model="stepForm2.inspectType" >
              <el-option v-for="item in inspectionTypeOptions" :key="item.value" :label="item.label"
                :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="巡检计划循环截止时间" prop="">
            <el-date-picker type="date" v-model="stepForm2.endDate"  format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"></el-date-picker>
            <span style="padding-left:20px;color:#ff3c00;font-size: 14px;">*不选择代表计划一直持续</span>
          </el-form-item>
        </el-form>
      </section>
      <section class="step_3" v-if="stepActive === 2">
        <el-form :model="stepForm3" label-width="154px" :rules="rules3" ref="form3">
          <el-form-item label="巡检工单执行时间">
            <el-time-picker v-model="executeTime" style="width:500px;" popper-class="custom_range_picker"
              :picker-options="{ format: 'HH:mm' }" is-range range-separator="至" start-placeholder="开始时间"
              end-placeholder="结束时间" placeholder="" value-format="HH:mm" @change="startTimeChange" :clearable="false">
            </el-time-picker>
            <el-form-item label="">
              <el-tag v-for="tag in executeTimeList" :key="tag" class="custom_tag" closable :disable-transitions="false"
                @close="tagClose(tag)">
                {{ tag }}
              </el-tag>
            </el-form-item>
          </el-form-item>
          <!-- <el-form-item label="巡检工单自动生成时间">
                        <el-time-picker v-model="value1" :picker-options="{format: 'HH:mm'}" placeholder="任意时间点" value-format="HH:mm">
                        </el-time-picker>
                    </el-form-item> -->
        </el-form>
      </section>
    </section>
    <span slot="footer" class="dialog-footer">
      <el-button class="cancel-btn" @click="handleClose" v-if="stepActive === 0">取 消</el-button>
      <el-button class="cancel-btn" @click="prev" v-if="stepActive !== 0">上一步</el-button>
      <el-button type="primary" class="confirm-btn" @click="submit" v-if="stepActive === 2">完 成</el-button>
      <el-button class="cancel-btn" @click="next" v-if="stepActive !== 2">下一步</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { addInspectPlan, updateInspectPlan } from '@/api/inspection-content.js'
import { getInspectPathByPage } from '@/api/auto-inspection.js'
import { getPathEquipmentByLineId } from '@/api/inspect-workorder.js'
import { getDict, dictTrans } from '@/api/common'
import { getInspectPlanNumber } from '@/api/inspect-workorder.js'
export default {
  props: {},
  data() {
    return {
      dialogVisible: false,
      stepActive: 0,
      tableData: [],
      pathList: [],
      stepForm1: {
        inspectName: '',
        inspectLineId: '',
        inspectNumber: '',
      },
      stepForm2: {
        startDate: '',
        circleMode: '',
        circleTime: '',
        inspectType: '',
        endDate: ''
      },
      stepForm3: {
        executeTime: '',
      },
      value1: '',
      executeTimeList: [],
      executeTime: '',
      loopModeOptions: [
        {
          label: '日',
          value: 'DAY'
        },
        {
          label: '周',
          value: 'WEEK'
        },
        {
          label: '月',
          value: 'MONTH'
        },
      ],
      inspectionTypeOptions: [
        {
          label: '类型一',
          value: '0'
        },
        {
          label: '类型二',
          value: '1'
        }
      ],
      weekChecked: [],
      monthChecked: '',
      tableData: [],
      paging: {
        pageNo: 1,
        pageSize: 9999
      },
      equipmentTypeOptions: [],
      detailData: {},
      monthTag: [],
      rules1: {
        inspectName: [
          { required: true, message: '请输入巡检计划名称', trigger: 'blur' }
        ],
        inspectLineId: [
          { required: true, message: '请选择巡检路线', trigger: 'change' }
        ]
      },
      rules2: {
        startDate: [
          { required: true, message: '请选择巡检计划开始时间', trigger: 'change' }
        ],
        circleMode: [
          { required: true, message: '请选择循环方式', trigger: 'change' }
        ],
        inspectType: [
          { required: true, message: '请选择巡检类型', trigger: 'change' }
        ]
      },
      rules3: {}
    }
  },
  computed: {
    title: function () {
      return '新增计划'
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
        if (res.code === 200 && res.data.records.length) this.pathList = res.data.records;
      })

      getDict('equipment_type').then(res => {
        if (res.code === 200 && res.data.length) this.equipmentTypeOptions = res.data;
      })
    },
    echoFunc(data) {
      for (let key in this.stepForm1) this.stepForm1[key] = data[key]
      for (let key in this.stepForm2) this.stepForm2[key] = data[key]
      for (let key in this.stepForm3) this.stepForm3[key] = data[key]
      if (this.stepForm2.circleMode === 'WEEK') this.weekChecked = data.circleTime.split(',');
      else if (this.stepForm2.circleMode === 'MONTH') this.monthTag = data.circleTime.split(',');
      this.executeTimeList = data.executeTime.split(',');
      this.stepForm2.circleTime = '';
      this.inspectLineChange(this.stepForm1.inspectLineId);
    },
    open(data) {
      this.dialogVisible = true;
      this.detailData = data || {};
      if (data) this.echoFunc(data);
      this.$nextTick(() => {
        this.$refs.form1?.clearValidate()
        this.$refs.form2?.clearValidate()
      })
    },
    handleClose() {
      this.dialogVisible = false;
      for (let key in this.stepForm1) this.stepForm1[key] = '';
      for (let key in this.stepForm2) this.stepForm2[key] = '';
      this.stepForm3.executeTime = '';
      this.weekChecked = [];
      this.monthTag = [];
      this.tableData = [];
      this.executeTimeList = [];
      this.stepActive = 0;
    },
    next() {
      if (this.stepActive === 0) {
        this.$refs.form1?.validate(valid => {
          if (valid) {
            if (this.stepActive++ > 2)
              this.stepActive = 0;
          } else {
            this.stepActive = 0;
          }
        })
      }
      if (this.stepActive === 1) {
        this.$refs.form2?.validate(valid => {
          if (valid) {
            if (this.stepActive++ > 2)
              this.stepActive = 0;
          } else {
            this.stepActive = 1;
            this.$nextTick(() => {
              this.$refs.form2?.validate(valid => { if (!valid) return })
            })
          }
        })
      }
    },
    prev() {
      if (this.stepActive-- < 1) this.stepActive = 0;
    },
    async submit() {
      const tempFormData = { ...this.stepForm1, ...this.stepForm2, ...this.stepForm3 }
      tempFormData.executeTime = this.executeTimeList.join(',')
      if (tempFormData.circleMode === 'WEEK') tempFormData.circleTime = this.weekChecked.join(',')
      else if (tempFormData.circleMode === 'MONTH') tempFormData.circleTime = this.monthTag.join(',')
      else tempFormData.circleTime = '';

      if (Object.keys(this.detailData).length > 0) {
        tempFormData.inspectNumber = this.detailData.inspectNumber;
        tempFormData.id = this.detailData.id;
        updateInspectPlan(tempFormData).then(res => {
          if (res.code === 200) {
            this.$message.success('编辑成功')
            this.handleClose();
            this.$emit('success')
          }
        })
      } else {
        const res = await getInspectPlanNumber()
        if (res.code === 200 && res.data !== '')
          tempFormData.inspectNumber = res.data;
        addInspectPlan(tempFormData).then(res => {
          if (res.code === 200) {
            this.$message.success('新增成功')
            this.handleClose();
            this.$emit('success')
          }
        })
      }
    },
    startTimeChange() {
      this.executeTimeList.push(`${this.executeTime[0]}-${this.executeTime[1]}`)
      this.executeTime = ''
    },
    tagClose(tag) {
      this.executeTimeList.splice(this.executeTimeList.indexOf(tag), 1);
    },
    monthChange() {
      if (this.stepForm2.circleMode !== 'DAY') {
        this.monthTag.push(this.stepForm2.circleTime)
        this.monthTag.sort(function (a, b) { return a - b; })
        this.stepForm2.circleTime = ''
      }
    },
    monthTagClose(tag) {
      this.monthTag.splice(this.monthTag.indexOf(tag), 1);
    },
    circleModeChange(e) {
      if (e === 'WEEK') {
        this.monthTag = [];
        this.stepForm2.circleTime = this.weekChecked.length > 0 || this.weekChecked.join(',')
      }
      if (e === 'MONTH') {
        this.weekChecked = [];
        this.stepForm2.circleTime = this.monthTag.length > 0 || this.monthTag.join(',')
      } else {
        this.stepForm2.circleTime = '';
      }
    },
    inspectLineChange(e) {
      getPathEquipmentByLineId(e).then(res => {
        if (res.code === 200 && res.data) this.tableData = res.data;
      })
    },
    equipmentTypeTrans(data, code) {
      return dictTrans(data, code)
    }
  }
}
</script>


<style lang="scss" scoped>
.saveBtn {
  width: 68px;
  background-color: #2e6cd8;
  border-radius: 3px;
  text-align: center;
}

.backBtn {
  width: 68px;
  color: #fff;
  text-align: center;
}

.prevBtn {
  width: 68px;
  color: #fff;
  background-color: #2e6cd8;
  text-align: center;
}

.step_2,
.step_3 {
  margin: 30px 0 20px 0;
  padding: 0 20px;
}

.nextBtn {
  width: 68px;
  color: #fff;
  background-color: #2e6cd8;
  text-align: center;
}

::v-deep .is-disabled .el-input__inner {
  background-color: #3a4964;
}

::v-deep .el-steps {
  .el-step__title.is-process {
    color: #fff;
  }
}

::v-deep .el-checkbox {
  margin-right: 10px;
  color: #fff;
}
</style>
<style lang="scss">
.custom_range_picker {
  .el-time-spinner__item.active:not(.disabled) {
    color: #fff;
  }

  .el-time-range-picker__body {
    border-color: #606f8d;
  }

  .el-time-panel__btn.cancel {
    color: #fff;
  }
}
//
.step_1{
  margin-top: 20px;
}
</style>
