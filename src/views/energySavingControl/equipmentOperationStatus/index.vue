<!-- 设备运行状态 -->
<template>
  <wl-main-container data-title="设备运行状态">
    <el-tabs type="border-card" :tab-position="tabPosition" @tab-click="tabClick">
      <el-tab-pane v-for="item in tabList" :key="item" :label="item">
        <section class="content_warp" v-if="activeLabel === '0'">
          <el-table :data="tableData" ref="table" style="width: 100%" border>
            <el-table-column label="系统" prop="equipmentSystem" align="center">
              <template #default="{ row }">{{ equipmentSystemTrans(row.equipmentSystem)
              }}</template>
            </el-table-column>
            <el-table-column label="设备类型" prop="equipmentType" align="center">
              <template #default="{ row }">{{ equipmentTypeTrans(row.equipmentType) }}
              </template>
            </el-table-column>
            <el-table-column label="设备运行数量" prop="runNum" align="center"></el-table-column>
            <el-table-column label="设备停机数量" prop="stopNum" align="center"></el-table-column>
            <el-table-column label="设备离线数量" prop="offLineNum" align="center"></el-table-column>
          </el-table>
        </section>
        <section class="content_warp" v-if="activeLabel !== '0'">
          <section class="subClass" v-for="item in ulList" :key="item.label">
            <p><span class="subTitle">{{ item.label }}</span><span class="divider_line"></span></p>
            <ul>
              <li v-for="detail in item.liList" :key="detail.id">
                <section class="detail_warp">
                  <img :src="imgUrl" alt="" />
                  <section class="detail_right">
                    <p><span class="tips">设备编号：</span><span class="detailVal">{{
                      detail.equipmentNumber }}</span></p>
                    <p><span class="tips">设备运行状态：</span><span class="detailVal">{{ detail.runStatus ||
                      '-'
                    }}</span></p>
                    <p><span class="tips">设备故障状态：</span><span class="detailVal">{{ detail.fault || '-'
                    }}</span></p>
                    <p><span class="tips">设备所属区域：</span><span class="detailVal">{{ '-'
                    }}</span></p>
                  </section>
                </section>
              </li>
            </ul>
            <div style="clear:both;"></div>
          </section>
        </section>
      </el-tab-pane>
    </el-tabs>
  </wl-main-container>
</template>

