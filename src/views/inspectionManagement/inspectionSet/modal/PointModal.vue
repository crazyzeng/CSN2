<!-- 点位 -->
<template>
  <el-dialog width="60%" :visible.sync="dataFlag" title="属性点选择" :before-close="modalCancel" append-to-body>
    <!-- form -->
    <el-form :inline="true" :model="formData" class="">
      <!-- 用户名 -->
      <el-form-item label="属性点名称：">
        <el-input v-model="formData.name" placeholder="属性点名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="属性点类型：" v-if="!isEnergy">
        <el-select v-model="formData.type" placeholder="请选择" :clearable="true">
          <el-option v-for="item in list.point_type" :key="item.itemValue" :label="item.itemText"
            :value="item.itemValue"></el-option>
        </el-select>
      </el-form-item>
      <!-- 所属资源名称 -->
      <el-form-item label="资源名称：">
        <el-input v-model="formData.orgName" placeholder="所属资源名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="通讯设备：">
        <el-select v-model="formData.deviceId" placeholder="请选择" :clearable="true">
          <el-option v-for="item in list.devices" :key="item.deviceId" :label="item.name"
            :value="item.deviceId"></el-option>
        </el-select>
      </el-form-item>
      <!--  -->
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="query">查询</el-button>
        <el-button type="primary" icon="el-icon-refresh-left" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- table -->
    <el-table :data="tableData" ref="multipleTable" @select-all="handleSelectAll" style="width: 100%" max-height="450"
      row-key="id" highlight-current-row border size="small" @selection-change="handleSelectionChange">
      <el-table-column label="" type="selection" width="50" align="center"></el-table-column>
      <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
      <el-table-column label="属性点ID" prop="pointId" width="80" align="center"></el-table-column>
      <el-table-column label="属性点名称" prop="name"></el-table-column>
      <el-table-column label="类型" align="center">
        <template slot-scope="scope">{{ pointTypeTrans(list.point_type, scope.row.type)
        }}</template>
      </el-table-column>
      <el-table-column align="center" label="所属资源" prop="orgName"></el-table-column>
      <el-table-column align="center" label="所属通讯设备">
        <template slot-scope="scope">
          {{ getTypeValue(scope.row.deviceId, list.devices, 'deviceId', 'name') }}
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="th-pagination">
      <el-pagination @size-change="sizeChange" @current-change="pageChange" :current-page="paging.pageNo"
        :page-size="paging.pageSize" :total="paging.total"
        layout="total, sizes, prev, pager, next, jumper"></el-pagination>
    </div>
    <!-- buttons -->
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submit" class="saveBtn">确 定</el-button>
      <el-button @click="modalCancel" class="backBtn">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getPointList, getDeviceList } from '@/api/auto-inspection.js';
import { dictTrans, getDict } from '@/api/common.js'
import { getWordbookValue } from '@/utils/index.js'
export default {
  name: "DeviceInfoPoint",
  props: [
    "dataFlag",
    "isEnergy",
    "isMulti"
  ],
  data: function () {
    return {
      list: {
        type: [],
        devices: [],
        point_type: [],
      },
      // 表单数据
      formData: {
        name: "",
        type: "",
        orgName: '',
        deviceId: '',
      },
      // 查询数据
      queryData: {
        name: "",
        type: "",
        orgName: '',
        deviceId: ''
      },
      // 用户数据
      tableData: [],
      tableCheckedData: [],
      // 分页
      paging: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
    };
  },
  created: function () {
    this.init();
  },
  watch: {
    dataFlag: function (val) {
      if (!val) this.$refs.multipleTable.clearSelection()
    }
  },
  computed: {
    // 获取类型值
    getTypeValue() {
      return (code, list, key, valueKey) =>
        getWordbookValue(code, list, key, valueKey);
    },
  },
  methods: {
    //
    //
    // -----------------------------------

    init() {
      this.getData(this.formData);
      // 字典查询
      getDict("point_type").then(res => {
        this.list['point_type'] = res.data
      })
      this.getDevices({})
    },
    // 通讯设备查询
    getDevices(data) {
      getDeviceList(data).then(res => {
        if (res) this.list.devices = res.data.records;
      });
    },
    // 查询
    query() {
      for (let i in this.formData) {
        this.queryData[i] = this.formData[i];
      }
      for (let key in this.queryData) {
        if (this.queryData[key] == "") delete this.queryData[key];
      }
      this.paging.pageNo = 1;
      this.getData(this.queryData);
    },
    reset() {
      this.formData.deviceId = '';
      this.formData.orgName = '';
      this.formData.name = '';
      this.formData.type = '';
      this.paging.pageNo = 1;
      this.paging.pageSize = 10;
      this.query();
    },
    handleSelectAll() {
      this.$message.warning('只能选择一个点位')
    },
    //table勾选事件
    handleSelectionChange(val) {
      if (val.length > 1) {
        this.$refs.multipleTable.toggleRowSelection(val[1], false);
        return
      }
      this.tableCheckedData = val;
    },
    // 弹框关闭
    modalCancel() {
      this.$emit("close");
    },

    // 确定
    submit() {
      this.$emit('data', this.tableCheckedData)
      this.$emit("close");
    },
    // 显示多少条发生改变
    sizeChange(val) {
      this.paging.pageSize = val;
      this.getData(this.queryData);
    },

    // 页数发生变化
    pageChange(val) {
      this.paging.pageNo = val;
      this.getData(this.queryData);
    },
    pointTypeTrans(data, code) {
      return dictTrans(data, code)
    },

    // 查询
    getData(data) {
      getPointList(data, this.paging).then(res => {
        if (res.code === 200 && res.data) {
          this.tableData = res.data.records;
          this.paging.total = res.data.total;
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.saveBtn {
  background-color: #2e6cd8;
  border-radius: 3px;
}

.backBtn {
  color: #fff;
}
.dialog-footer{
  text-align: center;
}
</style>

