<!-- 新增弹窗 -->
<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="85%" :before-close="handleClose" center>
    <section class="content_box">
      <el-form ref="basicForm" :inline="true" :model="formData" class="" :rules="rules">
        <el-row>
          <el-form-item label="智能巡检任务名称" prop="inspectName">
            <el-input v-model="formData.inspectName" placeholder=""></el-input>
          </el-form-item>

          <el-form-item label="循环模式" prop="circleMode">
            <el-select v-model="formData.circleMode" @change="circleModeChange">
              <el-option v-for="item in loopModeOptions" :key="item.value" :label="item.label"
                :value="item.value"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="巡检启动时间" prop="startTime">
            <el-time-picker v-model="formData.startTime" :picker-options="{ format: 'HH:mm' }" placeholder=""
              value-format="HH:mm" @change="startTimeChange" :clearable="false">
            </el-time-picker>
          </el-form-item>
          <el-form-item label="">
            <el-tag v-for="tag in startTime" :key="tag" class="custom_tag" closable :disable-transitions="false"
              @close="tagClose(tag)">
              {{ tag }}
            </el-tag>
          </el-form-item>

          <el-form-item label="循环时间" v-if="formData.circleMode === 'WEEK'">
            <el-checkbox-group style="" v-model="weekChecked">
              <el-checkbox label="1">周一</el-checkbox>
              <el-checkbox label="2">周二</el-checkbox>
              <el-checkbox label="3">周三</el-checkbox>
              <el-checkbox label="4">周四</el-checkbox>
              <el-checkbox label="5">周五</el-checkbox>
              <el-checkbox label="6">周六</el-checkbox>
              <el-checkbox label="7">周日</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="循环时间" v-if="formData.circleMode === 'MONTH'">
            <el-date-picker v-model="monthChecked" type="date" style="width: 128px" placeholder="选择日期" format="d"
              value-format="d" @change="monthChange">
            </el-date-picker>
            <el-form-item label="">
              <el-tag v-for="tag in monthTag" :key="tag" class="custom_tag" closable :disable-transitions="false"
                @close="monthTagClose(tag)">
                {{ tag }}
              </el-tag>
            </el-form-item>
          </el-form-item>
        </el-row>
      </el-form>
      <el-col :span="24" style="margin-bottom: 30px">
        <el-row>
          <el-col :span="7" style="background-color: #e9efff; border-radius: 8px">
            <p style="
                margin-bottom: 10px;
                color: #333;
                background-color: #e9efff;
                height: 40px;
                line-height: 40px;
                border-radius: 8px 8px 0 0;
                padding: 0 20px;
              ">
              <span>查询结果：</span><span>{{ dataLeft.length }}项</span> <span
                style="padding-left: 50px">选中结果：</span><span>{{ nowSelectData.length }}项</span>
            </p>
            <el-row>
              <el-col :span="24" style="text-align: center">
                <el-input v-model="leftSearchVal" style="width: 300px" placeholder="请输入名称或编号"
                  @keyup.enter.native="handleQuery">
                  <template #append>
                    <el-button icon="el-icon-search" @click="handleQuery" />
                  </template>
                </el-input>
              </el-col>
            </el-row>
            <el-table :data="dataLeft" height="400" ref="selectionTable" @selection-change="checkAll"
              style="width: 100%">
              <el-table-column type="selection" width="60"> </el-table-column>
              <el-table-column prop="equipmentName" align="center" label="设备名称" min-width="120">
                <template #default="scope">
                  {{ scope.row.equipmentName || "--" }}
                </template>
              </el-table-column>
              <el-table-column prop="equipmentNumber" align="center" label="设备编号" min-width="100">
                <template #default="scope">
                  {{ scope.row.equipmentNumber || "--" }}
                </template>
              </el-table-column>
              <el-table-column prop="equipmentType" align="center" label="设备类型" min-width="100">
                <template #default="{ row }">
                  {{ equipmentTypeTrans(equipmentTypeOptions, row.equipmentType) || "--" }}
                </template>
              </el-table-column>
            </el-table>
          </el-col>
          <el-col :span="2">
            <div class="opSetting">
              <div class="spacing" @click="handleRemoveSelect">
                <el-button icon="el-icon-arrow-left" class="custom_arrow_btn"
                  :disabled="nowSelectRightData.length ? false : true" type="text">
                </el-button>
              </div>
              <div @click="handelSelect">
                <el-button icon="el-icon-arrow-right" class="custom_arrow_btn"
                  :disabled="nowSelectData.length ? false : true" type="text">
                </el-button>
              </div>
            </div>
          </el-col>
          <el-col :span="15" style="background-color: #e9efff; border-radius: 8px">
            <p style="
                margin-bottom: 10px;
                color: #333;
                background-color: #e9efff;
                height: 40px;
                line-height: 40px;
                border-radius: 8px 8px 0 0;
                padding: 0 20px;
              ">
              <span>查询结果：</span><span>{{ selectArr.length }}项</span>
            </p>
            <el-row>
              <el-col :span="24" style="text-align: center">
                <el-input v-model="rightSearchVal" style="width: 300px" placeholder="请输入名称或编号"
                  @keyup.enter.native="handleRightQuery">
                  <template #append>
                    <el-button icon="el-icon-search" @click="handleRightQuery" />
                  </template>
                </el-input>
              </el-col>
            </el-row>
            <el-table :data="selectArr" height="400" ref="rightSelectionTable" @selection-change="checkRightAll"
              style="width: 100%">
              <el-table-column type="selection" width="60"> </el-table-column>
              <el-table-column prop="equipmentName" label="设备名称" width="120">
                <template #default="scope">
                  {{ scope.row.equipmentName || "--" }}
                </template>
              </el-table-column>
              <el-table-column prop="equipmentNumber" label="设备编号" width="100">
                <template #default="scope">
                  {{ scope.row.equipmentNumber || "--" }}
                </template>
              </el-table-column>
              <el-table-column prop="equipmentType" label="设备类型" width="120">
                <template #default="{ row }">
                  {{ equipmentTypeTrans(equipmentTypeOptions, row.equipmentType) || "--" }}
                </template>
              </el-table-column>
              <el-table-column prop="config" label="巡检内容">
                <template #default="{ row }">
                  <el-checkbox-group v-model="configCheckList">
                    <el-checkbox v-for="item in row.config" :disabled="item.status === 0" :key="item.id"
                      :label="item.id">{{
                        item.description
                      }}</el-checkbox>
                  </el-checkbox-group>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </el-col>
    </section>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" class="saveBtn" @click="submit">保 存</el-button>
      <el-button class="backBtn" @click="handleClose">返 回</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { getConfigGroup, addAutoInspect, autoInspectDetail, updateAutoInspect } from "@/api/auto-inspection.js";
