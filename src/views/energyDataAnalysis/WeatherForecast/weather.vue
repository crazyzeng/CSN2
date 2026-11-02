<template>
  <div data-title="">
    <div class="mt-5"></div>
    <el-form :model="formData" :inline="true">
      <el-form-item label="时间" style="width: 260px" class="">
        <el-date-picker v-model="formData.dataTime" type="date" placeholder="请选择时间" format="yyyy-MM-dd"
          value-format="yyyy-MM-dd" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" round icon="el-icon-search" @click="query">查询</el-button>
        <el-button type="primary" round icon="el-icon-refresh-left" @click="reset">重置</el-button>
      </el-form-item>
      <el-form-item style="margin-right: 0;float:right">
        <el-button plain type="primary" round icon="el-icon-plus" @click="add()">新增</el-button>
        <el-button type="primary" plain icon="el-icon-download" @click="downloadTemplate()">导出模板</el-button>
        <el-upload ref="upload" class="_uplaod-div" name="file" :show-file-list="false" :action="url"
          :before-upload="beforeUpload" :on-success="uploadSuccess" :on-error="uploadFail" :limit="1"
          accept=".xls, .xlsx">
          <el-button plain slot="trigger" type="primary" icon="el-icon-upload2">导入</el-button>
          <div slot="tip" class="el-upload__tip"></div>
        </el-upload>
        <el-button plain type="primary" icon="el-icon-delete" @click="handleBatchDelete">批量删除</el-button>
      </el-form-item>
    </el-form>
    <el-table ref="tableRef" :data="tableData" height="calc(100vh - 380px)" @selection-change="handleSelectionChange">
      <el-table-column align="center" type="selection" width="55" />
      <el-table-column align="center" type="index" label="序号" width="65" />
      <el-table-column align="center" label="时间" prop="dataTime" min-width="160px" />
      <el-table-column align="center" label="干球温度（摄氏度）" prop="dryBulbTemp" min-width="170px" />
      <el-table-column align="center" label="露点温度（摄氏度）" prop="dewTemp" min-width="170px" />
      <el-table-column align="center" label="相对湿度（%）" prop="relativeHumidity" min-width="140px" />
      <el-table-column align="center" label="大气压力（hPa）" prop="atmosphericPressure" min-width="150px" />
      <el-table-column align="center" label="风向（度）" prop="windDirection" min-width="110px" />
      <el-table-column align="center" label="风速（km/h）" prop="windSpeed" min-width="140px" />
      <el-table-column align="center" label="云量（%）" prop="cloudAmount" min-width="110px" />
      <el-table-column align="center" label="操作" width="150px">
        <template #default="{ row }">
          <el-link class="blue-link" @click="handleEdit(row)">
            编辑
          </el-link>
          <el-divider direction="vertical" />
          <el-link class="red-link"  @click="handleDelete(row)">
            删除
          </el-link>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination style="float:right;margin-top: 40px;" background layout="total, sizes, prev, pager, next, jumper"
      :current-page="paging.pageNo" :page-size="paging.pageSize" :total="paging.total" @size-change="sizeChange"
      @current-change="pageChange">
    </el-pagination>
    <AddOrEdit ref="AddOrEditRef" @success="success" :data-item="dataItem" :data-flag="dataFlag"
      :data-title="dataTitle" />
  </div>
</template>

<script>
import { deleteWeather, getWeatherPage, handleUpload, exportWeatherForecast } from '@/api/weather-forecast.js'
import AddOrEdit from './modal/AddOrEdit.vue'
import { getUrl } from '@/utils'
export default {
  components: { AddOrEdit },
  data() {
    return {
      tableData: [],
      AddOrEditRef: null,
      uploadRef: null,
      tempSelectIds: [],
      tableRef: null,
      dataItem: {},
      dataFlag: false,
      dataTitle: '',
      paging: {
        pageSize: 10,
        pageNo: 1,
        total: 10,
      },
      formData: { dataTime: '' }
    }
  },
  computed: {
    url() {
      let url = getUrl('weather/upload');
      return url;
    },
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      getWeatherPage(this.paging, this.formData).then((res) => {
        if (res && res.code === 200) {
          this.tableData = res.data.records
          this.paging.total = res.data.total
        }
      })
    },
    handleSelectionChange(data) {
      this.tempSelectIds = data.map(e => e.id)
    },
    query() {
      this.getData()
    },
    reset() {
      Object.keys(this.formData).forEach(key => (this.formData[key] = ''))
      this.paging.pageNo = 1;
      this.paging.pageSize = 10;
      this.getData()
    },
    add() {
      this.dataTitle = '新增'
      this.dataFlag = true
      this.dataItem.value = {}
    },
    success() {
      this.dataFlag = false
      this.query()
    },
    downloadTemplate() {
      exportWeatherForecast().then(res => {
        let data = res;
        if (!data) return;
        let url = window.URL.createObjectURL(new Blob([data]));
        let link = document.createElement("a");
        link.style.display = "none";
        link.href = url;
        link.setAttribute("download", "天气模板.xls");
        document.body.appendChild(link);
        link.click();
      });
    },
    beforeUpload() { },
    // 成功
    uploadSuccess(res, file, fileList) {
      if (res.code == 500) {
        this.$message.error(res.msg);
      } else {
        this.$message.success('导入成功！');
        this.query();
      }
      this.$refs.upload.clearFiles();
    },
    //上传失败
    uploadFail(err, file, fileList) {
      this.$refs.upload.clearFiles();
      this.$message.error(err.message);
    },
    async handleImportasync(op) {
      try {
        await handleUpload(op.file)
        this.$message.success('导入成功')
        await this.query()
      }
      catch (error) { }
      finally { this.uploadRef?.clearFiles() }
    },
    doDelete(idArray) {
      this.$confirm('确认删除？', '提示', { type: 'warning',confirmButtonClass:'confirm-btn ',
      cancelButtonClass:'cancel-btn ', }).then(() => {
        deleteWeather(idArray).then(() => {
          this.$message.success('删除成功')
          this.getData()
        })
      }).catch(() => { this.query() })
    },
    handleBatchDelete() {
      if (this.tempSelectIds.length > 0) this.doDelete(this.tempSelectIds)
      else this.$message.warning('请至少选择一条数据')
    },
    handleEdit(row) {
      this.dataTitle = '编辑'
      this.dataItem = row
      this.dataFlag = true
    },
    handleDelete(row) {
      this.doDelete([row.id])
    },
    pageChange(val) {
      this.paging.pageNo = val
      this.getData()
    },
    sizeChange(val) {
      this.paging.pageSize = val
      this.getData()
    }
  }
}

</script>

<style lang="scss" scoped>

.exportBtn {
  // margin-left: 25px;
}

._uplaod-div {
  display: inline-block;
  margin: 0 10px;
}

.edit_btn,
.del_btn {
  font-size: 16px;
}

.top_block {
  width: 4px;
  height: 20px;
  background: #fff;
  border-radius: 5px;
  position: absolute;
  top: 31px;
  left: 20px;
}
</style>
