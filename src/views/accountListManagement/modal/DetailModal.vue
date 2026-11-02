<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="60%" :before-close="handleClose">
    <section class="dialog_content">
      <section class="left_box">
        <p class="box_title"><span></span><span>设备基础信息</span></p>
        <div class="left_box_warp">
          <img :src="imageUrl" alt="">
          <p class="custom_tab"><span @click="curIndex = 0" :class="curIndex === 0 ? 'active' : ''">基础信息</span>
            <span @click="curIndex = 1" :class="curIndex === 1 ? 'active' : ''">拓展信息</span>
          </p>
          <div class="tab_content">
            <div class="tab_0" v-show="curIndex === 0">
              <el-row class="content_item" v-for="item in baseInfo" :key="item.name">
                <el-col :span="8"><span>{{ item.name }}</span></el-col>
                <el-col :offset="4" :span="12" v-if="item.name === '设备类型'">
                  <span>{{ equipmentTypeTrans(equipmentTypeOptions, item.value) }}</span>
                </el-col>
                <el-col :offset="4" :span="12" v-else-if="item.name === '使用状态'">
                  <span>{{ item.value === 0 ? '使用中' : '报废' }}</span>
                </el-col>
                <el-col :offset="4" :span="12" v-else><span>{{ item.value }}</span></el-col>
              </el-row>
            </div>
            <div class="tab_1" v-show="curIndex === 1">
              <el-row class="content_item" v-for="item in expandInfo" :key="item.name">
                <el-col :span="6"><span>{{ item.name }}</span></el-col>
                <el-col :offset="1" :span="17"><span>{{ item.value }}</span></el-col>
              </el-row>
            </div>
          </div>
        </div>
      </section>
      <section class="right_box">
        <p class="box_title"><span></span><span>设备累计维保信息</span></p>
        <div class="right_top_warp">
          <div class="left_progress_box">
            <el-progress type="circle" :percentage="healthPercent" :stroke-width="16" color="#29ffb0"
              define-back-color="#2b4670" :width="165" :show-text="false">
            </el-progress>
            <div class="center_text">
              <p><span>{{ healthPercent || '0' }}</span><span>%</span></p>
              <p><span class="resultSpan">{{ healthText || '-' }}</span></p>
            </div>
          </div>
          <div class="right_progress_box">
            <div class="progress_title">
              <p><span>巡检次数</span></p>
              <p><span>保养次数</span></p>
              <p><span>维修次数</span></p>
            </div>
            <div class="progress_box">
              <el-progress :percentage="inspectPercent" :stroke-width="16" :show-text="false"
                define-back-color="#999"></el-progress>
              <el-progress :percentage="maintainPercent" :stroke-width="16" :show-text="false"
                define-back-color="#999"></el-progress>
              <el-progress :percentage="repairPercent" :stroke-width="16" :show-text="false"
                define-back-color="#999"></el-progress>
            </div>
            <div class="progress_num">
              <p><span>{{ timesNumber.inspect }}</span></p>
              <p><span>{{ timesNumber.maintain }}</span></p>
              <p><span>{{ timesNumber.repair }}</span></p>
            </div>
          </div>
        </div>
        <div class="right_bottom_warp">
          <p class="box_title"><span></span><span>设备工单信息</span></p>
          <p class="custom_tab" style="text-align:center;"><span @click="indexVal = 0"
              :class="indexVal === 0 ? 'active' : ''">维修记录</span><span @click="indexVal = 1"
              :class="indexVal === 1 ? 'active' : ''">保养记录</span><span @click="indexVal = 2"
              :class="indexVal === 2 ? 'active' : ''">巡检记录</span></p>
          <el-table v-if="indexVal === 0" :data="tableData" style="width: 100%" height="200px">
            <el-table-column prop="orderNumber" label="工单编号" align="center">
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" align="center">
            </el-table-column>
            <el-table-column prop="completeTime" label="结束时间" align="center">
            </el-table-column>
            <el-table-column prop="" label="" align="center">
              <template #default="{ row }">
                <el-button type="text" @click="viewDetail(row)" class="detailBtn">详情</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-table v-if="indexVal === 1" :data="tableData" style="width: 100%" height="200px">
            <el-table-column prop="workNo" label="工单编号" align="center">
            </el-table-column>
            <el-table-column prop="generateTime" label="创建时间" align="center">
            </el-table-column>
            <el-table-column prop="completeTime" label="结束时间" align="center">
            </el-table-column>
            <el-table-column prop="" label="" align="center">
              <template #default="{ row }">
                <el-button type="text" @click="viewDetail(row)" class="detailBtn">详情</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-table v-if="indexVal === 2" :data="tableData" style="width: 100%" height="200px">
            <el-table-column prop="orderNumber" label="工单编号" align="center">
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" align="center">
            </el-table-column>
            <el-table-column prop="endTime" label="结束时间" align="center">
            </el-table-column>
            <el-table-column prop="" label="" align="center">
              <template #default="{ row }">
                <el-button type="text" @click="viewDetail(row)" class="detailBtn">详情</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </section>
    </section>
  </el-dialog>
