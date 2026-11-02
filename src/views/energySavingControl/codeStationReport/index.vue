<!-- 冷站运行参数 2026-01-07 改为 设备运行参数 -->
<template>
  <section class="content_warp h-full">
      <!-- <el-divider class="curDivider" direction="vertical" /> -->
      <el-form :inline="true" :model="formData" class="demo-form-inline">
        <div>
          <el-form-item label="">
            <el-radio-group v-model="radioType" @change="radioChange">
              <el-radio-button label="3">运行时长</el-radio-button>
              <el-radio-button label="1">设备状态</el-radio-button>
              <el-radio-button label="2">传感器</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </div>
        <el-form-item v-if="radioType == 3" label="设备类型">
          <el-select style="width:210px" class="mulSelect_class" v-model="formData.equipmentType" placeholder="请选择设备类型"
            multiple collapse-tags>
            <el-option v-for="item in deviceTypeOptions" :key="item.itemValue" :label="item.itemText"
              :value="item.itemValue"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备名称">
          <el-input v-model="formData.equipmentName" placeholder="请输入设备名称"></el-input>
        </el-form-item>
        <el-form-item label="时间区间" prop="select" style="padding-left: 20px;">
          <el-radio-group v-model="formData.dateType" @change="timeTypeChange">
            <el-radio label="day">日</el-radio>
            <el-radio label="month">月</el-radio>
            <el-radio label="year">年</el-radio>
          </el-radio-group>
          <el-date-picker style="margin-left: 10px;" ref="dateChose" id="dateChose" v-model="formData.date"
            :type="periodTimeType" :format="datePickFormat" :value-format="datePickFormat" placeholder="选择时间"
            :clearable="false">
          </el-date-picker>
        </el-form-item>
        <el-form-item class="ml-2">
          <el-button type="primary" icon="el-icon-search" @click="query">查询</el-button>
          <el-button type="primary" icon="el-icon-refresh" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table v-if="radioType == 1" :data="tableData1" v-loading="loading1" element-loading-spinner="el-icon-loading"
        class="table-class">
        <el-table-column type="index" label="序号" width="100" align="center"></el-table-column>
        <el-table-column prop="startValue" label="设备状态" align="center" />
        <el-table-column prop="pointName" label="设备名称" min-width="150" align="center"></el-table-column>
        <el-table-column prop="startTime" label="开始时间" align="center" />
        <el-table-column prop="endTime" label="结束时间" align="center" />
        <el-table-column prop="duration" label="持续时长" align="center" />
      </el-table>
      <el-table v-if="radioType == 2" :data="tableData2" v-loading="loading2" element-loading-spinner="el-icon-loading"
        class="table-class">
        <el-table-column type="index" label="序号" width="100" align="center"></el-table-column>
        <el-table-column prop="pointName" label="设备名称" align="center"></el-table-column>
        <el-table-column prop="avgVal" label="点位值" align="center" />
        <el-table-column prop="recordTime" label="采集时间" align="center" />
      </el-table>
      <el-table v-if="radioType == 3" :data="tableData3" v-loading="loading3" element-loading-spinner="el-icon-loading"
        class="table-class">
        <el-table-column type="index" label="序号" width="100" align="center"></el-table-column>
        <el-table-column prop="equipmentType" label="设备类型" align="center"></el-table-column>
        <el-table-column prop="equipmentName" label="设备名称" align="center"></el-table-column>
        <el-table-column prop="duration" label="运行时长" align="center" />
        <el-table-column prop="" label="操作" align="center">
          <template #default="{ row }">
            <el-button type="text" @click="viewDetail(row)" class="detailBtn">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="详情" :visible.sync="selectDialogVisible" width="1130px" center append-to-body>
        <el-table :data="tableData" ref="multipleTable" style="width: 100%" max-height="400" row-key="pointId" border
          size="small">
          <el-table-column label="序号" type="index" width="70" align="center"></el-table-column>
          <el-table-column label="开始时间" prop="startTime" width="200" align="center"></el-table-column>
          <el-table-column label="开始状态" prop="startValue" min-width="150" align="center"></el-table-column>
          <el-table-column label="结束时间" prop="endTime" min-width="200" align="center"></el-table-column>
          <el-table-column label="结束状态" prop="endValue" min-width="150" align="center"></el-table-column>
          <el-table-column label="持续时间(秒)" prop="runTime" min-width="200" align="center"></el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button class="confirm-btn" @click="selectDialogVisible = false">确 定</el-button>
          <el-button class="cancel-btn" @click="selectDialogVisible = false">取 消</el-button>
        </div>
      </el-dialog>
      <el-pagination style="float: right; margin-top: 20px" @current-change="handleCurrentChange"
        :current-page="paging.pageNo" :page-size="paging.pageSize" layout="total, prev, pager, next, jumper"
        :total="paging.total" />
  </section>
</template>

<script>
import dayjs from "dayjs";
import { getDict } from "@/api/common.js";
import { handleEquipmentPageEquipmentRunTime, handleEquipmentPageEquipmentStatus, handleEquipmentPageSensorData } from "@/api/cold-station";

