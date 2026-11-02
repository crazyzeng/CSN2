<!-- 日程控制设置 -->
<template>
  <section class="container_warp">
    <el-divider class="curDivider" direction="vertical" />
    <section class="page-title">
      <p>
        <!-- <el-button icon="el-icon-arrow-left" style="font-size: 14px; color: #eee" type="text" @click="$router.push('devicePlan')">返回</el-button> -->
        <span>日程控制设置</span>
      </p>
      <p style="position: absolute; right: 24px; top: 4px">
        <el-button type="primary" icon="" v-if="!disabled"  @click="save" size="small">保 存</el-button>
        <el-button type="primary" icon="" class="border-btn b-b-b" @click="$router.push('devicePlan')" size="small">返 回</el-button>
      </p>
    </section>
    <el-form :inline="false" ref="formRef" :model="formData" label-width="90px" :rules="rules" label-position="left" class="demo-form-inline">
      <el-form-item label="日程名称" prop="configName">
        <el-input v-model="formData.configName" :disabled="disabled" placeholder="请输入日程名称" style="width: 240px"></el-input>
      </el-form-item>
      <el-form-item label="执行时间" prop="executeDateRange">
        <el-date-picker
          v-model="formData.executeDateRange"
          ref="timeRef"
          :disabled="disabled"
          style="width: 240px"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="executeTimeChange"
          value-format="yyyy/MM/dd"
          format="yyyy-MM-dd"
        >
        </el-date-picker>
        <el-tag
          v-for="tag in executeTimeArr"
          :class="disabled ? 'disabled_ele' : ''"
          :key="tag"
          closable
          :disable-transitions="false"
          @close="executeTimeArrRemove(tag)"
        >
          {{ tag }}
        </el-tag>
        <el-button icon="el-icon-plus" circle @click="timeAdd" class="ml-5"></el-button>
      </el-form-item>
      <el-form-item label="周期" prop="cycleMode">
        <el-select
          v-model="formData.cycleMode"
          :disabled="disabled"
          style="width: 240px; vertical-align: top"
          placeholder=""
          @change="cycleModeChange()"
        >
          <el-option v-for="item in loopTimeOptions" :key="item.itemValue" :label="item.itemText" :value="item.itemValue"></el-option>
        </el-select>
        <ul class="ul_cus" v-if="formData.cycleMode === 'WEEK'">
          <li v-for="(item, index) in weekList" :key="item.label" class="li_cus">
            <span class="week_btn" :class="item.curIndex ? 'active' : ''" @click="weekItemClick(item)">{{ item.label }}</span>
          </li>
          <li class="li_cus"><span class="week_btn active" @click="selectAll">全选</span></li>
        </ul>
      </el-form-item>
    </el-form>
    <section style="margin: 8px 0; float: right; height: 45px; width: 100%">
      <el-button class="border-btn b-b-b" type="primary" icon="el-icon-delete" v-show="!disabled" @click="delDevice">删除设备</el-button>
      <el-button class="border-btn b-b-b" type="primary" icon="el-icon-plus" v-show="!disabled" @click="addDevice">新增设备</el-button>
    </section>
    <section style="height: calc(100% - 326px); text-align: center">
      <el-table
        :data="tableData"
        ref="tableRef"
        :key="Math.random()"
        height="calc(95%)"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column align="center" type="selection" width="60"> </el-table-column>
        <el-table-column align="center" type="index" label="序号" width="80"></el-table-column>
        <el-table-column align="center" prop="equipmentName" label="设备名称" width="300"></el-table-column>
        <el-table-column align="center" prop="equipmentNumber" label="设备编号" width="200"></el-table-column>
        <el-table-column align="center" prop="executeDetail" label="日程设置" width="">
          <template #default="{ row, $index }">
            <section v-for="(item, index) in row.executeDetail" :key="index" class="cus_section">
              <el-time-picker
                v-model="item.executeTime"
                :disabled="disabled"
                value-format="HH:mm:ss"
                :picker-options="{}"
                style="margin-left: 15px"
                placeholder="任意时间点"
              >
              </el-time-picker>
              <el-select v-model="item.valueSet" :disabled="disabled" placeholder="请选择" style="padding-right: 5px;">
                <el-option v-for="opt in options" :key="opt.value" :label="opt.label" :value="opt.value"> </el-option>
              </el-select>
              <div style="width:100px" class="flex flex-start">
                <el-button icon="el-icon-plus" circle @click="add($index)" style="color: #fff" :disabled="disabled"></el-button>
                <el-button v-if="index !== 0" circle type="danger" icon="el-icon-delete" @click="del(row, index)" :disabled="disabled"></el-button>
              </div>
            </section>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="float: right; margin-top: 20px"
        background
        layout="total,prev, pager, next,sizes"
        @current-change="pageChange"
        :current-page="paging.pageNo"
        :page-size="paging.pageSize"
        @size-change="handleSizeChange"
        :page-sizes="[10, 20, 50, 100, 500]"
        :total="paging.total"
      >
      </el-pagination>
    </section>
    <AddDeviceModal ref="addModalRef" @update-data="getDetails"></AddDeviceModal>
  </section>
