<!-- 巡检内容配置 -->
<template>
  <section class="container_warp">
        <el-form :model="formData" :inline="true">
          <el-form-item label="设备类型">
            <el-select v-model="formData.equipmentType">
              <el-option v-for="item in deviceTypeOptions" :key="item.itemValue" :label="item.itemText" :value="item.itemValue"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="query">查询</el-button>
            <el-button type="primary" icon="el-icon-refresh" @click="reset">重置</el-button>
          </el-form-item>
          <el-form-item style="float: right"></el-form-item>
        </el-form>
        <div class="table_div">
          <el-table :data="tableData" style="width: 100%" height="calc(100% - 47px)" :row-style="{ height: '48px' }" :header-row-style="{ height: '48px' }">
            <el-table-column type="index" label="序号" width="200" align="center"> </el-table-column>
            <el-table-column prop="equipmentType" label="设备类型" width="" align="center">
              <template #default="{ row }">{{ equipmentTypeTrans(deviceTypeOptions, row.equipmentType) }}</template>
            </el-table-column>
            <el-table-column prop="itemNum" label="巡检项目数" align="center"> </el-table-column>
            <el-table-column prop="" label="操作" align="center">
              <template #default="{ row }">
                <el-link class="blue-link" @click="setting(row)">配置</el-link>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <InspectSetting ref="settingRef" @success="getData()"></InspectSetting>
  </section>
</template>

<script>
import InspectSetting from "./modal/InspectSetting.vue";
import { getInspectConentByPage } from "@/api/inspection-content.js";
import { getDict, dictTrans } from "@/api/common.js";
export default {
  data() {
    return {
      formData: { equipmentType: "" },
      deviceTypeOptions: [],
      paging: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      tableData: [],
    };
  },

  components: { InspectSetting },

  computed: {},

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
        if (res.data) this.deviceTypeOptions = res.data;
      });
    },
    //查询
    query() {
      this.getData();
    },
    //重置
    reset() {
      this.paging.pageNo = 1;
      this.paging.pageSize = 10;
      this.formData.equipmentType = "";
      this.getData();
    },
    getData() {
      getInspectConentByPage(this.formData).then((res) => {
        if (res.code === 200 && res.data) this.tableData = res.data;
      });
    },
    equipmentTypeTrans(data, code) {
      return dictTrans(data, code);
    },
    setting(item) {
      this.$refs.settingRef?.open(item);
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
  height: calc(100% - 47px);
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 0 6px rgba(90, 151, 250, 0.3);
  padding: 10px;
}
.editBtn {
  color: #34e15d;
  font-size: 16px;
  border-left: 2px solid #fff;
  padding: 0 5px;
}

.delBtn {
  color: #ff3c00;
  font-size: 16px;
  border-left: 2px solid #fff;
  padding: 0 5px;
}

.detailBtn {
  color: #00aaff;
  font-size: 16px;
}
</style>
