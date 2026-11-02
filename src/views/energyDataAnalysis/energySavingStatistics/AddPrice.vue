<template>
  <el-dialog :title="dataTitle" :visible.sync="dataFlag" :before-close="modalClose" width="32%">
    <!-- body -->
    <el-radio-group v-model="radioValue">
      <el-radio-button label="电"></el-radio-button>
      <el-radio-button label="水"></el-radio-button>
      <el-radio-button label="热"></el-radio-button>
      <el-radio-button label="气"></el-radio-button>
    </el-radio-group>
    <el-form :model="formData" :rules="rules" :label-position="'right'" label-width="80px" ref="form">
      <el-form-item label="第一梯度" required>
        <el-col :span="5">
          <el-form-item prop="d1">
            <el-input v-model="rules.d1" placeholder="" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="5">
          <el-form-item prop="d2">
            <el-input v-model="rules.d1" placeholder="" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="d2" label="单价">
            <el-input v-model="rules.d1" placeholder=""></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>
      <!-- 倍率 -->
      <el-form-item label="第二梯度" prop="">
        <el-col :span="5">
          <el-form-item prop="d1">
            <el-input v-model="rules.d1" placeholder="" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="5">
          <el-form-item prop="d2">
            <el-input v-model="rules.d1" placeholder="" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="d2" label="单价">
            <el-input v-model="rules.d1" placeholder=""></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>

      <!-- 寄存器地址 -->
      <el-form-item label="第三梯度" prop="">
        <el-col :span="5">
          <el-form-item prop="d1">
            <el-input v-model="rules.d1" placeholder="" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="5">
          <el-form-item prop="d2">
            <el-input v-model="rules.d1" placeholder="" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="d2" label="单价">
            <el-input v-model="rules.d1" placeholder=""></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>

      <!-- modbus设备id -->
      <el-form-item label="第四梯度" prop="">
        <el-col :span="5">
          <el-form-item prop="d1">
            <el-input v-model="rules.d1" placeholder="" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="5">
          <el-form-item prop="d2">
            <el-input v-model="rules.d1" placeholder="" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="d2" label="单价">
            <el-input v-model="rules.d1" placeholder=""></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>
    </el-form>

    <!-- buttons -->
    <div slot="footer" class="dialog-footer">
      <el-button class="saveBtn" type="primary" @click="submit" :disabled="disabled">保 存</el-button>
      <el-button class="cancelBtn" @click="modalCancel">返 回</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { deepCopy } from '@/utils/index.js'
export default {
  name: "PriceAddOrEdit",
  props: [
    "dataTitle",
    "dataList",
    "dataType",
    "dataFlag",
    "dataId",
    "disabled"
  ],
  data: function () {
    var validerMultiplierValue = (rule, value, callback) => {
      if (value == "") callback(new Error("请输入倍率"));
      let reg = /^(0|[1-9][0-9]*)(\.\d+)?$/;
      if (!reg.test(value)) callback(new Error("倍率格式不正确！"));
      if (value > 100000) {
        callback(new Error("倍率不得高于100000！"));
      } else if (value < 0) {
        callback(new Error("倍率不得小于0！"));
      } else {
        callback();
      }
    };
    var checkHeartbeatRetryNum = (rule, value, callback) => {
      if (value == "") callback();
      if (!Number.isInteger(value)) {
        callback(new Error("请输入数字值"));
      } else {
        callback();
      }
    };
    var checkItemId = (rule, value, callback) => {
      if (value == "") callback(new Error("请输入项Id"));
      if (value < 0) {
        callback(new Error("请输入正确格式！"));
      } else callback();
    }
    return {
      radioValue: '电',
      tyepLevel: 0,
      editDisabled: false,
      storageHourDisabled: false,
      formData: {
        pointId: "",
        pointName: "",
        deviceId: "",
        multiplierValue: "",
        functionCode: "",
        registerAddress: "",
        slaveId: "",
        remoteDeviceId: "",
        writeDataType: "",
        pointType: "",
        remoteObjectId: "",
        remotePropertyCode: "",
        itemId: "",
        groupName: "",
        electricityMeterId: "",
        collectorIp: "",
        collectorItem: "",
        objectType: "",
      },
      deviceProtocol: "",
      list: {
        type: [],
        devices: [],
        orgList: [],
        writeModeList: [], // 写时数据类型
        storageHour: [],
        objectTypes: [],
        remotePropList: [],
        mode: [
          {
            label: 1,
            value: 1
          }
        ]
      },

      rules: {},
    };
  },
  created: function () {
    this.init();
  },
  watch: {
    dataId: function (newVal) {
      this.getData(newVal);
    },
  },
  computed: {
  },
  methods: {
    init() { },

    // 关闭
    close() {
      this.editDisabled = false;
      this.storageHourDisabled = false;
      this.deviceProtocol = "";
      this.formData.pointId = "";
      this.orgId = [];
      this.$refs["form"].resetFields();
    },

    // 弹框关闭
    modalClose(done) {
      this.close();
      this.deviceProtocol = "";
      this.$emit("close");
    },

    // 弹框关闭
    modalCancel() {
      this.close();
      this.deviceProtocol = "";
      this.$emit("close");
    },
    // 确定
    submit() {
      this.$refs["form"].validate(flag => {
        if (flag) {
          let data = deepCopy(this.formData);
          if (this.dataId) {
            data.pointId = this.dataId;
          } else { }
          this.modalClose();
        }
      });
    },
    // 查询
    getData(data) {
      if (!this.dataId) return;
    },
    // 获取匹配的设备对象 编辑弹窗需要
    getMatchDevice(id) {
      let obj = null;
      for (let i = 0; i < this.list.devices.length; i++) {
        let o = this.list.devices[i];
        if (o.deviceId == id) {
          return o;
        }
      }
      if (obj === null) return {};
    },

    // 查询字典
    findDic(key) {
      api.findDic(key)
        .then(res => {
          if (res.code == 200 && res.data.length > 0) { }
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.saveBtn,
.cancelBtn {
  width: 60px;
  height: 32px;
  line-height: 32px;
  font-size: 14px;
  padding: 0;
}

.saveBtn {
  background-color: rgb(46, 108, 216);
  border-radius: 4px;
}

.cancelBtn {
  background-color: transparent;
  color: rgb(46, 108, 216);
  border: 1px solid rgb(46, 108, 216);
}

::v-deep.el-dialog__wrapper {
  .el-dialog {
    border-radius: 6px;
    background: #243e62;

    .el-dialog__header {
      padding: 5px;
    }

    .el-input__inner {
      width: 90px;
      background-color: #2a3e62;
    }

    .el-form {
      padding: 20px;
    }

    .el-radio-group {
      width: 100%;
      background-color: #243e62;
      padding-bottom: 10px;
      padding-left: 10px;
    }

    .el-dialog__body {
      padding: 0;
      background-color: #1d2f4b;
    }

    .el-radio-button__inner {
      width: 54px;
      height: 30px;
      background-color: transparent;
      color: #fff;
      border: none;
      box-shadow: unset;
      font-size: 16px;
    }

    .is-active .el-radio-button__inner {
      font-weight: bold;
      background-image: url(../../../assets/img/802.png);
      border: none;
    }
  }
}
.dialog-footer{
  text-align: center;
}
</style>