</template>
<script>
import imgBg from '@/assets/img/bills/img_bg.png'
import { getAccountDetail } from '@/api/account-list.js'
import Big from 'big.js'
import { getDict, dictTrans } from '@/api/common.js'
import { getUploadFile } from '@/api/file.js'
export default {
  props: {},
  data() {
    return {
      dialogVisible: false,
      imageUrl: imgBg,
      baseInfo: [
        {
          name: '设备编号',
          value: '',
          prop: 'equipmentNumber'
        },
        {
          name: '设备名称',
          value: '',
          prop: 'equipmentName'
        },
        {
          name: '设备类型',
          value: '',
          prop: 'equipmentType'
        },
        {
          name: '安装位置',
          value: '',
          prop: 'installLocation'
        },
        {
          name: '使用状态',
          value: '',
          prop: 'equipmentStatus'
        },
      ],
      expandInfo: [
        {
          name: '品牌',
          value: '',
          prop: 'brand'
        },
        {
          name: '制造商',
          value: '',
          prop: 'producer'
        },
        {
          name: '规格型号',
          value: '',
          prop: 'specification'
        },
        {
          name: '安装单位',
          value: '',
          prop: 'installationUnit'
        },
        {
          name: '购入日期',
          value: '',
          prop: 'purchaseDate'
        },
        {
          name: '维保单位',
          value: '',
          prop: 'maintenanceUnit'
        },
        {
          name: '使用年限',
          value: '',
          prop: 'serviceLife'
        },
        {
          name: '负责人',
          value: '',
          prop: 'dutyPerson'
        },
        {
          name: '购入产地',
          value: '',
          prop: 'originOfPurchase'
        },
        {
          name: '安装日期',
          value: '',
          prop: 'installDate'
        },
        {
          name: '所属部门',
          value: '',
          prop: 'department'
        },
        {
          name: '维保期限',
          value: '',
          prop: 'maintenancePeriod'
        },
        {
          name: '所属系统',
          value: '',
          prop: 'system'
        },
        {
          name: '联系方式',
          value: '',
          prop: 'contact'
        },
        {
          name: '所属标段',
          value: '',
          prop: 'section'
        },
        {
          name: '所属子专业',
          value: '',
          prop: 'subMajor'
        },

      ],
      curIndex: 0,
      indexVal: 0,
      healthPercent: 0,
      healthText: '',
      timesNumber: {},
      equipmentTypeOptions: [],
      tableData: [],
      maintenanceRecord: {},
      equipmentNumber: ''
    }
  },
  computed: {
    title: function () {
      return '详情-' + this.equipmentNumber
    },
    inspectPercent: function () {
      let sumNum = 0
      let percent = 0
      for (const k in this.timesNumber) {
        sumNum += this.timesNumber[k]
      }
      if (this.timesNumber.inspect) {
        let inspect = new Big(this.timesNumber.inspect)
        percent = inspect.div(new Big(sumNum)).times(new Big(100)).toFixed(2)
      }
      return Number(percent)
    },
    maintainPercent: function () {
      let sumNum = 0
      let percent = 0
      for (const k in this.timesNumber) {
        sumNum += this.timesNumber[k]
      }
      if (this.timesNumber.maintain) {
        let maintain = new Big(this.timesNumber.maintain)
        percent = maintain.div(new Big(sumNum)).times(new Big(100)).toFixed(2)
      }
      return Number(percent)
    },
    repairPercent: function () {
      let sumNum = 0
      let percent = 0
      for (const k in this.timesNumber) {
        sumNum += this.timesNumber[k]
      }
      if (this.timesNumber.repair) {
        let repair = new Big(this.timesNumber.repair)
        percent = repair.div(new Big(sumNum)).times(new Big(100)).toFixed(2)
      }
      return Number(percent)
    }
  },
  watch: {
    "indexVal": function (val) {
      switch (val) {
        case 0:
          this.tableData = this.maintenanceRecord.repair;
          break;
        case 1:
          this.tableData = this.maintenanceRecord.maintain;
          break;
        case 2:
          this.tableData = this.maintenanceRecord.inspect;
          break;
        default:
          break;
      }
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    initData() {
      getDict('equipment_type').then(res => {
        if (res.code === 200 && res.data) this.equipmentTypeOptions = res.data;
      })
    },
    equipmentTypeTrans(data, code) {
      return dictTrans(data, code)
    },
    getImgById(id) {
      if (id && id.length > 0) {
        getUploadFile(id).then(res => {
          if (res.code === 200 && res.data.length > 0) {
            if (process.env.NODE_ENV === 'development') {
              this.imageUrl = `http://192.168.2.132:9000${res.data[0].fileUrl}`;
            } else {
              this.imageUrl = `${window.location.host}/${res.data[0].fileUrl}`;
            }
          }
        })
      }
    },
    open(data) {
      this.dialogVisible = true;
      this.equipmentNumber = data.equipmentNumber;
      getAccountDetail(data.equipmentId).then(res => {
        if (res.code === 200 && Object.keys(res.data).length > 0) {
          this.baseInfo.forEach(v => {
            for (const key in res.data.equipment) {
              if (v.prop == key) {
                v.value = res.data.equipment[key]
              }
            }
          })
          this.expandInfo.forEach(v => {
            for (const key in res.data.equipment.equipmentDetail) {
              if (v.prop == key) {
                v.value = res.data.equipment.equipmentDetail[key]
              }
            }
          })
          this.maintenanceRecord = res.data.map.maintenanceRecord;
          this.tableData = this.maintenanceRecord.repair;
          this.healthPercent = res.data.map.equipmentHealth.percent || 0;
          this.healthText = res.data.map.equipmentHealth.status;
          this.timesNumber = res.data.map.maintenanceSum;
          this.getImgById(res.data.equipment.url);
        }
      })
    },
    handleClose() {
      this.dialogVisible = false;
      this.imageUrl = imgBg;
    },
    viewDetail(item) {
      if (this.indexVal === 0) this.$router.push('repairWorkOrder')
      if (this.indexVal === 1) this.$router.push('upkeepWorkOrder')
      if (this.indexVal === 2) this.$router.push('inspectionWordOrder')
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

.detailBtn {
  font-size: 16px;
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
  color: #000;
  display: flex;

  .box_title {
    margin-bottom: 10px;
    padding-left: 15px;

    >span:first-child {
      display: inline-block;
      width: 4px;
      height: 4px;
      border-radius: 2px;
      background-color: #fff;
      vertical-align: middle;
      margin-right: 10px;
    }

    >span:nth-child(2) {
      display: inline-block;
      font-size: 20px;
      font-weight: bold;
      color: #000;
      vertical-align: middle;
    }
  }

  .left_box {
    width: 310px;

    .left_box_warp {
      width: 100%;
      border-right: 1px solid #355271;
      text-align: center;

      >img {
        margin: 20px 0 10px 0;
        width: 250px;
        height: 250px;
      }
    }

    .tab_content {
      @include scrollBar;
      overflow: auto;
      height: 265px;
      padding-bottom: 20px;

      .tab_0 .content_item {
        margin-top: 25px;

        >div:first-child {
          padding: 0 0 0 25px;
        }

        >div:nth-child(2) {
          padding: 0 25px 0 0;
        }
      }

      .tab_1 .content_item {
        margin-top: 15px;
      }

      .content_item {

        >div:first-child {
          padding: 0 0 0 5px;
          text-align: left;
        }

        >div:nth-child(2) {
          padding: 0 10px 0 0;
          text-align: right;
        }
      }
    }
  }

  .right_box {
    width: calc(100% - 310px);

    .right_top_warp {
      display: flex;
      justify-content: space-around;
      border-bottom: 1px solid #355271;
      padding: 20px 0;

      .left_progress_box {
        width: 250px;
        position: relative;
        text-align: center;

        .center_text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;

          span:first-child {
            font-size: 40px;
            font-weight: bold;
            color: #24e09b;
          }

          span:nth-child(2) {
            font-size: 20px;
            color: #24e09b;
          }

          span.resultSpan {
            font-size: 18px;
            color: #000;
          }
        }
      }

      .right_progress_box {

        display: flex;
        justify-content: space-around;
        width: calc(100% - 300px);
        padding-top: 20px;

        ::v-deep .el-progress-bar__inner {
          background-image: linear-gradient(to right, #058bfd, #08e2f0);
        }

        .progress_title {
          p {
            margin-bottom: 32px
          }
        }

        .progress_box {
          width: 350px;

          >div {
            margin-bottom: 38px
          }
        }

        .progress_num {
          width: 50px;
          overflow: hidden;

          p {
            text-align: center;
            margin-bottom: 32px;
          }
        }
      }
    }

    .right_bottom_warp {
      padding-top: 15px;
    }
  }
}
</style>