export default {
  data() {
    return {
      radioType: '3',
      formData: {
        dateType: "month",
        date: dayjs(new Date()).format("YYYY-MM"),
        queryDate: '',
        equipmentType: [],
        equipmentName: '',
      },
      tableData1: [],
      tableData2: [],
      tableData3: [],
      selectedList: [],
      deviceTypeOptions: [],
      paging: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      loading1: false,
      loading2: false,
      loading3: false,
      periodTimeType: "month",
      datePickFormat: "yyyy-MM",
      tableData: [], // 详情数据
      selectDialogVisible: false,
    };
  },
  mounted() {
    this.init();
  },

  methods: {
    timeTypeChange(data) {
      switch (data) {
        case "year":
          this.year();
          break;
        case "month":
          this.month();
          break;
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
      this.formData.date = dayjs(new Date()).format("YYYY-MM-DD");
    },

    month() {
      this.periodTimeType = "month";
      this.formData.dateType = "month";
      this.datePickFormat = "yyyy-MM";
      this.formData.date = dayjs(new Date()).format("YYYY-MM");
    },

    year() {
      this.periodTimeType = "year";
      this.formData.dateType = "year";
      this.datePickFormat = "yyyy";
      this.formData.date = dayjs(new Date()).format("YYYY");
    },

    async getDictList() {
      this.formData.equipmentType = []
      await getDict("equipment_type").then((res) => {
        if (res.code === 200 && res.data.length > 0) {
          this.deviceTypeOptions = res.data;
          this.deviceTypeOptions.forEach((item) => {
            this.formData.equipmentType.push(item.itemValue)
          })
        }
      });
    },

    async init() {
      await this.getDictList();
      await this.radioChange()
    },

    // 列表切换
    async radioChange(val) {

      this.tableData1 = []
      this.tableData2 = []
      this.tableData3 = []

      this.paging = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      };

      this.formData.dateType = 'month'
      this.formData.date = dayjs(new Date()).format("YYYY-MM")
      this.formData.queryDate = ''
      this.formData.equipmentType = []
      this.formData.equipmentName = ''
      this.periodTimeType = 'month'
      this.datePickFormat = "yyyy-MM"

      if (this.formData.dateType === 'day') {
        this.formData.queryDate = dayjs(this.formData.date).format("YYYYMMDD");
      } else if (this.formData.dateType === 'month') {
        this.formData.queryDate = dayjs(this.formData.date).format("YYYYMM");
      } else if (this.formData.dateType === 'year') {
        this.formData.queryDate = dayjs(this.formData.date).format("YYYY");
      }

      if (val == 1) {
        this.getStatusData();
      } else if (val == 2) {
        this.getSensorData();
      } else {
        await this.getDictList();
        await this.getRunTimeData();
      }
    },

    // 运行时长列表
    getRunTimeData() {
      this.loading3 = true;
      const data = {
        queryDate: this.formData.queryDate,
        equipmentType: this.formData.equipmentType,
        equipmentName: this.formData.equipmentName,
        dateType: this.formData.dateType,
        pageNo: this.paging.pageNo,
        pageSize: this.paging.pageSize,
      };
      handleEquipmentPageEquipmentRunTime(data, this.paging).then((res) => {
        this.tableData3 = res.data.records;
        this.paging.total = res.data.total;
        this.loading3 = false;
      });
    },

    // 获取设备状态列表
    getStatusData() {
      this.loading1 = true;
      const data = {
        queryDate: this.formData.queryDate,
        equipmentType: '',
        equipmentName: this.formData.equipmentName,
        dateType: this.formData.dateType,
        pageNo: this.paging.pageNo,
        pageSize: this.paging.pageSize,
      };
      handleEquipmentPageEquipmentStatus(data, this.paging).then((res) => {
        this.tableData1 = res.data.records;
        this.paging.total = res.data.total;
        this.loading1 = false;
      });
    },

    // 获取传感器列表
    getSensorData() {
      this.loading2 = true;
      const data = {
        queryDate: this.formData.queryDate,
        equipmentType: '',
        equipmentName: this.formData.equipmentName,
        dateType: this.formData.dateType,
        pageNo: this.paging.pageNo,
        pageSize: this.paging.pageSize,
      };
      handleEquipmentPageSensorData(data, this.paging).then((res) => {
        this.tableData2 = res.data.records;
        this.paging.total = res.data.total;
        this.loading2 = false;
      });
    },

    // 分页
    handleCurrentChange(newPage) {
      this.paging.pageNo = newPage;
      this.query();
    },

    //查询
    async query() {

      if (this.formData.dateType === 'day') {
        this.formData.queryDate = dayjs(this.formData.date).format("YYYYMMDD");
      } else if (this.formData.dateType === 'month') {
        this.formData.queryDate = dayjs(this.formData.date).format("YYYYMM");
      } else if (this.formData.dateType === 'year') {
        this.formData.queryDate = dayjs(this.formData.date).format("YYYY");
      }

      if (this.radioType == 1) {
        this.getStatusData();
      } else if (this.radioType == 2) {
        this.getSensorData();
      } else {
        if (this.formData.equipmentType.length) {
          await this.getRunTimeData();
        } else {
          this.$message.warning('最少选择一个设备类型')
        }
      }
    },

    //重置
    reset() {
      this.radioChange(this.radioType)
    },

    // 详情
    viewDetail(item) {
      this.selectDialogVisible = true
      this.tableData = item.detail
    }
  },
};
</script>

<style lang="scss" scoped>

.content_warp {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 0 6px rgba(90, 151, 250, 0.3);
  padding: 10px 20px;
}

.checkbox-group-vertical .el-checkbox {
  display: block;
  margin-bottom: 10px;
  /* 可选，设置每个复选框之间的间距 */
  margin-left: 20px;
}

.table-class {
  height: calc(100vh - 300px);
}

</style>