<!-- 角色管理 -->
<template>
  <section class="container_warp">
    <section class="container_box">
      <el-container class="th-container-view">
        <el-main>
          <el-form :inline="true" :model="formData" class="form-inline" size="mini">
            <el-form-item label="角色名称">
              <el-input v-model="formData.roleName" placeholder="请输入角色名称"></el-input>
            </el-form-item>
            <el-form-item label="角色描述">
              <el-input v-model="formData.description" placeholder="请输入角色描述"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button class="top_btn" type="primary" round icon="el-icon-search" @click="query">查询</el-button>
              <el-button class="top_btn" type="primary" round icon="el-icon-refresh" @click="reset">重置</el-button>
            </el-form-item>
            <div class="add_btn">
              <el-button type="primary" size="mini" icon="el-icon-plus" @click="add">新增</el-button>
            </div>
          </el-form>
          <div class="table_div">
            <el-table :data="tableData" header-cell-class-name="th-table-header-cell" class="th-table" height="100%"
              size="small">
              <el-table-column label="序号" type="index" align="center" width="200"></el-table-column>
              <el-table-column label="角色编码" align="center" prop="roleCode" width="200"></el-table-column>
              <el-table-column label="角色名称" align="center" prop="roleName" width="200"></el-table-column>
              <el-table-column label="角色描述" align="center" prop="description"></el-table-column>
              <el-table-column label="操作" align="center" width="400">
                <template slot-scope="scope">
                  <el-link class="blue-link" @click="edit(scope.row.roleCode)">编辑</el-link>
                  <el-divider direction="vertical" />
                  <el-link class="blue-link" @click="setMenu(scope.row.roleCode)">菜单权限</el-link>
                  <el-divider direction="vertical" />
                  <el-link class="blue-link" @click="setData(scope.row.roleCode)">数据权限</el-link>
                  <el-divider direction="vertical" />
                  <el-link class="blue-link" @click="openUsers(scope.row.roleCode)">查看用户</el-link>
                  <el-divider direction="vertical" />
                  <el-link class="red-link" @click="del(scope.row.roleCode)">删除</el-link>
                </template>
              </el-table-column>
            </el-table>
            <div class="th-pagination">
              <el-pagination @size-change="sizeChange" @current-change="pageChange" :current-page="paging.pageNum"
                :page-size="paging.pageSize" :total="paging.total" background
                layout="total, prev, pager, next, jumper" />
            </div>
          </div>
        </el-main>
      </el-container>
      <!-- 查看用户弹窗 -->
      <el-dialog :title="roleDialogTitle" :visible.sync="dialogVisible" width="30%">
        <el-form :model="role" :rules="rules" ref="roleForm" label-width="100px" class="demo-ruleForm" size="mini">
          <el-form-item label="角色编码">
            <el-input disabled v-model="role.roleCode"></el-input>
          </el-form-item>
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="role.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="description">
            <el-input type="textarea" :rows="2" v-model="role.description"></el-input>
          </el-form-item>
        </el-form>
        <p slot="footer" class="dialog-footer">
          <el-button type="primary" class="confirm-btn" @click="save" size="mini">确定</el-button>
          <el-button type="primary" class="cancel-btn" @click="dialogClose" size="mini">取消</el-button>
        </p>
      </el-dialog>
      <!-- 角色菜单弹窗 -->
      <el-dialog title="菜单配置" :visible.sync="menuDialogVisible" width="30%">
        <el-tree style="height: 500px; overflow: auto" :data="menuTree"
          :props="{ value: 'menuId', label: 'menuName', children: 'children' }" node-key="menuId" ref="menuTree"
          default-expand-all show-checkbox check-strictly @check-change="handleMenuCheckChange">
        </el-tree>
        <p slot="footer" class="dialog-footer">
          <el-button type="primary" class="confirm-btn" @click="saveRoleMenu" size="mini">确定</el-button>
          <el-button type="primary" class="cancel-btn" @click="menuDialogVisible = false" size="mini">取消</el-button>
        </p>
      </el-dialog>
      <!-- 用户数据权限弹窗 -->
      <el-dialog title="数据权限配置" :visible.sync="orgDialogVisible" width="30%">
        <el-tree style="max-height: 500px; overflow: auto" :data="orgTree"
          :props="{ value: 'orgId', label: 'orgName', children: 'children' }" node-key="orgId" ref="orgTree"
          default-expand-all show-checkbox check-strictly @check-change="handleOrgCheckChange">
        </el-tree>
        <p slot="footer" class="dialog-footer">
          <el-button type="primary" class="confirm-btn" @click="saveUserOrg" size="mini">确定</el-button>
          <el-button type="primary" class="cancel-btn" @click="orgDialogVisible = false" size="mini">取消</el-button>
        </p>
      </el-dialog>
      <!-- 查看用户弹框 -->
      <el-dialog title="查看用户" :visible.sync="userDialogVisible" width="50%">
        <el-table :data="userTableData" style="width: 100%" size="mini" highlight-current-row border>
          <el-table-column label="序号" type="index" width="55" align="center"></el-table-column>
          <el-table-column label="用户名" prop="userName" align="center"></el-table-column>
          <el-table-column label="姓名" prop="realName" align="center"></el-table-column>
          <el-table-column label="姓别" prop="realName" align="center">
            <template slot-scope="scope">
              <div>
                <span v-if="scope.row.gender == 1">男</span>
                <span v-if="scope.row.gender == 2">女</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="所属机构" prop="organization" align="center"></el-table-column>
          <el-table-column label="联系方式" prop="phone" align="center"></el-table-column>
          <el-table-column label="邮箱" prop="email" align="center"></el-table-column>
        </el-table>
      </el-dialog>
    </section>
  </section>
