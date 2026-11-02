<!-- 仓库管理 -->
<template>
  <div class="upkeep_work_order">
    <div class="navigation rounded-lg shadow-lg bg-white">
      <el-tabs v-model="businessType" @tab-click="modeChange">
        <el-tab-pane label="出库" name="出库"></el-tab-pane>
        <el-tab-pane label="入库" name="入库"></el-tab-pane>
        <el-tab-pane label="调拔" name="调拔"></el-tab-pane>
        <el-tab-pane label="报废" name="报废"></el-tab-pane>
      </el-tabs>
      <div class="navigation_echarts flex justify-between">
        <div class="left h-full w-1/2">
          <TopBarChart @monthChange="monthChange" :dataItem="barData"></TopBarChart>
        </div>
        <div class="right h-full w-1/2 flex justify-between relative">
          <div class="h-full w-1/2 overflow-hidden relative">
            <span style="color: #000; position: absolute;">{{ curMonth }}({{ rightPieTitle }})设备数量</span>
            <TopPieChart :dataItem="pieData"></TopPieChart>
          </div>
          <div class="h-full w-1/2 overflow-hidden relative">
            <span style="color: #000; position: absolute;">同比 — {{ curMonth }}({{ rightPieTitle }})设备数量</span>
            <TopPieChart :dataItem="pieData1"></TopPieChart>
          </div>
        </div>
      </div>
    </div>
    <div class="search mb-4">
      <el-form :inline="true" :model="formData" class="search-form">
        <div class="search-row-1">
          <el-form-item label="设备编号">
            <el-input v-model="formData.stockNumber" placeholder="请输入设备编号"></el-input>
          </el-form-item>
          <el-form-item label="设备名称">
            <el-input v-model="formData.stockName" placeholder="请输入设备名称"></el-input>
          </el-form-item>
          <el-form-item label="设备类型">
            <el-select v-model="formData.stockType">
              <el-option v-for="item in stockTypeOptions" :key="item.itemValue" :label="item.itemText"
                :value="item.itemValue"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="物品归属">
            <el-input v-model="formData.belong"></el-input>
          </el-form-item>
          <el-form-item label="库存位置">
            <el-select v-model="formData.repository">
              <el-option v-for="item in storehouseList" :key="item.id" :label="item.repoName"
                :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="库存状态">
            <el-select v-model="formData.stockStatus">
              <el-option v-for="item in statusOptions" :key="item.value" :label="item.label"
                :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </div>

        <div class="search-row-2">
          <el-form-item class="search-buttons left-aligned-buttons">
            <el-button type="primary" icon="el-icon-search" @click="query">查询</el-button>
            <el-button type="primary" icon="el-icon-refresh" @click="reset">重置</el-button>
          </el-form-item>

          <el-form-item class="search-buttons center-aligned-buttons">
            <el-button type="primary" icon="el-icon-plus" @click="add">新增</el-button>
            <el-upload ref="upload" class="_uplaod-div" name="file" :show-file-list="false" :action="url"
              :before-upload="beforeUpload" :on-success="uploadSuccess" :on-error="uploadFail" :limit="1"
              accept=".xls, .xlsx">
              <el-button slot="trigger" type="primary" icon="el-icon-upload2">导入</el-button>
              <div slot="tip" class="el-upload__tip"></div>
            </el-upload>
            <el-button type="primary" icon="el-icon-download" @click="handleExport">导出</el-button>
            <el-button type="primary" icon="el-icon-notebook-2" @click="donwloadTemplate">模板下载</el-button>
          </el-form-item>

          <el-form-item class="search-buttons right-aligned-buttons">
            <el-button type="primary" icon="" @click="handleStockOut">出库</el-button>
            <el-button type="primary" icon="" @click="handleStockIn">入库</el-button>
            <el-button type="primary" icon="" @click="handleTransfer">调拔</el-button>
            <el-button type="primary" icon="" @click="handleCheck">盘点</el-button>
            <el-button type="primary" icon="" @click="handleScrap">报废</el-button>
            <el-button type="primary" icon="" @click="stockRecords">库存信息记录</el-button>
          </el-form-item>
        </div>
      </el-form>

    </div>
    <div class="table">
      <el-table :data="tableData" class="curTable" height="100%"
        :default-sort="{ prop: 'updateTime', order: 'descending' }">
        <el-table-column align="center" prop="stockNumber" label="设备编号" width=""> </el-table-column>
        <el-table-column align="center" prop="stockName" label="设备名称" width=""> </el-table-column>
        <el-table-column align="center" prop="stockType" label="设备类型" width="">
          <template #default="{ row }">{{ stockTypeTrans(stockTypeOptions, row.stockType) }}</template>
        </el-table-column>
        <el-table-column align="center" prop="spec" label="设备型号" width=""> </el-table-column>
        <el-table-column align="center" prop="belong" label="物品归属" width=""> </el-table-column>
        <el-table-column align="center" prop="repository" label="库存位置" width="">
          <template #default="{ row }">{{ responsitoryTrans(row.repository) }}</template>
        </el-table-column>
        <el-table-column align="center" prop="curNum" label="当前库存量" width=""> </el-table-column>
        <el-table-column align="center" prop="threshold" label="库存阈值" width=""> </el-table-column>
        <el-table-column align="center" prop="stockStatus" label="库存状态">
          <template #default="{ row }">{{ row.stockStatus === 0 ? "正常" : "库存不足" }}</template>
        </el-table-column>
        <el-table-column align="center" prop="updateTime" sortable label="库存更新时间" width="180"> </el-table-column>
        <el-table-column align="center" prop="stockOrderType" label="更新类型" width="">
          <template #default="{ row }">{{ stockOrderTypeTrans(row.stockOrderType) }}</template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template #default="{ row }">
            <el-link class="green-link" @click="modifyThreshold(row)">修改库存阈值</el-link>
          </template>
        </el-table-column>
      </el-table>
      <div class="th-pagination">
        <el-pagination @current-change="handleCurrentChange" background :current-page="paging.pageNo"
          :page-size="paging.pageSize" layout="total, prev, pager, next, jumper" :total="paging.total">
        </el-pagination>
      </div>
    </div>
    <AddModal ref="addModalRef" @success="reset()"></AddModal>
    <ScrapModal ref="scrapModalRef" @success="reset()" :stock-type="stockTypeOptions"></ScrapModal>
    <StockInModal ref="stockInModalRef" @success="reset()" :stock-type="stockTypeOptions"></StockInModal>
    <StockOutModal ref="stockOutModalRef" @success="reset()" :stock-type="stockTypeOptions"></StockOutModal>
    <TransferModal ref="transferModalRef" @success="reset()" :stock-type="stockTypeOptions"></TransferModal>
  </div>
