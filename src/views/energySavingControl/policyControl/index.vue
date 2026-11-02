<!-- AI策略控制 -->
<template>
  <section class="container_warp">
    <section class="container_box">
      <el-divider class="curDivider" direction="vertical" />
      <wl-main-title data-title="AI策略控制">
      </wl-main-title>
      <section style="padding:0 20px;height:calc(100% - 75px)">
        <el-form :inline="true" :model="formData" class="demo-form-inline">
          <el-form-item label="执行策略" style="display: block;">
            <el-switch v-model="formData.allow" style="width:80px" active-color="#3399FF" inactive-color="#999999"
              active-value="1" inactive-value="0" @change="switchChange">
            </el-switch>
          </el-form-item>
          <el-form-item label="执行策略类型" style="margin-right:50px">
            <el-radio-group v-model="formData.isCustom" @change="isCustomChange">
              <el-radio label="0">AI策略</el-radio>
              <el-radio label="1">自定义策略</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="供冷/供热" style="margin-right:50px">
            <el-radio-group v-model="formData.mode" :disabled="formData.isCustom === '0'" @change="modeChange">
              <el-radio label="0">供冷</el-radio>
              <el-radio label="1">供热</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="区域">
            <el-radio-group v-model="formData.areaCode" @change="areaChange">
              <el-radio label="WG">武广</el-radio>
              <el-radio label="HK">沪昆</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <section class="policy_box_warp">
          <p class="cus_p"><span v-if="formData.isCustom === '0'">{{ historyForm.date
          }}&nbsp;&nbsp;AI策略</span><span v-else>当前策略</span></p>
          <ul class="ul_cus">
            <li><span>时间</span><span style="margin-left:50px">策略组合</span><span v-show="formData.isCustom === '0'" style="margin-left:52px">接收情况</span></li>
            <li><span>时间</span><span style="margin-left:50px">策略组合</span><span v-show="formData.isCustom === '0'" style="margin-left:52px">接收情况</span></li>
            <li><span>时间</span><span style="margin-left:50px">策略组合</span><span v-show="formData.isCustom === '0'" style="margin-left:52px">接收情况</span></li>
          </ul>
          <section class="cur_policy_box">
            <p v-for="item in timeRangeArray" :key="item.time">
              <span>{{ item.time }}</span>
              <el-select v-model="item.value" :disabled="formData.isCustom === '0'" placeholder="请选择">
                <el-option v-for="opt in item.policy_select" :key="opt.id" :label="opt.label" :value="opt.id">
                </el-option>
              </el-select>
              <span v-if="formData.isCustom === '0'">{{ item.ai_status }}</span>
              <span v-else>{{ item.status !== '' ? '本日已执行' : '' }}</span>
            </p>
          </section>
          <section class="btn_box">
            <el-button type="primary" v-show="formData.isCustom === '1'" icon="" @click="policyReset">重
              置</el-button>
            <el-button type="primary" v-show="formData.isCustom === '1'" icon="" @click="policyDoSave">保
              存</el-button>
          </section>
        </section>
        <section class="policy_history_box">
          <el-form :inline="true" :model="historyForm" style="float: right;">
            <el-form-item label="时间">
              <el-date-picker v-model="historyForm.date" type="date" value-format="yyyy-MM-dd" placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item style="margin-right: 0;">
              <el-button type="primary" icon="el-icon-search" @click="query">查询</el-button>
              <el-button type="primary" icon="el-icon-refresh" @click="reset">重置</el-button>
            </el-form-item>
          </el-form>
          <p style="position: absolute;"><span>执行策略记录</span></p>
          <ul class="history_record">
            <li v-for="item in recordList" :key="item.time">
              <p><span>{{ item.time }}</span></p>
              <p><span>{{ item.policyName }}</span></p>
            </li>
          </ul>
        </section>
      </section>
    </section>
  </section>
</template>
  