</template>

<script>
import { isFatherAndSon } from "@/utils/index";
import { getUserByRoleCode, getCurrentUserMenuBtn } from "@/api/user";
import { queryOrgAll, getOrgByRoleCode } from "@/api/org";
import { getRoleData, getRoleByCode, addRole, updateRole, delRole, configureRoleMenu, getMenuByRole, queryMenu, configureRoleOrg } from "@/api/role";

export default {
  name: "Role",
  computed: {},
  data: function () {
    return {
      loginUser: this.$store.state.user.user,
      formData: {
        parentRoleCode: null,
        description: null,
      },
      treeData: [],
      roleData: [],
      role: {
        parentRoleCode: null,
        description: null,
      },
      tableData: [],
      paging: {
        page: 1,
        size: 10,
        total: 0,
      },
      rules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          { max: 20, message: "长度不能超过20个字符", trigger: "blur" },
        ],
        description: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
          { max: 200, message: "长度不能超过200个字符", trigger: "blur" },
        ],
      },
      dialogVisible: false,
      dialogDisabled: false,
      menuDialogVisible: false,
      orgDialogVisible: false,
      orgTree: [],
      menuTree: [],
      btnTree: [],
      selectedMenuIds: [],
      selectedOrgIds: [],
      tableNowRoleCode: null,
      userDialogVisible: false,
      userTableData: [],
      roleDialogTitle: "",
      buttons: [], //本页面拥有权限的按钮
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.getRoleTree();
      this.getCurrentUserMenuBtn();
    },
    getCurrentUserMenuBtn() {
      let url = this.$route.fullPath;
      getCurrentUserMenuBtn({ urlAddress: url }).then((res) => {
        this.buttons = res.data;
      });
    },
    handleNodeClick(node) {
      this.formData.parentRoleCode = node.roleCode;
      this.getRoleData(this.formData);
    },
    query() {
      this.getRoleData(this.formData);
    },
    reset() {
      this.paging.total = 0;
      this.paging.page = 1;
      this.formData = {};
      this.init();
    },
    add() {
      this.dialogVisible = true;
      this.dialogDisabled = false;
      this.role = {
        parentRoleCode: null,
        description: null,
      };
      this.roleDialogTitle = "添加角色";
    },
    save() {
      this.$refs["roleForm"].validate((flag) => {
        if (flag) {
          if (this.role.roleCode) {
            updateRole(this.role).then((res) => {
              this.dialogVisible = false;
              this.$message.success("编辑成功");
              this.$refs["roleForm"].resetFields();
              this.init();
            });
          } else {
            addRole(this.role).then((res) => {
              this.dialogVisible = false;
              this.$message.success("新增成功");
              this.$refs["roleForm"].resetFields();
              this.init();
            });
          }
        }
      });
    },
    dialogClose() {
      this.dialogVisible = false;
      this.$refs["roleForm"].resetFields();
    },
    edit(roleCode) {
      getRoleByCode(roleCode).then((res) => {
        this.role = res.data;
        this.dialogVisible = true;
        this.dialogDisabled = true;
        this.roleDialogTitle = "编辑角色";
      });
    },
    setMenu(roleCode) {
      this.menuDialogVisible = true;
      this.openRoleMenu(roleCode);
      this.tableNowRoleCode = roleCode;
    },
    del(roleCode) {
      this.$confirm("确认删除该条内容？", "提示", { type: "warning" })
        .then(() => {
          delRole(roleCode).then((res) => {
            this.$message.success("删除成功");
            this.init();
          });
        })
        .catch(() => { });
    },
    handleMenuCheckChange() {
      this.selectedMenuIds = this.$refs["menuTree"].getCheckedKeys();
    },
    selectAllMenu() {
      this.$refs["menuTree"].setCheckedNodes(this.menuTree);
    },
    clearAllMenu() {
      this.$refs["menuTree"].setCheckedKeys([]);
    },
    saveRoleMenu() {
      let roleMenuList = [];
      this.selectedMenuIds.forEach((menuId) => {
        roleMenuList.push(menuId);
      });
      if (roleMenuList.length < 1) return this.$message.error("您没有选择任何数据");
      configureRoleMenu(roleMenuList, this.tableNowRoleCode).then((res) => {
        if (res) {
          this.menuDialogVisible = false;
          this.$message.success("配置成功");
          this.getRoleData(this.formData);
          this.selectedMenuIds = [];
        }
      });
    },
    openRoleMenu(roleCode) {
      this.selectedMenuIds = [];
      let selectedMenuIds = [];
      queryMenu({}).then((res) => {
        this.menuTree = isFatherAndSon(res.data, "menuId", "parentMenuId");
        getMenuByRole(roleCode).then((res) => {
          res.data.forEach((v) => {
            selectedMenuIds.push(v.menuId);
          });
          this.selectedMenuIds = selectedMenuIds;
          this.$nextTick((res) => {
            this.$refs["menuTree"].setCheckedKeys(this.selectedMenuIds);
          });
        });
      });
    },
    setData(roleCode) {
      this.orgDialogVisible = true;
      this.tableNowRoleCode = roleCode;
      this.openUserOrg(roleCode);
    },
    saveUserOrg() {
      let orgDataList = [];
      this.selectedOrgIds.forEach((orgId) => {
        orgDataList.push(orgId);
      });
      if (orgDataList.length < 1) return this.$message.error("您没有选择任何数据");
      configureRoleOrg(orgDataList, this.tableNowRoleCode).then((res) => {
        if (res) {
          this.orgDialogVisible = false;
          this.$message.success("配置成功");
          this.getRoleData(this.formData);
          this.selectedOrgIds = [];
          //根据权限的配置，需要实时的传递最新的配置进行顶部线路或者区域的更新
          this.$store.dispatch("point/updateUserPermission", true);
        }
      });
    },
    openUserOrg(roleCode) {
      this.selectedOrgIds = [];
      let selectedOrgIds = [];
      queryOrgAll({}).then((res) => {
        this.orgTree = res.data;
        getOrgByRoleCode(roleCode).then((res) => {
          Array.isArray(res.data) &&
            res.data.forEach((v) => {
              selectedOrgIds.push(v.orgId);
            });
          this.selectedOrgIds = selectedOrgIds;
          this.$refs["orgTree"].setCheckedKeys(this.selectedOrgIds);
        });
      });
    },
    handleOrgCheckChange() {
      this.selectedOrgIds = this.$refs["orgTree"].getCheckedKeys();
    },
    openUsers(roleCode) {
      getUserByRoleCode(roleCode).then((res) => {
        if (res) {
          if (res) {
            this.userTableData = res.data;
            this.userDialogVisible = true;
          }
        }
      });
    },
    auth(role) {
      let msg, flag;
      if (role.planAuth === 0) {
        msg = "是否允许一键预案";
        flag = true;
      } else {
        msg = "是否禁止一键预案";
        flag = false;
      }
      this.$confirm(msg, "提示", {
        type: "warning", confirmButtonClass: 'confirm-btn ',
        cancelButtonClass: 'cancel-btn ',
      })
        .then(() => {
          role.planAuth = flag ? 1 : 0;
          updateRole(role).then((res) => {
            this.init();
          });
        })
        .catch(() => { });
    },
    inspetAuth(role) {
      let msg, flag;
      if (role.inspetAuth === 0) {
        msg = "是否允许设备巡检";
        flag = true;
      } else {
        msg = "是否禁止设备巡检";
        flag = false;
      }
      this.$confirm(msg, "提示", {
        type: "warning", confirmButtonClass: 'confirm-btn ',
        cancelButtonClass: 'cancel-btn ',
      })
        .then(() => {
          role.inspetAuth = flag ? 1 : 0;
          updateRole(role).then((res) => {
            this.init();
          });
        })
        .catch(() => { });
    },
    sizeChange(val) {
      this.paging.size = val;
      this.getRoleData(this.formData);
    },
    pageChange(val) {
      this.paging.page = val;
      this.getRoleData(this.formData);
    },
    getRoleData(data) {
      getRoleData(data, this.paging).then((res) => {
        const { data } = res;
        this.tableData = data.list;
        this.paging.total = data.total;
      });
    },
    getRoleTree() {
      this.getRoleData(this.formData);
    },
    iteratorChildren(arr, top) {
      let children = [];
      arr.forEach((v) => {
        if (top.roleCode === v.parentRoleCode) {
          children.push(v);
          this.iteratorChildren(arr, v);
        }
      });
      top.children = children;
    },
  },
};
</script>
<style lang="scss" scoped>
.container_warp {
  width: 100%;
  height: 100%;
}

