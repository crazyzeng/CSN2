<!-- 新增 -->
<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="380px" :before-close="handleClose" center>
    <section class="content_box">
      <el-form ref="basicForm" :inline="true" :rules="rules" :model="formData" class="">
        <el-row>
          <el-col>
            <el-form-item label="表计名称：" prop="pointName">
              <el-input v-model="formData.pointName" placeholder="请输入表计名称" @click.native="handInputMeterName"
                readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="分项名称：" prop="subItemIds">
              <el-cascader v-model="formData.subItemIds" :options="stockTypeOptions" :props="cascaderProps"
                :show-all-levels="false" placeholder="请输入分项名称" clearable style="width: 100%;"
                popper-class="custom_poper"></el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="所在区域：" prop="area" style="margin-left: 10px;">
              <el-input v-model="formData.area" placeholder="请输入所在区域"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="安装位置：" prop="location" style="margin-left: 10px;">
              <el-input v-model="formData.location" placeholder="请输入安装位置"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>


      <!-- 新增的选择弹框 -->
      <el-dialog title="点位选择" :visible.sync="selectDialogVisible" width="1130px" :before-close="handleClose2" center
        append-to-body>
        <el-form :inline="true" :model="formData2" class="">
          <el-form-item label="属性点名称：">
            <el-input v-model="formData2.name" placeholder="属性点名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="属性点ID：">
            <el-input v-model="pointId" placeholder="属性点ID" clearable @change="handleInputPointId"></el-input>
          </el-form-item>
          <el-form-item label="通讯设备：">
            <el-select v-model="formData2.deviceId" placeholder="请选择" :clearable="true">
              <el-option v-for="item in list.devices" :key="item.deviceId" :label="item.name"
                :value="item.deviceId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="query2">查询</el-button>
            <el-button type="primary" icon="el-icon-refresh-left" @click="reset2">重置</el-button>
          </el-form-item>
        </el-form>

        <el-table :data="tableData" ref="multipleTable" style="width: 100%" max-height="400" row-key="pointId" border
          size="small" @selection-change="handleSelectionChange">
          <el-table-column label="" type="selection" width="50" align="center"
            :reserve-selection="true"></el-table-column>
          <el-table-column label="序号" type="index" width="100" align="center"></el-table-column>
          <el-table-column label="属性点ID" prop="pointId" width="150" align="center"></el-table-column>
          <el-table-column label="属性点名称" prop="name" min-width="200" align="center"></el-table-column>
          <el-table-column label="所属通讯设备" prop="deviceName" min-width="200" align="center"></el-table-column>
          <el-table-column label="属性类型" prop="typeName" min-width="200" align="center"></el-table-column>
        </el-table>
        <div class="th-pagination">
          <el-pagination @size-change="sizeChange" @current-change="pageChange" :current-page="paging.pageNo"
            :page-size="paging.pageSize" :total="paging.total"
            layout="total, sizes, prev, pager, next, jumper"></el-pagination>
        </div>
        <!-- buttons -->
        <div slot="footer" class="dialog-footer">
          <el-button class="confirm-btn" @click="submit2">确 定</el-button>
          <el-button class="cancel-btn" @click="handleClose2">取 消</el-button>
        </div>
      </el-dialog>

    </section>
    <span slot="footer" class="dialog-footer">
      <el-button class="confirm-btn" @click="submit">保 存</el-button>
      <el-button class="cancel-btn" @click="handleClose">返 回</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { handleSubItems, getMeterConfigAdd, getMeterConfigEdit } from '@/api/meter-config.js';
