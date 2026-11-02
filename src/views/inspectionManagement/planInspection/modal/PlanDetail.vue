<!-- 计划巡检-详情弹窗 -->
<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="60%" :before-close="handleClose">
    <section class="content_box">
      <div class="btn_group">
        <el-button type="primary" class="confirm-btn" icon="" @click="handleClose">确定</el-button>
      </div>
      <el-row>
        <el-col :span="10">
          <p><span>巡检计划名称：</span><span>{{ detailData.inspectName }}</span></p>
        </el-col>
        <el-col :span="12">
          <p><span>巡检类型：</span><span>{{ detailData.inspectType === '0' ? '类型一' : '类型二' }}</span></p>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <p><span>循环方式：</span><span>{{
            detailData.circleMode === 'DAY' ? '每日' : detailData.circleMode === 'WEEK' ? '每周' : '每月'
          }}</span></p>
        </el-col>
        <el-col :span="12">
          <p><span>循环日期：</span><span>{{ detailData.circleTime }}</span></p>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <p><span>巡检执行时间：</span><span>{{ detailData.executeTime }}</span></p>
        </el-col>
        <el-col :span="12">
          <p><span>巡检路线：</span><span>{{ lineName }}</span></p>
        </el-col>
      </el-row>
      <el-table :data="tableData" style="width: 100%;margin-top: 30px;" height="300">
        <el-table-column type="index" label="序号" width="200" align="center">
        </el-table-column>
        <el-table-column prop="equipmentNumber" label="设备编号" width="100" align="center">
        </el-table-column>
        <el-table-column prop="equipmentName" label="设备名称" align="center">
        </el-table-column>
        <el-table-column prop="equipmentType" label="设备类型" align="center">
          <template #default="{ row }">{{ equipmentTypeTrans(equipmentTypeOptions, row.equipmentType)
          }}</template>
        </el-table-column>
        <el-table-column prop="installLocation" label="设备安装位置" width="" align="center">
        </el-table-column>
      </el-table>
    </section>
  </el-dialog>
</template>
<script>
import { getInspectPathByPage } from '@/api/auto-inspection.js'
import { getDict, dictTrans } from '@/api/common'
import { getEquipmentByLineId } from '@/api/inspection-content.js'

export default {
  props: {},
  data() {
    return {
      dialogVisible: false,
      tableData: [],
      detailData: {},
      pathList: [],
      paging: {
        pageNo: 1,
        pageSize: 9999
      },
      lineName: '',
      equipmentTypeOptions: []
    }
  },
  computed: {
    title: function () { return '计划编号：' + this.detailData.inspectNumber }
  },
  mounted() {
    getDict('equipment_type').then(res => {
      if (res.code === 200 && res.data) this.equipmentTypeOptions = res.data;
    })
  },
  methods: {
    initData() {
      const tempObj = {
        lineName: ''
      }
      //获取巡检路线列表
      getInspectPathByPage(tempObj, this.paging).then(res => {
        if (res.code === 200 && res.data.records.length) {
          this.pathList = res.data.records;
          let tempArr = this.pathList.filter(v => { return v.id === this.detailData.inspectLineId })
          this.lineName = tempArr[0]?.lineName
        }
      })
      //获取设备信息
      getEquipmentByLineId(this.detailData.inspectLineId).then(res => {
        if (res.code === 200 && res.data) this.tableData = res.data;
      })
    },
    open(data) {
      this.dialogVisible = true;
      this.detailData = data;
      this.initData();
    },
    handleClose() {
      this.dialogVisible = false;
    },
    equipmentTypeTrans(data, code) {
      return dictTrans(data, code)
    }
  }
}
</script>

<style lang="scss" scoped>
.saveBtn {
  background-color: #2e6cd8;
  border-radius: 3px;
}
.customBtn {
  border-radius: 3px;
}

::v-deep .el-checkbox {
  margin-right: 10px;
}

.btn_group {
  position: absolute;
  right: 0;
  z-index: 9;
}

::v-deep .el-dialog {
  .el-dialog__header {
    background-color: transparent;
    height: 60px;
  }

  .dialog-footer {}

  .el-dialog__body {
    padding-top: 10px;
  }
}

.box_title {
  margin-bottom: 10px;
  padding-left: 15px;

  >span:nth-child(1) {
    display: inline-block;
    font-size: 20px;
    font-weight: bold;
    vertical-align: middle;
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

.content_box {
  position: relative;

  p {
    margin: 20px 0 0 0;
  }
}
</style>
