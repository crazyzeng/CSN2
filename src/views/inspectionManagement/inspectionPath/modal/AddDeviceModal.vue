<!-- 新增设备弹窗 -->
<template>
  <el-dialog title="添加设备" :visible.sync="dialogVisible" width="1225px" :before-close="handleClose" append-to-body>
    <section class="dialog_content">
      <el-col :span="24">
        <el-row>
          <el-col :span="11" style="padding: 10px">
            <el-row>
              <el-col :span="14">
                <el-input v-model="leftSearchVal" style="width:204px" placeholder="请输入设备名称/编号/类型/位置"></el-input>
              </el-col>
              <el-col :span="9" :offset="1">
                <el-button type="primary" class="" icon="el-icon-search" @click="query">查询</el-button>
                <el-button type="primary" class="" icon="el-icon-refresh" @click="reset">重置</el-button>
              </el-col>
            </el-row>
            <el-table :data="dataLeft" height="500" ref="selectionLeft" @selection-change="checkAll" style="width: 100%">
              <el-table-column type="selection" label="全选" width="60">
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
              <el-table-column prop="installLocation" label="设备安装位置" width="130">
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
          <el-col :span="11" style="padding: 10px">
            <el-row>
              <el-col :span="14">
                <el-input v-model="rightSearchVal" style="width:204px" placeholder="请输入设备名称/编号/位置"></el-input>
              </el-col>
              <el-col :span="9" :offset="1">
                <el-button type="primary" class="" icon="el-icon-search" @click="rightQuery">查询</el-button>
                <el-button type="primary" class="" icon="el-icon-refresh" @click="rightReset">重置</el-button>
              </el-col>
            </el-row>
            <el-table :data="selectArr" height="500" ref="selectionRight" @selection-change="checkRightAll"
              style="width: 100%">
              <el-table-column type="selection" label="全选" width="60">
              </el-table-column>
              <el-table-column type="index" label="序号" width="60">
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
              <el-table-column prop="installLocation" label="设备安装位置" width="130">
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </el-col>
      <p style="text-align: center;margin-top: 20px;" slot="footer" class="dialog-footer">
        <el-button class="confirm-btn" icon="" @click="submit">确定</el-button>
        <el-button class="cancel-btn" icon="" @click="cancel">返回</el-button>
      </p>
    </section>
  </el-dialog>
</template>
<script>
import { fetchAllEquipment } from '@/api/account-list.js'
import { getDict, dictTrans } from '@/api/common.js'
export default {
  props: {},
  data() {
    return {
      dialogVisible: false,
      leftSearchVal: '',
      rightSearchVal: '',
      selectArr: [],
      dataLeft: [],
      nowSelectData: [],
      nowSelectRightData: [],
      equipmentTypeOptions: [],
      dataId: null,
      detailData: {},
      tempSearchResult: []
    }
  },
  computed: {
  },
  mounted() {
    this.initData()
  },
  methods: {
    initData() {
      this.getAllEquipment(this.leftSearchVal);
      getDict('equipment_type').then(res => {
        this.equipmentTypeOptions = res.data;
      })
    },
    async getAllEquipment(searchString) {
      await fetchAllEquipment(searchString).then(res => {
        if (res.code === 200 && res.data) {
          this.dataLeft = res.data;
          if (Object.keys(this.detailData).length && this.detailData.equipmentIdList.length) {
            let tempArr = [];
            this.detailData.equipmentIdList.forEach(k => {
              tempArr = this.dataLeft.filter(v => { return v.equipmentId === k });
              console.log('tempArr', tempArr)
              this.selectArr.push(tempArr[0])
              this.handleRemoveTabList(tempArr, this.dataLeft)
            })
          }
        }
      })
    },
    open(data) {
      this.dataId = data.id;
      this.detailData = data;
      this.dialogVisible = true;
      this.initData()
    },
    handleClose() {
      this.dialogVisible = false;
      this.selectArr = [];
      this.rightSearchVal = '';
      sessionStorage.setItem('pathSelect', '[]');
    },
    equipmentTypeTrans(data, code) {
      return dictTrans(data, code)
    },
    query() {
      this.getAllEquipment(this.leftSearchVal);
    },
    reset() {
      this.leftSearchVal = '';
      this.getAllEquipment(this.leftSearchVal);
    },
    rightQuery() {
      this.tempSearchResult = JSON.parse(sessionStorage.getItem('pathSelect'))
      if (this.rightSearchVal !== '') {
        let tempArray = this.tempSearchResult.filter(v => {
          return v.equipmentNumber.includes(this.rightSearchVal) || v.equipmentName.includes(this.rightSearchVal) || v.installLocation.includes(this.rightSearchVal)
        })
        this.selectArr = tempArray;
      } else this.selectArr = JSON.parse(sessionStorage.getItem('pathSelect')) || []
    },
    rightReset() {
      this.selectArr = JSON.parse(sessionStorage.getItem('pathSelect'))
    },
    submit() {
      if (this.selectArr.length > 0)
        this.$emit('updateDevice', this.selectArr, this.dataId)
      this.handleClose()
    },
    cancel() { this.handleClose() },
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
      sessionStorage.setItem('pathSelect', JSON.stringify(this.selectArr))
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
::v-deep .el-dialog {
  .el-dialog__body {
    padding-top: 10px;
  }
}

.customBtn {
  background-color: #2e6cd8;
  color: #fff;
}

.submitBtn {
  width: 60px;
  height: 30px;
}

.backBtn {
  width: 60px;
  height: 30px;
  background-color: transparent;
  border: 1px solid #2e6cd8;
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
  color: #fff;

  .center_btn {
    width: 20%;
    text-align: center;
  }
}
</style>