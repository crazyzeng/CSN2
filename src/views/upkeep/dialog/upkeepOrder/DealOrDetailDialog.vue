<!-- 保养工单，详情，处理，dialog -->
<template>
  <el-dialog :title="curTitle" :visible.sync="dialogVisible" width="1366px" :before-close="handleClose" top="5vh"
    :close-on-click-modal="false">
    <section class="flex justify-between">
      <section class="left w-1/2">
        <!-- 工单信息-->
        <el-row class="flex flex-wary justify-between">
          <div class="w-1/3 mb-2">工单编号：{{ workData.workNo }}</div>
          <div class="w-1/3 mb-2">工单名称：{{ workData.name }}</div>
          <div class="w-1/3 mb-2">保养类型：{{ workData.type === 0 ? '常规保养' : workData.type === 1 ? '一级保养' : '二级保养' }}</div>
        </el-row>
        <el-row class="flex flex-wary" style="margin:10px 0">
          <div class="w-1/3 mb-2">责任部门：{{ workData.maintainDepart }}</div>
          <div class="w-1/3 mb-2">保养人员：{{ workData.maintainUserRealName }}</div>
        </el-row>
        <el-row>
          <div>工单生成时间：{{ workData.generateTime }}</div>
          <div style="margin:10px 0">工单派发时间：{{ workData.distributedTime }}</div>
          <div>工单完成时间：{{ workData.completeTime }}</div>
        </el-row>
        <div class="container_title" style="margin-top:20px">保养设备清单</div>
        <!--保养设备清单-->
        <el-table class="curTable" :data="tableData" height="400px" max-height="400px" style="width: 100%;padding:10px">
          <el-table-column type="index" align="center" label="序号" width="80"> </el-table-column>
          <el-table-column prop="equipmentNumber" align="center" label="设备编号" min-width="120"> </el-table-column>
          <el-table-column prop="equipmentName" align="center" label="设备名称" min-width="100"> </el-table-column>
          <el-table-column prop="equipmentType" align="center" label="设备类型" min-width="100">
            <template #default="{ row }">{{ equipmentTypeTrans(equipmentTypeOptions, row.equipmentType) }}</template>
          </el-table-column>
          <el-table-column prop="installLocation" align="center" label="设备安装位置" min-width="150"> </el-table-column>
        </el-table>
      </section>
      <el-divider direction="vertical"></el-divider>
      <section class="right  w-1/2">
        <!--保养过程图片-->
        <div class="container_title mb-15px">保养过程图片</div>
        <el-upload class="mt-4" :class="{ disabled: uploadDisabled }" action="#" list-type="picture-card"
          :http-request="handleUpload" accept=".jpg, .png" :limit="4" :file-list="fileList" :on-success="handleSuccess"
          :disabled="curType === 'detail'">
          <i slot="default" class="el-icon-plus"></i>
          <div slot="file" slot-scope="{file}">
            <img class="el-upload-list__item-thumbnail" :src="fileSrc(file)" alt="">
            <span class="el-upload-list__item-actions">
              <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                <i class="el-icon-zoom-in"></i>
              </span>
              <!-- <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleDownload(file)">
                <i class="el-icon-download"></i>
              </span> -->
              <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file)">
                <i class="el-icon-delete"></i>
              </span>
            </span>
          </div>
        </el-upload>
        <el-dialog title="图片预览" :visible.sync="imgDialogVisible" top="3vh" append-to-body>
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
        <!--保养过程描述-->
        <div class="container_title" style="margin-top:20px">保养过程描述</div>
        <el-input v-model="formData.description" type="textarea" :rows="10" placeholder="请输入内容" resize="none"
          show-word-limit class="mt-5" maxlength="500" :disabled="this.curType === 'detail'">
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
import { getDetailInfo, handleSomething } from '@/api/upkeep/workOrder.js'
import { getDict, dictTrans } from '@/api/common'
import { getUploadFile, uploadTempFile } from '@/api/file'
export default {
  data() {
    return {
      curTitle: '详情',
      curType: 'detail',
      dialogVisible: false,
      tableData: [],
      // 故障图片
      dialogImageUrl: '',
      imgDialogVisible: false,
      disabled: false,
      fileList: [],
      equipmentTypeOptions: [],
      workData: {},
      formData: {
        orderId: '',
        description: '',
        uploads: []
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
    handleClose(done) {
      done();
    },
    async confirm() {
      if (this.curType === 'deal') {
        handleSomething(this.formData).then(res => {
          if (res.code === 200) {
            this.$message.success('处理成功');
            this.$emit('success');
          }
          this.cancel()
        })
      } else this.dialogVisible = false;
    },
    async handleUpload(params) {
      const res = await uploadTempFile(params.file)
      if (res.code === 200 && Object.keys(res.data).length > 0) {
        console.log(res.data)
        this.fileList.push(res.data);
        this.formData.uploads = this.fileList;
        if (this.fileList.length >= 4) this.uploadDisabled = true;
      }
    },
    handleSuccess(res, file, fileList) {
      this.$message.success('图片上传成功！');
      this.$refs.upload.clearFiles();
    },
    fileSrc(file) {
      if (process.env.NODE_ENV === 'development') return `http://192.168.2.132:9000${file.fileUrl}`
      else return `http://192.168.20.199:9000${file.fileUrl}`
    },
    cancel() {
      this.formData.description = '';
      this.formData.uploads = [];
      this.formData.orderId = '';
      this.dialogVisible = false;
      if (this.fileList.length < 4) this.uploadDisabled = false;
    },
    equipmentTypeTrans(data, code) {
      return dictTrans(data, code)
    },
    // 上传图片相关
    handleRemove(file) {
      this.fileList.splice(this.fileList.indexOf(file), 1);
      this.formData.uploads = this.fileList;
      if (this.fileList.length < 4) this.uploadDisabled = false;
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.imgDialogVisible = true;
    },
    handleDownload(file) {
      console.log(file);
    },
    open(type, data) {
      this.fileList = []
      this.curType = type
      if (type === 'detail') this.curTitle = `详情--工单编号${data.workNo}`
      else this.curTitle = `处理--工单编号${data.workNo}`
      this.formData.orderId = data.id;
      getDetailInfo(data.id).then(res => {
        this.tableData = [res.data.equipment]
        this.workData = res.data
        this.formData.description = res.data.description;
        if (res.data.url && res.data.url.length > 0) {
          getUploadFile(res.data.url).then(res => {
            if (res.code === 200 && res.data.length > 0) {
              this.fileList = res.data;
              this.formData.uploads = res.data;
            }
          })
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
  color: #000
}

.right {
  margin-left: 10px;
}

::v-deep.el-divider {
  height: 620px !important;
  background-color: #355271 !important;
}

::v-deep.el-table--enable-row-transition .el-table__body td.el-table__cell {
  border: none !important;
}

::v-deep.el-table th.el-table__cell.is-leaf {
  border: none;
}

::v-deep.el-form-item .el-form-item--mini {
  margin-bottom: 0px !important;
}

::v-deep .el-textarea {
  .el-textarea__inner {
    color: #000 !important;
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
</style>