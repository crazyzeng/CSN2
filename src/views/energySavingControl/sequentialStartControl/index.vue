<!-- 顺序启停控制 -->
<template>
  <section class="container_warp">
    <section class="container_box">
      <el-divider class="curDivider" direction="vertical" />
      <wl-main-title data-title="顺序启停控制"> </wl-main-title>
      <section class="table-box" style="padding: 0 20px">
        <el-table :data="tableData" ref="tableRef" :key="Math.random()" height="calc(100%)" border style="width: 100%">
          <el-table-column align="center" type="index" label="序号" width="80"></el-table-column>
          <el-table-column align="center" label="模式" width="250" prop="">
            <template #default="{ row }">
              <div class="flex justify-center flex-col items-center">
                <p>{{ row.configName }}</p>
                <p class="mode_p" :class="row.workMode === 0 ? 'cold_color' : 'heat_color'">
                  <span class="mode_icon" :class="row.workMode === 0 ? 'cold_bg' : 'heat_bg'"></span><span>{{
                    row.workMode === 0 ? "制冷" : "制热" }}模式</span>
                </p>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="顺序启停控制" prop="">
            <template #default="{ row }">
              <section class="item_warp" v-for="item in row.nodes" :key="item.id">
                <section class="node_item" :class="item.status === '已执行' ? 'statusOn_bg' : 'statusOff_bg'">
                  <section class="img_warp">
                    <img :src="item.imgUrl" alt="" />
                  </section>
                  <p>
                    <span>{{ item.typeName }}</span>
                  </p>
                  <p class="status_p">
                    <span>{{ item.status }}</span><span>{{ item.finishNum }}台</span>
                  </p>
                  <p class="interval_time">
                    <span class="interval_second">{{ item.intervalTime }}{{ item.intervalTime ? "s" : "" }}</span>
                    <span class="step_right_icon" :class="item.intervalTime ? '' : 'hide'"></span>
                  </p>
                </section>
              </section>
            </template>
          </el-table-column>
          <el-table-column label="一键启停" prop="" width="200" align="center">
            <template #default="{ row }">
              <el-select v-model="row.switchStatus" class="switch-class" style="width: 100px; vertical-align: top">
                <el-option label="开启" value="1"></el-option>
                <el-option label="关闭" value="0"></el-option>
              </el-select>
              <el-button type="primary" @click="switchChange(row)" class="cus_btn">执行</el-button>
              <!-- <el-switch v-model="row.switchStatus" style="width:80px" active-color="#3399FF"
                                inactive-color="#999999" active-value="1" inactive-value="0" @change="switchChange(row)">
                            </el-switch> -->
            </template>
          </el-table-column>
        </el-table>
        <el-pagination style="float: right; margin-top: 20px" @current-change="handleCurrentChange"
          :current-page="paging.pageNo" :page-size="paging.pageSize" layout="total, prev, pager, next, jumper"
          :total="paging.total" />
      </section>
    </section>
  </section>
</template>

<script>
import { deepClone } from "@/utils/index";
import { getWebSocket } from "@/utils/websocket";
import { getDataByPage, handleSwitch } from "@/api/sequential-ctrl.js";
import { getUploadFile } from "@/api/file.js";

export default {
  data() {
    return {
      formData: { configName: "" },
      paging: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      tableData: [],
      webSocket: null,
      curStatus: "",
    };
  },

  components: {},

  computed: {},

  mounted() {
    this.init();
  },
  watch: {},
  methods: {
    init() {
      this.getData();
      this.setWebSocket();
    },
    getData() {
      const data = Object.assign({}, this.formData, this.paging);
      getDataByPage(data).then((res) => {
        if (res.code === 200 && res.data) {
          res.data.records.forEach((v) => {
            v.nodes.forEach((u) => {
              u.imgUrl = "";
              u.status = "已执行";
              u.finishNum = 0;
            });
            v.switchStatus = "";
          });
          this.tableData = res.data.records;
          this.paging.total = res.data.total;
          this.dataEcho();
        }
      });
    },
    // 图片回显
    dataEcho() {
      const tempData = deepClone(this.tableData);
      tempData.forEach((u) => {
        u.nodes.forEach(async (v) => {
          if (v.typeImgUrl && v.typeImgUrl.length > 0) {
            const res = await getUploadFile(v.typeImgUrl);
            if (res.code === 200 && res.data.length > 0) {
              if (process.env.NODE_ENV === "development") {
                v.imgUrl = `http://192.168.2.132:9000${res.data[0].fileUrl}`;
              } else {
                v.imgUrl = `http://192.168.20.199:9000${res.data[0].fileUrl}`;
                // v.imgUrl = `${window.location.origin}${res.data[0].fileUrl}`;
              }
            }
          }
        });
      });
      this.tableData = [];
      this.tableData = tempData;
      this.$forceUpdate();
      this.$nextTick(() => {
        this.$refs.tableRef.doLayout();
      });
      this.$refs.tableRef.doLayout();
    },
    switchChange(e) {
      if (e.switchStatus !== "") {
        this.$confirm("确认执行？", "提示", { type: "warning" })
          .then(() => {
            const tempObj = {
              configId: e.id,
              value: e.switchStatus,
            };
            this.curStatus = e.switchStatus;
            handleSwitch(tempObj).then((res) => {
              if (res.code === 200) {
                this.$message.success("操作成功");
                this.getData();
              }
            });
          })
          .catch(() => {
            e.switchStatus = "";
          });
      } else this.$message.warning("请先选择启停状态");
    },
    setWebSocket() {
      const ws = getWebSocket("custom/sequenceControl");
      ws.setMessage((res) => {
        const data = JSON.parse(res.data);
        if (data && Object.keys(data).length > 0) {
          let index;
          this.tableData.forEach((v, i) => {
            if (data.configId === v.id) {
              index = i;
            }
          });
          data.details.forEach((u) => {
            this.tableData[index].nodes.forEach((w) => {
              if (u.orderNo === w.orderNo) {
                let tempArray = u.result.filter((v) => v === true);
                w.finishNum = tempArray.length;
                w.status = this.curStatus === "1" ? "已执行" : "已执行";
              }
            });
          });
        }
      });
      ws.init();
      this.$once("hook:beforeDestroy", () => ws.getWS().close());
    },
    // pageChange(e) {
    //   this.paging.pageNo = e;
    //   this.getData();
    // },
    // handleSizeChange(e) {
    //   this.paging.pageSize = e;
    //   this.getData();
    // },

    // 分页
    handleCurrentChange(newPage) {
      this.paging.pageNo = newPage;
      this.getData();
    },
  },
};
</script>
<style lang="scss" scoped>
.cold_bg {
  background-image: url("@/assets/icon/cold_icon.png");
}

