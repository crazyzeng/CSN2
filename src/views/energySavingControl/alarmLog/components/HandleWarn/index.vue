<template>
  <el-dialog title="处理意见" width="30%" :visible.sync="value.flag" :before-close="handleClose" @open="handleOpen">
    <div class="th-content-wrapper" v-if="alarmType !== 'system-warning'">
      <el-input :rows="5" v-model="content" class="custom_input" type="textarea" placeholder="请输入内容" maxlength="200"
        show-word-limit />
    </div>

    <div class="th-falsePositive-wrapper" v-if="alarmType !== 'energy-warning'">
      <span>是否误报：</span>
      <el-radio-group v-model="falsePositive" class="custom_radioGroup">
        <el-radio label="ERROR">是</el-radio>
        <el-radio label="">否</el-radio>
      </el-radio-group>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" class="cancel-btn" @click="close" round>取 消</el-button>
      <el-button type="primary" class="confirm-btn" @click="submit('relieve')" v-if="alarmType !== 'energy-warning'">解除报警</el-button>
      <el-button type="primary" class="confirm-btn" @click="submit('confirm')" v-if="alarmType != 'system-warning'"
        :disabled="falsePositive === 'ERROR'">确认告警</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { handleWarn, handleEnergyAlarm, dealCommunicationAlarm } from '@/api/warn';
export default {
  name: 'HandleWarn',
  props: {
    value: Object,
    alarmType: {
      type: String,
      default: 'energy-warning'
    }
  },
  data() {
    return {
      content: '',
      falsePositive: '',
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() { },

    handleOpen() { },

    handleClose(done) {
      this.close()
    },

    resetData() {
      this.content = '';
      this.falsePositive = '';
    },

    close() {
      const value = { flag: false, warnId: '' };
      this.resetData();
      this.$emit('input', value);
    },

    async submit(type) {
      const data = {};
      if (this.content === '' && this.alarmType != 'system-warning') return this.$message.warning('请输入内容');
      if (type === 'relieve') {
        this.falsePositive === '' ? (data.status = 'OLD') : (data.status = this.falsePositive);
      }
      data.handleSuggestion = this.content;
      data.alarmRecordId = this.value.warnId;
      console.log(this.value.warnId, this.falsePositive, 'dd');
      

      if (this.alarmType === 'energy-warning') {
        const tempObj = {
          id: this.value.warnId,
          suggestion: this.content
        }
        await handleEnergyAlarm(tempObj).then(res => {
          if (res.code == 200) this.$message.success('处理成功')
        })
      } else if (this.alarmType === 'system-warning') {
        const tempObj = {
          alarmRecordId: this.value.warnId,
          status: this.falsePositive == '' ? 'OLD' : 'ERROR'
        }
        await dealCommunicationAlarm(tempObj).then(res => {
          if (res.code == 200) this.$message.success('处理成功')
        })
      } else {
        await handleWarn(data).then(res => {
          if (res.code == 200) this.$message.success('处理成功')
        })
      }
      this.$emit('submit');
      this.close();
    },
  },
};
</script>

<style lang="scss" scope>
.th-falsePositive-wrapper {
  margin-top: 20px;
}

.custom_input {
  >.el-textarea__inner {
    color: #fff;
  }
}
.dialog-footer{
  text-align: center;
}
</style>
