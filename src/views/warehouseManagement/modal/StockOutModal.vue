<!-- 出库弹窗 -->
<template>
  <el-dialog :title="'出库单号：' + formData.orderNumber" :visible.sync="dialogVisible" width="75%"
    :before-close="handleClose">
    <section class="dialog_content">
      <el-col :span="24">
        <el-row>
          <el-col :span="11" style="padding: 10px">
            <p style="margin-bottom:10px">
              <span>库存位置：</span>
              <el-select v-model="formData.fromRepository" @change="responsitoryChange">
                <el-option v-for=" item  in  storehouseList " :key="item.id" :label="item.repoName"
                  :value="item.id"></el-option>
              </el-select>
            </p>
            <el-row class="mb-2">
              <el-col :span="8">
                <el-input v-model="leftSearchVal" placeholder="请输入名称或编号"></el-input>
              </el-col>
              <el-col :span="8" :offset="1">
                <el-button type="primary" class="customBtn" icon="el-icon-search" @click="query">查询</el-button>
                <el-button type="primary" class="customBtn" icon="el-icon-refresh" @click="reset">重置</el-button>
              </el-col>
            </el-row>
            <el-table :data="leftTable" height="300" ref="selection" @selection-change="checkAll" style="width: 100%">
              <el-table-column type="selection" width="50">
              </el-table-column>
              <el-table-column prop="stockNumber" label="设备编号" width="100">
              </el-table-column>
              <el-table-column prop="stockName" label="设备名称" width="120">
              </el-table-column>
              <el-table-column prop="stockType" label="设备类型" width="100">
                <template #default="{ row }">{{ stockTypeTrans(row.stockType) }}</template>
              </el-table-column>
              <el-table-column prop="spec" label="设备型号" width="100">
              </el-table-column>
              <el-table-column prop="curNum" label="当前库存" min-width="100">
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
            <p style="margin-bottom:17px"><span>当前出库项目：</span><span>{{ selectArr.length }}项</span>
              <span style="padding-left:50px">当前出库数量：</span><span>{{ opratorNum }}件</span>
            </p>
            <el-row class="mb-2">
              <el-col :span="8">
                <el-input v-model="rightSearchVal" placeholder="请输入名称或编号"></el-input>
              </el-col>
              <el-col :span="8" :offset="1">
                <el-button type="primary" class="customBtn" icon="el-icon-search" @click="rightQuery">查询</el-button>
                <el-button type="primary" class="customBtn" icon="el-icon-refresh" @click="rightReset">重置</el-button>
              </el-col>
            </el-row>
            <el-table :data="selectArr" height="300" ref="selection" @selection-change="checkRightAll"
              style="width: 100%">
              <el-table-column type="selection" width="50">
              </el-table-column>
              <el-table-column prop="stockNumber" label="设备编号" width="100">
              </el-table-column>
              <el-table-column prop="stockName" label="设备名称" width="120">
              </el-table-column>
              <el-table-column prop="stockType" label="设备类型" width="100">
                <template #default="{ row }">{{ stockTypeTrans(row.stockType) }}</template>
              </el-table-column>
              <el-table-column prop="spec" label="设备型号" width="100">
              </el-table-column>
              <el-table-column prop="curNum" label="出库数量" min-width="100">
                <template #default="{ row }">
                  <el-input v-model="row.curNum" class="stockOutInput" @focus="stockOutFocus(row)"
                    @input="inputFinish(row)"></el-input>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </el-col>
      <p style="text-align: center;"><el-checkbox v-model="formData.genExcel">同时生成出库单</el-checkbox></p>
      <p style="text-align: center;margin-top: 20px;" slot="footer" class="dialog-footer">
        <el-button type="text" class="customBtn submitBtn" icon="" @click="submit">确定</el-button>
        <el-button type="text" class="customBtn backBtn" icon="" @click="cancel">返回</el-button>
      </p>
    </section>
  </el-dialog>
</template>
<script>
import { getStockOutNumber } from '@/api/warehouse.js'
import { getStorehouseList, getListByParam, addStockOrder, downloadOrderList } from '@/api/warehouse/check.js'
import { dictTrans } from '@/api/common'
import { deepClone, removeDuplicateObj } from '@/utils/index'

