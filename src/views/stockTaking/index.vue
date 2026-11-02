<!-- 盘点 -->
<template>
  <section class="container_warp">
    <section class="container_box">
      <el-container class="th-container-view">
        <el-main>
          <el-form ref="formData" :model="formData" :inline="true">
            <el-form-item label="盘点单号">
              <el-input v-model="formData.checkNumber" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="盘点仓库">
              <el-select v-model="formData.repository">
                <el-option v-for="(item, index) in storehouseList" :key="index" :label="item.repoName"
                  :value="item.repoNumber"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="创建时间" class="createTime">
              <el-date-picker v-model="selectTime" type="daterange" range-separator="至" start-placeholder="开始日期"
                end-placeholder="结束日期" value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="formData.status">
                <el-option v-for="(item, index) in statusOptions" :key="index" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item style="margin-right: 0; float: right">
              <el-button type="primary" icon="el-icon-search" @click="query">查询</el-button>
              <el-button type="primary" icon="el-icon-refresh" @click="reset">重置</el-button>
            </el-form-item>
          </el-form>
          <section class="btn_left_box">
            <el-button type="primary" icon="el-icon-plus" @click="add">新增</el-button>
            <el-button type="primary" icon="el-icon-download" @click="handleExport">导出</el-button>
          </section>
          <div class="table_div">
            <el-table :data="tableData" height="100%">
              <el-table-column prop="checkNumber" label="盘点单号" min-width="100" align="center"> </el-table-column>
              <el-table-column prop="repository" label="盘点仓库" min-width="100" align="center">
                <template #default="{ row }">{{ responsitoryTrans(row.repository) }}</template>
              </el-table-column>
              <el-table-column prop="createTime" label="创建时间" min-width="200px" align="center"> </el-table-column>
              <el-table-column prop="completeTime" label="完成时间" min-width="200px" align="center"> </el-table-column>
              <el-table-column prop="status" label="状态" min-width="100" align="center">
                <template #default="{ row }">
                  <div>
                    {{ row.status === 1 ? "已完成" : "未完成" }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="" label="操作" min-width="120px" align="center">
                <template #default="{ row }">
                  <el-link class="blue-link" @click="generateSheet(row)">生成盘点单</el-link>
                  <el-divider direction="vertical" />
                  <el-link class="green-link" :disabled="row.status === 1"
                    @click="handleCompleteCheck(row)">完成盘点</el-link>
                </template>
              </el-table-column>
            </el-table>
            <div class="th-pagination">
              <el-pagination @current-change="handleCurrentChange" :current-page="paging.pageNo" background
                :page-size="paging.pageSize" layout="total, prev, pager, next, jumper" :total="paging.total">
              </el-pagination>
            </div>
            <CompleteCheck ref="completeModalRef" @success="reset()"></CompleteCheck>
            <!-- 新增弹窗 -->
            <el-dialog title="新增盘点单" :visible.sync="dialogVisible" center width="350px" :before-close="handleClose">
              <section class="dialog_content">
                <p style="margin-bottom: 10px;">
                  <span>盘点仓库：</span>
                  <el-select v-model="storehouse">
                    <el-option v-for="(item, index) in storehouseList" :key="index" :label="item.repoName"
                      :value="item.id"></el-option>
                  </el-select>
                </p>
                <p style="text-align: center; margin-top: 60px" slot="footer" class="dialog-footer">
                  <el-button type='primary' icon="" @click="submit">确定</el-button>
                  <el-button type='primary' icon="" @click="cancel">返回</el-button>
                </p>
              </section>
            </el-dialog>
          </div>
        </el-main>
      </el-container>
    </section>
  </section>
</template>

<script>
import CompleteCheck from "./modal/CompleteCheck.vue";
import { getPage, getStorehouseList, exportCheckOrder, addCheckOrder, exportCheckList } from "@/api/warehouse/check.js";
export default {
  data() {
    return {
      paging: {
        pageNo: 1,
        pageSize: 10,
        total: 100,
      },
      selectTime: "",
      formData: {
        checkNumber: "",
        repository: "",
        status: "",
        startTime: "",
        endTime: "",
      },
      statusOptions: [
        { label: "未完成", value: 0 },
        { label: "已完成", value: 1 },
      ],
      storehouseList: [],
      storehouse: "",
      dialogVisible: false,
      tableData: [],
    };
  },

  components: { CompleteCheck },

  computed: {},

  mounted() {
    this.query();
    this.getSelect();
  },

  methods: {
    getSelect() {
      getStorehouseList().then((res) => {
        this.storehouseList = res.data;
      });
    },
    getData() {
      getPage(this.formData, this.paging).then((res) => {
        this.tableData = res.data.records;
        this.paging.total = res.data.total;
      });
    },
    query() {
      this.formData.startTime = this.selectTime[0];
      this.formData.endTime = this.selectTime[1];
      this.getData();
    },
    async reset() {
      for (let k in this.formData) this.formData[k] = "";
      this.selectTime = "";
      this.paging.pageNo = 1;
      this.paging.pageSize = 10;
      this.getData();
    },
    add() {
      this.dialogVisible = true;
    },
    // 新增盘点单
    submit() {
      if (this.storehouse !== "") {
        addCheckOrder(this.storehouse).then((res) => {
          if (res.code === 200) {
            this.$message({ type: "success", message: res.msg || "新增成功" });
            this.query();
          } else {
            this.$message({ type: "error", message: res.msg || "新增失败" });
          }
          this.storehouse = "";
          this.dialogVisible = false;
        });
      }
    },
    cancel() {
      this.dialogVisible = false;
    },
    handleExport() {
      exportCheckList(this.formData).then((res) => {
        if (res) {
          let data = res;
          if (!data) return;
          let url = window.URL.createObjectURL(new Blob([data]));
          let link = document.createElement("a");
          link.style.display = "none";
          link.href = url;
          link.setAttribute("download", `盘点表.xls`);
          document.body.appendChild(link);
          link.click();
          this.$message({
            type: "success",
            message: "导出成功",
          });
        }
      });
    },
    handleCurrentChange(val) {
      this.paging.pageNo = val;
      this.getData();
    },
    responsitoryTrans(code) {
      let tempLabel = "";
      this.storehouseList.forEach((v) => {
        if (v.id === code) tempLabel = v.repoName;
      });
      return tempLabel;
    },
    // 生成盘点单
    generateSheet(item) {
      this.$confirm("是否生成盘点单?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        confirmButtonClass: "confirm-btn ",
        cancelButtonClass: "cancel-btn ",
        type: "warning",
      })
        .then(() => {
          exportCheckOrder(item.id).then((res) => {
            if (res) {
              console.log("res: ", res);
              let data = res;
              if (!data) return;
              let url = window.URL.createObjectURL(new Blob([data]));
              let link = document.createElement("a");
              link.style.display = "none";
              link.href = url;
              link.setAttribute("download", `${item.checkNumber}盘点单.xls`);
              document.body.appendChild(link);
              link.click();
              //
              this.$message({
                type: "success",
                message: "盘点单生成成功",
              });
            }
          });
        })
        .catch(() => { });
    },
    // 完成盘点
    handleCompleteCheck(row) {
      this.$refs.completeModalRef?.open(row);
    },
    handleClose() { },
  },
};
</script>
<style lang="scss" scoped>
.container_warp {
  width: 100%;
  height: 100%;
}

