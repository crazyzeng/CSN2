<!-- 保养计划,详情，dialog -->
<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="800px" :before-close="handleClose">
    <section class="dialog_content">
      <!--表单数据-->
      <div>
        <el-row type="flex" justify="start">
          <div class="w-1/3 mb-2">保养计划名称:
            <span class="ml-10px">{{ formData.name }}</span>
          </div>
          <div class="w-1/3 mb-2">保养类型:
            <span class="ml-10px">{{ transLateType(formData.type) }}</span>
          </div>
        </el-row>
        <el-row type="flex" justify="start" class="mt-10px">
          <div class="w-1/3 mb-2">首次保养开始时间:
            <span class="ml-10px">{{ formData.startDate }}</span>
          </div>
          <div class="w-1/3 mb-2">持续保养:
            <span class="ml-10px">{{ formData.continuous ? '是' : '否' }}</span>
          </div>
          <div class="w-1/3 mb-2">工单生成日期:
            <span class="ml-10px">{{ formData.generateDay }}</span>
            <span class="ml-10px">天</span>
          </div>
        </el-row>
        <el-row type="flex" justify="start" class="mt-10px">
          <div class="w-1/3 mb-2">持续保养结束时间:
            <span class="ml-10px">{{ formData.endDate }}</span>
          </div>
          <div class="w-1/3 mb-2">保养周期:
            <span class="ml-10px">{{ formData.period }}</span>
            <span class="ml-10px">天</span>
          </div>
          <div class="w-1/3 mb-2">工单生成时间:
            <span class="ml-10px">{{ formData.generateTime }}</span>
          </div>
        </el-row>
        <div class="mt-4" style="font-size: 16px;">保养设备清单</div>
        <el-row>
          <el-table :data="tableData" height="300" style="width: 100%" class="p-10px">
            <el-table-column align="center" prop="equipmentNumber" label="设备编号" min-width="200" />
            <el-table-column align="center" prop="equipmentName" label="设备名称" min-width="100" />
            <el-table-column align="center" prop="equipmentType" label="设备类型" min-width="120">
              <template #default="{ row }">
                <div>
                  {{ equipmentTypeLabel(row.equipmentType) }}
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="installLocation" label="设备安装位置" min-width="200" />
          </el-table>
        </el-row>
      </div>
      <p style="text-align: center;margin-top: 20px;" slot="footer" class="dialog-footer">
        <el-button type="primary" @click="cancel">返回</el-button>
        <el-button @click="submit">确定</el-button>
      </p>
    </section>
  </el-dialog>
</template>
<script>
import { getDetailInfo } from '@/api/upkeep/plan.js'
import { getDict, dictTrans } from '@/api/common.js'

export default {
  props: {

  },
  data() {
    return {
      dialogVisible: false,
      formData: {
        name: '',
        type: '',
        startDate: '',
        continuous: '',
        period: '',
        endDate: '',
        generateDay: '',
        generateTime: '',
      },
      tableData: [],
      deviceTypeOptions: [],
      title: '',
    }
  },
  computed: {},
  mounted() { },
  methods: {
    query() {
      this.getDictInfo()
      getDetailInfo(this.curId).then(res => {
        this.tableData = res.data.equipments
        this.formData.name = res.data.name
        this.formData.type = String(res.data.type)
        this.formData.startDate = res.data.startDate
        this.formData.continuous = res.data.continuous
        this.formData.period = res.data.period
        this.formData.endDate = res.data.endDate
        this.formData.generateDay = res.data.generateDay
        this.formData.generateTime = res.data.generateTime
      })
    },
    handleClose() {
      this.dialogVisible = false;
    },
    submit() { this.handleClose() },
    cancel() { this.handleClose() },
    open(data) {
      this.title = `详情--工单编号${data.planNo}`
      this.curId = data.id
      this.query()
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
    transLateType(val) {
      switch (val) {
        case '1':
          return '常规保养'
        case '2':
          return '月度保养'
        case '3':
          return '季度保养'
        case '4':
          return '年度保养'
        default:
          break;
      }
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-dialog {
  .el-dialog__body {
    padding-top: 10px;
  }
}

.dialog_content {
  color: #666;

  .center_btn {
    width: 20%;
    text-align: center;
  }
}
</style>