import { getDict, dictTrans } from "@/api/common.js";
export default {
  props: {},
  data() {
    return {
      dialogVisible: false,
      loopModeOptions: [
        {
          label: "每日",
          value: "DAY",
        },
        {
          label: "每周",
          value: "WEEK",
        },
        {
          label: "每月",
          value: "MONTH",
        },
      ],
      formData: {
        id: "",
        inspectName: "",
        circleMode: "DAY",
        circleTime: "",
        startTime: "",
        config: "",
      },
      startTime: [],
      monthTag: [],
      leftSearchVal: "",
      rightSearchVal: "",
      weekChecked: [],
      monthChecked: "",
      selectArr: [],
      dataLeft: [],
      nowSelectData: [],
      nowSelectRightData: [],
      equipmentTypeOptions: [],
      configCheckList: [],
      detailData: [],
      isEdit: false,
      rules: {
        inspectName: [{ required: true, message: "请输入巡检任务名称", trigger: "blur" }],
        circleMode: [{ required: true, message: "请选择循环模式", trigger: "change" }],
        startTime: [{ required: true, message: "请选择启动时间", trigger: "change" }],
      },
      tempSearchResult: [],
    };
  },
  computed: {
    title: function () {
      return this.isEdit ? "编辑任务" : "新增任务";
    },
  },
  mounted() {
    getDict("equipment_type").then((res) => {
      this.equipmentTypeOptions = res.data;
    });
  },
  methods: {
    async fetchConfigGroup(searchString) {
      await getConfigGroup(searchString).then((res) => {
        if (res.code === 200 && res.data) this.dataLeft = res.data;
      });
    },
    equipmentTypeTrans(data, code) {
      return dictTrans(data, code);
    },
    handleQuery() {
      this.fetchConfigGroup(this.leftSearchVal);
    },
    initData() {
      this.fetchConfigGroup("");
    },

    getDetail(id) {
      getConfigGroup("").then((res) => {
        if (res.code === 200 && res.data) {
          this.dataLeft = res.data;
          autoInspectDetail(id).then((res) => {
            if (res.code === 200 && res.data.length > 0) {
              this.detailData = res.data;
              this.detailData.forEach((row) => {
                let tempArr = this.dataLeft.filter((v) => {
                  return v.equipmentId === row.equipmentId;
                });
                let tempArray = row.config.map((v) => {
                  return v.id;
                });
                this.configCheckList.push.apply(this.configCheckList, tempArray);
                this.selectArr.push(tempArr[0]);
                this.handleRemoveTabList(tempArr, this.dataLeft);
              });
            }
          });
        }
      });
    },
    open(data) {
      this.fetchConfigGroup("");
      this.dialogVisible = true;
      this.$refs.basicForm?.resetFields();
      if (data) {
        this.isEdit = true;
        this.formData.id = data.id;
        this.formData.inspectName = data.inspectName;
        this.formData.circleMode = data.circleMode;
        this.startTime = data.startTime.split(",");
        if (data.circleMode === "DAY") this.formData.circleTime = "";
        else if (data.circleMode === "WEEK") this.weekChecked = data.circleTime.split(",");
        else this.monthTag = data.circleTime.split(",");
        this.getDetail(data.id);
      } else this.isEdit = false;
    },
    tagClose(tag) {
      this.startTime.splice(this.startTime.indexOf(tag), 1);
    },
    monthChange() {
      this.monthTag.push(this.monthChecked);
      this.monthTag.sort(function (a, b) {
        return a - b;
      });
      this.monthChecked = "";
    },
    monthTagClose(tag) {
      this.monthTag.splice(this.monthTag.indexOf(tag), 1);
    },
    startTimeChange() {
      this.startTime.push(this.formData.startTime);
    },
    circleModeChange(e) {
      if (e === "WEEK") {
        this.startTime = [];
        this.monthTag = [];
        this.monthChecked = "";
      }
      if (e === "MONTH") {
        this.weekChecked = [];
      }
      this.formData.circleTime = "";
    },
    handleClose() {
      this.dialogVisible = false;
      for (let k in this.formData) this.formData[k] = "";
      this.weekChecked = [];
      this.startTime = [];
      this.monthTag = [];
      this.dataLeft = [];
      this.selectArr = [];
      this.configCheckList = [];
      sessionStorage.setItem("autoSelect", "[]");
    },
    submit() {
      this.$refs.basicForm.validate((valid) => {
        if (valid) {
          if (this.formData.circleMode === "DAY") this.formData.circleTime = "";
          else if (this.formData.circleMode === "WEEK") this.formData.circleTime = this.weekChecked.join(",");
          else this.formData.circleTime = this.monthTag.join(",");
          this.formData.config = this.configCheckList.join(",");
          this.formData.startTime = this.startTime.join(",");
          if (this.isEdit) {
            updateAutoInspect(this.formData).then((res) => {
              if (res.code === 200) {
                this.$message.success("编辑成功");
                this.$emit("success");
                this.handleClose();
              }
            });
          } else {
            addAutoInspect(this.formData).then((res) => {
              if (res.code === 200) {
                this.$message.success("新增成功");
                this.$emit("success");
                this.handleClose();
              }
            });
          }
        }
      });
    },
    checkAll(val) {
      this.nowSelectData = val;
    },
    checkRightAll(val) {
      this.nowSelectRightData = val;
    },
    // 选中
    handelSelect() {
      //右边的数组和左边的数组进行连接
      this.selectArr = this.handleConcatArr(this.selectArr, this.nowSelectData);
      //删除左边数组中的元素
      this.handleRemoveTabList(this.nowSelectData, this.dataLeft);
      this.nowSelectData = [];
      sessionStorage.setItem("autoSelect", JSON.stringify(this.selectArr));
    },
    // 取消
    handleRemoveSelect() {
      this.dataLeft = this.handleConcatArr(this.dataLeft, this.nowSelectRightData);
      this.handleRemoveTabList(this.nowSelectRightData, this.selectArr);
      this.nowSelectRightData = [];
    },
    handleConcatArr(selectArr, nowSelectData) {
      let arr = [];
      arr = arr.concat(selectArr, nowSelectData);
      return arr;
    },
    //在全局中删除被选中的元素
    handleRemoveTabList(isNeedArr, originalArr) {
      //如果两个数组都不为空
      if (isNeedArr.length && originalArr.length) {
        for (let i = 0; i < isNeedArr.length; i++) {
          for (let k = 0; k < originalArr.length; k++) {
            if (isNeedArr[i]["equipmentId"] === originalArr[k]["equipmentId"]) {
              originalArr.splice(k, 1);
            }
          }
        }
      }
    },
    handleRightQuery() {
      if (this.rightSearchVal !== "") {
        this.tempSearchResult = JSON.parse(sessionStorage.getItem("autoSelect"));
        let tempArray = this.tempSearchResult.filter((v) => {
          return v.equipmentNumber.includes(this.rightSearchVal) || v.equipmentName.includes(this.rightSearchVal);
        });
        this.selectArr = tempArray;
      } else this.selectArr = JSON.parse(sessionStorage.getItem("autoSelect")) || [];
    },
  },
};
</script>

<style lang="scss" scoped>

.opSetting {
  display: flex;
  margin-top: 150%;
  flex-wrap: nowrap;
  justify-content: space-evenly;
}

.custom_arrow_btn {
  width: 30px;
  height: 30px;
  border: 1px solid #bcbdbe;

  &:hover {
    border-color: #3e99f7;
  }
}

// .custom_tag {
//   margin: 0 1px;
//   background-color: #2a3e62;
//   border-color: transparent;
//   color: #333;
// }
</style>
