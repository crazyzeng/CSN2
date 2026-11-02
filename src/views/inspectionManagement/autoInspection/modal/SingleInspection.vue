<!-- 单检弹窗 -->
<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="70%" :before-close="handleClose" center>
    <section class="content_box">
      <el-col :span="24" style="margin-bottom:30px">
        <el-row>
          <el-col :span="7" style="background-color: #233855;border-radius: 8px;">
            <p
              style="margin-bottom:10px;color:#fff;background-color: #29405e;height: 40px;line-height: 40px;border-radius: 8px 8px 0 0;padding:0 20px">
              <span>查询结果：</span><span>{{ dataLeft.length }}项</span>
              <span style="padding-left:50px">选中结果：</span><span>{{ nowSelectData.length }}项</span>
            </p>
            <el-row>
              <el-col :span="24" style="text-align: center;">
                <el-input v-model="leftSearchVal" style="width:300px;" placeholder="请输入名称或编号"
                  @keyup.enter.native="handleQuery">
                  <template #append>
                    <el-button icon="el-icon-search" @click="handleQuery" />
                  </template>
                </el-input>
              </el-col>
            </el-row>
            <el-table :data="dataLeft" height="400" ref="selection" @selection-change="checkAll" style="width: 100%">
              <el-table-column type="selection" width="60">
              </el-table-column>
              <el-table-column prop="equipmentName" label="设备名称" width="120">
              </el-table-column>
              <el-table-column prop="equipmentNumber" label="设备编号" width="100">
              </el-table-column>
              <el-table-column prop="equipmentType" label="设备类型" width="100">
                <template #default="{ row }">
                  {{ equipmentTypeTrans(equipmentTypeOptions, row.equipmentType) }}
                </template>
              </el-table-column>
            </el-table>
          </el-col>
          <el-col :span="2">
            <div class="opSetting">
              <div class="spacing" @click="handleRemoveSelect">
                <el-button icon="el-icon-arrow-left" class="custom_arrow_btn" :disabled="nowSelectRightData.length ? false : true
                  " type="text">
                </el-button>
              </div>
              <div @click="handelSelect">
                <el-button icon="el-icon-arrow-right" class="custom_arrow_btn"
                  :disabled="nowSelectData.length ? false : true" type="text">
                </el-button>
              </div>
            </div>
          </el-col>
          <el-col :span="15" style="background-color: #233855;border-radius: 8px;">
            <p
              style="margin-bottom:10px;color:#fff;background-color: #29405e;height: 40px;line-height: 40px;border-radius: 8px 8px 0 0;padding:0 20px">
              <span>查询结果：</span><span>{{ selectArr.length }}项</span>
            </p>
            <el-row>
              <el-col :span="24" style="text-align: center;">
                <el-input v-model="rightSearchVal" style="width:300px;" placeholder="请输入名称或编号"
                  @keyup.enter.native="handleRightQuery">
                  <template #append>
                    <el-button icon="el-icon-search" @click="handleRightQuery" />
                  </template>
                </el-input>
              </el-col>
            </el-row>
            <el-table :data="selectArr" height="400" ref="selection" @selection-change="checkRightAll"
              style="width: 100%">
              <el-table-column type="selection" width="60">
              </el-table-column>
              <el-table-column prop="equipmentName" label="设备名称" width="120">
              </el-table-column>
              <el-table-column prop="equipmentNumber" label="设备编号" width="100">
              </el-table-column>
              <el-table-column prop="equipmentType" label="设备类型" width="120">
                <template #default="{ row }">
                  {{ equipmentTypeTrans(equipmentTypeOptions, row.equipmentType) }}
                </template>
              </el-table-column>
              <el-table-column prop="scrapReason" label="巡检内容">
                <template #default="{ row }">
                  <el-checkbox-group v-model="configCheckList">
                    <el-checkbox v-for="item in row.config" :key="item.id" :label="item.id">{{
                      item.description }}</el-checkbox>
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
import { singleInspect, getConfigGroup } from '@/api/auto-inspection.js'
import { getDict, dictTrans } from '@/api/common.js'
export default {
  props: {},
  data() {
    return {
      dialogVisible: false,
      loopModeOptions: [
        {
          label: '每日',
          value: '每日'
        },
        {
          label: '每周',
          value: '每周'
        },
        {
          label: '每月',
          value: '每月'
        }
      ],
      formData: {
        inspectionName: '',
        loopMode: '',
        startTime: '',
        loopTime: '',
      },
      weekChecked: [],
      monthChecked: '',
      selectArr: [],
      leftSearchVal: '',
      rightSearchVal: '',
      dataLeft: [
        { deviceNo: "1", deviceName: "设备一", currentNum: 100 },
        { deviceNo: "2", deviceName: "设备二", currentNum: 50 },
      ],
      nowSelectData: [],
      nowSelectRightData: [],
      configCheckList: [],
      equipmentTypeOptions: [],
      tempSearchResult: []
    }
  },
  computed: {
    title: function () { return '' }
  },
  mounted() {
    this.initData()
    getDict('equipment_type').then(res => {
      this.equipmentTypeOptions = res.data;
    })
  },
  methods: {
    //获取配置列表
    getConfigList() {
      this.fetchConfigGroup('')
    },
    initData() {
      this.getConfigList()
    },
    async fetchConfigGroup(searchString) {
      await getConfigGroup(searchString).then(res => {
        if (res.code === 200 && res.data) this.dataLeft = res.data;
      })
    },
    open(data) {
      this.dialogVisible = true;
      this.initData();
    },
    handleClose() {
      this.dialogVisible = false;
      this.dataLeft = [];
      this.selectArr = [];
      this.configCheckList = [];
      sessionStorage.setItem('singleSelect', '[]')
    },
    submit() {
      if (this.configCheckList.length) {
        singleInspect(this.configCheckList).then(res => {
          if (res.code === 200) {
            this.$message.success('新增单检成功');
            this.handleClose();
            this.$emit('success')
          }
        })
      } else this.$message.warning('请勾选巡检内容')
    },
    handleQuery() {
      this.fetchConfigGroup(this.leftSearchVal)
    },
    handleRightQuery() {
      this.tempSearchResult = JSON.parse(sessionStorage.getItem('singleSelect'))
      if (this.rightSearchVal !== '') {
        let tempArray = this.tempSearchResult.filter(v => { return v.equipmentNumber.includes(this.rightSearchVal) || v.equipmentName.includes(this.rightSearchVal) })
        this.selectArr = tempArray;
      } else this.selectArr = JSON.parse(sessionStorage.getItem('singleSelect')) || []
    },
    equipmentTypeTrans(data, code) {
      return dictTrans(data, code)
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
      sessionStorage.setItem('singleSelect', JSON.stringify(this.selectArr))
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
            if (isNeedArr[i]["equipmentId"] === originalArr[k]["equipmentId"]) originalArr.splice(k, 1);
          }
        }
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.saveBtn {
  background-color: #2e6cd8;
  border-radius: 3px;
}

.backBtn {
  color: #fff;
}

::v-deep .el-checkbox {
  margin-right: 10px;
  color: #fff;
}

::v-deep .el-dialog {
  .el-dialog__header {
    background-color: transparent;
    height: 60px;
  }

  .dialog-footer {}

  .el-dialog__body {
    padding-top: 10px;
  }
}

::v-deep .el-input {
  .el-input__inner {
    border-radius: 3px;
  }

  .el-input-group__append {
    background-color: #2a3e62;
    border-color: transparent;
  }
}

::v-deep .el-table {
  background-color: #233855;
}

.box_title {
  margin-bottom: 10px;
  padding-left: 15px;

  >span:nth-child(1) {
    display: inline-block;
    font-size: 20px;
    font-weight: bold;
    color: #fff;
    vertical-align: middle;
  }
}

.opSetting {
  display: flex;
  margin-top: 150%;
  flex-wrap: nowrap;
  justify-content: space-evenly;
}

.custom_arrow_btn {
  width: 30px;
  height: 30px;
  border: 1px solid #2e6cd8;
}

.content_box {}
</style>