<script>
import { getAllEquStatus } from '@/api/equ-running-status.js';
import { getDict, dictTrans } from '@/api/common.js'
import { deepClone } from '@/utils'
import deviceImg from '@/assets/img/device.png'
export default {
  data() {
    return {
      imgUrl: deviceImg,
      activeLabel: '0',
      tabPosition: 'left',
      spanArr: [],//用于存放每一行记录的合并数
      pos: '',
      tabList: [],
      ulList: [],
      tableData: [],
      detailData: [],
      equipmentSystemOptions: [],
      equipmentTypeOptions: []
    };
  },

  components: {},

  computed: {
  },

  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.getAllData();
      this.getSpanArr(this.tableData);
      this.getDictList();
    },
    getDictList() {
      getDict('system_type').then(res => {
        if (res.code === 200 && res.data)
          this.equipmentSystemOptions = res.data
      })
      getDict('equipment_type').then(res => {
        if (res.code === 200 && res.data)
          this.equipmentTypeOptions = res.data
      })
    },
    equipmentSystemTrans(code) {
      return dictTrans(this.equipmentSystemOptions, code)
    },
    equipmentTypeTrans(code) {
      return dictTrans(this.equipmentTypeOptions, code)
    },
    tabClick(e) {
      this.activeLabel = e.index;
      let systemTypeArr = deepClone(this.tabList);
      systemTypeArr.shift();
      systemTypeArr = systemTypeArr.map(v => {
        this.equipmentSystemOptions.forEach(w => {
          if (w.itemText == v) v = w.itemValue
        })
        return v
      });
      const tempDetail = this.detailData[systemTypeArr[e.index - 1]];
      this.ulList = [];
      for (let key in tempDetail) {
        const tempObj = {
          label: '',
          liList: []
        }
        tempObj.label = this.equipmentTypeTrans(key);
        tempObj.liList = tempDetail[key];
        this.ulList.push(tempObj)
      }

    },
    getSpanArr(data) {
      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          this.spanArr.push(1);
          this.pos = 0;
        } else {
          // 判断当前元素与上一个元素是否相同
          if (data[i].equipmentSystem === data[i - 1].equipmentSystem) {
            this.spanArr[this.pos] += 1;
            this.spanArr.push(0);
          } else {
            this.spanArr.push(1);
            this.pos = i;
          }
        }
      }
    },
    //总览
    getAllData() {
      getAllEquStatus().then(res => {
        if (res.code == 200 && Object.values(res.data).length > 0) {
          this.tabList = Object.keys(res.data.detail);
          this.tabList = this.tabList.map(v => { return this.equipmentSystemTrans(v) });
          this.tabList.unshift('设备信息总览');
          this.detailData = res.data.detail
          this.tableData = [].concat.apply([], Object.values(res.data.overView));
        }
      })
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep.th-container-view {
  overflow: hidden;
}

::v-deep.el-table {
  color: #ccd4ff;
  background-color: rgb(0 0 0 / 0%);
  border-color: #304663 !important;
  font-size: 16px;

  tr {
    background-color: rgb(0 0 0 / 0%);
  }

  thead {
    color: #fff;
    font-size: 18px;
  }

  th {
    font-weight: normal;
  }

  th.el-table__cell,
  .el-table tr {
    background-color: rgb(0 0 0 / 0%);
  }

  .el-table__cell {
    border-color: #304663 !important;
    border-bottom: 1px solid;
  }

  .el-table__body tr:hover {
    >td.el-table__cell {
      background-color: #2a3e62;
      color: #fff;
    }
  }

  .el-tabs--border-card {
    border: none;
  }
}

::v-deep.el-table::after,
::v-deep.el-table::before {
  background-color: #2a3e62;
}

::v-deep.el-tabs {
  width: 100%;
  min-width: 1640px;
  // @include scrollBar;
  height: 100%;
  background-color: rgb(0 0 0 / 0%);
  border-color: rgba(0, 0, 0, 0);

  .el-tabs__header.is-left {
    background-color: rgb(0 0 0 / 0%);
    border-color: rgb(0 0 0 / 20%);
    // border-right: none;
  }

  .el-tab-pane {
    height: 100%;
    overflow: auto;
    @include scrollBar;
  }

  .el-tabs__item {
    font-size: 16px;
    color: #fff;
    text-align: left;
    height: 45px;
    line-height: 45px;
    border-right: none !important;
  }

  .el-tabs__item.is-active {
    color: #1873b3;
    background-color: rgb(0 0 0 / 0%);
    border-color: rgb(0 0 0 / 20%) !important;
    border-right: none !important;
  }

  .el-tabs__item:not(.is-disabled):hover {
    color: #1873b3;
  }
}

.subClass {
  clear: both;

  >p {
    font-size: 20px;
    color: #ccd4ff;
    display: flex;
    align-items: center;
    padding: 20px 10px;

    >span.subTitle {
      word-break: keep-all;
      padding-right: 10px;
    }

    >span.divider_line {
      width: 100%;
      height: 1px;
      background-color: #304663;
    }
  }
}

.shadow_box {
  box-shadow: 0 0 5px 1px #ff0000;
}

::v-deep.el-divider {
  background-color: #304663;
}

ul {
  width: 100%;
  height: 100%;

  >li {
    float: left;
    width: 300px;
    height: 140px;
    margin-bottom: 20px;
    margin-left: 10px;

    .detail_warp {
      width: 100%;
      height: 100%;
      background-color: #2c4466;
      border-radius: 8px;

      >img {
        padding: 32px 10px;
        float: left;
      }

      >.detail_right {
        float: left;
        width: 160px;
        padding-top: 24px;
        font-size: 12px;

        >p {
          margin-bottom: 10px;

          >span.tips {
            text-shadow: -2px 2px 6px #20a3ff;
          }
        }
      }
    }
  }
}
</style>
