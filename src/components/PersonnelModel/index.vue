<template>
  <el-dialog width="30%" :title="dataTitle" :visible="dataFlag" :before-close="handleClose" @open="handleOpen">

    <el-tree :data="treeData" :props="{ label: 'realName' }" ref="tree" node-key="userName" show-checkbox>
    </el-tree>

    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handlcSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getAllUser } from '@/api/user'

export default {
  name: 'PersonnelModel',
  props: {
    dataTitle: {
      type: String,
      default: ''
    },
    dataFlag: {
      type: Boolean,
      default: false
    },
    dataIds: {
      type: Array,
      default() { return [] }
    }
  },
  data() {
    return {
      treeData: []
    }
  },
  mounted() { this.init() },
  methods: {

    // 初始化
    init() {
      this.getData()
    },

    // 处理弹框打开
    handleOpen() {
      if (this.dataId.length > 0) this.$nextTick(() => this.$refs.tree.setCheckedKeys(this.dataId));
    },

    // 处理关闭
    handleClose() {
      this.$refs.tree.setCheckedKeys([]);
      this.$emit('close');
    },

    // 处理提交
    handlcSubmit() {
      const dataArr = this.$refs.tree.getCheckedNodes();
      if (dataArr.length <= 0) return this.$message.warning('请选择保养人');
      else this.$emit('submit', dataArr);
    },

    // 获取用户数据
    getData() {
      getAllUser()
        .then(res => {
          this.treeData = res.data.list;
        });
    }
  }
}
</script>

<style lang="scss" scoped></style>
