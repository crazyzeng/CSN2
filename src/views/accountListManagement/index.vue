<!-- 台账管理 -->
<template>
  <div class="account_list_management">
    <div class="navigation rounded-lg shadow-lg bg-white">
      <div class="navigation_echarts flex justify-between">
        <div class="left h-full w-1/2">
          <div class="h-full w-full overflow-hidden relative m-4">
            <span style="color: #000; position: absolute;font-size: 16px;font-weight: 600;">在编设备数量</span>
            <PieChart :data-item="dataItem" :data-options="deviceTypeOptions"></PieChart>
          </div>
        </div>
        <div class="right h-full w-1/2 flex justify-between relative m-4">
          <div class="h-full w-full overflow-hidden relative">
            <span style="color: #000; position: absolute;font-size: 16px;font-weight: 600;">年度新增设备数量</span>
            <PieChart :data-item="dataItem1" :data-options="deviceTypeOptions" legend-type="addNum"></PieChart>
          </div>
        </div>
      </div>
    </div>
    <div class="search">
      <el-row :gutter="20" align="middle">
        <el-col :span="20">
          <el-form :model="formData" label-width="90px">
            <el-row :gutter="20">
              <el-col :span="4">
                <el-form-item label="设备编号">
                  <el-input v-model="formData.equipmentNumber" style="width: 100%;" />
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="设备名称">
                  <el-input v-model="formData.equipmentName" style="width: 100%;" />
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="系统类型">
                  <el-select v-model="formData.equipmentSystem" style="width: 100%;">
                    <el-option v-for="item in systemTypeList" :key="item.itemValue" :label="item.itemText"
                      :value="item.itemValue" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="设备类型">
                  <el-select v-model="formData.equipmentType" style="width: 100%;">
                    <el-option v-for="item in deviceTypeOptions" :key="item.itemValue" :label="item.itemText"
                      :value="item.itemValue" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="使用状态">
                  <el-select v-model="formData.equipmentStatus" style="width: 100%;">
                    <el-option v-for="item in statusOptions" :key="item.value" :label="item.label"
                      :value="item.value" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-col>
        <el-col :span="4" style="text-align: right;">
          <el-button type="primary" icon="el-icon-search" @click="query">查询</el-button>
          <el-button type="primary" icon="el-icon-refresh" @click="reset">重置</el-button>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <div class="btn_group">
            <el-button type="primary" icon="el-icon-plus" @click="add">新增</el-button>
            <el-upload ref="upload" name="file" :show-file-list="false" :action="url" :before-upload="beforeUpload"
              :on-success="uploadSuccess" :on-error="uploadFail" :limit="1" accept=".xls, .xlsx">
              <el-button slot="trigger" type="primary" icon="el-icon-upload2" class="ml-2 mr-2">导入</el-button>
            </el-upload>
            <el-button type="primary" icon="el-icon-download" @click="handleExport">导出</el-button>
            <el-button type="primary" icon="el-icon-notebook-2" @click="donwloadTemplate">模板</el-button>
            <el-button type="primary" icon="el-icon-printer" @click="handlePrint">打印二维码</el-button>
          </div>
        </el-col>
      </el-row>
    </div>

    <div class="table">
      <el-table :data="tableData" height="100%">
        <el-table-column align="center" type="selection" width="60"> </el-table-column>
        <el-table-column align="center" prop="equipmentNumber" label="设备编号" width=""> </el-table-column>
        <el-table-column align="center" prop="equipmentName" label="设备名称" width=""> </el-table-column>
        <el-table-column align="center" prop="equipmentSystem" label="系统类型">
          <template #default="{ row }">{{ equipmentSystemLabel(row.equipmentSystem) }}</template>
        </el-table-column>
        <el-table-column align="center" prop="equipmentType" label="设备类型" width="">
          <template #default="{ row }">{{ equipmentTypeLabel(row.equipmentType) }}</template>
        </el-table-column>
        <el-table-column align="center" prop="installLocation" label="安装位置" width=""> </el-table-column>
        <el-table-column align="center" prop="installDate" label="安装日期" width=""></el-table-column>
        <el-table-column align="center" prop="createTime" label="设备新增日期" width="">
          <template #default="{ row }">{{ getCreateDate(row.createTime) }}</template>
        </el-table-column>
        <el-table-column align="center" prop="equipmentStatus" label="使用状态">
          <template #default="{ row }">{{ row.equipmentStatus === 0 ? "使用中" : "报废" }}</template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="220px">
          <template #default="{ row }">
            <el-link class="blue-link" @click="handleEdit(row)">编辑</el-link>
            <el-divider direction="vertical" />
            <el-link class="red-link" @click="handleDel(row)">删除</el-link>
            <el-divider direction="vertical" />
            <el-link class="blue-link" v-if="row.equipmentStatus === 0" @click="handleScrap(row)">报废</el-link>
            <el-divider direction="vertical" />
            <el-link class="green-link" @click="handleView(row)">查看详情</el-link>
          </template>
        </el-table-column>
      </el-table>
      <div class="th-pagination">
        <el-pagination style="float: right;" @current-change="handleCurrentChange"
          @size-change="handleSizeChange" :current-page="paging.pageNo" background
          :page-size="paging.pageSize" layout="total, prev, pager, next, jumper" :total="paging.total">
        </el-pagination>
      </div>
    </div>
    <AddOrEditModal ref="addEditmodal" @success="reset()"></AddOrEditModal>
    <DetailModal ref="detailModal"></DetailModal>
    <PrintDialog ref="printDialog" :form-data="formData"></PrintDialog>
  </div>
