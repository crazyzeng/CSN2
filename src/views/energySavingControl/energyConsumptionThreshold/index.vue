<!-- 区域能耗阈值 -->
<template>
  <section class="container_warp">
    <section class="container_box">
      <el-divider class="curDivider" direction="vertical" />
      <wl-main-title data-title="区域能耗阈值"></wl-main-title>
      <el-main>
        <section class="content_warp">
          <section class="title_wj">
            <span class="content_title">{{ curMonth }}区域能耗阈值</span>

            <div class="ml-10">
              <span class="mr-2">时间选择</span>
              <el-date-picker
                size="mini"
                prefix-icon="test"
                @focus="dateFocus"
                v-model="formData.month"
                value-format="yyyy-MM"
                type="month"
                format="MM"
                placeholder="切换月份"
                class="monthSelect"
                :clearable="false"
              >
              </el-date-picker>
            </div>
            <el-button type="primary" icon="el-icon-search" class="query_Btn" @click="query">查询</el-button>
            <el-button type="primary" icon="el-icon-search" class="query_Btn" @click="reset">重置</el-button>
          </section>
          <el-form :inline="true" class="demo-form-inline" style="float: right; position: relative; top: -25px">
            <el-form-item style="margin-right: 0;">
              <el-button class="edit_Btn border-btn b-b-b" v-if="!isEdit" @click="editData">编辑</el-button>
              <el-button class="edit_Btn border-btn b-b-b" v-else @click="saveData">保存</el-button>
              <el-button class="copyBtn border-btn b-b-b" @click="copyData">复制数据</el-button>
            </el-form-item>
          </el-form>
          <section class="content_main">
            <section class="content_left" v-for="(item, label) in areaData" :key="label">
              <p>
                <span class="address_icon">&nbsp;&nbsp;{{ label }}</span
                ><span class="line"></span>
              </p>
              <ul>
                <li v-for="(energyItem, innerLabel) in item" :key="innerLabel" :class="energyItem.length <= 0 ? 'isShow' : ''">
                  <p class="wj_l1" v-if="innerLabel === 'ENERGY_ELECTRIC'"><span class="l1_icon iconfont icon-goumai-shandian"></span>用电(kWh)</p>
                  <p class="wj_l1" v-else-if="innerLabel === 'ENERGY_WATER'"><span class="l2_icon iconfont icon-lushuixian"></span>用水(吨)</p>
                  <p class="wj_l1" v-else-if="innerLabel === 'ENERGY_HEAT'"><span class="l3_icon iconfont icon-sen018"></span>用热(GJ)</p>
                  <p class="wj_l1" v-else><span class="l4_icon iconfont icon-shouye-keranqitijiancebaojingxitong1"></span>用气(m³)</p>
                  <p class="wj_l2" v-for="areaItem in energyItem" :key="areaItem.orgId">
                    <span class="l2_label">{{ areaItem.orgName }}</span>
                    <span class="l2_value" v-show="!isEdit">{{ areaItem.threshold }}</span>
                    <input type="text" v-show="isEdit" v-model="areaItem.threshold" required />
                  </p>
                </li>
              </ul>
            </section>
          </section>
        </section>
        <el-dialog title="复制数据至" :visible.sync="dialogVisible" width="650px" center custom-class="custom_dialog" :before-close="handleClose">
          <section class="dialog_content">
            <el-checkbox-group v-model="checkList">
              <el-checkbox v-for="item in checkItem" :label="item.label" :key="item.value" :disabled="new Date().getMonth() + 1 == item.label">{{
                monthTrans(item.label)
              }}</el-checkbox>
            </el-checkbox-group>
          </section>
          <span slot="footer" class="dialog-footer">
            <el-button class="confirm-btn" type="primary" @click="handleCopy">应 用</el-button>
            <el-button class="cancel-btn" type="primary" @click="dialogVisible = false">取 消</el-button>
          </span>
        </el-dialog>
      </el-main>
    </section>
  </section>
</template>

