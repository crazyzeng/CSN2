<template>
  <div class="mt-5">
    <el-form :model="formData" class="" :inline="true">
      <el-form-item label="时间" class="">
        <el-date-picker v-model="formData.dataTime" type="month" format="yyyy-MM" value-format="yyyy-MM" placeholder="选择月份" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="query">查询</el-button>
        <el-button type="primary" icon="el-icon-refresh-left" @click="reset">重置</el-button>
      </el-form-item>
      <!-- 更多操作按钮 -->
      <el-form-item style="margin-right: 0; float: right">
        <el-button plain type="primary" round icon="el-icon-plus" @click="handleAdd">新增</el-button>
        <el-button plain type="primary" icon="el-icon-download" @click="handleExport">导出模板</el-button>
        <el-upload class="uploadBtn" :action="uploadUrl" :on-success="uploadSuccess" :on-error="uploadFail" :show-file-list="false">
          <el-button plain type="primary" icon="el-icon-upload2">导入</el-button>
        </el-upload>
        <el-button plain type="primary" icon="el-icon-delete" @click="handleBatchDelete">批量删除</el-button>
      </el-form-item>
    </el-form>

    <!-- 数据表格 -->
    <el-table :data="tableData" @selection-change="handleSelectionChange" height="calc(100vh - 380px)" class="curTable">
      <el-table-column align="center" type="selection" width="55"></el-table-column>
      <el-table-column align="center" type="index" label="序号" width="65"></el-table-column>
      <el-table-column align="center" prop="date" label="时间"></el-table-column>
      <el-table-column align="center" prop="touristNumber" label="发送旅客数"></el-table-column>
      <el-table-column align="center" label="操作" width="200">
        <template #default="{ row }">
          <el-link class="blue-link" @click="handleEdit(row)">编辑</el-link>
          <el-divider direction="vertical" />
          <el-link class="red-link" @click="handleDelete(row)">删除</el-link>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      style="float: right; margin-top: 40px"
      @current-change="handleCurrentChange"
       @size-change="sizeChange"
      :current-page="currentPage"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>

    <!-- 新增/编辑弹窗 -->
    <el-dialog :visible.sync="dialogVisible" title="发送旅客数" width="450px" >
      <el-form :model="editData" :rules="rules" ref="form" inline label-width="100px">
        <el-form-item label="月份" prop="date">
          <el-date-picker v-model="editData.date" type="month" placeholder="选择月份" />
        </el-form-item>
        <el-form-item label="发送旅客数" prop="touristNumber">
          <el-input v-model="editData.touristNumber">
            <template #append>人次</template>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="footer-class">
        <el-button type="primary"  @click="saveData"> 确 定 </el-button>
        <el-button @click="dialogVisible = false"> 取 消 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  deleteTouristData,
  getTouristDataExcelTemplate,
  getTouristDataPage,
  updateTouristData,
  addTouristData,
} from "@/views/energyDataAnalysis/WeatherForecast/api";
import { getUrl } from "@/utils";