<script>
import { getPolicyMode, getPolicyExecuteHistory, getPolicySwitchStatus, policySwitchToggle, getCurrentPolicyMode, policySave } from '@/api/policy-ctrl.js'
import { deepClone } from '@/utils/index';
import dayjs from 'dayjs'
export default {
  data() {
    return {
      formData: {
        areaCode: 'WG',
        allow: '',
        isCustom: '0',
        mode: '0'
      },
      timeRangeArray: [],
      policyArray: [],
      runningStatusOptions: [
        { itemText: '启用', itemValue: '1' },
        { itemText: '停用', itemValue: '0' },
      ],
      historyForm: { date: '' },
      recordList: []
    };
  },

  components: {},

  computed: {},
  watch: {
    'formData.mode': function () {
      const tempObj = deepClone(this.formData)
      delete tempObj.allow
      delete tempObj.isCustom
      this.getModeSelect(tempObj)
    }
  },

  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.historyForm.date = new dayjs().format('YYYY-MM-DD')
      this.getData();
      this.initTimeArray();
      this.query();
      this.policySwitchStatus();
      this.currentPolicyMode();
    },
    modeChange() {
      this.getData()
    },
    // 获取当前策略
    currentPolicyMode() {
      const tempObj = { areaCode: this.formData.areaCode, isCustom: this.formData.isCustom }
      getCurrentPolicyMode(tempObj).then(res => {
        if (res.code === 200 && res.data && Object.keys(res.data).length > 0) {
          this.formData.mode = res.data.mode.toString();
          this.timeRangeArray.forEach((v, i) => {
            v.value = res.data.strategy[i]
          })
        }
      })
    },
    // 获取开关状态
    policySwitchStatus() {
      const tempObj = { areaCode: this.formData.areaCode }
      getPolicySwitchStatus(tempObj).then(res => {
        if (res.code === 200) this.formData.allow = res.data.toString();
      })
    },
    areaChange() {
      this.getData()
      this.policySwitchStatus();
      this.query();
      if (this.formData.isCustom === '0') this.currentPolicyMode();
    },
    isCustomChange() {
      this.getData();
      this.currentPolicyMode();
    },
    initTimeArray() {
      for (let i = 0; i < 24; i++) {
        let tempObj = {
          time: '',
          policy_select: '',
          value: '',
          ai_status: '接收成功',
          status: ''
        }
        tempObj.time = `${i}:00-${i + 1}:00`
        this.timeRangeArray.push(tempObj)
      }
    },
    switchChange() {
      this.$confirm('确认执行？', '提示').then(() => {
        const tempObj = {
          areaCode: this.formData.areaCode,
          allow: this.formData.allow
        }
        policySwitchToggle(tempObj).then(res => {
          if (res.code === 200) {
            this.$message.success('操作成功')
            this.getData();
            this.policySwitchStatus();
          }
        })
      }).catch(() => {
        if (this.formData.allow === '1') this.formData.allow = '0'
        else this.formData.allow = '1'
      })
    },
    policyReset() {
      this.currentPolicyMode();
    },
    policyDoSave() {
      const tempObj = { areaCode: this.formData.areaCode, mode: this.formData.mode }
      let data = []
      this.timeRangeArray.forEach(v => { data.push(v.value) })
      policySave(data, tempObj).then(res => {
        if (res.code === 200) {
          this.$message.success('保存成功')
          this.currentPolicyMode();
        }
      })
    },
    //查询
    query() {
      this.getHistory();
    },
    //重置
    reset() {
      this.historyForm.date = new dayjs().format('YYYY-MM-DD')
      this.getHistory();
    },
    getHistory() {
      const tempObj = {
        areaCode: this.formData.areaCode,
        date: this.historyForm.date
      }
      getPolicyExecuteHistory(tempObj).then(res => {
        this.recordList = [];
        if (res.code === 200 && res.data) {
          for (let i = 0; i < 24; i++) {
            let tempObj = {
              time: '',
              policyName: '',
              value: ''
            }
            tempObj.time = `${i}:00-${i + 1}:00`
            if (i < res.data.modeTranslate.length) {
              tempObj.policyName = res.data.modeTranslate[i]
              tempObj.value = res.data.actualData[i]
            } else tempObj.policyName = ''
            this.recordList.push(tempObj)
          }
        }
        if (res.code === 200 && res.data === null) {
          for (let i = 0; i < 24; i++) {
            let tempObj = {
              time: '',
              policyName: '',
              value: ''
            }
            tempObj.time = `${i}:00-${i + 1}:00`
            tempObj.value = ''
            tempObj.policyName = ''
            this.recordList.push(tempObj)
          }
        }
        this.recordList.forEach((v, i) => { this.timeRangeArray[i].status = v.value })
      })
    },
    getModeSelect(data) {
      getPolicyMode(data).then(res => {
        if (res.code === 200 && res.data) {
          this.timeRangeArray.forEach(v => { v.policy_select = res.data })
        }
      })
    },
    getData() {
      const tempObj = deepClone(this.formData)
      delete tempObj.allow
      delete tempObj.isCustom
      this.getModeSelect(tempObj)
    },
  }
}

