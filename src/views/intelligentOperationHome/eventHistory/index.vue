<!-- 事件记录（新） -->
<template>
  <section class="container_warp">
    <section class="container_box">
      <wl-main-title data-title="事件记录">
        <el-form :inline="true" :model="formData" class="demo-form-inline">
          <el-form-item label="设备名称">
            <!-- <el-input v-model="formData.equipmentName" placeholder="设备" style="width:140px;"></el-input> -->
            <el-autocomplete class="inline-input" v-model="formData.equipmentName" :fetch-suggestions="queryNameSearch"
              placeholder="请输入内容" @select="handleSelect" :popper-append-to-body="false" clearable
              @clear="equipmentNameClear"></el-autocomplete>
          </el-form-item>
          <el-form-item label="控制点位">
            <!-- <el-input v-model="formData.controlPoint" placeholder="请输入控制点位" style="width:140px;"></el-input> -->
            <el-autocomplete class="inline-input" v-model="formData.controlPoint" :popper-append-to-body="false"
              :fetch-suggestions="queryPointSearch" placeholder="请输入内容" @select="handleSelectPoint"
              :trigger-on-focus="triggerFocus" clearable></el-autocomplete>
          </el-form-item>
          <el-form-item label="事件时间">
            <el-date-picker v-model="formData.startTime" style="width:140px;" type="date" format="yyyy-MM-dd"
              value-format="yyyy-MM-dd" placeholder="选择开始日期">
            </el-date-picker>
            <span style="margin-left: 10px;margin-right: 10px;">~</span>
            <el-date-picker v-model="formData.endTime" style="width:140px;" type="date" format="yyyy-MM-dd"
              value-format="yyyy-MM-dd" placeholder="选择结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="query">查询</el-button>
            <el-button type="primary" icon="el-icon-refresh" @click="reset">重置</el-button>
          </el-form-item>
          <el-button type="primary" class="wbtn exportBtn" icon="el-icon-download" @click="handleExport">导出</el-button>
        </el-form>
      </wl-main-title>
      <section style="padding: 0 20px; height: calc(100% - 120px);">
        <el-table :data="tableData" :key="Math.random()" height="calc(100%)" border style="width: 100%">
          <el-table-column type="index" label="序号" align="center" width="80"></el-table-column>
          <el-table-column prop="equipmentName" align="center" label="事件设备名称" min-width="200"></el-table-column>
          <el-table-column prop="equipmentType" align="center" label="设备类型" min-width="200"></el-table-column>
          <el-table-column prop="equipmentLocation" align="center" label="安装位置" min-width="200px"> </el-table-column>
          <el-table-column prop="createTime" align="center" label="事件时间" min-width="200"></el-table-column>
          <el-table-column prop="handleContent" align="center" label="事件内容" min-width="200px"> </el-table-column>
          <el-table-column prop="handleUserName" align="center" label="操作人" min-width="200"></el-table-column>
        </el-table>
        <el-pagination style="float: right; margin-top: 20px" background layout="total,prev, pager, next,sizes"
          @current-change="pageChange" :current-page="paging.pageNum" :page-size="paging.pageSize"
          @size-change="handleSizeChange" :page-sizes="[10, 20, 50, 100, 500]" :total="paging.total">
        </el-pagination>
      </section>
    </section>
  </section>
</template>
  
<script>
import { getEventRecordingList, exportEventRecordingList, getControlPointList, getEquipment } from '@/api/equipment-running-time.js';
import { getDict, dictTrans } from '@/api/common.js'
import dayjs from 'dayjs';

