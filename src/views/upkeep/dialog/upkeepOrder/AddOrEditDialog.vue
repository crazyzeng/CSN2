<!-- 故障申报，编辑，dialog -->
<template>
  <el-dialog :title="curTitle" :visible.sync="dialogVisible" width="1366px" :before-close="handleClose" top="5vh"
    :close-on-click-modal="false">
    <section class="flex justify-between">
      <section class="left w-1/2">
        <el-row class="flex justify-between">
          <div class="w-1/3">设备编号：{{ topData.deviceNum }}</div>
          <div class="w-1/3">品牌：{{ topData.deviceNum }}</div>
          <div class="w-1/3">负责人：{{ topData.deviceNum }}</div>
        </el-row>
        <el-row class="flex justify-between mt-4">
          <div class="w-1/3">设备名称：{{ topData.deviceNum }}</div>
          <div class="w-1/3">型号：{{ topData.deviceNum }}</div>
          <div class="w-1/3">联系方式：{{ topData.deviceNum }}</div>
        </el-row>
        <el-row class="flex justify-between mt-4">
          <div class="w-1/3">设备类型：{{ topData.deviceNum }}</div>
          <div class="w-1/3">制造商：{{ topData.deviceNum }}</div>
          <div class="w-1/3">所属部门：{{ topData.deviceNum }}</div>
        </el-row>
        <el-row class="flex justify-start mt-4">
          <div class="w-1/3">安装位置：{{ topData.deviceNum }}</div>
          <div class="w-1/3">维保单位：{{ topData.deviceNum }}</div>
        </el-row>
        <div class="container_title mt-6">保养设备清单</div>
        <!--搜索-->
        <el-form ref="formRef" :inline="true" :model="formData" class="mt-4 flex">
          <el-form-item label="" prop="">
            <el-input v-model="formData.searchData" style="width:300px" placeholder="请输入设备名称、编号、类型"></el-input>
          </el-form-item>
          <el-form-item label="" style="margin-left: 50px;">
            <el-button type="primary" class="customBtn" icon="el-icon-search" @click="query">查询</el-button>
            <el-button type="primary" class="customBtn" icon="el-icon-refresh" @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
        <!--表格-->
        <el-table ref="singleTable" :data="tableData" highlight-current-row @current-change="handleCurrentChange"
          style="width: 100%" height="300px">
          <el-table-column type="index" align="center" width="80" label="序号"> </el-table-column>
          <el-table-column prop="date" align="center" label="设备编号"> </el-table-column>
          <el-table-column prop="name" align="center" label="设备名称"> </el-table-column>
          <el-table-column prop="address" align="center" label="设备类型"> </el-table-column>
          <el-table-column prop="address" align="center" label="设备安装位置" style="border:none"> </el-table-column>
        </el-table>
      </section>
      <el-divider direction="vertical"></el-divider>
      <section class="right  w-1/2">
        <!--故障图片-->
        <div class="container_title">故障设备图片</div>
        <el-upload class="mt-4" action="#" list-type="picture-card" :auto-upload="false" :on-exceed="handleOnExceed"
          accept=".jpg, .png" :limit="4" :file-list="fileList" :on-change="ImgChange">
          <i slot="default" class="el-icon-plus"></i>
          <div slot="file" slot-scope="{file}">
            <img class="el-upload-list__item-thumbnail" :src="file.url" alt="">
            <span class="el-upload-list__item-actions">
              <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                <i class="el-icon-zoom-in"></i>
              </span>
              <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleDownload(file)">
                <i class="el-icon-download"></i>
              </span>
              <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file)">
                <i class="el-icon-delete"></i>
              </span>
            </span>
          </div>
          <div slot="tip" class="mt-5">只能上传jpg/png文件，且不超过5M</div>
        </el-upload>
        <el-dialog title="图片预览" :visible.sync="imgDialogVisible" top="3vh" append-to-body>
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
        <!--故障描述-->
        <div class="container_title mt-20">故障描述</div>
        <el-input v-model="faultDescribe" type="textarea" :rows="6" placeholder="请输入内容" resize="none" show-word-limit
          class="mt-5" maxlength="500">
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
export default {
  data() {
    return {
      curTitle: '新增',
      dialogVisible: false,
      topData: {
        deviceNum: '测试数据'
      },
      formData: {
        searchData: ''
      },
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }
      ],
      // 故障图片
      dialogImageUrl: '',
      imgDialogVisible: false,
      disabled: false,
      fileList: [],
      faultDescribe: ''
    };
  },

  components: {},

  computed: {},

  mounted() { },

  methods: {
    query() { },
    reset() { },
    handleClose(done) {
      done();
      this.$refs.singleTable.setCurrentRow();
    },
    async confirm(data) {
      this.dialogVisible = false
      this.$refs.singleTable.setCurrentRow();
    },

    cancel() {
      this.dialogVisible = false
      this.$refs.singleTable.setCurrentRow();
    },
    // 表格单选
    handleCurrentChange(data) {
      console.log('data: ', data);
    },
    // 上传图片相关
    handleRemove(file) {
      console.log(file);
      console.log(this.fileList)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.imgDialogVisible = true;
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
    open(type, data) {
      if (type === 'add') this.curTitle = '新增'
      else this.curTitle = '编辑'
      if (data) this.curTitle = `编辑--工单编号${data.workOrderNum}`
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
</style>