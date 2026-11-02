<!-- 处理，dialog -->
<template>
  <el-dialog :title="curTitle" :visible.sync="dialogVisible" width="1614px" :before-close="handleClose" top="5vh"
    :close-on-click-modal="false">
    <section class="flex justify-between">
      <section class="left w-1/2 text-white">
        <!-- 工单信息-->
        <el-row class="flex justify-between">
          <div class="w-1/3">工单编号：{{ workOrderDetail.orderNumber }}</div>
          <div class="w-1/3">工单来源：{{ workOrderDetail.source }}</div>
          <div class="w-1/3">责任部门：{{ workOrderDetail.dept }}</div>
          <div class="w-1/3">维修人员：{{ workOrderDetail.username }}</div>
        </el-row>
        <el-row class="flex justify-start mt-1">
          <div class="w-1/2">工单生成时间：{{ workOrderDetail.createTime }}</div>
          <div class="w-1/2">工单完成时间：{{ workOrderDetail.completeTime }}</div>
        </el-row>
        <div class="container_title my-4">保养设备清单</div>
        <!--设备信息-->
        <el-row class="flex justify-between">
          <div class="w-1/3">设备编号：{{ equipmentItem?.equipmentNumber }}</div>
          <div class="w-1/3">品牌：{{ equipmentItem?.equipmentDetail?.brand }}</div>
          <div class="w-1/3">负责人：{{ equipmentItem?.equipmentDetail?.dutyPerson }}</div>
        </el-row>
        <el-row class="flex justify-between mt-1">
          <div class="w-1/3">设备名称：{{ equipmentItem?.equipmentName }}</div>
          <div class="w-1/3">型号：{{ equipmentItem?.equipmentDetail?.specification }}</div>
          <div class="w-1/3">联系方式：{{ equipmentItem?.equipmentDetail?.contact }}</div>
        </el-row>
        <el-row class="flex justify-between mt-1">
          <div class="w-1/3">设备类型：{{ equipmentTypeTrans(equipmentTypeOptions, equipmentItem?.equipmentType) }}</div>
          <div class="w-1/3">制造商：{{ equipmentItem?.equipmentDetail?.producer }}</div>
          <div class="w-1/3">所属部门：{{ equipmentItem?.equipmentDetail?.department }}</div>
        </el-row>
        <el-row class="flex justify-start mt-1">
          <div class="w-1/3">安装位置：{{ equipmentItem?.installLocation }}</div>
          <div class="w-1/3">维保单位：{{ equipmentItem?.equipmentDetail?.maintenanceUnit }}</div>
        </el-row>
        <!--故障图片-->
        <div class="container_title">故障设备图片</div>
        <el-upload class="mt-4" :class="{ isDetail: true }" action="#" list-type="picture-card" :auto-upload="false"
          :on-exceed="handleOnExceed" accept=".jpg, .png" :limit="4" :file-list="faultFileList" :on-change="ImgChange"
          disabled>
          <i slot="default" class="el-icon-plus"></i>
          <div slot="file" slot-scope="{file}">
            <img class="el-upload-list__item-thumbnail" :src="fileSrc" alt="">
            <span class="el-upload-list__item-actions">
              <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                <i class="el-icon-zoom-in"></i>
              </span>
              <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleDownload(file)">
                <i class="el-icon-download"></i>
              </span>
            </span>
          </div>
        </el-upload>
        <!--故障描述-->
        <div class="container_title">故障描述</div>
        <el-input v-model="workOrderDetail.description" type="textarea" disabled :rows="4" placeholder="请输入内容"
          resize="none" show-word-limit class="mt-5 text-white" maxlength="200">
        </el-input>
      </section>
      <el-divider direction="vertical"></el-divider>
      <section class="right  w-1/2 text-white">
        <!--维修设备图片-->
        <div class="container_title mb-4">维修设备图片</div>
        <el-upload class="mt-4 repair_upload" :class="{ disabled: uploadDisabled, isDetail: curType === 'detail' }"
          action="#" list-type="picture" ref="upload" :multiple="true" :on-success="handleSuccess" accept=".jpg, .png"
          :limit="4" :file-list="repairFileList" :http-request="handleUpload" :disabled="curType === 'detail'">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="file" slot-scope="{file}">
            <img class="el-upload-list__item-thumbnail" :src="fileSrc(file)" alt="">
            <span style="color:#333;">{{ file.fileName }}</span>
            <span class="el-upload-list__item-actions float-right">
              <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file, 'repair')">
                <i class="el-icon-zoom-in"></i>
              </span>
              <span class="el-upload-list__item-delete" @click="handleRemove(file)">
                <i class="el-icon-delete"></i>
              </span>
            </span>
          </div>
        </el-upload>
        <el-dialog title="图片预览" :visible.sync="imgDialogVisible" top="3vh" append-to-body>
          <img style="display: block;margin: auto;" :src="dialogImageUrl" alt="">
        </el-dialog>
        <!--维修过程-->
        <div class="container_title my-4">维修过程</div>
        <el-input v-model="formData.process" type="textarea" :disabled="curType === 'detail'" :rows="10"
          placeholder="请输入内容" resize="none" show-word-limit class="mt-5" maxlength="500">
        </el-input>
      </section>
    </section>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="confirm">确 定</el-button>
      <el-button type="primary" @click="cancel">返 回</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getRepairWorkOrderDetail, handleRepairWorkOrder } from '@/api/repair-workorder.js'
