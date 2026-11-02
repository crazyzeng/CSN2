<!-- 异常数据校正 -->
<template>
  <section class="container_warp">
    <section class="container_box">
      <el-container class="th-container-view">
        <el-main>
          <el-form :inline="true" :model="formData" class="demo-form-inline">
            <el-form-item label="虚拟点名称">
              <el-input v-model="formData.name" placeholder="请输入虚拟点名称"></el-input>
            </el-form-item>
            <el-form-item label="时间区间" prop="select" style="margin-left: 20px;">
              <el-date-picker style="margin-left: 10px;" ref="dateChose" id="dateChose" v-model="formData.queryDate"
                :type="periodTimeType" :format="datePickFormat" :value-format="datePickFormat" placeholder="选择时间"
                :clearable="false">
              </el-date-picker>
            </el-form-item>

            <el-form-item class="ml-2">
              <el-button type="primary" icon="el-icon-search" @click="query">查询</el-button>
              <el-button type="primary" icon="el-icon-refresh" @click="reset">重置</el-button>
            </el-form-item>
          </el-form>
          <div class="table_div">
            <el-table 
              :data="tableData1" 
              v-loading="loading" 
              height="100%"
              element-loading-spinner="el-icon-loading"
              element-loading-text="加载中...">
              <el-table-column type="index" label="序号" width="100" align="center"></el-table-column>
              <el-table-column prop="simulatePointId" label="虚拟点ID" align="center"></el-table-column>
              <el-table-column prop="simulatePointName" label="虚拟点名称" align="center"></el-table-column>
              <el-table-column prop="orgName" label="所属资源" align="center"></el-table-column>
              <el-table-column prop="expressions" label="计算表达式" align="center">
                <template #default="{ row }">
                  <el-tooltip v-if="row.expressions.length > 10" effect="dark" placement="top"
                    :content="row.expressions" :disabled="row.expressions.length <= 10" :enterable="false">
                    <div class="multiline-text">
                      {{ row.expressions }}
                    </div>
                  </el-tooltip>
                  <div v-else>
                    {{ row.expressions }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="data" label="能耗值" align="center"></el-table-column>
              <el-table-column prop="" label="操作" align="center">
                <template #default="{ row }">
                  <div class=" mt-2 mb-2">
                    <el-link class="blue-link" @click="viewDetail(row)">详情</el-link>
                    <el-divider direction="vertical" />
                    <el-link class="blue-link" type="text" @click="onRefresh">刷新</el-link>
                  </div>
                </template>
              </el-table-column>
            </el-table>

            <!-- 修改后的对话框 -->
            <el-dialog title="详情" :visible.sync="selectDialogVisible" :before-close="handleClose" width="1000px" center
              append-to-body>
              <div class="dialog-scrollable">
                <el-table :data="tableData" border max-height="400px" width="500px">
                  <el-table-column type="index" align="center" label="序号" width="55"></el-table-column>
                  <el-table-column prop="pointId" align="center" label="点位ID" width="120"></el-table-column>
                  <el-table-column prop="name" align="center" label="点位名称" width="250"></el-table-column>
                  <el-table-column v-for="(column, index) in dynamicColumns" :key="index" :prop="column.prop"
                    :label="column.label" align="center" min-width="100">
                    <template #default="{ row }">
                      <el-input v-model="row[column.prop]" class="dialogInput"
                        @input="recordChange(row, column.prop, row[column.prop])" size="mini"></el-input>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="handleClose">取 消</el-button>
                <el-button type="primary" @click="handlcSubmit" :loading="isSubmitLoading">确 定</el-button>
              </span>
            </el-dialog>

            <div class="th-pagination">
              <el-pagination @current-change="handleCurrentChange"
                :current-page="paging.pageNo" :page-size="paging.pageSize" layout="total, prev, pager, next, jumper" background
                :total="paging.total" />
            </div>
          </div>
        </el-main>
      </el-container>
    </section>
  </section>
</template>

<script>
import dayjs from "dayjs";
import { getDict } from "@/api/common.js";
import { energyDataResetPointDataHours, handleEnergyDataResetPointDataHours } from "@/api/data-correction";

export default {
  data() {
    return {
      formData: {
        dateType: "day",
        queryDate: dayjs(new Date()).format("YYYY-MM-DD"),
        name: '',
      },
      tableData1: [],
      selectedList: [],
      paging: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      loading: false,
      isSubmitLoading: false,
      periodTimeType: "date",
      datePickFormat: "yyyy-MM-dd",
      selectDialogVisible: false, // 改为false，初始不显示
      rawData: [],          // 原始动态数据
      tableData: [],        // 处理后的表格数据
      dynamicColumns: [],    // 动态生成的列配置
      details: [],
      formattedDetails: []
    };
  },
  mounted() {
    this.init();
  },

  methods: {
    timeTypeChange(data) {
      switch (data) {
        case "day":
          this.day();
          break;
        default:
          break;
      }
    },

    day() {
      this.periodTimeType = "date";
      this.formData.dateType = "day";
      this.datePickFormat = "yyyy-MM-dd";
      this.formData.queryDate = dayjs(new Date()).format("YYYY-MM-DD");
    },

    async init() {
      this.query()
    },

    // 分页
    handleCurrentChange(newPage) {
      this.paging.pageNo = newPage;
      this.query();
    },

    //查询
    async query() {
      this.loading = true;
      const res = await energyDataResetPointDataHours(this.formData, this.paging)
      if (res.code === 200) {
        this.tableData1 = res.data.records
        this.loading = false;
        this.paging.total = res.data.total;
      }
    },

    //重置
    reset() {
      this.formData.queryDate = dayjs(new Date()).format("YYYY-MM-DD")
      this.formData.name = ''
      this.query()
    },

    // 详情
    viewDetail(item) {
      this.rawData = item.detail
      this.processData();
      this.selectDialogVisible = true
    },

    onRefresh() {
      this.query()
      this.$message.success("刷新成功");
    },

    processData() {
      this.dynamicColumns = Array.from({ length: 24 }, (_, i) => ({
        prop: i < 10 ? `0${i}` : `${i}`,
        label: `${i < 10 ? '0' : ''}${i}:00`
      }))

      this.tableData = this.rawData.map(item => {
        const pointData = {
          pointId: item.pointId,
          name: item.name,
          dataDateMap: {}
        }

        item.datas.forEach(dataItem => {
          const hour = dataItem.dataDate.slice(-2)
          pointData[hour] = dataItem.dataValue || 0,
            pointData.dataDateMap[hour] = dataItem.dataDate;
        })

        return pointData
      })
    },

    // 修改记录方法
    recordChange(row, field, newValue) {
      const dataDate = row.dataDateMap[field];

      const date = dayjs(dataDate, 'YYYYMMDDHH');
      const date1 = date.format('YYYY-MM-DD HH:mm:ss')

      const newRecord = {
        pointId: row.pointId,
        name: row.name,
        dataDate: date1,
        dataValue: newValue
      };

      this.details = this.details.filter(record =>
        record.dataDate !== date1
      );

      this.details.unshift(newRecord);

    },

    // 详情弹窗关闭
    handleClose() {
      this.rawData = []
      this.tableData = []
      this.dynamicColumns = []
      this.details = []
      this.formattedDetails = []
      this.selectDialogVisible = false
      this.isSubmitLoading = false;
    },

    // 详情确定
    async handlcSubmit() {
      this.isSubmitLoading = true;
      try {
        const res = await handleEnergyDataResetPointDataHours(this.details)
        if (res.code === 200) {
          this.isSubmitLoading = false;
          this.$message.success("修改成功");
          this.selectDialogVisible = false
        }
      } catch (error) {
        this.isSubmitLoading = false;
        // this.$message.error("修改失败");
      }

    },
  }
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

.table_div {
  width: 100%;
  height: calc(100vh - 156px);
  min-height: 400px;
  background-color: #fff !important;
  border-radius: 10px;
  box-shadow: 0 0 6px rgba(90, 151, 250, 0.3);
  padding: 20px;
  display: flex;
  flex-direction: column;
}

::v-deep {
  .th-container-view {
    width: 100%;
    height: 100%;
  }
}

::v-deep .el-tabs {
  background: none !important;
  border: none;

  .el-tabs__nav-wrap::after {
    background-color: #2a3e62;
  }

  >.el-tabs__header {
    border-color: #2a3e62;
    background: none !important;

    .el-tabs__item.is-active {
      background-color: transparent;
      border: none;
      color: #409eff !important;
    }

    .el-tabs__item {
      border: none;
      color: #fff;
    }
  }
}

::v-deep .el-form-item {
  >.el-form-item__label {
    color: #fff;
  }
}

::v-deep .el-radio-group {
  >.is-active {
    .el-radio-button__inner {
      background-color: #409eff !important;
    }
  }

  .el-radio-button__inner {
    background: #2a3e62 !important;
    color: #fff !important;
    border: none !important;
  }
}

::v-deep .el-input>.el-input__inner {
  text-overflow: ellipsis;
}

::v-deep .mulSelect_class {
  margin-right: 20px;

  .el-tag.el-tag--info {
    color: #fff;
    background-color: rgb(25, 70, 133);
    border-color: rgb(25, 70, 133);
  }

  .el-select-dropdown.is-multiple .el-select-dropdown__item.selected.hover {
    background-color: rgb(25, 70, 133) !important;
  }

  .el-input>.el-input__inner {
    width: 220px !important;
  }
}

.multiline-text {
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  word-break: break-word;
  margin: 0 auto;
}

::v-deep .dialogInput {
  .el-input__inner {
    width: 80px !important;
  }
}


::v-deep .dialog-scrollable {
  width: 100% !important;
  height: 400px !important;
  overflow-y: scroll !important;
}

::v-deep .dialog-scrollable .el-table {
  ::-webkit-scrollbar {
    display: block;
  }

  width: 100% !important;
  height: 400px !important;
  overflow-y: scroll !important;
}

::v-deep .el-table {
  /* 让表格内部处理滚动，通常不需要在外部强制 overflow，除非高度受限 */
  flex: 1; /* 让表格占据剩余空间 */
  min-height: 0; /* 防止 flex 子元素溢出 */
}

::v-deep .el-form-item {
  >.el-form-item__label {
    color: #000;
  }
}
</style>
