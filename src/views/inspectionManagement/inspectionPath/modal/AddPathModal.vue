<!-- 新增路线弹窗 -->
<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="1225px" :before-close="handleClose" center>
    <section class="dialog_content">
      <el-form :model="formData" label-width="120px" :inline="true" :rules="rules" ref="formRef">
        <el-form-item label="路线名称" prop="lineName">
          <el-input v-model="formData.lineName" style="width:180px"></el-input>
        </el-form-item>
        <el-form-item label="上传底图">
          <el-upload class="flex items-center" ref="upload" action="#" :show-file-list="false"
            :http-request="handleUpload" :on-success="handleSuccess" :limit="1" accept="image/*" :file-list="fileList"
            list-type="picture">
            <el-button plain type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">(图片尺寸为750px*750px,文件大小不超过1M)</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <section class="content_box">
        <section class="left_box">
          <div v-if="!imgSrc" class="img_placeholder"></div>
          <img v-else :src="imgSrc" alt="">
          <vue-draggable-resizable v-for="item in tableData" :key="item.id" :w="33" :h="33" :x="item.xaxis"
            :y="item.yaxis" @dragstop="onDragstop" @activated="onActivated(item)" @deactivated="onDeactivated(item)"
            :parent="true" :resizable="false" :active="item.isTag" v-show="item.isTag">
            <img src="@/assets/icon/inspection_wait.png" v-if="item.isTag" style="width:33px;height:33px;" alt=''
              :title="`序列${item.orderBy}   ${item.name}`">
          </vue-draggable-resizable>
        </section>
        <section class="right_box">
          <el-button type="primary" plain @click="addAddress()">新增地点</el-button>
          <ul class="table_box">
            <p><span>序号</span><span>地点名称</span><span>设备数量</span><span>操作</span></p>
            <draggable v-model="tableData" group="people" :animation="500" @end="dragEnd">
              <li v-for="(item, index) in tableData" :key="item.orderBy">
                <p>
                  <span>{{ index + 1 }}</span>
                  <span><el-input v-model="item.name" class="table_input" :placeholder="item.name"></el-input></span>
                  <span>{{ item.equipmentIdList.length }}</span>
                  <span>
                    <el-button type="text" class="editBtn" @click="handleTag(item)"
                      :disabled="item.isTag">标记</el-button>
                    <el-button type="text" class="detailBtn" @click="addDevice(item)">添加设备</el-button>
                    <!-- <el-button type="text" class="editBtn" @click="handleMove(item)">移序</el-button> -->
                    <el-button type="text" class="delBtn" @click="del(item)">删除</el-button>
                  </span>
                </p>
              </li>
            </draggable>
          </ul>
        </section>
      </section>
    </section>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submit">保 存</el-button>
      <el-button @click="handleClose">返 回</el-button>
    </span>
    <AddDeviceModal ref="addDeviceRef" @updateDevice="getDevice(arguments)"></AddDeviceModal>
  </el-dialog>