export default {
  name: "PassengerManagement",
  data() {
    return {
      formData: { dataTime: "" },
      dialogVisible: false,
      editData: {},
      selectedRows: [],
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      rules: {
        date: [{ required: true, message: "请选择月份", trigger: "blur" }],
        touristNumber: [{ required: true, message: "请输入发送旅客数", trigger: "blur" }],
      },
    };
  },
  mounted() {
    this.query();
  },
  computed: {
    uploadUrl() {
      return getUrl("/touristData/import");
    },
  },
  methods: {
    formatDate(date) {
      if (!date) return "";
      const d = new Date(date);
      let month = "" + (d.getMonth() + 1),
        day = "" + d.getDate(),
        year = d.getFullYear();

      if (month.length < 2) month = "0" + month;
      if (day.length < 2) day = "0" + day;

      return [year, month].join("-");
    },
    query() {
      // 模拟调用API
      getTouristDataPage({
        date: this.formData.dataTime,
        pageNo: this.currentPage,
        pageSize: this.pageSize,
      }).then((response) => {
        this.tableData = response.data.records;
        this.total = response.data.total;
      });
    },
    handleSizeChange(newSize) {
      this.pageSize = newSize;
      this.query();
    },
    handleCurrentChange(newPage) {
      this.currentPage = newPage;
      this.query();
    },
    sizeChange(newSize) {
      this.currentPage = 1;
      this.pageSize = newSize;
      this.query();
    },

    // 重置方法
    reset() {
      this.formData.dataTime = "";
      this.query();
    },

    // 新增方法
    handleAdd() {
      this.editData = {};
      this.dialogVisible = true;
    },

    // 导入方法
    handleImport() {
      // 触发上传组件的点击事件以打开文件选择器
      this.$refs.upload.click();
    },

    uploadSuccess(response) {
      if (response.code === 200) {
        this.$message({
          type: "success",
          message: "导入成功",
        });
        this.query(); // 重新查询更新表格
      } else {
        this.$message.error("导入失败");
      }
    },

    uploadFail() {
      this.$message.error("导入失败");
    },

    // 导出方法
    handleExport() {
      getTouristDataExcelTemplate().then((res) => {
        if (res) {
          let data = res;
          if (!data) return;
          let url = window.URL.createObjectURL(new Blob([data]));
          let link = document.createElement("a");
          link.style.display = "none";
          link.href = url;
          link.setAttribute("download", `发送旅客数管理.xls`);
          document.body.appendChild(link);
          link.click();
          this.$message({
            type: "success",
            message: "导出成功",
          });
        }
      });
    },

    // 批量删除方法
    handleBatchDelete() {
      if (this.selectedRows.length === 0) {
        this.$message.warning("请选择要删除的行");
        return;
      }

      this.$confirm("确认删除选中的数据吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        confirmButtonClass:'confirm-btn ',
        cancelButtonClass:'cancel-btn ',
        type: "warning",
      })
        .then(() => {
          const idsToDelete = this.selectedRows.map((row) => row.id);
          deleteTouristData(idsToDelete)
            .then(() => {
              this.$message.success("删除成功");
              this.query(); // 重新查询更新表格
            })
            .catch((error) => {
              this.$message.error("删除失败");
              console.error("删除失败:", error);
            });
        })
        .catch(() => {
          // 取消删除操作
        });
    },

    // 选中行变化时触发
    handleSelectionChange(selected) {
      this.selectedRows = selected;
    },

    handleEdit(row) {
      this.editData = Object.assign({}, row);
      this.dialogVisible = true;
    },

    saveData() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // 新增或者更新
          if (!this.editData.id) {
            this.editData.date = this.formatDate(this.editData.date);
            addTouristData({
              date: this.formatDate(this.editData.date),
              touristNumber: Number(this.editData.touristNumber),
            })
              .then((response) => {
                this.$message.success("新增成功");
                this.dialogVisible = false;
                this.query();
              })
              .catch((error) => {
                console.error("新增失败:", error);
              });
          } else {
            updateTouristData({
              id: this.editData.id,
              date: this.formatDate(this.editData.date),
              touristNumber: Number(this.editData.touristNumber),
            })
              .then((response) => {
                this.$message.success("保存成功");
                this.dialogVisible = false;
                this.query();
              })
              .catch((error) => {
                this.$message.error("保存失败");
                console.error("保存失败:", error);
              });
          }
        } else {
          // 验证未通过，显示提示
          this.$message.error("请检查输入项");
          return false;
        }
      });
    },

    handleDelete(row) {
      this.$confirm("确认删除这条数据吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        confirmButtonClass:'confirm-btn ',
        cancelButtonClass:'cancel-btn ',
        type: "warning",
      })
        .then(() => {
          deleteTouristData([row.id])
            .then(() => {
              this.$message.success("删除成功");
              this.query();
            })
            .catch((error) => {
              this.$message.error("删除失败");
              console.error("删除失败:", error);
            });
        })
        .catch(() => {
          // 取消删除操作
        });
    },
  },
};
</script>

<style scoped>
.edit_btn,
.del_btn {
  font-size: 16px;
}

.uploadBtn {
  display: inline-block;
  margin: 0 10px;
}
.footer-class{
    text-align: center;
}
</style>
