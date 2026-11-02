<!-- 完成盘点 -->
<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="1200px" :before-close="handleClose">
    <section class="dialog_content">
      <el-col :span="24">
        <el-row>
          <el-col :span="11" style="padding: 10px">
            <p style="margin-bottom:10px">
              <span>盘点仓库：</span>
              <span class="ml-10px">{{ checkName }}</span>
            </p>
            <el-row class="mt-24px flex">  
                <el-input v-model="searchValLeft" placeholder="请输入名称或编号"></el-input>
                <el-button type="primary" class="" icon="el-icon-search" @click="leftQuery">查询</el-button>
                <el-button type="primary" class="" icon="el-icon-refresh" @click="leftReset">重置</el-button>
            </el-row>
            <el-table :data="leftTableData" height="350" ref="selection" @selection-change="checkAll" style="width: 100%;margin-top: 10px;">
              <el-table-column align="center" type="selection" width="50" />
              <el-table-column align="center" prop="stockNumber" label="设备编号" width="100" />
              <el-table-column align="center" prop="stockName" label="设备名称" min-width="120" />
              <el-table-column align="center" prop="curNum" label="当前库存" />
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
            <p style="margin-bottom:10px"><span>当前修正项目：</span><span>{{ selectArr.length }}项</span>
              <span style="padding-left:50px">当前修正数量：</span><span>{{ opratorNum }}件</span>
            </p>
            <el-row class="flex">
                <el-input v-model="searchValRight" placeholder="请输入名称或编号"></el-input>
                <el-button type="primary" class="" icon="el-icon-search" @click="rightQuery">查询</el-button>
                <el-button type="primary" class="" icon="el-icon-refresh" @click="rightReset">重置</el-button>
            </el-row>
            <el-table :data="selectArr" height="350" ref="selection" @selection-change="checkRightAll"
              style="width: 100%;margin-top: 10px;">
              <el-table-column align="center" type="selection" width="50" />
              <el-table-column align="center" prop="stockNumber" label="设备编号" width="100" />
              <el-table-column align="center" prop="stockName" label="设备名称" width="120" />
              <el-table-column align="center" prop="curNum" label="修正库存">
                <template #default="{ row }"><el-input v-model="row.curNum" class="stockCheckInput"
                    @input="inputFinish(row)" @focus="stockTakingFocus(row)"></el-input></template>
              </el-table-column>
              <el-table-column align="center" prop="tips" label="备注">
                <template #default="{ row }">
                  <el-input v-model="row.tips" class="tipsInput"></el-input>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </el-col>
      <p style="text-align: center;color: #fff;">
        <el-checkbox v-model="formData.genExcel">同时生成盘点修正单</el-checkbox>
      </p>
      <p style="text-align: center;margin-top: 20px;" slot="footer" class="dialog-footer">
        <el-button type="primary" icon="" @click="submit">确定</el-button>
        <el-button type="primary" icon="" @click="cancel">返回</el-button>
      </p>
    </section>
  </el-dialog>
