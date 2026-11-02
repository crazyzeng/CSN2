<!-- 实时巡检轨迹 -->
<template>
  <section class="container_warp">
    <div class="statistics_num flex items-center justify-between">
      <div class=" flex items-center">
        <div>路线名称：<span class="label_text mr-16">{{ lineDetail.lineName }}</span></div>
        <div>巡检项目数量：<span class="label_text mr-16">{{ lineDetail.equipmentNum }}项</span></div>
        <div>当前巡检时间段：<span class="label_text">{{ lineDetail?.executeTime }}</span></div>
      </div>
      <el-form :model="topForm" :inline="true">
        <!-- <el-form-item> <span class="top_block"></span><span class="title_text">实时巡检轨迹</span> </el-form-item> -->
        <el-form-item label="">
          <el-radio-group v-model="topForm.showType" @change="radioChange">
            <el-radio-button label="文字"></el-radio-button>
            <el-radio-button label="图形"></el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>
    <div class="showType_box">
      <el-tabs v-model="activeName">
        <el-tab-pane v-for="(item, index) in placeList" :key="item.name" :label="item.name"
          :name="item.name"></el-tab-pane>
      </el-tabs>
      <div class=" px-5" style="height: calc(100% - 64px);">
        <el-row v-show="topForm.showType === '图形'" class="h-full mt-2" :gutter="20">
          <el-col :span="11">
            <div class="legend_box">
              <div class="mt-2">
                <span class="legend_icon">巡检完成</span>
                <span class="legend_icon1">巡检中</span>
                <span class="legend_icon2">待巡检</span>
              </div>
              <div class=" default_img mt-3">
                <img v-if="imgSrc" :src="imgSrc" alt="" />
                <img v-else src="@/assets/img/lineImg.png" alt="">
                <!-- <div id="echart_box"></div> -->
              </div>
            </div>
          </el-col>
          <el-col :span="13" class="inner_box">
            <section class="right_box w-full">
              <el-table :data="curActive" height="600px" ref="selectionRight" style="width: 100%">
                <el-table-column type="index" label="序号" width="60" align="center"> </el-table-column>
                <el-table-column prop="equipmentNumber" label="设备编号" align="center" width="100"> </el-table-column>
                <el-table-column prop="equipmentName" label="设备名称" align="center" width="120"> </el-table-column>
                <el-table-column prop="equipmentType" label="设备类型" align="center">
                  <template #default="{ row }">{{ equipmentTypeTrans(equipmentTypeOptions, row.equipmentType)
                  }}</template>
                </el-table-column>
                <el-table-column prop="equipmentLocation" label="地点" align="center"> </el-table-column>
                <el-table-column prop="installLocation" label="设备安装位置" align="center" width="130"> </el-table-column>
                <el-table-column prop="inspectStatus" label="巡检状态" align="center">
                  <template #default="{ row }">
                    <span
                      :style="{ color: row.inspectStatus == '待巡检' ? '#fdb446' : row.inspectStatus == '巡检中' ? '#409eff' : '#67c23a' }">
                      {{ row.inspectStatus }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column prop="time" label="巡检时间" width="" align="center"> </el-table-column>
              </el-table>
            </section>
          </el-col>
        </el-row>
        <section v-show="topForm.showType === '文字'" class=" h-full">
          <!-- <p>
            <span v-for="(item, index) in placeList" :key="item.name" class="tab_span" @click="tabClick(item.name, index)"
              :class="indexVal === index ? 'tabActive' : ''">{{ item.name }}</span>
          </p> -->
          <div class="content_box">
            <div v-for="(detail, index) in curActive" :key="index" class="content_item"
              :class="getStatusClass(detail.inspectStatus)">
              <p class="step_p">
                <span class="detail_label">序列</span><span class="detail_val">{{ index + 1 }}</span>
              </p>
              <div class=" px-3">
                <div class=" flex items-center justify-between my-2">
                  <span class="detail_label">巡检设备</span><span class="detail_val">{{ detail.equipmentName
                  }}</span>
                </div>
                <div class=" flex items-center justify-between my-2">
                  <span class="detail_label">设备地址</span><span class="detail_val">{{ detail.equipmentLocation
                  }}</span>
                </div>
                <div class=" flex items-center justify-between my-2">
                  <span class="detail_label">巡检状态</span>
                  <span class="detail_val status-text">
                    {{ detail.inspectStatus }}
                  </span>
                </div>
                <div class=" flex items-center justify-between my-2">
                  <span class="detail_label">巡检时间</span><span class="detail_val">{{ detail.time }}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </section>
</template>
<script>
import { getCurrentInspect, getinspectPathDetail } from "@/api/inspect-workorder.js";
import { fetchEquipmentById } from "@/api/account-list.js";
import { getDict, dictTrans } from "@/api/common.js";
import { getUploadFile } from "@/api/file.js";

export default {
  props: {},
  data() {
    const wait_icon =
      "image://data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAACEAAAAgCAYAAACcuBHKAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4RpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo2NTc0NDMxZS1mOTk4LWU1NDEtYmUwYy0zZjg4ZmJkNDJiNTkiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6Nzk1RUQ4MUVDRUQ2MTFFRDlDNjVBQzA4QjExNjNCRjkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6Nzk1RUQ4MURDRUQ2MTFFRDlDNjVBQzA4QjExNjNCRjkiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6OTM0YjlmNTEtZTE2MC1iMzQ3LTg0NGItMzA5OTA1ZTEwNzE4IiBzdFJlZjpkb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6YzFmZWM1NmEtM2NiMC0yMzQ2LWFhZjUt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";
    const inspecting_icon =
      "image://data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAACEAAAAgCAYAAACcuBHKAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4RpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo2NTc0NDMxZS1mOTk4LWU1NDEtYmUwYy0zZjg4ZmJkNDJiNTkiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NzdCREU3MjNDRUQ2MTFFRDlDNjVBQzA4QjExNjNCRjkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NzdCREU3MjJDRUQ2MTFFRDlDNjVBQzA4QjExNjNCRjkiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6OTM0YjlmNTEtZTE2MC1iMzQ3LTg0NGItMzA5OTA1ZTEwNzE4IiBzdFJlZjpkb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6YzFmZWM1NmEtM2NiMC0yMzQ2LWFhZjUt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";
    const finish_icon =
      "image://data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAACEAAAAgCAYAAACcuBHKAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4RpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo2NTc0NDMxZS1mOTk4LWU1NDEtYmUwYy0zZjg4ZmJkNDJiNTkiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NzdCREU3MUZDRUQ2MTFFRDlDNjVBQzA4QjExNjNCRjkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NzdCREU3MUVDRUQ2MTFFRDlDNjVBQzA4QjExNjNCRjkiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6OTM0YjlmNTEtZTE2MC1iMzQ3LTg0NGItMzA5OTA1ZTEwNzE4IiBzdFJlZjpkb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6YzFmZWM1NmEtM2NiMC0yMzQ2LWFhZjUt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";
    return {
      topForm: {
        showType: "图形",
      },
      formData: {
        pathName: "路线一",
      },
      activeName: '地点一',
      placeList: [
        { name: '地点一', id: 1 },
        { name: '地点二', id: 2 },
        { name: '地点三', id: 3 },
        { name: '地点四', id: 4 },
        { name: '地点五', id: 5 },
        { name: '地点六', id: 6 },
        { name: '地点七', id: 7 },
        { name: '地点八', id: 8 },
        { name: '地点九', id: 9 },
        { name: '地点十', id: 10 },
      ],
      finish_icon: finish_icon,
      wait_icon: wait_icon,
      inspecting_icon: inspecting_icon,
      option: {
        title: {
          text: "",
        },
        tooltip: {
          textStyle: {
            color: "#fff",
          },
          formatter: function (param) {
            let tempStr = "";
            if (param.data.name) {
              tempStr = `序列${param.data.orderBy}  ${param.data.name}`;
            } else tempStr = `${param.name}`;
            return tempStr;
          },
        },
        xAxis: {
          name: "x",
          min: 0,
          max: 500,
          show: false,
          type: "value",
        },
        yAxis: {
          name: "y",
          min: 0,
          max: 450,
          show: false,
          type: "value",
          inverse: true,
        },
        grid: {
          left: "0%",
          top: "0%",
        },
        animationDurationUpdate: 1000,
        animationEasingUpdate: "quinticInOut",
        series: [
          {
            type: "graph",
            layout: "none",
            coordinateSystem: "cartesian2d",
            symbolSize: 33,
            roam: false,
            label: {
              show: false,
              color: "#fff",
            },
            edgeSymbol: ["circle", "arrow"],
            edgeSymbolSize: [4, 10],
            edgeLabel: {
              fontSize: 20,
            },
            data: [],
            links: [],
            lineStyle: {
              opacity: 1,
              width: 3,
              curveness: 0.2,
              color: "#35acff",
            },
          },
        ],
      },
      tableData: [],
      propData: {},
      lineDetail: {
        lineName: '园区配电设施巡检',
        equipmentNum: 10,
        executeTime: '13:00-15:00'
      },
      curActive: [
        { equipmentName: '1号配件柜', equipmentLocation: '北门门卫处', inspectStatus: '完成巡检', time: '13:10:03' },
        { equipmentName: '2号配件柜', equipmentLocation: '南门门卫处', inspectStatus: '巡检中', time: '13:10:03' },
        { equipmentName: '3号配件柜', equipmentLocation: '南门门卫处', inspectStatus: '待巡检', time: '13:10:03' },
        { equipmentName: '4号配件柜', equipmentLocation: '南门门卫处', inspectStatus: '完成巡检', time: '13:10:03' },
        { equipmentName: '5号配件柜', equipmentLocation: '南门门卫处', inspectStatus: '完成巡检', time: '13:10:02' },
        { equipmentName: '6号配件柜', equipmentLocation: '南门门卫处', inspectStatus: '完成巡检', time: '13:10:02' },
        { equipmentName: '7号配件柜', equipmentLocation: '南门门卫处', inspectStatus: '巡检中', time: '13:10:02' },
        { equipmentName: '8号配件柜', equipmentLocation: '南门门卫处', inspectStatus: '待巡检', time: '13:10:02' },
        { equipmentName: '9号配件柜', equipmentLocation: '南门门卫处', inspectStatus: '完成巡检', time: '13:10:02' },
        { equipmentName: '10号配件柜', equipmentLocation: '南门门卫处', inspectStatus: '待巡检', time: '13:10:02' },
      ],
      indexVal: 0,
      equipmentTypeOptions: [],
      imgSrc: null,
    };
  },
  computed: {},
  mounted() {
    this.initData();
  },
  methods: {
    // 设备巡检状态
    getStatusClass(status) {
      switch (status) {
        case '完成巡检':
          return 'status-done'
        case '巡检中':
          return 'status-doing'
        case '待巡检':
          return 'status-wait'
        default:
          return ''
      }
    },
    drawChart(data) {
      const dom = document.getElementById("echart_box");
      var myChart = this.$echarts.init(dom);
      let _this = this;
      if (Object.keys(data).length) {
        this.option.series[0].data = [];
        this.option.series[0].links = [];
        for (let i = 0; i < data.siteDetails.length; i++) {
          const tempLinks = {
            source: "",
            target: "",
          };
          const tempData = {
            name: "",
            value: [],
            equipmentIdList: [],
            siteStatus: -1,
            orderBy: 0,
          };
          tempLinks.source = data.siteDetails[i].name;
          tempLinks.target = data.siteDetails[i + 1]?.name;
          this.option.series[0].links.push(tempLinks);

          tempData.name = data.siteDetails[i].name;
          tempData.value = [data.siteDetails[i].xaxis + 23, data.siteDetails[i].yaxis + 20];
          tempData.equipmentIdList = data.siteDetails[i].equipmentIdList;
          tempData.orderBy = data.siteDetails[i].orderBy;
          tempData.siteStatus = data.siteDetails[i].siteStatus;
          tempData.symbol =
            data.siteDetails[i].siteStatus === 0 ? this.wait_icon : data.siteDetails[i].siteStatus === 2 ? this.finish_icon : this.inspecting_icon;
          this.option.series[0].data.push(tempData);
        }
      }
      myChart.setOption(this.option);
      myChart.off("click");
      myChart.on("click", function (param) {
        if (param.data.equipmentIdList) _this.getRealTime(param.data, _this.propData.id);
      });
    },
    initData() {
      getDict("equipment_type").then((res) => {
        if (res.code === 200 && res.data) this.equipmentTypeOptions = res.data;
      });
      this.propData = this.$route.query.data;
      this.dialogVisible = true;
      if (this.propData?.id !== "" && this.propData?.id !== undefined) {
        getinspectPathDetail(this.propData.id).then((res) => {
          if (res.code === 200 && res.data) {
            this.lineDetail = res.data;
            this.placeList = res.data.siteDetails;
            this.activeName = this.placeList[0].name;
            this.getRealTime(this.placeList[0], this.propData.id);
            this.drawChart(res.data);
            getUploadFile(res.data.url).then((res) => {
              if (res.code === 200 && res.data.length > 0) {
                if (process.env.NODE_ENV === "development") {
                  this.imgSrc = `http://192.168.2.132:9000${res.data[0].fileUrl}`;
                } else {
                  this.imgSrc = `http://192.168.20.199:9000${res.data[0].fileUrl}`;
                }
              }
            });
          }
        });
      }
    },
    getEquipmentById(data) {
      fetchEquipmentById(data.equipmentIdList).then((res) => {
        if (res.code === 200 && res.data) {
          this.placeList.forEach((v) => {
            if (data.name === v.name) {
              this.curActive = res.data;
              this.tableData = res.data;
            }
          });
        }
      });
    },

    getRealTime(data, id) {
      getCurrentInspect(data.equipmentIdList, id).then((res) => {
        if (res.code === 200 && res.data) {
          this.placeList.forEach((v) => {
            if (data.name === v.name) this.curActive = res.data;
          });
        }
      });
    },
    radioChange(e) {
      this.indexVal = 0;
      this.getRealTime(this.placeList[0], this.propData.id);
    },
    tabClick(e, i) {
      this.indexVal = i;
      let curData = this.placeList.filter((v) => {
        return v.name === e;
      });
      if (this.propData.id !== "" && this.propData.id !== undefined) this.getRealTime(curData[0], this.propData.id);
    },
    equipmentTypeTrans(data, code) {
      return dictTrans(data, code);
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-tabs__nav-scroll {
  // margin-left: 50px;
  padding: 0 50px;
}

::v-deep .el-tabs__item {
  padding: 0 50px;
}

::v-deep .el-tabs__nav-wrap::after {
  background-color: #e5e9fb !important;
}

.container_warp {
  width: 100%;
  height: 100%;
  color: #333;
}

.customBtn {
  background-color: #2e6cd8;
  color: #fff;
}

.submitBtn {
  width: 60px;
  height: 30px;
}

.backBtn {
  width: 60px;
  height: 30px;
  background-color: transparent;
  border: 1px solid #2e6cd8;
}

.top_block {
  width: 4px;
  height: 20px;
  display: inline-block;
  background: #333;
  border-radius: 5px;
  margin-right: 10px;
  vertical-align: middle;

  // width: 3px;
  //   height: 22px;
  background: linear-gradient(0deg, #0073e6, #f2fdff);
  border-radius: 2px;
  // position: absolute;
}

.title_text {
  font-size: 20px;
  color: #fefeff;
  margin-right: 40px;
  vertical-align: middle;
}

.showType_box {
  width: 100%;
  height: calc(100% - 48px);
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 0 6px rgba(90, 151, 250, 0.3);
  padding: 10px 0;
}

.statistics_num {
  color: #333;
  font-size: 16px;

  .label_text {
    color: #818181;
  }
}

#echart_box {
  width: 550px;
  height: 500px;
  // background-image: url('@/assets/img/bills/block1.png');
  background-repeat: no-repeat;
  background-size: cover;
}

#echart_box1 {
  width: 550px;
  height: 500px;
}

.content_box {
  display: grid;
  grid-template-columns: repeat(auto-fill, 260px);
  gap: 32px;
  align-content: start;
  height: 100%;
  overflow-y: scroll;
  padding: 16px;

  .content_item {
    width: 260px;
    height: 210px;
    color: #606060;
    padding: 10px 16px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

    .step_p {
      padding: 10px 0;
      margin-bottom: 16px;
    }

    .detail_label {
      font-size: 14px;
      color: #000000;
    }
  }

}

// 完成巡检
.status-done {
  box-shadow: 0 4px 12px rgba(103, 194, 58, 0.15);
  border-top: 2px solid #c5de8b;

  .step_p {
    border-bottom: 1px solid #c5de8b;
  }
}

.status-done .status-text {
  color: #67c23a;
}

// 巡检中
.status-doing {
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.15);
  border-top: 2px solid #9fc0fe;

  .step_p {
    border-bottom: 1px solid #9fc0fe;
  }
}

.status-doing .status-text {
  color: #409eff;
}

// 待巡检
.status-wait {
  box-shadow: 0 4px 12px rgba(230, 162, 60, 0.15);
  border-top: 2px solid #f5debb;

  .step_p {
    border-bottom: 1px solid #f5debb;
  }

}

.status-wait .status-text {
  color: #fdb446;
}

.inner_box {
  display: flex;
  justify-content: space-between;

  .left_box {
    position: relative;
    width: 550px;
    height: 500px;

    >img {
      position: absolute;
      width: 100%;
      height: 100%;
    }
  }
}

// .right_box {
//   width: calc(100% - 570px);
// }

::v-deep .el-radio-group {
  .el-radio-button__orig-radio:checked+.el-radio-button__inner {
    background-image: linear-gradient(90deg, #5783ff, #2960f9);
  }

  .el-radio-button__inner {
    background-color: transparent;
    color: #3268ff;
    border: 1px solid #6594dc;
    // font-size: 18px;
  }

  .el-radio-button.is-active .el-radio-button__inner {
    color: #fff;
  }

  .el-radio-button:last-child .el-radio-button__inner {
    border-radius: 0 17px 17px 0;
    border-left: none;
  }

  .el-radio-button:first-child .el-radio-button__inner {
    border-radius: 17px 0 0 17px;
  }
}

.legend_box {
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 0 6px rgba(90, 151, 250, 0.2);

  span {
    display: inline-block;
    width: 98px;
    height: 32px;
    line-height: 32px;
    background-repeat: no-repeat;
    background-size: contain;
    background-position: 0 center;
    text-align: left;
    padding-left: 40px;
  }

  .legend_icon {
    background-image: url("@/assets/icon/greenIcon.png");
  }

  .legend_icon1 {
    background-image: url("@/assets/icon/blueIcon.png");
    margin: 0 15px;
  }

  .legend_icon2 {
    background-image: url("@/assets/icon/yellowIcon.png");
  }

  .default_img {
    border-radius: 5px;
    background: #ecf2ff;
    padding: 5px;
  }
}

::v-deep .el-form {
  .el-form-item__label {
    font-size: 18px;
  }
}
</style>