.container_box {
  height: 100%;
}

::v-deep {
  .th-container-view {
    width: 100%;
    height: 100%;
  }
}

.table_div {
  width: 100%;
  height: calc(100vh - 196px);
  min-height: 400px;
  background-color: #fff !important;
  border-radius: 10px;
  box-shadow: 0 0 6px rgba(90, 151, 250, 0.3);
  padding: 20px;
  display: flex;
  margin-top: 10px;
  flex-direction: column;
}

// ::v-deep .el-pagination {
//   button {
//     background-color: transparent;
//     border: 1px solid #364d79;
//     color: #fff;
//     border-radius: 4px;
//   }

//   // .el-input__inner {
//   //   border-radius: 0%;
//   // }
// }

// ::v-deep .el-pager {
//   li {
//     background-color: transparent;
//     border: 1px solid #364d79;
//     color: #fff;
//     margin: 0 2.5px;
//     border-radius: 4px;
//   }

//   li.active+li {
//     border-left: 1px solid #364d79;
//   }

//   li.active {
//     background-image: linear-gradient(180deg, #66ffff, #0073e5);
//   }
// }

// .customBtn.submitBtn {
//   width: 60px;
//   height: 30px;
//   background-color: #2e6cd8;
//   color: #fff;
// }

// .backBtn {
//   width: 60px;
//   height: 30px;
//   background-color: transparent;
//   border: 1px solid #2e6cd8;
//   color: #fff;
// }

// .customBtn {
//   background-color: #2a3e62;
// }

// .remarkBtn {
//   color: #7faaff;
// }

// .detailBtn {
//   color: #1ec695;
// }

// .is-disabled.detailBtn {
//   color: #c0c4cc;
// }

.btn_group {
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
}

// .addBtn {
//   border-color: #1ec695;
// }

// .wbtn {
//   background-color: transparent;
//   color: #fff;
// }

// .uploadBtn,
// .exportBtn {
//   border-color: #486aa8;
// }

// //
// ::v-deep.el-date-editor .el-range-separator {
//   padding-right: 15px;
//   padding-top: 2px;
// }

// //
// .el-date-editor.el-input__inner {
//   width: 450px;
// }

// ::v-deep.el-input__icon.el-range__close-icon {
//   display: none !important;
// }

// ::v-deep.el-date-editor .el-range__close-icon {
//   display: none !important;
// }

// ::v-deep {
//   .createTime {
//     .el-form-item__content {
//       width: 380px !important;
//     }
//   }
// }

// .th-main-view {
//   padding: 0 10px;
//   right: 0;
// }



// ::v-deep {
//   .th-main-title h2 {
//     margin-left: 10px !important;
//   }
</style>
