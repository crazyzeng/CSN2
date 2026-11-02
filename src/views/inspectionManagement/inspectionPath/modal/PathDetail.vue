<!-- 查看路线弹窗 -->
<template>
  <el-dialog :title="title" :visible="dialogVisible" width="65%" :before-close="handleClose" center>
    <section class="dialog_content">
      <el-form :model="formData" label-width="120px" :inline="true">
        <el-form-item label="路线名称:">
          <p><span>{{ formData.pathName }}</span></p>
        </el-form-item>
      </el-form>
      <section class="content_box">
        <section class="left_box">
          <div v-if="!imgSrc" class="img_placeholder"></div>
          <img v-else :src="imgSrc" alt="">
          
          <img v-if="propsData.siteDetails?.length === 1" :src="wait_icon"
            :style="{ width: '33px', height: '32px', position: 'absolute', left: propsData.siteDetails[0].xaxis + 'px', top: propsData.siteDetails[0].yaxis + 'px' }"
            alt="">
          <div v-else id="echart_box"></div>
        </section>
        <section class="right_box">
          <el-table :data="tableData" height="500" ref="selectionRight" style="width: 100%">
            <el-table-column type="index" label="序号" width="60">
            </el-table-column>
            <el-table-column prop="equipmentNumber" label="设备编号" width="100">
            </el-table-column>
            <el-table-column prop="equipmentName" label="设备名称" width="120">
            </el-table-column>
            <el-table-column prop="equipmentType" label="设备类型">
              <template #default="{ row }">{{ equipmentTypeTrans(equipmentTypeOptions, row.equipmentType)
              }}</template>
            </el-table-column>
            <el-table-column prop="equipmentLocation" label="地点">
            </el-table-column>
            <el-table-column prop="installLocation" label="设备安装位置" width="130">
            </el-table-column>
          </el-table>
        </section>
      </section>
    </section>
    <span slot="footer" class="dialog-footer">
      <el-button class="backBtn" @click="handleClose">返 回</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { debounce } from '@/utils/index'
import { fetchEquipmentById } from '@/api/account-list.js'
import { getDict, dictTrans } from '@/api/common.js'
import { getUploadFile } from '@/api/file.js'
import inspection_wait from '@/assets/icon/inspection_wait.png'
import imgBg from '@/assets/img/bills/img_bg.png'