import { getDict, dictTrans } from '@/api/common'
import { getUploadFile, uploadTempFile } from '@/api/file'
export default {
  data() {
    return {
      curTitle: '详情',
      curType: 'detail',
      dialogVisible: false,
      workOrderDetail: {},
      equipmentItem: {},
      // 故障图片
      dialogImageUrl: '',
      imgDialogVisible: false,
      disabled: false,
      faultFileList: [],
      repairFileList: [],
      equipmentTypeOptions: [],
      formData: {
        repairId: '',
        process: '',
        fileUploads: []
      },
      uploadDisabled: false
    };
  },

  components: {},

  computed: {

  },

  mounted() {
    getDict('equipment_type').then(res => {
      if (res.code === 200 && res.data) this.equipmentTypeOptions = res.data;
    })
  },

  methods: {
    query() { },
    reset() { },
    handleClose() {
      this.cancel();
    },
    async confirm() {
      if (this.curType === 'deal') {
        handleRepairWorkOrder(this.formData).then(res => {
          if (res.code === 200) {
            this.$message.success('处理成功');
            this.$emit('success');
            this.cancel();
          }
        })
      }
      this.dialogVisible = false
    },
    equipmentTypeTrans(data, code) {
      return dictTrans(data, code)
    },
    fileSrc(file) {
      if (process.env.NODE_ENV === 'development') return `http://192.168.2.132:9000${file.fileUrl}`
      else return `http://192.168.20.199:9000${file.fileUrl}`
    },
    cancel() {
      this.dialogVisible = false
      this.formData.repairId = ''
      this.formData.process = '';
      this.formData.fileUploads = [];
      this.repairFileList = [];
      this.faultFileList = [];
      if (this.repairFileList.length < 4) this.uploadDisabled = false;
    },
    // 表格单选
    handleCurrentChange(data) {
      console.log('data: ', data);

    },
    handleRemove(file) {
      if (this.curType === 'detail') return;
      this.repairFileList.splice(this.repairFileList.indexOf(file), 1);
      this.formData.fileUploads = this.repairFileList;
      if (this.repairFileList.length < 4) this.uploadDisabled = false;
    },
    handlePictureCardPreview(file) {
      let url = '';
      if (process.env.NODE_ENV === 'development') url = 'http://192.168.2.132:9000';
      else url = 'http://192.168.20.199:9000';
      let tempStr = '';
      tempStr = file.fileUrl;
      this.dialogImageUrl = `${url}${tempStr}`
      this.imgDialogVisible = true;
    },
    async handleUpload(params) {
      const res = await uploadTempFile(params.file)
      if (res.code === 200 && Object.keys(res.data).length > 0) {
        this.repairFileList.push(res.data);
        this.formData.fileUploads = this.repairFileList;
        if (this.repairFileList.length >= 4) this.uploadDisabled = true;
      }
    },
    handleSuccess(res, file, fileList) {
      this.$message.success('图片上传成功！');
      this.$refs.upload.clearFiles();
    },
    handleDownload(file) {
      console.log(file);
    },
    handleOnExceed() {
      this.$message.warning('超过最大上传数量')
    },
    ImgChange(file, fileList) {
      console.log('file: ', file);
      console.log(fileList);
    },
    getImgUrl(str, type) {
      if (str && str.length > 0)
        getUploadFile(str).then(res => {
          if (res.code === 200 && res.data) {
            if (type === 'fault')
              this.faultFileList = res.data;
            else {
              this.repairFileList = res.data
              this.formData.fileUploads = res.data;
            };
          }
        })
    },
    open(type, data) {
      this.fileList = []
      this.curType = type
      if (type === 'detail') this.curTitle = `详情--工单编号${data.orderNumber}`
      else this.curTitle = `处理--工单编号${data.orderNumber}`
      getRepairWorkOrderDetail(data.id).then(res => {
        if (res.code === 200 && Object.keys(res.data).length > 0) {
          this.workOrderDetail = res.data.repair;
          this.formData.process = res.data.detail?.process || '';
          this.equipmentItem = res.data.equipment || {};
          this.formData.repairId = this.workOrderDetail?.id;
          this.getImgUrl(res.data.repair.url, 'fault');
          this.getImgUrl(res.data.detail?.url, 'repair')
        }
      })
      this.dialogVisible = true
    },
  }
}

</script>
<style lang='scss' scoped>
.container_title {
  font-size: 16px;
  color: #000;
}

.left {
  margin-right: 10px;
  color: #333;
}

.right {
  margin-left: 10px;
}

.img_box {
  width: 100%;
  height: 150px;
}

::v-deep.el-divider {
  height: 560px !important;
}

::v-deep.el-table--enable-row-transition .el-table__body td.el-table__cell {
  border: none !important;
}

::v-deep.el-table th.el-table__cell.is-leaf {
  border: none;
}

::v-deep .el-textarea {
  .el-textarea__inner {
    background-color: transparent;
    color: #000 !important;
  }

  .el-input__count {
    color: #000;
    background-color: transparent;
  }
}

::v-deep.repair_upload {
  .el-button {
    border-radius: 16px;
  }

  .el-upload-list {
    display: flex;
    flex-wrap: wrap;
    height: 204px;
    max-height: 204px;
    overflow: hidden;

    li {
      width: 50%;
      background-color: transparent;
    }
  }

  .el-upload-list__item-delete {
    display: inline;
    top: 30px;
    right: 11px;
  }
}

::v-deep {
  .el-upload-list__item {
    transition: none !important;
    -webkit-transition: nonne !important;
  }

  .el-upload-list__item-name {
    transition: none !important;
    -webkit-transition: nonne !important;
  }
}
</style>
<style lang="scss">
.disabled .el-upload {
  display: none !important;
}

.isDetail .el-upload--picture {
  // visibility: hidden;
  display: none;
}

.isDetail .el-upload--picture-card {
  // visibility: hidden;
  display: none;
}
</style>