<script>
import { copyData, getThresholdData, editThresholdData, getThresholdValue } from "@/api/consumption-threshold.js";
import { numberTransfer } from "@/utils";
import dayjs from "dayjs";
export default {
  data() {
    return {
      formData: {
        month: null,
      },
      list: {
        month: [],
      },
      energyType: {
        ENERGY_ELECTRIC: "用电",
        ENERGY_WATER: "用水",
        ENERGY_GAS: "用气",
        ENERGY_HEAT: "用热",
      },
      isEdit: false,
      leftForm: {
        threshold: "",
        orgId: "",
        energyType: "",
        month: "",
      },
      checkItem: [
        {
          label: "1",
        },
        {
          label: "2",
        },
        {
          label: "3",
        },
        {
          label: "4",
        },
        {
          label: "5",
        },
        {
          label: "6",
        },
        {
          label: "7",
        },
        {
          label: "8",
        },
        {
          label: "9",
        },
        {
          label: "10",
        },
        {
          label: "11",
        },
        {
          label: "12",
        },
      ],
      checkList: [],
      dialogVisible: false,
      curMonth: "",
      areaData: {},
      thresholdData: [],
    };
  },

  components: {},

  computed: {},

  mounted() {
    this.init();
  },

  methods: {
    init() {
      this.curMonth = numberTransfer(new Date().getMonth() + 1) + "月";
      this.formData.month = dayjs().format("YYYY-MM");
      this.getData();
    },
    monthTrans(data) {
      return numberTransfer(data) + "月";
    },
    saveData() {
      const data = this.serializeData(this.areaData);
      editThresholdData(data).then((res) => {
        if (res.code == 200) {
          this.$message.success("保存成功!");
          this.isEdit = false;
          this.getData();
        }
      });
    },
    dateFocus() {
      this.$nextTick(() => {
        let prevBtn = document.getElementsByClassName("el-picker-panel__icon-btn el-date-picker__prev-btn el-icon-d-arrow-left")[0];
        let nextBtn = document.getElementsByClassName("el-picker-panel__icon-btn el-date-picker__next-btn el-icon-d-arrow-right")[0];
        let yearBtn = document.getElementsByClassName("el-date-picker__header-label")[0];
        let yearText = yearBtn.innerHTML.substr(0, 4);
        if (yearText == new Date().getFullYear()) {
          nextBtn.disabled = "disabled";
          prevBtn.disabled = "disabled";
          yearBtn.style.pointerEvents = "none";
          nextBtn.style.display = "none";
          prevBtn.style.display = "none";
        }
      });
    },
    editData() {
      this.isEdit = true;
    },
    copyData() {
      this.dialogVisible = true;
    },
    handleCopy() {
      this.dialogVisible = false;
      copyData(this.checkList, new Date().getMonth() + 1).then((res) => {
        if (res.code === 200) {
          this.$message.success("复制成功");
          this.dialogVisible = false;
          this.checkList = [];
        }
      });
    },
    handleClose() {
      this.dialogVisible = false;
    },
    // 区域和阈值保存时序列化
    serializeData(data) {
      let tempArr = [];
      let tempArr1 = Object.values(data);
      tempArr1.forEach((v) => {
        tempArr.push(Object.values(v));
      });
      let tempArr2 = tempArr.flat();
      let tempArr3 = tempArr2.filter((v) => {
        return v !== null;
      });
      let tempArr4 = tempArr3.flat();
      let tempArr5 = tempArr4.map((v) => {
        const tempObj = {};
        this.thresholdData.forEach((w) => {
          if (v.orgId === w.orgId) {
            v.id = w.id;
          }
        });
        tempObj.threshold = v.threshold || "";
        tempObj.orgId = v.orgId;
        tempObj.energyType = v.energyType;
        tempObj.id = v.id;
        tempObj.month = dayjs(this.formData.month).format("M");
        return tempObj;
      });
      return tempArr5;
    },
    // 区域和阈值合并
    concatDataAndArea(data) {
      let tempArr = [];
      let tempArr1 = Object.values(data);
      tempArr1.forEach((v) => {
        tempArr.push(Object.values(v));
      });
      let tempArr2 = tempArr.flat();
      let tempArr3 = tempArr2.filter((v) => {
        return v !== null;
      });
      let tempArr4 = tempArr3.flat();
      tempArr4.forEach((v) => {
        this.thresholdData.forEach((w) => {
          if (v.orgId === w.orgId) {
            v.threshold = w.threshold;
            v.id = w.id;
          }
        });
      });
      this.$forceUpdate();
    },
    getAreaData(month) {
      getThresholdData().then((res) => {
        if (res.code === 200 && res.data) {
          this.areaData = res.data;
          this.getThresholdVal(month);
        }
      });
    },
    getData() {
      const curMonth = dayjs(this.formData.month).format("M");
      this.getAreaData(curMonth);
    },
    query() {
      const month = dayjs(this.formData.month).format("M");
      this.getAreaData(month);
    },
    reset() {
      this.formData.month = dayjs().format("YYYY-MM");
      const tempMonth = new Date().getMonth() + 1;
      const curMonth = tempMonth.toString().replace("0", "");
      this.getAreaData(curMonth);
    },
    getThresholdVal(month) {
      getThresholdValue(month).then((res) => {
        if (res.code === 200 && res.data.length > 0) {
          this.thresholdData = res.data;
          this.concatDataAndArea(this.areaData);
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.isShow {
  display: none;
}

span.l2_label {
  //   width: 100px;
  text-align: left;
}

span.l2_value {
  //   width: 90px;
  text-align: left;
}

.container_warp {
  width: 100%;
  height: 100%;
}

.container_box {
  height: 100%;
  overflow: auto;
  min-width: 1740px;
}

.content_warp {
  height: 100%;
  background: #1e2a45;
  width: calc(100% - 40px);
  margin-left: 20px;
  border-radius: 8px;
  padding-top: 30px;
  padding-left: 20px;
  padding-right: 20px;
}

.el-main {
  height: calc(100% - 60px);
}

.content_title {
  display: block;
  width: 223px;
  height: 27px;
  line-height: 27px;
  text-indent: 20px;
  background-image: url(../../../assets/img/title_bg.png);
}

.title_wj {
  display: flex;
}
.query_Btn {
  border-radius: 15px !important;
  background-color: #364d79;
  color: #fff;
  border: none;
  margin-left: 10px;
}

.edit_Btn,
.copyBtn {
  width: 80px;
  height: 30px;
  border-radius: 15px;
  background-color: #364d79;
  color: #fff;
  border: none;
}

::v-deep.el-date-editor.el-input {
  width: 100px;

  .el-input__inner {
    padding: 0;
    text-align: center;
  }
}

section.content_main {
  clear: both;
  width: 100%;
  height: calc(100% - 88px);
  display: flex;
  justify-content: space-between;

  section.content_left {
    width: 49%;

    > p {
      > span {
        display: inline-block;
        vertical-align: middle;
      }

      .address_icon {
        background-image: url("../../../assets/img/address.png");
        background-repeat: no-repeat;
        width: 100px;
        height: 32px;
        line-height: 32px;
        padding-left: 26px;
        font-size: 22px;
      }

      span.line {
        width: calc(100% - 100px);
        height: 1px;
        background-color: #535e7d;
      }
    }

    > ul {
      display: flex;
      justify-content: flex-start;
      margin: 20px 0 0 0;

      > li:not(:first-child) {
        margin-left: 16px;
      }

      > li {
        width: 200px;
        height: 328px;
        background-color: #2a3e62;
        border-radius: 8px;

        > p:nth-child(1) {
          padding: 20px;
          font-size: 20px;

          > span {
            display: inline-block;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            text-align: center;
            vertical-align: middle;
            line-height: 36px;
            font-size: 25px;
            margin-right: 20px;
          }

          .l1_icon {
            background-image: linear-gradient(137deg, #00ebcc, #00bae0);
          }

          .l2_icon {
            background-image: linear-gradient(0deg, #5880fb, #26cde5);
          }

          .l3_icon {
            background-image: linear-gradient(0deg, #f59ccf, #f9bfa4);
          }

          .l4_icon {
            background-image: linear-gradient(0deg, #8357fc, #baa9eb);
          }
        }

        > p {
          padding: 5px 5px 10px 5px;
          text-align: center;

          > input[type="text"] {
            width: calc(100% - 100px);
            background-color: #365074;
            outline: none;
            border: none;
            border-radius: 4px;
            color: #fff;
            padding: 0 5px;
            height: 25px;
          }

          > span {
            display: inline-block;
            // width: 100px;
            height: 25px;
            line-height: 25px;
          }

          > span:nth-child(2) {
            // width: 90px;
          }
        }
      }
    }
  }

  section.content_right {
    width: 49%;

    > p {
      > span {
        display: inline-block;
        vertical-align: middle;
      }

      .address_icon {
        background-image: url("../../../assets/img/address.png");
        background-repeat: no-repeat;
        width: 100px;
        height: 32px;
        line-height: 32px;
        padding-left: 26px;
        font-size: 22px;
      }

      span.line {
        width: calc(100% - 100px);
        height: 1px;
        background-color: #535e7d;
      }
    }

    > ul {
      display: flex;
      justify-content: space-between;
      margin: 20px 0 0 0;

      > li {
        width: 200px;
        height: 328px;
        background-color: #2a3e62;
        border-radius: 8px;

        > p:nth-child(1) {
          font-size: 20px;
          padding: 20px;

          > span {
            display: inline-block;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            text-align: center;
            vertical-align: middle;
            line-height: 36px;
            font-size: 25px;
            margin-right: 20px;
          }

          .l1_icon {
            background-image: linear-gradient(90deg, #00ebcc, #00bae0);
          }

          .l2_icon {
            background-image: linear-gradient(0deg, #5880fb, #26cde5);
          }

          .l3_icon {
            background-image: linear-gradient(0deg, #f59ccf, #f9bfa4);
          }

          .l4_icon {
            background-image: linear-gradient(0deg, #8357fc, #baa9eb);
          }
        }

        > p {
          padding: 5px 10px 10px 20px;

          > input[type="text"] {
            width: calc(100% - 70px);
            background-color: #365074;
            outline: none;
            border: none;
            border-radius: 4px;
            color: #fff;
            padding: 0 5px;
            height: 25px;
          }

          > span {
            display: inline-block;
            width: 70px;
            height: 25px;
            line-height: 25px;
          }
        }
      }
    }
  }
}

.el-button--primary {
  border-radius: 3px;
}

::v-deep.el-dialog__wrapper {
  .el-dialog__header {
    background-color: #243e62;
  }

  .el-dialog__body {
    background-color: #1d2f4b;
  }

  .el-dialog__footer {
    background-color: #243e62;
  }
}

::v-deep.el-dialog {
  border-radius: 6px;
}

.el-checkbox {
  width: 66px;
  margin-bottom: 20px;
  color: #fff;
}
::v-deep {
  .monthSelect {
    .el-input__inner {
      width: 90px !important;
    }
  }
}
.wj_l2 {
  display: flex;
  justify-content: space-around;
}
</style>