export default {
  props: {},
  components: {},
  data() {
    const wait_icon = 'image://data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAACEAAAAgCAYAAACcuBHKAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4RpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo2NTc0NDMxZS1mOTk4LWU1NDEtYmUwYy0zZjg4ZmJkNDJiNTkiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6Nzk1RUQ4MUVDRUQ2MTFFRDlDNjVBQzA4QjExNjNCRjkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6Nzk1RUQ4MURDRUQ2MTFFRDlDNjVBQzA4QjExNjNCRjkiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6OTM0YjlmNTEtZTE2MC1iMzQ3LTg0NGItMzA5OTA1ZTEwNzE4IiBzdFJlZjpkb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6YzFmZWM1NmEtM2NiMC0yMzQ2LWFhZjUtYTFiN2FjNjFhNDc0Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+bzQFDAAACJtJREFUeNqsVwtwVNUZPufce/dmH9nNg2TzakiENOFhCpFHeXQIII9BprWdqUxlrOJ0rEaoHYtWOh0sdqjIo6CoBIqMArYl2IJaiECg2CAwMTxDIAt5QJJNNu+QZPfu3b3nnJ6z3I2XmzCK7Zn55tzd8/rO/z4wxj0RgjsN6kA6hBPbCsbmZNqWWGVhlijAXAiBk08khPaqIeLp7tO++NepzoMvv3Wjgf/NgBk0vTeDGgBeee5HFEQP1kkYCQindhbkfXek7Q1ZQvPB1zfadTv82baPvOs37Gm8pZMIm/ooERIlYiQhiI5UZCTQ8PH3n8lKlfeJCOTeTf6egDYZ5cyc4Foyq8DV+eFn7fX6XsbLDWmnKj1g5uS8u0hECLSWTl3ttKO1bGPxGxIYBIRUynRbHp43NT64+1B7zT0IUOM3IwI5kUECNw8WPGOX6SpIMfhfMDnPunLvmpzFbE8Hg43ByiAzSAwiP8tMkEtCKi8ek5uVYimB95CAouIuzy2l/Lxn4Exts1LNf7vsMEEU+OZD549Kt0yrrleOX28KBk1SoMNJgxumraM0f78swUVmvREKwmUVfbuXrW083h/ASL9FRN9JcaJl20vfmT9vivNR5jXIvLbOqx6Z+GTNn9hngMGv9wqDyhAyGCwVTu6aPn5kirjxjuF+BUJJeN1u35pfbfaeC4WpxSROFAgSWnKit9Yi0cZp461TICTQuD4uFmWfvRI4dtMXVoB586+8JCINMS9TfAxQbYj1llX4d6/b01HH9ZmRJNo2rnDPG/+AnEcYv0u1weoXtrSd7O7D4dd2tVdNzLEcnjvJ/ohxPRONUPSTuDknL/j367c2wuiyULRa8CxIyV0EFJV2LVvbcpx9WkamSI7Pt6avSnQJ6dHx7BTruKljMgpmPNe8qaMXh1f82Vd66YPMuRYRxhj3GZMpfI91nxhihhGCTgQiEeExEUkYUOdVKvsDJGID776YsDjRSdPNc1ITwOi3f504m9+muUMLNniD1eY58Q6awS+iQ9Z7o1ojnoIQCMcByogZ0Nymtkcnjc+CD5rHo5iQA/OjOvZ1qW3mcausxemHWobBIBGRMaZDggrFUS9gA5oAKBo2XiNAhMGwySVrsi1KInoWhyES0v+L2IVISLgHQZBgXJw2gqZFA0q9V73+UK6YMhyJG03aVV0SIH0ETYlIwNC0MA3vWGmf47RBfgs/s7W2G83k2qYSpUoNR8hxYBQKafWQ3cCI3HRakBQHuQ7BS8WBTwNKuMc8Z8AfbvvNNv9hPicnA9myksk48xxN01S3iyQ6rSQ20UESR6XS0Y/OQAtObLI//vRCKVknIQpFj6Xmx1rJFKMLiwKRczOQuv9zXNfSRdUzV7UvH8ymVkcMdbAU3n/lpnb2idfV4qoGMsClVfJ76aeZyTTPHApau3Bjdz/pYTEEIEgoAxEQJTEWYp0+DuYyPdZVXqcB+OH6SfOXFMIjQ/IzBWR9CXnnj3vJFVOAMfZg63I0c9kC9MvhUnx5FS2r8FBPey/oSXIBWJADU+IdQIqxgJAsgbCGQcfcl/FOHrYzfPvAPxxWMGUYIvTYeXDo+a3gaGs3CBoJ5KQD67srwA+njQULh7OXth7Q/PBvwZYGH+gTmAtiAhR2hvpWEZgwdiTI4CQkEWgXa8ERTiLtneV48pPzyD+HywG8hTQQrG+F1YxIGzNimJYI3NkpdNydBDa0sZyDn31T2HzsPPL+4Qk8ganKFdZA4KNydOrgaVR34FVtYaIT2DkJvwIaOAk3W2ev3hF8LctNl4L/Q6tpglUPLY/5yws/1kbPzifZokAxI8xdR1m8Wt677unw6MJ8MlESqcYuHkDRuvAXm6Utiqo1maPe/WJAwf2lX8Lz3GDdLmxn8YNFGUx4bxGxaJMp7LxN/XwuJRgiiGMGSZy5Jtx+/6iwihJmLt+SAGFrL9ygl102zIsZ0NQBevnhUQRVHAioEKclaC4WEHlQBKEQ1iJFTTQ9Hz0vdS+apAqp8Xjy/ZZ3HJ4m5Gnpgl3M5S2+HtRRWik15aRp0GElqLsftm8vjSlXwzD07KLANFkiIisJAfu/JVLU6MmFl2F2Ji6np7hjZ6KTTLgfO7jaKNZ4vGIT0z1gsQCzw5TtpbbT/6m2eNkw9yw1N10T3niqf0ZqAk5i8zBLXKTsouU4JxGjx3FZrwntSwsDo7YVdf+VTYz9JgT6FNQ/Y2Xy24unKO4ZY0IZzBA15pZYZIbX3iv4egdQR0IskbLcmlsWKc+aLGgBMhCEXYteTdrH1QFN5Tmquikp+VlqZ156aM7XqYCyYPLK+3H7yi5ZfZcbLB2z85VERwwRWNTFIpNIvAPLGYmaa4RTcwiQEYCUCix6soXk9f3Oj680WvxI3w0big1eAwZ/tiHpcL0PHY4a0L1QWimf2XEktpYbtxKCakm57SKzeE1EhIH1EGMBMu9gKTXSMwNlbgGu3BIvf1ph6+HnI8PzLUokFCXy+MbkDX6Veod/1WHg7YK+p95MPqZXTnxdkEmk+cTlmEpRwJrEIWLN1wNvIkYIRvIHpq29sLGoOKkiKk6uDmCoJ+5STVuviGNlfH16rv8R9hxgwZI9cnQwRw7/fEvqrhqv3KuTVqIV9VmPtfkHY/1SanzYJSBCHDKxSCIzA6aKAQXeLip2H2q/LYajt0GmN4FRGtyildV/S7pQWWt5zyyFPSdjD5Rdsjfq5fyAjsHvF3e5T/QFQDOXhk1moQBhjAlR1h9IOFTnsyjGzZD+MKX3UAsnEliwJuu9rj50keuSo7ZFOvf89rSjbKxfR5RE9Nvfzzzmd3vdn2BMezkBlsa1ki+cpYfPxXaaHsuaUFhYyB+nwz1aB1WkYQiuNcsVEx8IOFt6RM/SzSN3dfaJgajt6KowPnAicaG1RwqcrrFXBVRU//fyuIoP/p3QZrpshMR/BRgAatQw3hL3bYgAAAAASUVORK5CYII='
    return {
      dialogVisible: false,
      tableData: [],
      formData: { pathName: '' },
      equipmentTypeOptions: [],
      myChart: null,
      imgSrc: '',
      option: {
        title: {
          text: ''
        },
        tooltip: {
          textStyle: {
            color: '#fff'
          },
          formatter: function (param) {
            let tempStr = '';
            if (param.data.name) {
              tempStr = `序列${param.data.orderBy}  ${param.data.name}`
            } else tempStr = `${param.name}`
            return tempStr
          }
        },
        xAxis: {
          name: "x",
          min: 0,
          max: 500,
          show: false,
          type: "value"
        },
        yAxis: {
          name: "y",
          min: 0,
          max: 450,
          show: false,
          type: "value",
          inverse: true
        },
        grid: {
          left: '0%',
          top: '0%'
        },
        animationDurationUpdate: 1000,
        animationEasingUpdate: 'quinticInOut',
        series: [
          {
            type: 'graph',
            layout: 'none',
            coordinateSystem: "cartesian2d",
            symbolSize: 33,
            symbol: wait_icon,
            edgeSymbol: ['circle', 'arrow'],
            edgeSymbolSize: [4, 10],
            label: {
              show: false
            },
            edgeLabel: {
              fontSize: 20
            },
            data: [],
            links: [],
            lineStyle: {
              opacity: 1,
              width: 3,
              curveness: 0.2,
              color: '#35acff'
            }
          }
        ]
      },
      wait_icon: inspection_wait,
      propsData: {}
    }
  },
  computed: {
    title: function () { return '查看路线' }
  },
  mounted() {
    this.initData()
  },
  methods: {
    initData() {
      getDict('equipment_type').then(res => {
        if (res.code === 200 && res.data) this.equipmentTypeOptions = res.data;
      })
    },
    getEquipmentByIds(data) {
      if (data.length > 0) {
        fetchEquipmentById(data).then(res => {
          if (res.code === 200 && res.data) this.tableData = res.data;
        })
      }
    },
    equipmentTypeTrans(data, code) {
      return dictTrans(data, code)
    },
    getImgBg(str) {
      getUploadFile(str).then(res => {
        if (res.code === 200 && res.data.length > 0) {
          if (process.env.NODE_ENV === 'development') {
            this.imgSrc = `http://192.168.2.132:9000${res.data[0].fileUrl}`
          } else this.imgSrc = `http://192.168.20.199:9000${res.data[0].fileUrl}`
        }
      })
    },
    drawChart(data) {
      if (data.siteDetails.length > 1) {
        const dom = document.getElementById('echart_box')
        this.myChart = this.$echarts.init(dom);
        let _this = this;
        if (Object.keys(data).length) {
          this.option.series[0].data = [];
          this.option.series[0].links = [];
          for (let i = 0; i < data.siteDetails.length; i++) {
            const tempLinks = {
              source: '',
              target: ''
            }
            const tempData = {
              name: '',
              value: [],
              equipmentIdList: [],
              orderBy: 0
            };
            tempLinks.source = data.siteDetails[i].name;
            tempLinks.target = data.siteDetails[i + 1]?.name;
            this.option.series[0].links.push(tempLinks);

            tempData.name = data.siteDetails[i].name;
            tempData.value = [data.siteDetails[i].xaxis + 23, data.siteDetails[i].yaxis + 20];
            tempData.equipmentIdList = data.siteDetails[i].equipmentIdList;
            tempData.orderBy = data.siteDetails[i].orderBy;
            this.option.series[0].data.push(tempData)
          }
        }
        this.myChart.setOption(this.option)
        this.myChart.off('click');
        this.myChart.on("click", debounce(function (params) {
          if (params.data.equipmentIdList.length > 0) {
            _this.getEquipmentByIds(params.data.equipmentIdList);
          } else _this.$message({ message: '暂无设备信息' });
        }, 500))
      }
    },
    open(data) {
      this.dialogVisible = true;
      this.formData.pathName = data.lineName;
      this.propsData = data;
      this.$nextTick(function () {
        this.drawChart(data);
        this.getEquipmentByIds(data.siteDetails[0]?.equipmentIdList || []);
        this.getImgBg(data.url);
      })
    },
    handleClose() {
      this.dialogVisible = false;
      this.tableData = [];
      this.myChart = null;
      this.imgSrc = '';
    },
  }
}
</script>


