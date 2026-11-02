<!-- 智能运维管理--事件记录 -->
<template>
  <section class="container_warp">
    <section class="container_box">
      <wl-main-title data-title="事件记录">
        <el-form :inline="true" :model="formData" class="demo-form-inline">
          <el-form-item label="设备所属建筑分区" prop="building">
            <el-input v-model="formData.equipmentLocation" placeholder="设备所属建筑分区" style="width:140px;"></el-input>
          </el-form-item>
          <el-form-item label="设备所属系统" prop="system">
            <el-select v-model="formData.equipmentSystem" style="width:140px;">
              <el-option v-for="item in systemOptions" :key="item.itemValue" :label="item.itemText"
                :value="item.itemValue"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="设备名称">
            <el-input v-model="formData.equipmentName" placeholder="请输入设备名称" style="width:140px;"></el-input>
          </el-form-item>
          <el-form-item label="操作时间">
            <el-date-picker v-model="formData.startTime" style="width:140px;" type="date" format="yyyy-MM-dd"
              value-format="yyyy-MM-dd" placeholder="选择开始日期">
            </el-date-picker>
            <span style="margin-left: 10px;margin-right: 10px;">~</span>
            <el-date-picker v-model="formData.endTime" style="width:140px;" type="date" format="yyyy-MM-dd"
              value-format="yyyy-MM-dd" placeholder="选择结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="操作人">
            <el-input v-model="formData.handleUserName" placeholder="请输入操作人" style="width:140px;"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="query">查询</el-button>
            <el-button type="primary" icon="el-icon-refresh" @click="reset">重置</el-button>
          </el-form-item>
          <el-button type="primary" class="wbtn exportBtn" icon="el-icon-download" @click="handleExport">导出</el-button>
        </el-form>
      </wl-main-title>
      <section style="padding: 0 20px; height: calc(100% - 120px)">
        <el-table :data="tableData" :key="Math.random()" height="calc(100%)" border style="width: 100%">
          <el-table-column type="index" label="序号" align="center" width="80"></el-table-column>
          <el-table-column prop="equipmentLocation" align="center" label="设备所属建筑分区" min-width="200"></el-table-column>
          <el-table-column prop="equipmentSystem" align="center" label="设备所属系统" min-width="150"></el-table-column>
          <el-table-column prop="equipmentLocation" align="center" label="操作设备名称" min-width="200"></el-table-column>
          <el-table-column prop="createTime" align="center" label="操作时间" min-width="200"></el-table-column>
          <el-table-column prop="handleUserName" align="center" label="操作人" min-width='120'></el-table-column>
          <el-table-column prop="handleContent" align="center" label="操作内容" min-width="200px"> </el-table-column>
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
import { getEventRecordingList, exportEventRecordingList } from '@/api/equipment-running-time.js';
import { getDict, dictTrans } from '@/api/common.js'
import dayjs from 'dayjs';

export default {
  data() {
    return {
      formData: {
        equipmentLocation: '',
        equipmentSystem: '',
        equipmentName: '',
        startTime: dayjs().format('YYYY-MM-DD'),
        endTime: dayjs().format('YYYY-MM-DD'),
        handleUserName: ''
      },
      tableData: [],
      buildingOptions: [],
      systemOptions: [],
      paging: {
        pageNum: 1,
        pageSize: 20,
        total: 0,
      },
    };
  },

  components: {},

  computed: {},

  mounted() {
    this.getDictDetail()
    this.query();
  },
  methods: {
    getDictDetail() {
      getDict('system_type').then(res => {
        this.systemOptions = res.data
      })
    },
    //查询
    query() {
      this.getData();
    },
    //重置
    reset() {
      this.formData.equipmentLocation = '';
      this.formData.equipmentSystem = '';
      this.formData.equipmentName = '';
      this.formData.startTime = dayjs().format('YYYY-MM-DD');
      this.formData.endTime = dayjs().format('YYYY-MM-DD');
      this.formData.handleUserName = '';
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