import { getPointList, getDeviceList } from '@/api/auto-inspection.js';
export default {
  props: {},
  data() {
    return {
      dialogVisible: false,
      title: '',
      stockTypeOptions: [], // 分项名称数据
      cascaderProps: {
        value: 'orgId',     // 选项值字段
        label: 'orgName',   // 选项标签字段
        children: 'children' // 子节点字段
      },
      formData: {
        id: '',
        pointId: '',
        pointName: '',
        subItemId: '',
        subItemIds: [],
        area: '',
        location: '',
      },
      pointId: '',
      // 表单数据
      formData2: {
        name: '',
        type: '',
        pointIds: [],
        orgName: '',
        deviceId: '',
      },
      list: {
        devices: [],
      },
      selectDialogVisible: false, // 点位弹框状态
      tableData: [], // 点位数据
      selectPointIds: [], // 勾选的点位
      // 分页
      paging: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      rules: {
        pointName: [{ required: true, message: '请输入表计名称', trigger: 'blur' }],
        subItemIds: [{ required: true, message: '请输入分项名称', trigger: 'blur' }],
      },
      storehouseList: [],
    }
  },
  computed: {
  },
  mounted() {
    this.initData()
    this.getData()
  },
  methods: {
    initData() {
      this.getDevices({});
      this.getSubItems()
    },

    // 获取分项名称
    getSubItems() {
      handleSubItems({ energyType: 'ENERGY_ELECTRIC' }).then((res) => {
        if (res) this.stockTypeOptions = res.data;
      });
    },

    // 获取通讯设备
    getDevices(data) {
      getDeviceList(data).then((res) => {
        if (res) this.list.devices = res.data.records;
      });
    },

    // 表计input点位弹出框点击事件
    async handInputMeterName() {
      this.selectDialogVisible = true
      this.setSelections()
      // this.initSelection()
    },

    // 获取点位数据
    getData() {
      getPointList(this.formData2, this.paging).then((res) => {
        if (res.code === 200 && res.data) {
          this.tableData = res.data.records;
          this.paging.total = res.data.total;
          if (this.formData.pointId)
            this.setSelections()
        }
      });
    },

    // 显示多少条发生改变
    async sizeChange(val) {
      this.paging.pageNo = 1;
      this.paging.pageSize = val;
    },

    // 页数发生变化
    async pageChange(val) {
      this.paging.pageNo = val;
      await this.getData(this.formData2, this.paging);
    },

    // ponintId输入框点击事件
    handleInputPointId() {
      this.formData2.pointIds = this.pointId.split(',').map((id) => id.trim()).filter((id) => id !== '');
    },

    // 编辑匹配点位数据函数
    findPointById(pointId) {
      return this.tableData.find(item => item.pointId === pointId);
    },

    // 点位勾选回显
    setSelections() {
      this.$nextTick(() => {
        const table = this.$refs.multipleTable;
        if (!table) return;

        this.tableData.forEach((row) => {
          if (this.selectPointIds.includes(row.pointId)) {
            setTimeout(() => {
              table.toggleRowSelection(row, true);
            }, 50);
          }
        });
      });
    },

    // 查询
    query2() {
      this.getData(this.formData2, this.paging);
    },

    reset2() {
      this.formData2.deviceId = '';
      this.formData2.orgName = '';
      this.formData2.name = '';
      this.formData2.type = '';
      this.pointId = '';
      this.formData2.pointIds = [];
      this.paging.pageNo = 1;
      this.paging.pageSize = 10;
      this.query2();
    },

    submit2() {
      if (this.selectPointIds.length !== 1) {
        this.$message.warning('只能选择一个设备')
      } else {
        this.selectDialogVisible = false;
        this.formData.pointId = this.selectPointIds[0].pointId
        this.formData.pointName = this.selectPointIds[0].name
      }
    },

    handleClose2() {
      this.formData2.deviceId = '';
      this.formData2.orgName = '';
      this.formData2.name = '';
      this.formData2.type = '';
      this.pointId = '';
      this.formData2.pointIds = [];
      this.paging.pageNo = 1;
      this.paging.pageSize = 10;
      this.selectDialogVisible = false;
      this.getData()
    },

    submit() {
      if (this.formData.subItemIds.length === 3) {
        this.formData.subItemId = this.formData.subItemIds[2]
      } else if (this.formData.subItemIds.length === 2) {
        this.formData.subItemId = this.formData.subItemIds[1]
      } else if (this.formData.subItemIds.length === 1) {
        this.formData.subItemId = this.formData.subItemIds[0]
      }

      this.$refs.basicForm.validate(valid => {
        if (valid) {
          if (!this.formData.id) {
            getMeterConfigAdd(this.formData).then(res => {
              if (res.code === 200) {
                this.$message.success('新增成功');
                this.handleClose();
                this.$emit('success');
              }
            })
          } else {
            getMeterConfigEdit(this.formData).then(res => {
              if (res.code === 200) {
                this.$message.success('编辑成功');
                this.handleClose();
                this.$emit('success');
              }
            })
          }
        }
      })
    },
    handleClose() {
      for (let k in this.formData) this.formData[k] = '';
      this.selectPointIds = []

      if (this.$refs.multipleTable) {
        this.$refs.multipleTable.clearSelection();
      }
      
      this.dialogVisible = false;
    },
    //table勾选事件
    handleSelectionChange(val) {
      this.selectPointIds = val
    },

    open(data) {
      this.dialogVisible = true;
      this.title = data ? '编辑表计配置' : '新增表计配置';

      if (data.id) {
        this.selectPointIds = []
        // 复制数据
        this.formData = { ...data };
        this.formData.pointName = data.meterName;
        this.selectPointIds = [data.pointId]

        // 查找路径（如果subItemId存在）
        if (data.subItemId) {
          this.formData.subItemIds = this.findPathById(data.subItemId);
        }
      } else {
        this.title = '新增表计配置'
        this.formData2.deviceId = '';
        this.formData2.orgName = '';
        this.formData2.name = '';
        this.formData2.type = '';
        this.formData2.type = '';
        this.pointId = '';
        this.formData2.pointIds = [];
        this.paging.pageNo = 1;
        this.paging.pageSize = 10;
      }
    },

    // 简化的查找函数
    findPathById(id) {
      const result = [];

      const find = (nodes, targetId, path = []) => {
        for (const node of nodes) {
          const newPath = [...path, node.orgId];
          if (node.orgId === targetId) {
            result.push(...newPath);
            return true;
          }
          if (node.children && find(node.children, targetId, newPath)) {
            return true;
          }
        }
        return false;
      };

      find(this.stockTypeOptions, id);
      return result;
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog {
  .el-dialog__header {
    text-align: left;
  }

  .el-dialog__body {
    padding-top: 10px;
  }
}

.box_title {
  margin-bottom: 10px;
  padding-left: 15px;

  >span:nth-child(1) {
    display: inline-block;
    font-size: 20px;
    font-weight: bold;
    color: #fff;
    vertical-align: middle;
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