<style lang="scss" scoped>
.add_addressBtn {
  background-color: #2a3e61;
  border-radius: 15px;
  color: #fff;
  padding: 8px 12px;
  margin-bottom: 10px;
}

.saveBtn {
  border-radius: 3px;
}

.backBtn {
  color: #fff;
}

.upload-box {
  display: flex;
}

.uploadBtn {
  background-color: #2a3e61;
}

.el-upload__tip {
  color: #6DC6FF;
  margin: 0 0 0 10px;
}

.el-input {
  .el-input__inner {
    background-color: transparent !important;
    border-radius: 3px;
  }
}

.content_box {
  width: 100%;
  display: flex;
  justify-content: space-between;

  .left_box {
    width: 550px;
    height: 500px;
    position: relative;
    margin-right: 20px;
    border-radius: 8px;
    overflow: hidden;

    .img_placeholder {
      width: 100%;
      height: 100%;
      background: #f5f6f7;
      border: 1px dashed #dcdfe6;
      border-radius: 8px;
      overflow: hidden;
    }

    >img {
      width: 550px;
      height: 500px;
      margin-right: 20px;
      position: absolute;
    }


    .draggable.vdr {
      position: absolute;
      left: 0;
      top: 0;
    }

    #echart_box {
      width: 550px;
      height: 500px;
      // background-image: url('@/assets/img/bills/block1.png');
      background-repeat: no-repeat;
      background-size: cover;
    }
  }

  .right_box {
    width: calc(100% - 570px);
  }


}