</template>
<script>
import { getExecuteConfigDetail, addExecuteConfig, updateExecuteConfig } from "@/api/equipment-plan.js";
import AddDeviceModal from "./AddDeviceModal.vue";
import { deepClone } from "@/utils/index";
export default {
  data() {
    return {
      paging: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      formData: {
        configName: "",
        executeDateRange: "",
        cycleMode: "DAY",
        cycleWeekNum: "",
        details: [],
      },
      options: [
        {
          value: 1,
          label: "开启",
        },
        {
          value: 0,
          label: "关闭",
        },
      ],
      loopTimeOptions: [
        { itemText: "每日重复", itemValue: "DAY" },
        { itemText: "每周重复", itemValue: "WEEK" },
      ],
      tableData: [],
      weekList: [
        {
          label: "周一",
          value: 1,
          curIndex: false,
        },
        {
          label: "周二",
          value: 2,
          curIndex: false,
        },
        {
          label: "周三",
          value: 3,
          curIndex: false,
        },
        {
          label: "周四",
          value: 4,
          curIndex: false,
        },
        {
          label: "周五",
          value: 5,
          curIndex: false,
        },
        {
          label: "周六",
          value: 6,
          curIndex: false,
        },
        {
          label: "周日",
          value: 7,
          curIndex: false,
        },
      ],
      isAll: true,
      executeTimeArr: [],
      selectedData: [],
      disabled: false,
      multipleSelectArray: [],
      rules: {
        configName: [{ required: true, message: "请输入日程名称", trigger: "blur" }],
        executeDateRange: [{ required: true, message: "请选择执行时间", trigger: "blur" }],
        cycleMode: [{ required: true, message: "请选择执行周期", trigger: "change" }],
      },
    };
  },
  components: { AddDeviceModal },

  computed: {},

  mounted() {
    this.init();
  },
  methods: {
    init() {
      const curId = this.$route.query.id;
      const type = this.$route.query.type;
      if (curId) this.getDetail(curId);
      if (type == "detail") this.disabled = true;
    },
    getDetail(id) {
      getExecuteConfigDetail(id).then((res) => {
        if (res.code === 200 && res.data) {
          this.echoData(res.data);
        }
      });
    },
    echoData(data) {
      this.formData.configName = data.configName;
      this.formData.cycleMode = data.cycleMode;
      this.formData.executeDateRange = [data.executeDateRange[0].split("-")[0], data.executeDateRange[0].split("-")[1]];
      this.executeTimeArr = data.executeDateRange;
      if (data.cycleWeekNum.length > 0) {
        data.cycleWeekNum.split(",").forEach((v) => {
          this.weekList.forEach((w) => {
            if (v == w.value) w.curIndex = true;
          });
        });
      }
      this.tableData = data.details;
      this.paging.total = this.tableData.length;
    },
    addDevice() {
      this.$refs.addModalRef?.open({});
    },
    delDevice() {
      if (this.selectedData.length === 0) {
        this.$message.warning("请选择要删除的设备");
        return;
      } else {
        this.$confirm("确定删除该设备及其日程？", "提示", { type: "warning",confirmButtonClass:'confirm-btn ',
        cancelButtonClass:'cancel-btn ',  })
          .then(() => {
            this.tableData = this.tableData.filter((item, index) => {
              return !this.multipleSelectArray.includes(item.id);
            });
            this.paging.total = this.tableData.length;
          })
          .catch(() => {});
      }
    },
    pageChange(e) {
      this.paging.pageNo = e;
      this.getData();
    },
    handleSizeChange(e) {
      this.paging.pageSize = e;
      this.getData();
    },
    save() {
      this.$refs.formRef?.validate((valid) => {
        if (valid && this.tableData.length > 0) {
          const tempArr = deepClone(this.tableData);
          tempArr.forEach((v) => {
            delete v.equipmentName;
            delete v.equipmentNumber;
          });
          this.formData.details = tempArr;
          this.formData.executeDateRange = this.executeTimeArr;
          const type = this.$route.query.type;
          const curId = this.$route.query.id;
          if (type === "edit") {
            if (this.formData.cycleMode === "WEEK") this.getWeekNum();
            this.formData.details = this.tableData;
            this.formData.id = curId;
            updateExecuteConfig(this.formData).then((res) => {
              if (res.code === 200) {
                this.$message.success("编辑成功");
                this.$router.push("devicePlan");
              }
            });
          } else {
            addExecuteConfig(this.formData).then((res) => {
              if (res.code === 200) {
                this.$message.success("保存成功");
                this.$router.push("devicePlan");
              }
            });
          }
        }
      });
    },

    getWeekNum() {
      const tempArray = [];
      const tempArr = this.weekList.filter((v) => {
        if (v.curIndex) return v.value;
      });
      tempArr.forEach((v) => {
        tempArray.push(v.value);
      });
      this.formData.cycleWeekNum = tempArray.join(",");
    },
    weekItemClick(item) {
      item.curIndex = !item.curIndex;
      this.getWeekNum();
    },
    selectAll() {
      this.weekList.forEach((v) => {
        v.curIndex = this.isAll;
      });
      let tempArr = [];
      if (this.isAll) tempArr = this.weekList;
      else tempArr = [];
      const tempArray = [];
      tempArr.forEach((v) => {
        tempArray.push(v.value);
      });
      this.formData.cycleWeekNum = tempArray.join(",");
      this.isAll = !this.isAll;
    },
    executeTimeArrRemove(e) {
      this.executeTimeArr.splice(this.executeTimeArr.indexOf(e), 1);
    },
    executeTimeChange() {
      this.executeTimeArr.push(this.formData.executeDateRange[0] + "-" + this.formData.executeDateRange[1]);
    },
    timeAdd() {
      this.$refs.timeRef.focus();
    },
    getDetails(e, e1) {
      e[0].equipmentName = e1[0].equipmentName;
      e[0].equipmentNumber = e1[0].equipmentNumber;
      const tempArr = deepClone(e);
      this.formData.details = e;
      this.tableData = this.tableData.concat(tempArr);
      this.paging.total = this.tableData.length;
    },
    cycleModeChange() {
      if (this.formData.circleMode === "DAY") this.formData.cycleWeekNum = "";
    },
    handleSelectionChange(e) {
      this.selectedData = e;
      e.forEach((item) => {
        this.multipleSelectArray.push(item.id);
      });
    },
    add(index) {
      this.tableData[index].executeDetail.push({
        executeTime: "",
        valueSet: "",
        pointId: this.tableData[index].executeDetail[0].pointId,
      });
      this.$refs.tableRef?.doLayout();
      this.$forceUpdate();
    },
    del(data, index) {
      data.executeDetail.splice(index, 1);
    },
  },
};
</script>
<style lang="scss" scoped>
.custom_btn {
  font-size: 16px;
  border-radius: 18px;
}