.container_box {
  height: 100%;
}

.table_div {
  width: 100%;
  height: calc(100vh - 157px);
  min-height: 400px;
  background-color: #fff !important;
  border-radius: 10px;
  box-shadow: 0 0 6px rgba(90, 151, 250, 0.3);
  padding: 20px;
  display: flex;
  flex-direction: column;
}


::v-deep {
  .top_btn {

    .el-button--primary:hover,
    .el-button--primary:focus {
      background-color: #2a3e62 !important;
      border-color: #2a3e62;
    }
  }

  //新增按钮
  .add_btn {
    position: absolute;
    right: 0px;
    top: 0;
    display: inline-block;
  }

  .operation_btn {
    background: transparent !important;
    border: none !important;
    color: #b5bde6;
  }

  .operation_btn:hover {
    color: #fff;
  }

  .el-tree {
    background: transparent;
    color: #fff;
    @include scrollBar;
  }
}

.form-inline {
  position: relative;
}

::v-deep {
  .th-container-view {
    width: 100%;
    height: 100%;
  }
}

::v-deep {
  .th-main-title h2 {
    margin-left: 10px !important;
  }
}

.dialog-footer {
  text-align: center;
}

::v-deep .el-form-item {
  >.el-form-item__label {
    color: #000;
  }
}
</style>
