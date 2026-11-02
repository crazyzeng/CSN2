<!-- 故障申报，编辑，dialog -->
<template>
  <el-dialog :title="curTitle" :visible.sync="dialogVisible" width="1366px" :before-close="handleClose" top="5vh"
    :close-on-click-modal="false">
    <section class="flex justify-between text-white">
      <section class="left w-1/2">
        <el-row class="flex justify-between">
          <div class="w-1/3">设备编号：{{ equipmentItem.equipmentNumber }}</div>
          <div class="w-1/3">品牌：{{ equipmentItem.equipmentDetail?.brand }}</div>
          <div class="w-1/3">负责人：{{ equipmentItem.equipmentDetail?.dutyPerson }}</div>
        </el-row>
        <el-row class="flex justify-between mt-4">
          <div class="w-1/3">设备名称：{{ equipmentItem.equipmentName }}</div>
          <div class="w-1/3">型号：{{ equipmentItem.equipmentDetail?.specification }}</div>
          <div class="w-1/3">联系方式：{{ equipmentItem.equipmentDetail?.contact }}</div>
        </el-row>
        <el-row class="flex justify-between mt-4">
          <div class="w-1/3">设备类型：{{ equipmentTypeTrans(deviceTypeOptions, equipmentItem.equipmentType) }}</div>
          <div class="w-1/3">制造商：{{ equipmentItem.equipmentDetail?.producer }}</div>
          <div class="w-1/3">所属部门：{{ equipmentItem.equipmentDetail?.department }}</div>
        </el-row>
        <el-row class="flex justify-start mt-4">
          <div class="w-1/3">安装位置：{{ equipmentItem.installLocation }}</div>
          <div class="w-1/3">维保单位：{{ equipmentItem.equipmentDetail?.maintenanceUnit }}</div>
        </el-row>
        <div class="container_title mt-6">维修设备清单</div>
        <!--搜索-->
        <el-form ref="formRef" :inline="true" :model="formData" class="mt-4 flex">
          <el-form-item label="" prop="">
            <div class="flex">
              <el-input v-model="formData.searchVal" style="width:300px;margin-right: 20px;"
                placeholder="请输入设备名称、编号、类型"></el-input>
              <el-button type="primary" icon="el-icon-search" @click="query">查询</el-button>
              <el-button type="primary" icon="el-icon-refresh" @click="reset">重置</el-button>
            </div>
          </el-form-item>
        </el-form>
        <!--表格-->
        <el-table :data="tableData" height="300" ref="multipleTable" @selection-change="handleSelectionChange"
          style="width: 100%" @select-all="handleSelectAll" @select="tableSelect">
          <el-table-column align="center" type="selection" label="全选" width="60">
          </el-table-column>
          <el-table-column align="center" type="index" label="序号" width="60">
          </el-table-column>
          <el-table-column align="center" prop="equipmentName" label="设备名称" width="120">
          </el-table-column>
          <el-table-column align="center" prop="equipmentNumber" label="设备编号" width="100">
          </el-table-column>
          <el-table-column align="center" prop="equipmentType" label="设备类型" width="120">
            <template #default="{ row }">
              {{ equipmentTypeTrans(deviceTypeOptions, row.equipmentType) }}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="installLocation" label="设备安装位置" width="130">
          </el-table-column>
        </el-table>
      </section>
      <el-divider direction="vertical"></el-divider>
      <section class="right  w-1/2">
        <!--故障图片-->
        <div class="container_title">故障设备图片</div>
        <el-upload class="mt-4" :class="{ disabled: uploadDisabled }" action="#" list-type="picture-card" ref="upload"
          :multiple="true" :on-success="handleSuccess" accept=".jpg, .png" :limit="4" :file-list="fileList"
          :http-request="handleUpload">
          <i slot="default" class="el-icon-plus"></i>
          <div slot="file" slot-scope="{file}">
            <img class="" :src="fileSrc(file)" alt="">
            <span class="el-upload-list__item-actions">
              <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                <i class="el-icon-zoom-in"></i>
              </span>
              <!-- <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleDownload(item)">
                  <i class="el-icon-download"></i>
                </span> -->
              <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file)">
                <i class="el-icon-delete"></i>
              </span>
            </span>
          </div>
          <div slot="tip" class="mt-5 text-xs">只能上传jpg/png文件，且不超过5M，最多上传4张图片</div>
        </el-upload>
        <el-dialog title="图片预览" :visible.sync="imgDialogVisible" top="3vh" append-to-body>
          <img style="display: block;margin: auto;" :src="dialogImageUrl" alt="">
        </el-dialog>
        <!--故障描述-->
        <div class="container_title mt-20">故障描述</div>
        <el-input v-model="addData.description" type="textarea" :rows="6" placeholder="请输入内容" resize="none"
          show-word-limit class="mt-5" maxlength="250">
        </el-input>
      </section>
    </section>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="confirm">确 定</el-button>
      <el-button type="primary" @click="handleClose">返 回</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { uploadTempFile, getUploadFile } from '@/api/file.js'