.heat_bg {
  background-image: url("@/assets/icon/heat_icon.png");
}

.cold_color {
  background-color: #263f88;
}

.heat_color {
  background-color: #a9303b;
}

.mode_p {
  height: 25px;
  line-height: 25px;
  border-radius: 12.5px;
  width: 100px;
  padding-left: 10px;

  .mode_icon {
    display: inline-block;
    width: 14px;
    height: 14px;
    background-repeat: no-repeat;
    margin-right: 5px;
  }
}

.statusOn_bg {
  background-color: #263f88;
}

.statusOff_bg {
  background-color: #4b5264;
}

section.item_warp:not(:last-child) {
  margin-right: 50px;
}

section.item_warp {
  float: left;
  width: 82px;
  height: 84px;
}

section.node_item {
  position: relative;

  p {
    height: 15px;
    line-height: 15px;
    text-align: center;
    color: #fff;
    font-size: 12px;
    margin-top: 2px;
  }

  p.status_p {
    background-color: #fff;
    color: #3399ff;
  }

  p.interval_time {
    position: absolute;
    right: -50%;
    top: 50%;
    transform: translateY(-50%);
    height: 28px;

    .interval_second {
      display: block;
      height: 14px;
    }

    .step_right_icon {
      display: inline-block;
      width: 14px;
      height: 14px;
      background-image: url("@/assets/icon/to_right_arrow_on.png");
      background-repeat: no-repeat;
    }

    .step_right_icon.hide {
      display: none;
    }
  }

  .img_warp {
    width: 50px;
    height: 50px;
    margin: auto;
    background-color: #fff;
    border-radius: 25px;
    padding-top: 7.5px;

    img {
      width: 35px;
      height: 35px;
      margin: auto;
    }
  }
}

::v-deep .el-switch__core::before {
  content: "OFF";
  position: absolute;
  top: 0;
  right: 5px;
  color: #fff;
}

::v-deep .el-switch__core {
  width: 50px !important;
}

.is-checked ::v-deep .el-switch__core::before {
  content: "ON";
  position: absolute;
  top: 0;
  left: -15px;
  color: #fff;
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

.cus_btn {
  font-size: 16px;
  border-radius: 4px;
  margin-left: 10px;
  height: 30px;
}

.container_box {
  width: 100%;
  height: calc(100% - 50px);
  border-radius: 14px;
}

::v-deep.el-cascader {
  margin: 7.5px;

  .el-tag {
    background: #1a53a9 !important;
  }

  .el-tag--info {
    color: #fff;
  }
}

::v-deep.el-table {
  border-radius: 8px;
}

.header-extend {
  background-color: #1e2a45 !important;
  height: 45px;
}

.execute_status {
  padding-left: 25px;
  background-repeat: no-repeat;
  display: inline-block;
  margin: 0 8px;
}

.execute_finish {
  background-image: url(../../../assets/icon/finish.png);
}

.execute_error {
  background-image: url(../../../assets/icon/error.png);
}

.execute_wait {
  background-image: url(../../../assets/icon/wait.png);
}

.execute_span {
  display: inline-block;
  width: 20px;
  height: 20px;
}

.switch-class {
  ::v-deep {
    .el-input>.el-input__inner {
      width: 100px !important;
    }
  }
}
</style>
<style lang="scss">
.custom_poper {
  border: none;

  .el-cascader-menu {
    color: #fff;
  }

  .el-cascader-node:not(.is-disabled):hover,
  .el-cascader-node:not(.is-disabled):focus {
    background: #41618f !important;
  }
}

.table-box {
  height: calc(100% - 60px);
}

@media (min-height: 1080px) {
  .table-box {
    height: calc(100% - 90px);
  }
}
</style>
