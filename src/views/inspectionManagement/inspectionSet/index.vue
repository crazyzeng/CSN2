<!-- 智能巡检-配置 -->
<template>
  <section class="container_warp">
        <el-form :model="formData" :inline="true">
          <el-form-item label="设备编号">
            <el-input v-model="formData.equipmentNumber"></el-input>
          </el-form-item>
          <el-form-item label="设备名称">
            <el-input v-model="formData.equipmentName"></el-input>
          </el-form-item>
          <el-form-item label="设备类型">
            <el-select v-model="formData.equipmentType">
              <el-option v-for="item in deviceTypeOptions" :key="item.itemValue" :label="item.itemText" :value="item.itemValue"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="项ID">
            <el-input v-model="formData.pointId"></el-input>
          </el-form-item>
          <el-form-item label="项名称">
            <el-input v-model="formData.description"></el-input>
          </el-form-item>
          <el-form-item style="float: right; margin-right: 0">
            <el-button type="primary" icon="el-icon-search" @click="query">查询</el-button>
            <el-button type="primary" icon="el-icon-refresh" @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
        <div class="flex items-center gap-2 mb-4">
          <el-button type="primary" plain @click="add">新增</el-button>
          <!-- <el-button type="primary" class="customBtn" @click="handleUpload">导入</el-button> -->
          <el-upload
            ref="upload"
            class="flex items-center"
            name="file"
            :show-file-list="false"
            :action="uploadUrl"
            :on-success="uploadSuccess"
            :on-error="uploadFail"
            :limit="1"
            accept=".xls, .xlsx"
          >
            <el-button plain slot="trigger" type="primary" icon="">导入</el-button>
            <div slot="tip" class="el-upload__tip"></div>
          </el-upload>
          <el-button type="primary" plain @click="downloadTemplate">模板下载</el-button>
          <!-- <el-button type="primary" class="customBtn" @click="batchDel">批量删除</el-button> -->
        </div>
        <div class="table_div">
          <el-table
            :data="tableData"
            style="width: 100%"
            height="calc(100% - 50px)"
            :row-style="{ height: '48px' }"
            :header-row-style="{ height: '48px' }"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" label="" width="60" align="center"> </el-table-column>
            <el-table-column prop="equipmentNumber" label="设备编号" width="200" align="center"> </el-table-column>
            <el-table-column prop="equipmentName" label="设备名称" width="100" align="center"> </el-table-column>
            <el-table-column prop="equipmentType" label="设备类型" align="center">
              <template #default="{ row }">{{ equipmentTypeTrans(deviceTypeOptions, row.equipmentType) }}</template>
            </el-table-column>
            <el-table-column prop="pointId" label="项ID" align="center"> </el-table-column>
            <el-table-column prop="description" label="项名称" align="center"> </el-table-column>
            <el-table-column prop="minVal" label="标准最小值" align="center"> </el-table-column>
            <el-table-column prop="maxVal" label="标准最大值" align="center"> </el-table-column>
            <el-table-column prop="" label="操作" align="center">
              <template #default="{ row }">
                <el-link class="blue-link" @click="edit(row)" :disabled="row.status == 1">编辑</el-link>
                <el-divider direction="vertical" />
                <el-link class="green-link" v-if="row.status == 0" @click="start(row)">启用</el-link>
                <el-link class="red-link" v-else @click="stop(row)">停用</el-link>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            style="float: right; margin-top: 10px"
            @current-change="handleCurrentChange"
            :current-page="paging.pageNo"
            :page-size="paging.pageSize"
            layout="total, prev, pager, next, jumper"
            :total="paging.total"
          >
          </el-pagination>
        </div>
        <AddOrEdit ref="addOrEditRef" @update="getData()"></AddOrEdit>
  </section>
</template>

<script>
import AddOrEdit from "./modal/AddOrEdit.vue";
import { getConfigTemplate, switchConfig, getConfigListByPage } from "@/api/auto-inspection.js";
import { getDict, dictTrans } from "@/api/common.js";
import { getUrl } from "@/utils";
export default {
  data() {
    return {
      formData: {
        equipmentNumber: "",
        equipmentName: "",
        equipmentType: "",
        pointId: "",
        description: "",
      },
      paging: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      tableData: [],
      selectedData: [],
      deviceTypeOptions: [],
    };
  },

  components: { AddOrEdit },

  computed: {
    uploadUrl() {
      let url = getUrl("/smartInspect/config/import");
      return url;
    },
  },

  mounted() {},
  created() {
    this.$nextTick(() => {
      this.init();
    });
  },
  methods: {
    init() {
      this.getData();
      getDict("equipment_type").then((res) => {
        this.deviceTypeOptions = res.data;
      });
    },
    //查询
    query() {
      this.getData();
    },
    //重置
    reset() {
      for (let k in this.formData) this.formData[k] = "";
      this.paging.pageNo = 1;
      this.paging.pageSize = 10;
      this.query();
    },
    getData() {
      getConfigListByPage(this.formData, this.paging).then((res) => {
        if (res.code === 200 && res.data) {
          this.tableData = res.data.records;
          this.paging.total = res.data.total;
        }
      });
    },
    add() {
      this.$refs.addOrEditRef?.open();
    },
    edit(item) {
      this.$refs.addOrEditRef?.open(item);
    },
    handleUpload() {},
    downloadTemplate() {
      getConfigTemplate().then((res) => {
        let data = res;
        if (!data) return;
        let url = window.URL.createObjectURL(new Blob([data]));
        let link = document.createElement("a");
        link.style.display = "none";
        link.href = url;
        link.setAttribute("download", "配置模板.xls");
        document.body.appendChild(link);
        link.click();
      });
    },
    start(item) {
      this.$confirm("确认启用？", "提示", {
        confirmButtonClass: "confirm-btn ",
        cancelButtonClass: "cancel-btn ",
      })
        .then(() => {
          switchConfig(item.id, !item.status - 0).then((res) => {
            if (res.code === 200) {
              this.$message.success("启用成功");
              this.getData();
            }
          });
        })
        .catch(() => {});
    },
    stop(item) {
      this.$confirm("确认停用？", "提示", {
        confirmButtonClass: "confirm-btn ",
        cancelButtonClass: "cancel-btn ",
      })
        .then(() => {
          switchConfig(item.id, !item.status - 0).then((res) => {
            if (res.code === 200) {
              this.$message.success("停用成功");
              this.getData();
            }
          });
        })
        .catch(() => {});
    },
    handleCurrentChange(val) {
      this.paging.pageNo = val;
      this.getData();
    },
    handleSelectionChange(val) {
      this.selectedData = val;
    },
    equipmentTypeTrans(data, code) {
      return dictTrans(data, code);
    },
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
  },
};
</script>
<style lang="scss" scoped>
.container_warp {
  width: 100%;
  height: 100%;
}
.table_div {
  height: calc(100% - 95px);
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 0 6px rgba(90, 151, 250, 0.3);
  padding: 10px;
}

</style>