import { addRepairWorkOrder, updateRepairWorkOrder, getRepairWorkOrderNumber } from '@/api/repair-workorder.js'
import { fetchAllEquipment, getAccountDetail } from '@/api/account-list.js'
import { getDict, dictTrans } from '@/api/common.js'
export default {
  data() {
    return {
      curTitle: '新增',
      dialogVisible: false,
      formData: {
        searchVal: '',
      },
      addData: {
        id: '',
        orderNumber: '',
        equipmentId: '',
        source: '人工申报',
        fileUploads: [],
        description: '',
      },
      tableData: [],
      // 故障图片
      dialogImageUrl: '',
      imgDialogVisible: false,
      disabled: false,
      fileList: [],
      faultDescribe: '',
      tableCheckedData: [],
      deviceTypeOptions: [],
      equipmentItem: {},
      uploadDisabled: false,
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
      getDict('equipment_type').then(res => {
        this.deviceTypeOptions = res.data;
      })
      this.getAllEquipment(this.formData.searchVal);
    },
    async getAllEquipment(searchString) {
      await fetchAllEquipment(searchString).then(res => {
        if (res.code === 200 && res.data) this.tableData = res.data;
      })
    },
    query() {
      this.getAllEquipment(this.formData.searchVal);
    },
    reset() {
      this.formData.searchVal = '';
      this.getAllEquipment('');
    },
    handleClose() {
      this.$refs.multipleTable.clearSelection();
      this.$refs.multipleTable.setCurrentRow();
      for (let key in this.addData) {
        if (key == 'fileUploads') this.addData[key] = [];
        else this.addData[key] = ''
      }
      this.equipmentItem = {};
      this.fileList = [];
      this.dialogVisible = false;
      this.formData.searchVal = '';
      this.reset();
      this.addData.fileUploads = []
      if (this.fileList.length < 4) this.uploadDisabled = false;
    },
    fileSrc(file) {
      if (process.env.NODE_ENV === 'development') return `http://192.168.2.132:9000${file.fileUrl}`
      else return `http://192.168.20.199:9000${file.fileUrl}`
    },
    async confirm() {
      this.$refs.multipleTable.setCurrentRow();
      this.addData.equipmentId = this.equipmentItem.equipmentId;
      if (this.curTitle === '新增') {
        const res = await getRepairWorkOrderNumber();
        if (res.code === 200) this.addData.orderNumber = res.data;
        addRepairWorkOrder(this.addData).then(res => {
          if (res.code === 200) {
            this.$message.success('故障申报成功');
            this.handleClose();
            this.$emit('success');
            this.addData.fileUploads = [];
          }
        })
      } else {
        updateRepairWorkOrder(this.addData).then(res => {
          if (res.code === 200) {
            this.$message.success('编辑成功');
            this.handleClose();
            this.$emit('success');
            this.addData.fileUploads = [];
          }
        })
      }
    },
    handleSelectionChange(val) {
      if (val.length > 1) {
        this.$refs.multipleTable.clearSelection();
        return
      }
      this.tableCheckedData = val;
    },
    handleSelectAll() {
      this.$message.warning('只能选择一个设备')
    },
    tableSelect(selection, row) {
      this.equipmentItem = row;
    },
    // 表格单选
    handleCurrentChange(data) {
      console.log('data: ', data);

    },
    handleRemove(file) {
      this.fileList.splice(this.fileList.indexOf(file), 1);
      this.addData.fileUploads = this.fileList;
      if (this.fileList.length < 4) this.uploadDisabled = false;
    },
    handlePictureCardPreview(item) {
      if (process.env.NODE_ENV === 'development') this.dialogImageUrl = `http://192.168.2.132:9000${item.fileUrl}`
      else this.dialogImageUrl = `http://192.168.20.199:9000${item.fileUrl}`

      this.imgDialogVisible = true;
    },
    handleDownload(file) {
      console.log(file);
    },
    handleOnExceed() {
      this.$message.warning('超过最大上传数量')
    },
    async handleUpload(params) {
      const res = await uploadTempFile(params.file)
      if (res.code === 200 && Object.keys(res.data).length > 0) {
        this.fileList.push(res.data);
        this.addData.fileUploads = this.fileList;
        if (this.fileList.length >= 4) this.uploadDisabled = true;
      }
    },
    handleSuccess(res, file, fileList) {
      this.$message.success('图片上传成功！');
      this.$refs.upload.clearFiles();
    },
    open(type, data) {
      if (type === 'add') this.curTitle = '新增'
      else this.curTitle = '编辑'
      if (data) {
        this.addData.description = data.description;
        this.addData.id = data.id;
        this.addData.orderNumber = data.orderNumber;
        this.curTitle = `编辑--工单编号${data.orderNumber}`
        getAccountDetail(data.equipmentId).then(res => {
          if (res.code === 200) this.equipmentItem = res.data?.equipment;
          const tempRow = this.tableData.filter(v => { return v.equipmentId === data.equipmentId })
          this.$nextTick(() => {
            this.$refs.multipleTable?.toggleRowSelection(tempRow[0], true);
          })
        })
        if (data.url && data.url.length > 0) {
          getUploadFile(data.url).then(res => {
            if (res.code === 200 && res.data.length > 0) {
              this.fileList = res.data;
              this.addData.fileUploads = res.data;
              if (this.fileList.length >= 4) this.uploadDisabled = true;
            }
          })
        }
      }
      this.dialogVisible = true
    },
    equipmentTypeTrans(data, code) {
      return dictTrans(data, code);
    },
  }
}

</script>
<style lang='scss' scoped>
.container_title {
  font-size: 18px;
  color: #000;
}

.left {
  margin-right: 10px;
  color: #333;
}

.right {
  margin-left: 10px;
}

::v-deep.el-divider {
  height: 545px !important;
  background-color: #355271 !important;
}

::v-deep.el-table--enable-row-transition .el-table__body td.el-table__cell {
  border: none !important;
}

::v-deep.el-table th.el-table__cell.is-leaf {
  border: none;
}

::v-deep .el-textarea {
  .el-textarea__inner {
    border-color: #31679d;
    color: #000;
  }

  .el-input__count {
    color: #000;
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

.dialog-footer {
  text-align: center;
}
</style>