</template>

<script>
import TopBarChart from "./chart/TopBarChart.vue";
import TopPieChart from "./chart/TopPieChart.vue";
import AddModal from "./modal/AddModal.vue";
import ScrapModal from "./modal/ScrapModal.vue";
import StockInModal from "./modal/StockInModal.vue";
import StockOutModal from "./modal/StockOutModal.vue";
import TransferModal from "./modal/TransferModal.vue";
import { getStockListPage, updateThreshold, getStatisticsData, downloadTemplate, exportStockExcel } from "@/api/warehouse.js";
import { getStorehouseList } from "@/api/warehouse/check.js";
import { getDict, dictTrans } from "@/api/common";
import { numberTransfer, getUrl } from "@/utils";
export default {
  data() {
    return {
      businessType: "出库",
      rightPieTitle: "出库",
      statusOptions: [
        {
          label: "正常",
          value: "0",
        },
        {
          label: "库存不足",
          value: "1",
        },
      ],
      ownerShipOptions: [],
      paging: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      formData: {
        stockNumber: "",
        stockName: "",
        stockType: "",
        belong: "",
        repository: "",
        stockStatus: "",
      },
      tableData: [],
      stockTypeOptions: [],
      stockOrderTypeOptions: [
        {
          label: "出库",
          value: 0,
        },
        {
          label: "入库",
          value: 1,
        },
        {
          label: "调拔",
          value: 2,
        },
        {
          label: "报废",
          value: 3,
        },
        {
          label: "盘点",
          value: 4,
        },
      ],
      storehouseList: [],
      overiewData: {},
      barData: {},
      pieData: {},
      pieData1: {},
      curMonth: "年度",
    };
  },

  components: { TopBarChart, TopPieChart, AddModal, ScrapModal, StockInModal, StockOutModal, TransferModal },

  computed: {
    url() {
      let url = getUrl("/stock/importStock");
      return url;
    },
  },

  mounted() {
    this.init();
  },

  methods: {
    init() {
      this.getPage();
      this.getData();
      getDict("stock_type").then((res) => {
        if (res.code === 200 && res.data) this.stockTypeOptions = res.data;
      });
      getStorehouseList().then((res) => {
        if (res.code === 200 && res.data) this.storehouseList = res.data;
      });
    },
    modeChange() {
      switch (this.businessType) {
        case "出库":
          this.barData = this.overiewData["0"];
          this.pieData = this.overiewData["0"].now?.yearCompare;
          this.pieData1 = this.overiewData["0"].compare?.yearCompare;
          break;
        case "入库":
          this.barData = this.overiewData["1"];
          this.pieData = this.overiewData["1"].now?.yearCompare;
          this.pieData1 = this.overiewData["1"].compare?.yearCompare;
          break;
        case "调拔":
          this.barData = this.overiewData["2"];
          this.pieData = this.overiewData["2"].now?.yearCompare;
          this.pieData1 = this.overiewData["2"].compare?.yearCompare;
          break;
        case "报废":
          this.barData = this.overiewData["3"];
          this.pieData = this.overiewData["3"].now?.yearCompare;
          this.pieData1 = this.overiewData["3"].compare?.yearCompare;
          break;
        default:
          break;
      }
      this.rightPieTitle = this.businessType;
    },
    getPage() {
      getStockListPage(this.formData, this.paging).then((res) => {
        if (res.code === 200 && res.data) {
          this.tableData = res.data.records;
          this.paging.total = res.data.total;
        }
      });
    },
    getData() {
      getStatisticsData().then((res) => {
        if (res.code === 200 && res.data) {
          this.overiewData = res.data;
          this.barData = res.data["0"];
          this.pieData = res.data["0"].now?.yearCompare;
          this.pieData1 = res.data["0"].compare?.yearCompare;
        }
      });
    },
    monthChange(data) {
      this.curMonth = numberTransfer(data + 1) + "月";
      switch (this.businessType) {
        case "出库":
          this.pieData = this.overiewData["0"].now?.chart[data] || [];
          this.pieData1 = this.overiewData["0"].compare?.chart[data] || [];
          break;
        case "入库":
          this.pieData = this.overiewData["1"].now?.chart[data] || [];
          this.pieData1 = this.overiewData["1"].compare?.chart[data] || [];
          break;
        case "调拔":
          this.pieData = this.overiewData["2"].now?.chart[data] || [];
          this.pieData1 = this.overiewData["2"].compare?.chart[data] || [];
          break;
        case "报废":
          this.pieData = this.overiewData["3"].now?.chart[data] || [];
          this.pieData1 = this.overiewData["3"].compare?.chart[data] || [];
          break;
        default:
          break;
      }
    },
    query() {
      this.getPage();
    },
    reset() {
      for (let k in this.formData) this.formData[k] = "";
      this.paging.pageNo = 1;
      this.paging.pageSize = 10;
      this.businessType = "出库";
      this.getPage();
      this.getData();
    },
    stockOrderTypeTrans(code) {
      let tempLabel = "";
      this.stockOrderTypeOptions.forEach((v) => {
        if (v.value === code) tempLabel = v.label;
      });
      return tempLabel;
    },
    responsitoryTrans(code) {
      let tempLabel = "";
      this.storehouseList.forEach((v) => {
        if (v.id === code) tempLabel = v.repoName;
      });
      return tempLabel;
    },
    stockTypeTrans(data, code) {
      return dictTrans(data, code);
    },
    handleCurrentChange(val) {
      this.paging.pageNo = val;
      this.getPage();
    },
    beforeUpload() { },
    uploadSuccess(res, file, fileList) {
      if (res.code == 500) {
        this.$message.error(res.msg);
      } else {
        this.$message.success("导入成功！");
        this.query();
      }
      this.$refs.upload.clearFiles();
    },
    uploadFail(err, file, fileList) {
      this.$refs.upload.clearFiles();
      this.$message.error(err.message);
    },
    //导出列表
    handleExport() {
      exportStockExcel(this.formData).then((res) => {
        let data = res;
        if (!data) return;
        let url = window.URL.createObjectURL(new Blob([data]));
        let link = document.createElement("a");
        link.style.display = "none";
        link.href = url;
        link.setAttribute("download", "库存清单.xls");
        document.body.appendChild(link);
        link.click();
      });
    },
    //导出模板
    donwloadTemplate() {
      downloadTemplate().then((res) => {
        let data = res;
        if (!data) return;
        let url = window.URL.createObjectURL(new Blob([data]));
        let link = document.createElement("a");
        link.style.display = "none";
        link.href = url;
        link.setAttribute("download", "库存清单模板.xls");
        document.body.appendChild(link);
        link.click();
      });
    },
    modifyThreshold(data) {
      this.$prompt("请输入库存阈值", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        confirmButtonClass: "confirm-btn ",
        cancelButtonClass: "cancel-btn ",
        inputPattern: /^[0-9]+(.[0-9]{1,2})?$/,
        inputErrorMessage: "格式不正确",
        inputValue: data.threshold,
      })
        .then(({ value }) => {
          const tempObj = { id: data.id, threshold: value };
          updateThreshold(tempObj).then((res) => {
            if (res.code == 200) {
              this.$message.success("修改成功");
              this.reset();
            }
          });
        })
        .catch(() => { });
    },
    add() {
      this.$refs.addModalRef?.open();
    },
    stockRecords() {
      this.$router.push("stockRecord");
    },
    handleStockIn() {
      this.$refs.stockInModalRef?.open();
    },
    handleStockOut() {
      this.$refs.stockOutModalRef?.open();
    },
    handleTransfer() {
      this.$refs.transferModalRef?.open();
    },
    handleCheck() {
      this.$router.push("stockTaking");
    },
    handleScrap() {
      this.$refs.scrapModalRef?.open();
    },
  },
};
</script>