::v-deep .el-dialog {
  .el-dialog__header {
    background-color: transparent;
    height: 60px;
  }

  .el-dialog__body {
    padding-top: 10px;
  }
}
</style>
<style lang="scss">
.vdr,
.vdr.active:before {
  position: absolute;
  -webkit-box-sizing: border-box;
  box-sizing: border-box
}

.vdr.active:before {
  content: "";
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  outline: 1px dashed #d6d6d6;
  z-index: -1;
}

.vdr-stick {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  position: absolute;
  font-size: 1px;
  background: #fff;
  border: 1px solid #6c6c6c;
  -webkit-box-shadow: 0 0 2px #bbb;
  box-shadow: 0 0 2px #bbb
}

.inactive .vdr-stick {
  display: none
}

.vdr-stick-br,
.vdr-stick-tl {
  cursor: nwse-resize
}

.vdr-stick-bm,
.vdr-stick-tm {
  left: 50%;
  cursor: ns-resize
}

.vdr-stick-bl,
.vdr-stick-tr {
  cursor: nesw-resize
}

.vdr-stick-ml,
.vdr-stick-mr {
  top: 50%;
  cursor: ew-resize
}

.vdr-stick.not-resizable {
  display: none
}

.content-container {
  display: block;
  position: relative
}
</style>
