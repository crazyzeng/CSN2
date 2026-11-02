<!-- 设备日程控制 -->
<template>
  <section class="container_warp">
    <section class="container_box">
      <el-divider class="curDivider" direction="vertical" />
      <wl-main-title data-title="设备日程控制">
        <el-form :inline="true" :model="formData" class="demo-form-inline">
          <el-form-item label="日程名称">
            <el-input v-model="formData.configName" placeholder="请输入日程名称"></el-input>
          </el-form-item>
          <el-form-item label="启用状态">
            <el-select v-model="formData.status" placeholder="启用状态">
              <el-option v-for="item in runningStatusOptions" :key="item.itemValue" :label="item.itemText"
                :value="item.itemValue"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="query">查询</el-button>
            <el-button type="primary" icon="el-icon-refresh" @click="reset">重置</el-button>
          </el-form-item>
          <el-button type="primary" class="border-btn b-b-b" style="float:right;margin-right: 0;" icon="el-icon-plus" @click="handleAdd">增加</el-button>
        </el-form>
      </wl-main-title>
      <section style="padding:0 20px 0 20px;height:calc(100% - 120px)">
        <el-table :data="tableData" :key="Math.random()" height="calc(100%)" border style="width: 100%">
          <el-table-column align="center" type="index" label="序号" width="80"></el-table-column>
          <el-table-column align="center" prop="configName" label="日程名称" width=""></el-table-column>
          <el-table-column align="center" prop="cycleMode" label="周期类型" width="">
            <template #default="{ row }">{{ row.cycleMode === 'WEEK' ? '每周重复' : '每日重复' }}</template>
          </el-table-column>
          <!-- <el-table-column prop="cycleWeekNum" label="周期说明" width=""></el-table-column> -->
          <el-table-column align="center" prop="createTime" label="创建时间" width=""></el-table-column>
          <el-table-column align="center" prop="status" label="启用状态" width="">
            <template #default="{ row }">{{ row.status ? '开启' : '关闭' }}</template>
          </el-table-column>
          <el-table-column align="center" prop="" label="操作" width="250">
            <template #default="{ row }">
              <el-link class="green-link" v-if="row.status === 0"
                @click="handleStopOrStart(row)">启用</el-link>
              <el-link class="yellow-link" v-else @click="handleStopOrStart(row)">停用</el-link>
              <el-divider direction="vertical" />
              <el-link class="red-link" :disabled="row.status === 1" @click="handleDel(row)">删除</el-link>
              <el-divider direction="vertical" />
              <el-link class="blue-link" :disabled="row.status === 1"
                @click='handleEdit(row)'>修改</el-link>
                <el-divider direction="vertical" />
              <el-link class="blue-link" @click="handleView(row)">详情</el-link>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination style="float:right;margin-top:20px" background layout="total, sizes, prev, pager, next, jumper"
          @current-change="pageChange" :current-page="paging.pageNo" :page-size="paging.pageSize"
          @size-change="handleSizeChange" :page-sizes="[10, 20, 50, 100, 500]" :total="paging.total">
        </el-pagination>
      </section>
    </section>
  </section>
</template>
  
<script>
import { getDataByPage, handleSwitch, deleteExecuteConfig } from '@/api/equipment-plan.js'
import { getDict, dictTrans } from '@/api/common.js'
export default {
  data() {
    return {
      formData: {
        configName: '',
        status: '',
        canControl: '1'
      },

      tableData: [],
      paging: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      runningStatusOptions: [
        { itemText: '启用', itemValue: '1' },
        { itemText: '停用', itemValue: '0' },
      ],
    };
  },

  components: {},

  computed: {},

  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.getData();
      this.getDictList('equipment_system');
    },
    getDictList(code) {
      getDict(code).then(res => {
        if (res) this.equipmentSystemOptions = res.data
      })
    },
    //查询
    query() {
      this.getData();
    },
    //重置
    reset() {
      this.formData.configName = '';
      this.formData.status = '';
      this.paging.pageNo = 1;
      this.paging.pageSize = 10;
      this.getData();
    },
    equipmentSystemTrans(code) {
      return dictTrans(code, this.equipmentSystemOptions)
    },
    getData() {
      const tempObj = { ...this.formData, ...this.paging }
      getDataByPage(tempObj).then(res => {
        if (res.code === 200 && res.data) {
          this.tableData = res.data.records;
          this.paging.total = res.data.total;
        }
      })
    },
    pageChange(e) {
      this.paging.pageNo = e;
      this.getData();
    },
    handleSizeChange(e) {
      this.paging.pageSize = e;
      this.getData();
    },
    handleAdd() {
      this.$router.push('devicePlanSetting')
    },
    handleStopOrStart(item) {
      this.$confirm('确定执行？', '提示', { type: 'warning' ,
      confirmButtonClass:'confirm-btn ',
      cancelButtonClass:'cancel-btn ',
      }).then(() => {
        const tempObj = {
          configId: item.id,
          status: item.status === 0 ? 1 : 0
        }
        handleSwitch(tempObj).then(res => {
          if (res.code === 200) {
            this.$message.success('执行成功')
            this.getData();
          }
        })
      }).catch(() => { })
    },
    handleEdit(item) {
      this.$router.push({ path: 'devicePlanSetting', query: { id: item.id, type: 'edit' } })
    },
    handleDel(item) {
      this.$confirm('确定删除？', '提示', { type: 'warning',
      confirmButtonClass:'confirm-btn ',
      cancelButtonClass:'cancel-btn ',
       }).then(() => {
        deleteExecuteConfig(item.id).then(res => {
          if (res.code === 200) {
            this.$message.success('删除成功')
            this.getData();
          }
        })
      }).catch(() => { })
    },
    handleView(item) {
      this.$router.push({ path: 'devicePlanSetting', query: { id: item.id, type: 'detail' } })
    }
  }
}

</script>
<style lang='scss' scoped>
::v-deep.el-form-item {
  >.el-form-item__label {
    color: #fff;
  }
}

.el-form {
  margin: 0px 0 0 40px;
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

.addBtn {
  float: right;
  font-size: 16px;
  border-radius: 16px
}

.container_box {
  width: 100%;
  height: 100%
}

.enableBtn {
  color: #00fff6;
  font-size: 16px;
  padding: 0 5px;
}

.disableBtn {
  color: #f99f11;
  font-size: 16px;
  padding: 0 5px;
}
</style>