</template>
<script>
import { deepClone } from '@/utils/index'
import AddDeviceModal from './AddDeviceModal.vue'
import VueDraggableResizable from 'vue-draggable-resizable'
import inspection_on from '@/assets/icon/inspection_on.png'
import inspection_wait from '@/assets/icon/inspection_wait.png'
import inspection_finish from '@/assets/icon/inspection_finish.png'
import draggable from 'vuedraggable'
import { addInspectPath, updateInspectPath } from '@/api/auto-inspection.js'
import { uploadTempFile, getUploadFile } from '@/api/file.js'
import imgBg from '@/assets/img/bills/img_bg.png'
export default {
  props: {},
  components: { AddDeviceModal, VueDraggableResizable, draggable },
  data() {
    return {
      dialogVisible: false,
      tableData: [],
      fileList: [],
      formData: {
        id: '',
        lineName: '',
        url: '',
        fileUploads: [],
        siteDetails: []
      },
      equipmentList: [],
      activeItem: {},
      detailData: {},
      imgSrc: '',
      fileObj: {},
      rules: {
        lineName: [{ required: true, message: '请输入路线名称', trigger: 'blur' }]
      }
    }
  },
  computed: {
    title: function () {
      return '新增路线'
    }
  },
  mounted() {
  },
  methods: {
    initData() { },
    open(data) {
      this.dialogVisible = true;
      if (data) {
        this.detailData = data;
        for (let key in this.formData) this.formData[key] = this.detailData[key]
        this.detailData.siteDetails.forEach(v => { v.isTag = true })
        this.tableData = this.detailData.siteDetails;
        getUploadFile(data.url).then(res => {
          if (res.code === 200 && res.data.length > 0) {
            if (process.env.NODE_ENV === 'development') {
              this.imgSrc = `http://192.168.2.132:9000${res.data[0].fileUrl}`;
            } else this.imgSrc = `http://192.168.20.199:9000${res.data[0].fileUrl}`;
          }
        })
        this.$nextTick(() => { this.$refs.formRef?.clearValidate() })
      }
    },
    handleClose() {
      this.dialogVisible = false;
      this.tableData = [];
      this.fileObj = {};
      this.formData.fileUploads = [];
      this.imgSrc = '';
      for (let key in this.formData) {
        if (key == 'siteDetails') this.formData[key] = []
        else this.formData[key] = ''
      }
      this.detailData = {};
    },
    addAddress() {
      let tempObj = {
        id: this.tableData.length,
        name: `默认新增区域${this.tableData.length}`,
        equipmentIdList: [],
        isTag: false,
        xaxis: 0,
        yaxis: 0,
        orderBy: this.tableData.length + 1
      }
      this.tableData.push(tempObj)
    },
    submit() {
      this.$refs.formRef?.validate(valid => {
        if (valid) {
          this.formData.fileUploads = [];
          let tempArray = deepClone(this.tableData)
          tempArray.forEach(v => {
            delete v.id;
            delete v.isTag;
          })
          this.formData.siteDetails = tempArray
          if (Object.keys(this.fileObj).length > 0) {
            this.formData.fileUploads.push(this.fileObj);
          }
          if (Object.keys(this.detailData).length > 0) {
            this.formData.id = this.detailData.id;
            updateInspectPath(this.formData).then(res => {
              if (res.code === 200) {
                this.$message.success('编辑成功');
                this.handleClose();
                this.$emit('success')
              }
            })
          } else {
            addInspectPath(this.formData).then(res => {
              if (res.code === 200) {
                this.$message.success('新增成功');
                this.handleClose();
                this.$emit('success')
              }
            })
          }
        }
      })

    },
    async handleUpload(params) {
      const res = await uploadTempFile(params.file)
      if (res.code === 200 && Object.keys(res.data).length > 0) {
        if (process.env.NODE_ENV === 'development') this.imgSrc = `http://192.168.2.132:9000${res.data.fileUrl}`;
        else this.imgSrc = `http://192.168.20.199:9000${res.data.fileUrl}`
        this.fileObj = res.data;
      }
    },
    handleSuccess(res, file, fileList) {
      this.$message.success('图片上传成功！');
      this.$refs.upload.clearFiles();
    },
    handleTag(item) {
      item.isTag = true
      item.xaxis += 10 * item.id
      item.yaxis += 10 * item.id
    },
    addDevice(item) {
      this.$refs.addDeviceRef?.open(item)
    },
    handleMove(item) { },
    del(item) {
      this.$confirm('确定删除?', '提示').then(() => {
        let tempArray = [];
        if (this.detailData) { tempArray = deepClone(this.tableData).filter(v => { return v.name !== item.name }) }
        else { tempArray = deepClone(this.tableData).filter(v => { return v.id !== item.id }) }
        this.tableData = tempArray
      }).catch(() => { })
    },
    getDevice(data) {
      this.tableData.forEach(v => {
        if (v.id === data[1]) v.equipmentIdList = data[0].map(v => { return v.equipmentId })
      });
    },
    onActivated(item) {
      this.activeItem = item;
    },
    onDragstop(x, y) {
      this.activeItem.xaxis = x;
      this.activeItem.yaxis = y;
    },
    onDeactivated(item) {
      if (!this.detailData) {
        item.xaxis = this.activeItem.xaxis;
        item.yaxis = this.activeItem.yaxis;
      }
    },
    dragEnd() {
      for (let i = 0; i < this.tableData.length; i++) {
        this.tableData[i].orderBy = i + 1
      }
    }
  }
}
</script>


<style lang="scss" scoped>
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
    // background-image: url('@/assets/img/bills/block1.png');
    background-repeat: no-repeat;
    background-size: cover;
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
      object-fit: cover;
    }

    .draggable.vdr {
      position: absolute;
      left: 0;
      top: 0;
    }
  }

  .right_box {
    width: calc(100% - 570px);

    .table_box {
      margin-top: 10px;

      >p {
        font-size: 16px;
        border-bottom: 2px solid #5480fd;
        background: #e9efff;

        >span {
          display: inline-block;
          text-align: center;
          padding: 8px 0;
        }

        >span:nth-child(1) {
          width: 60px;
        }

        >span:nth-child(2) {
          width: 200px;
        }

        >span:nth-child(3) {
          width: 100px;
        }

        >span:nth-child(4) {
          width: 240px;
        }
      }

      li {
        color: #a6b3fc;

        .table_input {
          width: 98%;

        }

        .el-input .el-input__inner {
          background-color: transparent !important;
          border-radius: 3px;
        }

        p {
          height: 33px;

          >span {
            display: inline-block;
            text-align: center;
            padding: 8px 0;
            // border-right: 1px solid #c9d9fc;
            height: 33px;
          }

          >span:nth-child(1) {
            width: 60px;
          }

          >span:nth-child(2) {
            width: 200px;
          }

          >span:nth-child(3) {
            width: 100px;
          }

          >span:nth-child(4) {
            width: 240px;
          }
        }
      }
    }
  }


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
