<!-- 账单管理--计价规则 -->
<template>
  <el-dialog :visible.sync="dataFlag" width="680px" :before-close="dialogClose" :close-on-click-modal="false" :show-close="false" center>
    <div slot="title" class="dialog-header">计价规则</div>
    <el-form ref="form" :model="formData" :rule="rules" label-width="80px">
      <el-form-item
        :label="item.ruleType"
        v-for="(item, index) in formData.ruleList"
        :key="item.ruleType"
        :rules="{ required: true, message: '请选择时间', trigger: 'blur' }"
      >
        <el-row style="margin-top: 8px" v-for="(item, i) in item.intervals" :key="i">
          <el-time-select
            v-model="item.startTime"
            :picker-options="{
              start: '00:00',
              step: '01:00',
              end: '23:59',
            }"
            placeholder="选择日期"
          >
          </el-time-select>
          <span style="margin: 0 15px; font-size: 16px; color: #fff">至</span>
          <el-time-select
            v-model="item.endTime"
            :picker-options="{
              start: '00:00',
              step: '01:00',
              end: '23:59',
            }"
            placeholder="选择日期"
          >
          </el-time-select>
          <i class="el-icon-circle-plus-outline custom_btn" @click="peakAdd(index)"></i>
          <i v-show="!i == 0" class="el-icon-remove-outline custom_btn" @click="peakReduce(index, i)"></i>
        </el-row>
        <el-row style="margin-top: 15px" class="flex">
          <el-input
            v-model="formData.ruleList[index].price"
            style="width: 200px"
            @change="checkPrice(formData.ruleList[index].price, index)"
          ></el-input>
          <span style="margin-left: 15px; color: #fff; display: inline-block; width: 200px">单价（元/千瓦时）</span>
        </el-row>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button class="confirm-btn" type="primary" @click="save">保存</el-button>
      <el-button class="cancel-btn" type="primary" @click="dialogClose">返回</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { fetchDegreeRule, updateDegreeRule } from "@/api/bill-management.js";
export default {
  components: {},
  props: {
    dataFlag: {
      type: Boolean,
      required: false,
    },
  },
  data() {
    return {
      dialogVisible: true,
      formData: {
        ruleList: [
          {
            ruleType: "尖",
            applyStartDate: "",
            applyEndDate: "",
            intervals: [{ startTime: "", endTime: "" }],
            price: "",
          },
          {
            ruleType: "峰",
            applyStartDate: "",
            applyEndDate: "",
            intervals: [{ startTime: "", endTime: "" }],
            price: "",
          },
          {
            ruleType: "平",
            applyStartDate: "",
            applyEndDate: "",
            intervals: [{ startTime: "", endTime: "" }],
            price: "",
          },
          {
            ruleType: "谷",
            applyStartDate: "",
            applyEndDate: "",
            intervals: [{ startTime: "", endTime: "" }],
            price: "",
          },
        ],
      },
      rules: {
        startTime: [{ required: true, message: "请选择时间", trigger: "blur" }],
      },
    };
  },

  computed: {},

  mounted() {
    this.getData();
  },

  methods: {
    getData() {
      fetchDegreeRule().then((res) => {
        if (res && res.data.length > 0) this.formData.ruleList = res.data;
      });
    },
    checkPrice(val, i) {
      let checkPlan = "" + val;
      checkPlan = checkPlan
        .replace(/[^\d.]/g, "") // 清除“数字”和“.”以外的字符
        .replace(/[.]$/, "") //清除最后一个.
        .replace(/\.{2,}/g, ".") // 只保留第一个. 清除多余的
        .replace(/^\./g, "") // 保证第一个为数字而不是.
        .replace(".", "$#$")
        .replace(/\./g, "")
        .replace("$#$", ".");
      if (checkPlan.indexOf(".") < 0 && checkPlan !== "") {
        checkPlan = parseFloat(checkPlan) + "";
      } else if (checkPlan.indexOf(".") >= 0) {
        checkPlan = checkPlan.replace(/^()*(\d+)\.(\d\d).*$/, "$1$2.$3"); // 只能输入两个小数
      }
      this.formData.ruleList[i].price = Number(checkPlan);
    },
    save() {
      this.formData.ruleList.price - 0;
      updateDegreeRule(this.formData.ruleList).then((res) => {
        if (res && res.code === 200) {
          this.$message.success("保存成功");
          this.$emit("dialog2Save");
        }
      });
    },
    dialogClose() {
      this.$emit("dialog2Cancel");
      this.$refs["form"].resetFields();
      this.formData.ruleList.intervals = [{ startTime: "", endTime: "" }];
    },
    peakAdd(i) {
      this.formData.ruleList[i].intervals.push({ startTime: "", endTime: "" });
    },
    peakReduce(index, i) {
      this.formData.ruleList[index].intervals.splice(i, 1);
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep {
  .el-dialog {
    border-radius: 10px 10px 10px 10px;
    background-color: #1d2f4b;
  }

  .el-dialog__header {
    background: #243e62;
    border-radius: 10px 10px 0px 0px;
    color: #fff;
    // text-align: center;
    padding-top: 0;
    padding-bottom: 0;
    height: 44px;
    font-size: 20px;
  }

  .el-form-item__label {
    text-align: left;
  }

  // .el-input {
  //   width: 160px;
  // }

  .singleChoice {
    .el-form-item__content {
      margin-left: 0 !important;
      text-align: center;

      .el-radio {
        color: #fff;
      }
    }
  }

  .el-checkbox__label {
    color: #fff;
  }
}

.dialog-header {
  height: 44px;
  line-height: 44px;
}

.el-icon-circle-plus-outline,
.el-icon-remove-outline {
  font-size: 20px;
  color: #fff;
  margin-left: 15px;
  cursor: pointer;
}
</style>