export default {
  data() {
    return {
      formData: {
        equipmentName: '',
        startTime: '',
        endTime: '',
        controlPoint: ''
      },
      tableData: [],
      buildingOptions: [],
      systemOptions: [],
      paging: {
        pageNum: 1,
        pageSize: 20,
        total: 0,
      },
      equipmentNameList: [],
      ctrlPointList: [],
      triggerFocus: false
    };
  },

  components: {},

  computed: {},

  mounted() {
    this.getDictDetail()
    this.query();
    this.getEquipmentList();
    this.getPointIdList('');
  },
  methods: {
    //获取设备列表
    getEquipmentList() {
      getEquipment().then(res => {
        this.equipmentNameList = res.data.map(v => ({
          value: v,
          label: v
        }))
      })
    },
    //获取点位列表 
    getPointIdList(equipmentName) {
      getControlPointList(equipmentName).then(res => {
        this.ctrlPointList = res.data.map(v => ({
          value: v,
          label: v
        }))
      })
    },
    equipmentNameClear() {
      this.formData.controlPoint = '';
      this.triggerFocus = false;
      this.getPointIdList('');
    },
    getDictDetail() {
      getDict('system_type').then(res => {
        this.systemOptions = res.data
      })
    },
    handleSelect() {
      this.triggerFocus = true;
      this.getPointIdList(this.formData.equipmentName);
      this.formData.controlPoint = '';
    },
    handleSelectPoint() {

    },
    queryNameSearch(queryString, cb) {
      var results = queryString ? this.equipmentNameList.filter(this.createFilter(queryString)) : this.equipmentNameList;
      cb(results);
    },
    queryPointSearch(queryString, cb) {
      var results = queryString ? this.ctrlPointList.filter(this.createFilter(queryString)) : this.ctrlPointList;
      cb(results);
    },
    createFilter(queryString) {
      return (v) => {
        return (v.value.toLowerCase().indexOf(queryString.toLowerCase()) > -1);
      };
    },
    //查询
    query() {
      this.getData();
    },
    //重置
    reset() {
      this.formData.equipmentName = '';
      this.formData.controlPoint = '';
      this.formData.startTime = '';
      this.formData.endTime = '';
      this.paging.pageNum = 1;
      this.paging.pageSize = 20;
      this.getData();
    },
    getData() {
      getEventRecordingList(this.formData, this.paging).then((res) => {
        if (res.code == 200 && Object.keys(res.data).length > 0) {
          this.tableData = res.data.records;
          this.paging.total = res.data.total;
        }
      });
    },
    pageChange(e) {
      this.paging.pageNum = e;
      this.getData();
    },
    handleSizeChange(e) {
      this.paging.pageSize = e;
      this.getData();
    },
    //导出列表
    handleExport() {
      exportEventRecordingList(this.formData).then((res) => {
        let data = res;
        if (!data) return;
        let url = window.URL.createObjectURL(new Blob([data]));
        let link = document.createElement('a');
        link.style.display = 'none';
        link.href = url;
        link.setAttribute('download', '事件记录.xls');
        document.body.appendChild(link);
        link.click();
      });
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-autocomplete {
  .el-autocomplete-suggestion {
    background-color: #2a3e62;

    li:hover {
      background-color: #395681;
    }

    li {
      color: #fff;
    }
  }
}

._uplaod-div {
  display: inline-block;
  margin: 0 10px;

  button {
    background-color: transparent;
    border: 1px solid #486aa8;
  }
}

::v-deep.el-form-item {
  >.el-form-item__label {
    color: #fff;
  }
}

.el-form {
  margin: 15px 0 0 40px;
}

.container_warp {
  width: 100%;
  height: 100%;
  overflow: auto;
}

::-webkit-scrollbar-track-piece {
  background: transparent;
}

::-webkit-scrollbar {
  width: 6px;
  height: 10px;
}

::-webkit-scrollbar-thumb {
  background: $light-blue;
  border-radius: 20px;
}

::-webkit-scrollbar-corner {
  background: transparent;
}

.edit_btn {
  font-size: 16px;
}

.container_box {
  width: 100%;
  height: 100%;
}

::v-deep(.th-main-title) {
  height: auto !important;
  flex-wrap: wrap;
  min-height: 60px;
}
</style>
  