<style lang="scss" scoped>
.upkeep_work_order {
  width: 100%;
  height: 100%;
  position: relative;

  .navigation {
    width: 100%;
    height: calc(35% - 10px);
    margin-bottom: 15px;
    border-radius: 10px;

    .navigation_echarts {
      width: 100%;
      height: 100%;
    }
  }

  .search {
    width: 100%;
    height: 10%;
    // margin-bottom: 15px;

    ::v-deep .search-form {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;

      .search-row-1 {
        display: flex;
        flex-wrap: nowrap;
        width: 100%;
        margin-bottom: 0;

        .el-form-item {
          width: 16.66%;
          margin-right: 0;

          .el-input,
          .el-select,
          .el-date-editor {
            width: 100%;
          }
        }
      }

      .search-row-2 {
        display: flex;
        justify-content: space-between;
        width: 100%;
        align-items: center;
        flex-wrap: nowrap;
        margin-top: -5px;

        ::v-deep .el-form-item {
          margin-right: 0 !important;
          margin-bottom: 0 !important;
          display: flex;
          align-items: center;
        }

        .search-buttons {
          display: flex;
          justify-content: center;
          padding-right: 0;
          margin-bottom: 0;
          margin-right: 0;

          ::v-deep .el-form-item__content {
            margin-left: 0 !important;
            display: flex;
            align-items: center;
            white-space: nowrap;
          }
        }

        .left-aligned-buttons {
          justify-content: flex-start;
          flex: 1;
        }

        .center-aligned-buttons {
          justify-content: center;
          flex: 1;
        }

        .right-aligned-buttons {
          display: flex;
          margin-left: auto;
          flex-wrap: nowrap;
          margin-right: 60px;
        }
      }
    }
  }

  .table {
    width: 100%;
    height: 52%;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(90, 151, 250, 0.3);
    padding: 20px;
    display: flex;
    flex-direction: column;
  }
}

::v-deep .el-tabs__nav {
  margin-left: 50px;
}

::v-deep .el-form-item__content {
  width: calc(100% - 100px);
}

._uplaod-div {
  display: inline-block;
  margin: 0 10px;

  button {
    background-color: #409EFF;
  }
}

::v-deep .right-aligned-buttons .el-form-item__content {
  display: flex !important;
  flex-wrap: nowrap !important;
  white-space: nowrap;
}
</style>