</template>

<script>
import PieChart from "./chart/PieChart.vue";
import AddOrEditModal from "./modal/AddOrEditModal.vue";
import DetailModal from "./modal/DetailModal.vue";
import PrintDialog from "./modal/PrintDialog.vue";
import { getAccountListByPage, delAccountList, exportAccountList, downloadTemplate, doScrap, fetchOverViewData } from "@/api/account-list.js";
import { getDict, dictTrans } from "@/api/common.js";
import { getUrl } from "@/utils";
export default {
  data() {
    return {
      paging: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      formData: {
        equipmentNumber: "",
        equipmentName: "",
        equipmentSystem: "",
        equipmentType: "",
        equipmentStatus: "",
      },
      systemTypeList: [],
      deviceTypeOptions: [],
      statusOptions: [
        {
          label: "使用中",
          value: 0,
        },
        {
          label: "报废",
          value: 7,
        },
      ],
      tableData: [],
      dataItem: {},
      dataItem1: {},
      dataItem2: {},
    };
  },

  components: { PieChart, AddOrEditModal, DetailModal, PrintDialog },

  computed: {
    url() {
      let url = getUrl("equipment/importExcel");
      return url;
    },
  },

  mounted() {
    this.init();
  },
  methods: {
    async getDictList() {
      await getDict("equipment_type").then((res) => {
        if (res.code === 200 && res.data.length > 0) this.deviceTypeOptions = res.data;
      });
      await getDict("system_type").then((res) => {
        if (res.code === 200 && res.data.length > 0) this.systemTypeList = res.data;
      });
    },
    init() {
      this.getDictList();
      this.getData();
    },
    getData() {
      getDict("equipment_type").then((res) => {
        if (res.code === 200 && res.data.length > 0) {
          this.deviceTypeOptions = res.data;
          fetchOverViewData().then((res) => {
            if (res.code === 200 && Object.keys(res.data).length > 0) {
              this.dataItem = res.data["TYPE"];
              this.dataItem1 = res.data["YEAR"];
            }
          });
        }
      });
      this.query();
    },
    query() {
      getAccountListByPage(this.formData, this.paging).then((res) => {
        if (res.code === 200 && res.data) {
          this.tableData = res.data.records;
          this.paging.total = res.data.total;
        }
      });
    },
    reset() {
      for (let k in this.formData) this.formData[k] = "";
      this.paging.pageNo = 1;
      this.paging.pageSize = 10;
      this.getData();
    },
    handleScrap(item) {
      this.$confirm("确认报废？", "提示", {
        confirmButtonClass: 'confirm-btn ',
        cancelButtonClass: 'cancel-btn ',
      })
        .then(() => {
          doScrap([item.equipmentId]).then((res) => {
            if (res.code === 200) {
              this.$message.success("操作成功");
              this.getData();
            }
          });
        })
        .catch(() => { });
    },
    handleEdit(item) {
      this.$refs.addEditmodal?.open(item);
    },
    handleDel(item) {
      this.$confirm("确定删除?", "提示", {
        confirmButtonClass: 'confirm-btn ',
        cancelButtonClass: 'cancel-btn ',
      })
        .then(() => {
          delAccountList([item.equipmentId]).then((res) => {
            if (res.code === 200) this.$message.success("删除成功");
            this.getData();
          });
        })
        .catch(() => { });
    },
    handleView(item) {
      this.$refs.detailModal?.open(item);
    },
    handleCurrentChange(val) {
      this.paging.pageNo = val;
      this.query();
    },
    handleSizeChange(val) {
      this.paging.pageSize = val;
      this.query();
    },
    add() {
      this.$refs.addEditmodal?.open({});
    },
    //导出列表
    handleExport() {
      exportAccountList(this.formData).then((res) => {
        let data = res;
        if (!data) return;
        let url = window.URL.createObjectURL(new Blob([data]));
        let link = document.createElement("a");
        link.style.display = "none";
        link.href = url;
        link.setAttribute("download", "设备台账.xls");
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
        link.setAttribute("download", "设备台账模板.xls");
        document.body.appendChild(link);
        link.click();
      });
    },
    handlePrint() {
      const routeData = this.$router.resolve({
        path: "/accountListManagement",
        query: {},
      });
      this.$refs.printDialog?.open(this.paging.pageSize);
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
    equipmentTypeLabel(val) {
      return dictTrans(this.deviceTypeOptions, val);
    },
    equipmentSystemLabel(val) {
      return dictTrans(this.systemTypeList, val);
    },
    getCreateDate(val) {
      return val.substr(0, 10);
    },
    getInstallDate(val) {
      return val?.installDate;
    },
  },
};
</script>
<style lang="scss" scoped>
.account_list_management {
  width: 100%;
  height: 100%;
  position: relative;

  .navigation {
    width: 100%;
    height: calc(30% - 15px);
    margin-bottom: 15px;
    border-radius: 10px;

    .navigation_echarts {
      width: 100%;
      height: 100%;
    }
  }

  .search {
    width: 100%;
    // height: calc(10% - 15px);
    margin-bottom: 15px;
  }

  .table {
    width: 100%;
    height: calc(60% - 12px);
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

.btn_group {
  display: flex;
  margin-left: 20px;
}
</style>
