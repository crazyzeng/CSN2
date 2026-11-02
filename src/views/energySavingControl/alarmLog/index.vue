<!-- 告警记录 -->
<template>
  <section class="container_warp">
    <section class="container_box">
      <el-main>
        <div class="table_div">
          <el-tabs v-model="activeName" style="height:100%">
            <el-tab-pane label="设备告警管理" name="deviceWarning">
              <deviceWarning v-if="activeName == 'deviceWarning'" style="height: 100%;"></deviceWarning>
            </el-tab-pane>
            <el-tab-pane label="系统告警管理" name="systemWarning">
              <systemWarning v-if="activeName == 'systemWarning'" style="height: 100%;"></systemWarning>
            </el-tab-pane>
            <el-tab-pane label="能源告警管理" name="energyWarning">
              <energyWarning v-if="activeName == 'energyWarning'" style="height: 100%;"></energyWarning>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-main>
    </section>
  </section>
</template>

<script>
import { getByPage, getAlarmType, dealAlarm, deleteData } from '@/api/alarmLog.js'
import { getDict } from '@/api/common.js'
import DeviceWarning from './tabs/DeviceWarning.vue'
import SystemWarning from './tabs/SystemWarning.vue'
import EnergyWarning from './tabs/EnergyWarning.vue'
export default {
  data() {
    return {
      activeName: 'deviceWarning',
      warnRange: '',
      masterPlateId: '',
      formData: {
        masterPlateIds: [],
        alarmStatus: '',
        queryStartTime: '',
        queryEndTime: '',
      },
      list: {
        warnType: [],
        alarmStatus: []
      },
      tableData: [],
      paging: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
    };
  },

  components: { DeviceWarning, SystemWarning, EnergyWarning },

  computed: {},

  mounted() {
    this.init();
    this.getRouteParam();
  },

  methods: {
    getRouteParam() {
      const routeParam = this.$route.params.type;
      if (routeParam === 'energy') this.activeName = 'energyWarning';
    },
    init() {
      this.getData();
      this.getDict();
      this.getAlarmTypeList();
    },
    async getAlarmTypeList() {
      const res = await getAlarmType({})
      this.list.warnType = res.data
    },
    async getDict() {
      const res = await getDict('alarm_status')
      this.list.alarmStatus = res.data
    },
    deal(id) {
      dealAlarm(id).then(res => {
        if (res.code === 200) {
          this.getData()
          this.$message.success('处理成功')
        }
      })
    },
    getData() {
      getByPage(this.formData, this.paging).then(res => {
        this.tableData = res.data.list
        this.paging.total = res.data.total
      })
    },
    handleDel(id) {
      this.$confirm('确认删除该条内容？', '提示', { type: 'warning' })
        .then(() => {
          deleteData(id).then(res => {
            if (res.code === 200) {
              this.getData();
              this.$message.success('删除成功')
            }
          })
        })
        .catch(() => { });
    },
    //查询
    query() {
      this.formData.queryStartTime = this.warnRange[0]
      this.formData.queryEndTime = this.warnRange[1]
      this.formData.masterPlateIds = [this.masterPlateId]
      this.getData()
    },
    reset() {
      this.formData.queryStartTime = ''
      this.formData.queryEndTime = ''
      this.formData.masterPlateIds = []
      this.formData.alarmStatus = ''
      this.masterPlateId = ''
      this.warnRange = ''
      this.getData()
    },
  }
}

</script>
<style lang='scss' scoped>
.container_warp {
  width: 100%;
  height: 100%;
}

.container_box {
  height: 100%;
  display: flex;
  flex-direction: column;
}

::v-deep .el-main {
  padding: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
}
::v-deep .el-tab-pane{
  height: 100% !important;
}

.table_div {
  width: 100%;
  height: 100%;
  flex: 1;
  background-color: #fff !important;
  border-radius: 10px;
  box-shadow: 0 0 6px rgba(90, 151, 250, 0.3);
  padding: 20px;
  display: flex;
  flex-direction: column;
}

::v-deep .el-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
}

::v-deep .el-tabs__content {
  flex: 1;
  padding-top: 15px !important;
}

::v-deep.el-form-item {
  >.el-form-item__label {
    color: #fff;
  }
}

::v-deep.el-tabs {
  background: none !important;
  border: none;

  .el-tabs__content {
    padding-top: 15px !important;
  }

  >.el-tabs__header {
    border-color: #2a3e62;
    background: none !important;

    .el-tabs__item.is-active {
      background-color: transparent;
      border: none;
      color: #409EFF !important;
    }

    .el-tabs__item {
      border: none;
      color: #000;
    }
  }
}


.el-form {
  margin: 15px 0 0 40px;
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

.el-input__inner {
  background-color: transparent;
}

::v-deep .el-form-item {
  >.el-form-item__label {
    color: #000;
  }
}
</style>