</script>
<style lang='scss' scoped>
.container_box{
  position: relative;
  height: 100%;
}
.policy_box_warp {
  border: 1px solid #1e2a45;
  border-radius: 8px;
  height: 410px;
  position: relative;
  background: #1e2a45;

  .cus_p {
    position: absolute;
    top: 10px;
    left: 20px;
  }
}

ul.ul_cus {
  width: 100%;
  height: 22px;
  display: flex;
  justify-content: space-around;
  margin-top: 40px;

  li {
    width: 25%;

    >span:first-child {
      padding-left: 40px;
    }

    >span:nth-child(2) {
      padding-left: 40px;
      display: inline-block;
      // width: 206px;
    }

    >span:last-child {
      padding-left: 52px;
    }
  }
}
@media (min-height: 1080px) {
  .policy_history_box {
    height: calc(100% - 525px)!important;
  }
}
.policy_history_box {
  position: relative;
  border: 1px solid #1e2a45;
  border-radius: 8px;
  background: #1e2a45;
  padding: 0 20px 10px 20px;
  clear: both;
  margin-top: 10px;
  >p {
    position: absolute;
    top: 28px;
    left: 20px;
  }

  .history_record {
    clear: both;
    width: 100%;
    height: 200px;

    li {
      float: left;
      width: calc(100%/12);
      height: 100px;
      border: 1px solid #005D90;

      >p:first-child {
        background-color: #00377C;
        text-align: center;
        border-bottom: 1px solid #1a4f91;
      }

      >p:last-child {
        height: 78px;
        text-align: center;

        >span {
          display: block;
          position: relative;
          top: 50%;
          transform: translateY(-50%);
          color: #2878f3;
        }
      }
    }

    li:not(:last-child),
    li:nth-child(-n+12) {
      border-right: none;
    }

    li:nth-child(12) {
      border-right: 1px solid #005D90;
    }

  }
}

.cur_policy_box {
  width: 100%;
  height: 310px;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-content: space-around;

  p {
    width: 25%;
    margin-bottom: 7px;

    >span {
      display: inline-block;
      width: 80px;
      text-align: right;
      margin-right: 15px;
    }
  }
}

.btn_box {
  float: right;
  width: 200px;
  height: 35px;
}

::v-deep .el-radio-group {
  .el-radio {
    color: #fff;
  }

  .el-radio-button__inner {
    background-color: #999;
    color: #fff;
    border-color: transparent;
  }

  .el-radio-button:first-child .el-radio-button__inner {
    border-color: transparent;
  }

  .el-radio-button__orig-radio:checked+.el-radio-button__inner {
    color: #fff;
    box-shadow: none;
    background-color: #3399ff;
  }
}

::v-deep .el-switch__core::before {
  content: "OFF";
  position: absolute;
  top: 0;
  right: 5px;
  color: #fff;
}

::v-deep .el-switch__core {
  width: 50px !important;
}

.is-checked ::v-deep .el-switch__core::before {
  content: "ON";
  position: absolute;
  top: 0;
  left: 5px;
  color: #fff;
}

::v-deep.el-form-item {
  >.el-form-item__label {
    color: #fff;
  }
}

.demo-form-inline {
  margin-top: 0px !important;
}

.el-form {
  margin: 15px 0 0 0px;
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

::v-deep .el-input {
  .el-input.is-disabled .el-input__inner {
    color: #eee !important;
  }

}
::v-deep.el-radio__input.is-disabled + span.el-radio__label{
  color:#fff!important;
}
</style>