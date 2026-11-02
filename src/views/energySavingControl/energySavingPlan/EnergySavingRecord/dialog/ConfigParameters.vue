<template>
  <el-dialog :visible.sync="dataFlag" title="参数配置" width="1280px" :before-close="handleBeforeClose" top="3vh">
    <template #header>
      <el-divider class="curDivider" direction="vertical" />
      <span class="el-dialog__title">参数配置</span>
    </template>
    <el-form ref="formC" :model="form" label-width="115px" label-position="left" inline>
      <p class="title_text">
        <span>{{ deviceNameList[0] ? deviceNameList[0].typeName : "" }}</span>
      </p>
      <el-row>
        <el-col :span="8">
          <el-form-item label="数量">
            <el-input v-model="form.chillerLNum" style="width: 225px" placeholder="请输入">
              <template #append> 台 </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="额定冷量">
            <el-input v-model="form.chillerLEnergy" style="width: 225px" placeholder="请输入">
              <template #append> kW </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="COP">
            <el-input v-model="form.chillerLCop" style="width: 153px" placeholder="请输入"> </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <p class="title_text">
        <span>{{ deviceNameList[1] ? deviceNameList[1].typeName : "" }}</span>
      </p>
      <el-row>
        <el-col :span="8">
          <el-form-item label="数量">
            <el-input v-model="form.chillerSNum" style="width: 225px" placeholder="请输入">
              <template #append> 台 </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="额定冷量">
            <el-input v-model="form.chillerSEnergy" style="width: 225px" placeholder="请输入">
              <template #append> kW </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="COP">
            <el-input v-model="form.chillerSCop" style="width: 153px" placeholder="请输入"> </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <p class="title_text">
        <span>{{ deviceNameList[2] ? deviceNameList[2].typeName : "" }}</span>
      </p>
      <el-row>
        <el-col :span="8">
          <el-form-item label="数量">
            <el-input v-model="form.gshpNum" style="width: 225px" placeholder="请输入">
              <template #append> 台 </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="额定冷量">
            <el-input v-model="form.gshpEnergyCool" style="width: 225px" placeholder="请输入">
              <template #append> kW </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="制冷COP">
            <el-input v-model="form.gshpCopCool" style="width: 153px" placeholder="请输入"> </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="额定热量">
            <el-input v-model="form.gshpEnergyHot" style="width: 225px" placeholder="请输入">
              <template #append> kW·h </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="制热COP">
            <el-input v-model="form.gshpCopHot" style="width: 153px" placeholder="请输入"> </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <p class="title_text">
        <span>{{ deviceNameList[3] ? deviceNameList[3].typeName : "" }}</span>
      </p>
      <el-row>
        <el-col :span="8">
          <el-form-item label="数量">
            <el-input v-model="form.ashpNum" style="width: 225px" placeholder="请输入">
              <template #append> 台 </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="额定冷量">
            <el-input v-model="form.ashpEnergyCool" style="width: 225px" placeholder="请输入">
              <template #append> kW </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="制冷COP">
            <el-input v-model="form.ashpCopCool" style="width: 153px" placeholder="请输入"> </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="额定热量">
            <el-input v-model="form.ashpEnergyHot" style="width: 225px" placeholder="请输入">
              <template #append> kW </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="制热COP">
            <el-input v-model="form.ashpCopHot" style="width: 153px" placeholder="请输入"> </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <p class="title_text">
        <span>{{ deviceNameList[4] ? deviceNameList[4].typeName : "" }}</span>
      </p>
      <el-row>
        <el-col :span="8">
          <el-form-item label="数量">
            <el-input v-model="form.boilerNum" style="width: 225px" placeholder="请输入">
              <template #append> 台 </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="额定热量">
            <el-input v-model="form.boilerEnergy" style="width: 225px" placeholder="请输入">
              <template #append> kW </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="额定燃气">
            <el-input v-model="form.boilerGas" style="width: 153px" placeholder="请输入"> </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <!--其他参数-->
      <p class="title_text" style="margin-bottom: 20px;"><span>其他参数</span></p>
      <div>
        <el-form-item v-for="item in otherSetList" :key="item.id" :label="item.typeName">
          <el-input v-model="item.configValue" style="width: 225px" placeholder="请输入">
            <template #append>
              {{ item.unit }}
            </template>
          </el-input>
        </el-form-item>
      </div>
    </el-form>
    <template #footer>
      <div class="dialog-foot">
        <el-button  color="#e6e6e6" class="cancel-btn" @click="cancel"> 取 消 </el-button>
        <el-button  class="confirm-btn" @click="submit"> 确 定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { getAiConfigType, getAiConfigOtherType, getEnergySupply, saveEnergySupply } from "@/api/energy-saving-plan.js";

export default {
  props: {
    buildType: {
      type: String,
    },
    dataFlag: {
      type: Boolean,
    },
  },
  data() {
    return {
      form: {
        chillerLNum: "",
        chillerLEnergy: "",
        chillerLCop: "",
        chillerSNum: "",
        chillerSEnergy: "",
        chillerSCop: "",
        gshpNum: "",
        gshpEnergyCool: "",
        gshpCopCool: "",
        gshpEnergyHot: "",
        gshpCopHot: "",
        ashpNum: "",
        ashpEnergyCool: "",
        ashpCopCool: "",
        ashpEnergyHot: "",
        ashpCopHot: "",
        boilerNum: "",
        boilerEnergy: "",
        boilerGas: "",
      },
      deviceNameList: [],
      otherSetList: [],
    };
  },
  mounted() {},
  watch: {
    buildType: function (newVal) {
      this.getData();
      // 获取上次设置
      getEnergySupply(newVal).then((res) => {
        if (res && res.data) {
          this.form = res.data;
        }
      });
    },
  },
  methods: {
    handleBeforeClose() {
      this.cancel();
    },
    cancel() {
      this.$emit("close");
    },
    submit() {
      this.otherSetList.forEach((e) => {
        this.$set(this.form, `${e.typeCode}`, e.configValue);
      });
      saveEnergySupply(this.form).then((res) => {
        if (res.code === 200) this.$message.success("配置成功");
      });
      this.$emit("close");
    },
    getData() {
      getAiConfigType().then((res) => {
        if (res) {
          this.deviceNameList = res.data;
        }
      });
      getAiConfigOtherType(this.buildType).then((res) => {
        if (res) {
          this.otherSetList = res.data;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.title_text {
  color: #fff;
  margin-top: 25px;
  font-size: 15px;
}

.title_text:first-child {
  margin-top: 0px;
}

:deep(.el-dialog__body) {
  // height: 600px;
}

:deep(.el-input-group__append) {
  text-align: center;
  background-color: #1e2a45;
  color: #fff;
  border: none;
}

:deep(.cop .el-input__inner) {
  width: 275px;
}

:deep(.el-form-item.other_label) {
  > label {
    width: 170px !important;
  }
}

:deep(.el-form-item) {
  .el-form-item__label {
    font-size: 13px;
  }
}

:deep(.el-input) {
  .el-input-group__append {
    width: 72px;
    text-align: left;
  }
}
.dialog-foot{
  text-align: center;
}
</style>
