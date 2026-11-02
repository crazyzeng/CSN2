<!-- 保养计划，新增，编辑，dialog -->
<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="1280px" :before-close="handleClose">
    <section class="dialog_content">
      <el-col :span="24">
        <el-row>
          <!--top-->
          <el-form ref="addOrEditForm" :inline="true" :model="formData" :rules="rules" class="" label-width="135px">
            <el-row type="flex" style="flex-wrap:wrap">
              <el-form-item label="保养计划名称" prop="name">
                <el-input v-model="formData.name" placeholder="请输入"  maxlength="20"
                  show-word-limit></el-input>
              </el-form-item>
              <el-form-item label="保养类型" prop="type">
                <el-select v-model="formData.type">
                  <el-option v-for="item in upkeepTypeList" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="首次保养开始时间" prop="startDate">
                <el-date-picker v-model="formData.startDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"
                  format="yyyy-MM-dd"  @change="startDateChange" />
              </el-form-item>
              <el-form-item label="持续保养" prop="continuous">
                <el-select v-model="formData.continuous" @change="continuousChange">
                  <el-option v-for="item in lastUpkeep" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
              <el-form-item label="工单生成日期" prop="generateDay">
                <el-input v-model="formData.generateDay" placeholder="请输入" >
                  <template slot="append">天</template>
                </el-input>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="持续保养结束时间" prop="endDate">
                <el-date-picker v-model="formData.endDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"
                  format="yyyy-MM-dd"  :disabled="!formData.continuous" />
              </el-form-item>
              <el-form-item label="保养周期" prop="period">
                <el-input v-model="formData.period" placeholder="请输入" >
                  <template slot="append">天</template>
                </el-input> </el-form-item>
              <el-form-item label="工单生成时间" prop="generateTime">
                <el-time-picker v-model="formData.generateTime" placeholder="任意时间点" value-format="HH:mm:ss"
                   popper-class="custom_time_picker" class="custom_time_picker" />
              </el-form-item>
            </el-row>
          </el-form>
          <!--bot-->
          <!--左侧表格-->
          <el-col :span="11" style="padding: 10px">
            <el-row>
              <el-col :span="8">
                <el-input v-model="searchValLeft" placeholder="请输入设备名称、编号、类型" style="width:200px;"></el-input>
              </el-col>
              <el-col :span="8" :offset="1">
                <el-button type="primary" icon="el-icon-search" @click="leftQuery">查询</el-button>
                <el-button type="primary" icon="el-icon-refresh" @click="leftReset">重置</el-button>
              </el-col>
            </el-row>
            <el-table :data="selectArrLeft" height="300" ref="selection" @selection-change="checkAll" style="width: 100%;margin-top: 10px;">
              <el-table-column align="center" type="selection" width="50" />
              <el-table-column align="center" prop="equipmentNumber" label="设备编号" width="100" />
              <el-table-column align="center" prop="equipmentName" label="设备名称" width="120" />
              <el-table-column align="center" prop="equipmentType" label="设备类型">
                <template #default="{ row }">
                  <div>
                    {{ equipmentTypeLabel(row.equipmentType) }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="installLocation" label="设备安装位置" />
            </el-table>
          </el-col>
          <!--中间按钮-->
          <el-col :span="2">
            <div class="opSetting">
              <div class="spacing" @click="handleRemoveSelect">
                <el-button icon="el-icon-arrow-left" class="custom_arrow_btn" :disabled="nowSelectRightData.length ? false : true
                  " type="text">
                </el-button>
              </div>
              <div @click="handelSelect">
                <el-button icon="el-icon-arrow-right" class="custom_arrow_btn"
                  :disabled="nowSelectData.length ? false : true" type="text">
                </el-button>
              </div>
            </div>
          </el-col>
          <!--右侧表格-->
          <el-col :span="11" style="padding: 10px">
            <!-- <el-row>
                            <el-col :span="8">
                                <el-input v-model="searchValRight" placeholder="请输入设备名称、编号、类型"
                                    style="width:200px"></el-input>
                            </el-col>
                            <el-col :span="8" :offset="1">
                                <el-button type="primary" class="customBtn" icon="el-icon-search"
                                    @click="rightQuery">查询</el-button>
                                <el-button type="primary" class="customBtn" icon="el-icon-refresh"
                                    @click="rightReset">重置</el-button>
                            </el-col>
                        </el-row> -->
            <el-table :data="selectArrRight" height="300" ref="selection" @selection-change="checkRightAll"
              style="width: 100%;margin-top: 38px;margin-bottom: 10px;">
              <el-table-column align="center" type="selection" width="50" />
              <el-table-column align="center" prop="equipmentNumber" label="设备编号" width="100" />
              <el-table-column align="center" prop="equipmentName" label="设备名称" width="120" />
              <el-table-column align="center" prop="equipmentType" label="设备类型">
                <template #default="{ row }">
                  <div>
                    {{ equipmentTypeLabel(row.equipmentType) }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="installLocation" label="设备安装位置" />
            </el-table>
          </el-col>
        </el-row>
      </el-col>
      <p style="text-align: center;margin-top: 20px;" slot="footer" class="dialog-footer">
        <el-button type="primary" icon="" @click="cancel">返回</el-button>
        <el-button icon="" @click="submit">确定</el-button>
      </p>
    </section>
  </el-dialog>
</template>
<script>
import { fetchAllEquipment } from '@/api/account-list.js'
import { getDict, dictTrans } from '@/api/common.js'
import { addPlan, editPlan, getDetailInfo } from '@/api/upkeep/plan.js'
import { deepClone } from '@/utils/index';

export default {
  props: {},
  data() {
    return {
      dialogVisible: false,
      title: '',
      curType: 'add',
      curId: '',
      rules: {
        name: [{ required: true, message: '请输入计划名称', trigger: 'blur' },],
        type: [{ required: true, message: '请选择保养类型', trigger: 'blur' },],
        startDate: [{ required: true, message: '请选择开始时间', trigger: 'blur' },],
        continuous: [{ required: true, message: '请选择持续保养', trigger: 'blur' },],
        period: [{ required: true, message: '请输入保养周期', trigger: 'blur' },],
        generateDay: [{ required: true, message: '请输入工单生成日期', trigger: 'blur' },],
        generateTime: [{ required: true, message: '请选择工单生成时间', trigger: 'blur' },],
      },
      tempRules: {
        endDate: [{ required: true, message: '请选择结束时间', trigger: 'blur' },],
      },
      formData: {
        name: '',
        type: '',
        startDate: '',
        continuous: '',
        period: '',
        endDate: '',
        generateDay: '',
        generateTime: '',
        equipmentIds: [],
      },
      deviceTypeOptions: [],
      lastUpkeep: [
        { label: '是', value: true },
        { label: '否', value: false },
      ],
      upkeepTypeList: [
        { label: '常规保养', value: '0' },
        { label: '一级保养', value: '1' },
        { label: '二级保养', value: '2' },
      ],
      searchValLeft: '',
      searchValRight: '',
      current: 0,
      selectArrLeft: [],
      selectArrRight: [],
      rightTempData: [],
      nowSelectData: [],
      nowSelectRightData: [],
    }
  },
  computed: {},
  mounted() { },
  methods: {
    handleClose() {
      this.dialogVisible = false;
      this.$refs['addOrEditForm'].resetFields()
      for (let k in this.formData) this.formData[k] = '';
      this.selectArrRight = [];
      this.rightTempData = [];
    },
    leftQuery() {
      fetchAllEquipment(this.searchValLeft).then(res => {
        this.selectArrLeft = res.data
      })
    },
    leftReset() {
      this.searchValLeft = ''
      this.leftQuery()
    },
    startDateChange() {
      if (this.formData.continuous !== '' && !this.formData.continuous) this.formData.endDate = this.formData.startDate;
    },
    continuousChange() {
      if (this.formData.startDate !== '' && !this.formData.continuous) this.formData.endDate = this.formData.startDate;
      if (this.formData.continuous) {
        this.rules = { ...this.rules, endDate: [{ required: true, message: '请选择结束时间', trigger: 'blur' }] }
      } else {
        delete this.rules.endDate;
        this.rules = { ...this.rules }
      }
      this.formData.endDate = '';
      this.$nextTick(() => {
        this.$refs['addOrEditForm'].clearValidate();
      })
    },
    rightQuery() {
      let tempData = deepClone(this.selectArrRight)
      this.rightTempData = deepClone(this.selectArrRight)
      let curArr = []
      tempData.forEach(e => {
        if (e.equipmentName.includes(this.searchValRight) ||
          e.equipmentNumber.includes(this.searchValRight) ||
          e.equipmentName.includes(this.equipmentTypeLabel(this.searchValRight))) {
          curArr.push(e)
        }
      });
      this.selectArrRight = curArr
    },
    rightReset() {
      this.searchValRight = ''
      this.selectArrRight = this.rightTempData
      this.rightQuery()
    },
    // 
    submit() {
      this.$refs['addOrEditForm'].validate((flag) => {
        if (flag) {
          this.formData.equipmentIds = this.selectArrRight.map(item => { return item.equipmentId })
          if (this.formData.equipmentIds.length === 0) {
            this.$message.warning('请选择设备')
          } else {
            if (this.curType === 'add') {
              addPlan(this.formData).then(res => {
                if (res.code === 200) {
                  this.$message.success('新增成功')
                  this.handleClose()
                  this.$refs['addOrEditForm'].resetFields()
                  this.$emit('submit');
                } else {
                  this.$message.error(res.msg || '新增失败')
                }
              })
            } else {
              this.formData.id = this.curId
              editPlan(this.formData).then(res => {
                if (res.code === 200) {
                  this.$message.success('编辑成功')
                  this.handleClose()
                  this.$refs['addOrEditForm'].resetFields()
                  this.$emit('submit');
                } else {
                  this.$message.error(res.msg || '编辑失败')
                }
              })
            }
          }
        }
      })
    },
    cancel() {
      this.selectArrRight = []
      this.nowSelectData = []
      this.handleClose()
    },
    next() {
      this.current++;
    },
    prev() {
      this.current--;
    },
    checkAll(val) {
      this.nowSelectData = val;
    },
    checkRightAll(val) {
      this.nowSelectRightData = val;
    },
    // 选中
    handelSelect() {
      //右边的数组和左边的数组进行连接
      this.selectArrRight = this.handleConcatArr(this.selectArrRight, this.nowSelectData);
      //删除左边数组中的元素
      this.handleRemoveTabList(this.nowSelectData, this.selectArrLeft);
      this.nowSelectData = [];
    },
    // 取消
    handleRemoveSelect() {
      this.selectArrLeft = this.handleConcatArr(this.selectArrLeft, this.nowSelectRightData);
      this.handleRemoveTabList(this.nowSelectRightData, this.selectArrRight);
      this.nowSelectRightData = [];
    },
    handleConcatArr(selectArrRight, nowSelectData) {
      let arr = [];
      arr = arr.concat(selectArrRight, nowSelectData);
      return arr;
    },
    //在全局中删除被选中的元素
    handleRemoveTabList(isNeedArr, originalArr) {
      //如果两个数组都不为空
      if (isNeedArr.length && originalArr.length) {
        for (let i = 0; i < isNeedArr.length; i++) {
          for (let k = 0; k < originalArr.length; k++) {
            if (isNeedArr[i]["equipmentId"] === originalArr[k]["equipmentId"]) originalArr.splice(k, 1);
          }
        }
      }
    },
    async open(type, data) {
      this.curType = type
      if (type === 'add') this.title = '新增'
      else this.title = '编辑'
      await this.leftQuery()
      this.getDictInfo()
      if (data) {
        this.curId = data.id
        this.title = `编辑--计划编号${data.planNo}`
        getDetailInfo(data.id).then(res => {
          this.formData.name = res.data.name
          this.formData.type = String(res.data.type)
          this.formData.startDate = res.data.startDate
          this.formData.continuous = res.data.continuous
          this.formData.period = res.data.period
          this.formData.endDate = res.data.endDate
          this.formData.generateDay = res.data.generateDay
          this.formData.generateTime = res.data.generateTime
          this.formData.equipmentIds = res.data.equipments.map(item => { return item.equipmentId })
          this.nowSelectData = res.data.equipments
          this.handelSelect()
        })
      }
      this.dialogVisible = true;
    },
    // 字典
    getDictInfo() {
      getDict('equipment_type').then(res => {
        if (res.code === 200 && res.data.length > 0) this.deviceTypeOptions = res.data
      })
    },
    equipmentTypeLabel(val) {
      return dictTrans(this.deviceTypeOptions, val)
    },

  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-dialog {
  .el-dialog__body {
    padding-top: 10px;
  }
}

.opSetting {
  display: flex;
  margin-top: 150%;
  flex-wrap: nowrap;
  justify-content: space-evenly;
}

.custom_arrow_btn {
  width: 30px;
  height: 30px;
  border: 1px solid #2e6cd8;
}

.custom_tab {
  margin-bottom: 10px;

  >span {
    display: inline-block;
    height: 30px;
    line-height: 30px;
    cursor: pointer;
    font-size: 16px;
    padding: 0 15px;
  }

  >span.active {
    border-bottom: 1px solid #0084ff;
  }
}

.dialog_content {
  color: #fff;

  .center_btn {
    width: 20%;
    text-align: center;
  }
}

::v-deep.el-input-group--append {
  input {
    border-radius: 15px 0 0 15px !important;
  }

  .el-input-group__append {
    background-color: #dedcdc !important;
    border: none;
    color: #000;
    border-radius: 0 15px 15px 0;
  }
}

::v-deep.el-input .el-input__count .el-input__count-inner {
  background-color: transparent;
}

::v-deep.el-input {
  .el-input__inner {
    color: #fff !important;
  }
}
</style>