</template>
<script>
import { getListByParam, addStockOrder, getStorehouseList, downloadOrderList } from '@/api/warehouse/check.js'
import { deepClone } from '@/utils/index'
export default {
  data() {
    return {
      dialogVisible: false,
      searchValLeft: '',
      searchValRight: '',
      checkName: '',
      current: 0,
      selectArr: [],
      leftTableData: [],
      nowSelectData: [],
      nowSelectRightData: [],
      repoId: '',
      formData: {
        orderNumber: '',
        stockOrderType: '',
        fromRepository: '',
        genExcel: false,
        itemNum: '',
        opratorNum: '',
        details: []
      },
      storehouseList: [],
      opratorNum: 0,
      rightTempData: [],
      oldVal: 0,
      timer: null,
      initialArray: [],
      initialLeftArray: []
    }
  },
  computed: {
    title: function () {
      return '完成盘点'
    }
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
        this.storehouseList = res.data
      })
    },
    getResponsitoryDetailList(data) {
      getListByParam(data).then(res => {
        this.leftTableData = res.data
        this.initialLeftArray = deepClone(res.data);
      })
    },
    inputFinish(e) {
      this.timer = setTimeout(() => {
        const reg = /^[1-9]\d*$/;
        if (e.curNum === '') {
          return;
        }
        if (!reg.test(e.curNum)) {
          this.$message.warning('输入格式不正确，请重新输入');
          e.curNum = ''
          return;
        }
        this.opratorNum = 0;
        this.selectArr.forEach(v => {
          this.opratorNum += Number(v.curNum)
        })
      }, 800)
    },
    stockTakingFocus(e) {
      this.initialArray.forEach(v => {
        if (v.id === e.id)
          this.oldVal = v.curNum
      })
    },
    selectArrChange(data) {
      const finalArray = this.initialLeftArray.filter(x => data.find(y => y.id === x.id))
      this.initialArray = deepClone(finalArray);
    },
    open(data) {
      this.repoId = data.id;
      this.formData.fromRepository = data.repository;
      this.formData.orderNumber = data.checkNumber;
      this.checkName = this.responsitoryTrans(data.repository);
      this.dialogVisible = true;
      let pushData = { repoId: data.repository, dynamicParam: this.searchValLeft }
      this.getResponsitoryDetailList(pushData)
    },
    handleClose() {
      this.dialogVisible = false;
      this.formData.details = [];
      this.formData.fromRepository = '';
      this.formData.orderNumber = '';
      this.formData.genExcel = false;
      this.selectArr = [];
      this.nowSelectData = [];
      this.nowSelectRightData = [];
      this.timer = null;
      this.opratorNum = 0;
    },
    leftQuery() {
      let data = { repoId: this.formData.fromRepository, dynamicParam: this.searchValLeft }
      this.getResponsitoryDetailList(data)
    },
    leftReset() {
      this.searchValLeft = '';
      let data = { repoId: this.formData.fromRepository, dynamicParam: this.searchValLeft }
      this.getResponsitoryDetailList(data)
    },
    query() {
      const tempObj = { repoId: this.formData.fromRepository, dynamicParam: this.searchValRight }
      this.getResponsitoryDetailList(tempObj)
    },
    reset() {
      this.searchValRight = '';
      const tempObj = { repoId: this.formData.fromRepository, dynamicParam: this.searchValRight }
      this.getResponsitoryDetailList(tempObj)
    },
    rightQuery() {
      let tempData = deepClone(this.selectArr)
      this.rightTempData = deepClone(this.selectArr)
      let curArr = []
      tempData.forEach(e => {
        if (e.stockNumber.includes(this.searchValRight) ||
          e.stockName.includes(this.searchValRight)) {
          curArr.push(e)
        }
      });
      this.selectArr = curArr
    },
    rightReset() {
      this.searchValRight = ''
      this.selectArr = this.rightTempData
      this.rightQuery()
    },
    submit() {
      this.formData.stockOrderType = '4' //4.盘点
      this.selectArr.forEach(v => {
        let tempObj = {
          stockId: '',
          operateNum: '',
          otherData: { comm: '' }
        }
        tempObj.stockId = v.id;
        tempObj.operateNum = v.curNum;
        tempObj.otherData.comm = v.tips;
        this.formData.details.push(tempObj)
      })
      this.formData.opratorNum = this.opratorNum;
      this.formData.itemNum = this.selectArr.length;
      addStockOrder(this.formData).then(res => {
        if (res.code === 200) {
          this.$message.success('保存成功');
          this.$emit('success');
          if (this.formData.genExcel) {
            downloadOrderList(this.formData).then(res => {
              let data = res;
              if (!data) return;
              let url = window.URL.createObjectURL(new Blob([data]));
              let link = document.createElement('a');
              link.style.display = 'none';
              link.href = url;
              link.setAttribute('download', `${this.formData.orderNumber}盘点单.xls`);
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
    responsitoryTrans(code) {
      let tempLabel = '';
      this.storehouseList.forEach(v => { if (v.id === code) tempLabel = v.repoName; })
      return tempLabel;
    },
    // 选中
    handelSelect() {
      //右边的数组和左边的数组进行连接
      this.selectArr = this.handleConcatArr(this.selectArr, this.nowSelectData);
      //删除左边数组中的元素
      this.handleRemoveTabList(this.nowSelectData, this.leftTableData);
      this.nowSelectData = [];
      this.opratorNum = 0;
      this.selectArr.forEach(v => { this.opratorNum += Number(v.curNum) })
      this.selectArrChange(this.selectArr)
    },
    // 取消
    handleRemoveSelect() {
      this.leftTableData = this.handleConcatArr(this.leftTableData, this.nowSelectRightData);
      this.handleRemoveTabList(this.nowSelectRightData, this.selectArr);
      this.nowSelectRightData = [];
      this.opratorNum = 0;
      this.selectArr.forEach(v => { this.opratorNum += Number(v.curNum) })
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
  color: #000;

  .center_btn {
    width: 20%;
    text-align: center;
  }
}

::v-deep .el-checkbox {
  color: #000;
}

::v-deep.el-input.stockCheckInput {
  >.el-input__inner {
    background-color: #fff;
    width: 100px;
  }
}
</style>