export default {
  props: {
    stockType: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      dialogVisible: false,
      storehouseList: [],
      formData: {
        orderNumber: '',
        stockOrderType: '0',//0:出库
        fromRepository: '',
        genExcel: false,
        opratorNum: 0,
        itemNum: 0,
        details: []
      },
      leftSearchVal: '',
      rightSearchVal: '',
      selectArr: [],
      leftTable: [],
      nowSelectData: [],
      nowSelectRightData: [],
      rightTempData: [],
      oldVal: 0,
      opratorNum: 0,
      timer: null,
      initialArray: [],
      initialLeftArray: []
    }
  },
  computed: {
    title: function () { return '出库单号：' + this.formData.orderNumber; }
  },
  watch: {
    dialogVisible: function () {
      this.initData()
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    initData() {
      getStorehouseList().then(res => {
        if (res.code === 200 && res.data) {
          this.storehouseList = res.data
          this.formData.fromRepository = res.data[0].id;
          const tempObj = { repoId: this.formData.fromRepository, dynamicParam: this.leftSearchVal, showZero: '1' }
          this.getResponsitoryDetailList(tempObj)
        }
      })
      getStockOutNumber().then(res => {
        if (res.code === 200) this.formData.orderNumber = res.data;
      })
    },
    responsitoryChange() {
      const tempObj = { repoId: this.formData.fromRepository, dynamicParam: this.leftSearchVal, showZero: '1' }
      this.getResponsitoryDetailList(tempObj)
      this.selectArr = [];
    },
    getResponsitoryDetailList(data) {
      getListByParam(data).then(res => {
        this.leftTable = res.data;
        this.initialLeftArray = deepClone(res.data);
      })
    },
    inputFinish(e) {
      this.timer = setTimeout(() => {
        const reg = /^[1-9]\d*$/;
        if (e.curNum === '') { return; }
        if (!reg.test(e.curNum)) {
          this.$message.warning('输入格式不正确，请重新输入');
          e.curNum = this.oldVal;
          return;
        }
        if (this.oldVal < e.curNum) {
          this.$message.warning('出库数量大于现有库存数量，请重新输入');
          e.curNum = this.oldVal;
          return;
        }
        this.opratorNum = 0;
        this.selectArr.forEach(v => { this.opratorNum += Number(v.curNum) })
      }, 800)
    },
    stockOutFocus(e) {
      this.initialArray.forEach(v => {
        if (v.id === e.id) this.oldVal = v.curNum
      })
    },
    selectArrChange(data) {
      const finalArray = this.initialLeftArray.filter(x => data.find(y => y.id === x.id))
      this.initialArray = deepClone(finalArray);
    },
    stockTypeTrans(code) {
      return dictTrans(this.stockType, code)
    },
    open(data) {
      this.dialogVisible = true;
    },
    handleClose() {
      this.dialogVisible = false;
      this.formData.details = [];
      this.formData.fromRepository = '';
      this.formData.orderNumber = '';
      this.formData.genExcel = false;
      this.formData.opratorNum = 0;
      this.formData.itemNum = 0;
      this.selectArr = [];
      this.nowSelectData = [];
      this.nowSelectRightData = [];
      this.timer = null;
      this.opratorNum = 0;
    },
    query() {
      const tempObj = { repoId: this.formData.fromRepository, dynamicParam: this.leftSearchVal, showZero: '1' }
      this.getResponsitoryDetailList(tempObj)
    },
    reset() {
      this.leftSearchVal = '';
      const tempObj = { repoId: this.formData.fromRepository, dynamicParam: this.leftSearchVal, showZero: '1' }
      this.getResponsitoryDetailList(tempObj)
    },
    rightQuery() {
      let tempData = deepClone(this.selectArr)
      this.rightTempData = deepClone(this.selectArr)
      let curArr = []
      tempData.forEach(e => {
        if (e.stockNumber.includes(this.rightSearchVal) ||
          e.stockName.includes(this.rightSearchVal)) {
          curArr.push(e)
        }
      });
      this.selectArr = curArr
    },
    rightReset() {
      this.rightSearchVal = ''
      this.selectArr = this.rightTempData
      this.rightQuery()
    },
    submit() {
      this.selectArr.forEach(v => {
        let tempObj = {
          stockId: '',
          operateNum: '',
        }
        tempObj.stockId = v.id;
        tempObj.operateNum = v.curNum;
        this.formData.details.push(tempObj)
      })
      if (this.selectArr.length <= 0) {
        this.$message.warning('设备不能为空')
        return;
      }
      this.formData.opratorNum = this.opratorNum;
      this.formData.itemNum = this.selectArr.length;
      addStockOrder(this.formData).then(res => {
        if (res.code === 200) {
          this.$message.success('操作成功');
          this.$emit('success');
          if (this.formData.genExcel) {
            downloadOrderList(this.formData).then(res => {
              let data = res;
              if (!data) return;
              let url = window.URL.createObjectURL(new Blob([data]));
              let link = document.createElement('a');
              link.style.display = 'none';
              link.href = url;
              link.setAttribute('download', `${this.formData.orderNumber}出库单.xls`);
              document.body.appendChild(link);
              link.click();
            })
          }
          this.handleClose();
        }
      })
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
      this.handleRemoveTabList(this.nowSelectData, this.leftTable);
      this.nowSelectData = [];
      this.selectArr = removeDuplicateObj(this.selectArr)
      this.opratorNum = 0;
      this.selectArr.forEach(v => { this.opratorNum += Number(v.curNum) })
      this.selectArrChange(this.selectArr)
    },
    // 取消
    handleRemoveSelect() {
      this.leftTable = this.handleConcatArr(this.leftTable, this.nowSelectRightData);
      this.handleRemoveTabList(this.nowSelectRightData, this.selectArr);
      this.nowSelectRightData = [];
      this.opratorNum = 0;
      this.selectArr.forEach(v => {
        this.opratorNum += Number(v.curNum)
      })
      this.reset();
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
            if (isNeedArr[i]["id"] === originalArr[k]["id"]) originalArr.splice(k, 1);
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
  background-color: #2e6cd8;
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
  color: #000;

  .center_btn {
    width: 20%;
    text-align: center;
  }
}

::v-deep .el-checkbox {
  color: #fff;
}
</style>