.disabled_ele {
  pointer-events: none;
}

::v-deep.el-input.is-disabled {
  .el-input__inner {
    color: #fff;
  }
}

::v-deep.el-select .el-input.is-disabled {
  .el-input__inner {
    color: #fff;
  }
}

// ::v-deep.el-range-editor.is-disabled {
//   background-color: #293852;

//   input {
//     background-color: #293852;
//   }
// }

.cus_section {
  // width: 301px;
  display: flex;
  justify-content: space-evenly;
  margin-bottom: 5px;
  // display: inline-block;
}

.ul_cus {
  display: inline-block;
  margin-left: 20px;
  list-style: none;
}

.li_cus {
  float: left;
  width: 50px;
  height: 30px;
}

.week_btn {
  display: block;
  width: 50px;
  height: 30px;
  background-color: #999999;
  border-radius: 4px;
  text-align: center;
  cursor: pointer;
}

.li_cus:not(:first-child) {
  margin-left: 10px;
}

.week_btn.active {
  background-color: #3399ff;
}

::v-deep.el-form-item {
  > .el-form-item__label {
    color: #fff;
  }
}

.el-form {
  padding: 15px;
  border-radius: 8px;
  margin: 15px 0 0 0;
  background-color: #1e2a45;
}

.container_warp {
  width: 100%;
  height: 100%;
  overflow: auto;
  padding: 0 20px;
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

.page-title {
  span {
    padding-left: 20px;
    font-size: 20px;
    font-weight: 400;
  }
}

::v-deep.el-input__inner {
  background-color: #2a3e62;
  border-radius: 15px;
}
::v-deep {
  .el-input > .el-input__inner {
    width: 240px;
  }
}
</style>
