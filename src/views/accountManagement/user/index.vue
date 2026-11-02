<!-- 用户管理 -->
<template>
  <section class="container_warp">
    <section class="container_box">
      <el-container class="th-container-view">
        <el-main>
          <el-form :inline="true" :model="formData" class="demo-form-inline" size="mini">
            <el-form-item label="用户名">
              <el-input v-model="formData.userName" placeholder="请输入用户名称"></el-input>
            </el-form-item>
            <el-form-item label="所属角色">
              <el-input v-model="formData.roleName" placeholder="请输入所属角色"></el-input>
            </el-form-item>
            <el-form-item style="margin-left: 30px">
              <el-button class="top_btn" type="primary" round icon="el-icon-search" @click="queryUser">查询</el-button>
              <el-button class="top_btn" type="primary" round icon="el-icon-refresh-left"
                @click="resetUser">重置</el-button>
            </el-form-item>
            <el-form-item label="" style="float: right; margin-right: 0">
              <el-button type="primary" icon="el-icon-plus" @click="addUser">新增</el-button>
            </el-form-item>
          </el-form>
          <!-- <div style="margin-bottom: 20px"> -->
          <!-- <el-button type="primary" icon="el-icon-plus" @click="addUser">新增</el-button> -->
          <!--v-if="checkAuth('new-users')"--->
          <!-- <el-button type="primary" @click="delUsers" v-if="checkAuth('batch-delete-users')"
                        >批量删除</el-button
                    > -->
          <!-- </div> -->
          <div class="table_div">
            <el-table :data="tableData" height="100%" size="mini" row-key="userName"
              header-cell-class-name="th-table-header-cell" @selection-change="handleSelectionChange">
              <!-- <el-table-column label="" type="selection" width="50" align="center" :selectable='checkUser'></el-table-column> -->
              <el-table-column label="序号" type="index" width="120" align="center"></el-table-column>
              <el-table-column label="姓名" prop="realName" align="center"></el-table-column>
              <el-table-column label="用户名" prop="userName" align="center"></el-table-column>
              <el-table-column label="所属角色" prop="roleNames" align="center"></el-table-column>
              <el-table-column label="性别" prop="realName" align="center">
                <template slot-scope="scope">
                  <div>
                    <span v-if="scope.row.gender == 1">男</span>
                    <span v-if="scope.row.gender == 2">女</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="联系方式" prop="phone" align="center"></el-table-column>
              <!-- <el-table-column label="所属机构" prop="organization" align="center"></el-table-column> -->
              <el-table-column label="操作" align="center" width="200">
                <template slot-scope="scope">
                  <!-- <section style="text-align: left"> -->
                  <!-- <el-button class="operation_btn" type="primary" size="mini" icon="el-icon-my-edit" @click="edit(scope.row.userName)"
                      >编辑</el-button
                    > -->
                  <!--v-if="checkAuth('edit-user')"-->
                  <!--checkAuth('delete-user')-->
                  <!-- <el-button class="operation_btn" type="primary" size="mini" icon="el-icon-my-resetPassWord-user" @click="resetPassWord(scope.row)"
                      >重置密码</el-button
                    > -->
                  <!-- <el-button
                      class="operation_btn"
                      type="primary"
                      size="mini"
                      icon="el-icon-my-delete"
                      @click="del(scope.row)"
                      v-if="$store.getters.user.userName != scope.row.userName"
                      >删除</el-button
                    > -->

                  <el-link class="blue-link" @click="edit(scope.row.userName)"> 编辑 </el-link>
                  <el-divider direction="vertical" />
                  <el-link class="blue-link" @click="resetPassWord(scope.row)"> 重置密码 </el-link>
                  <el-divider v-if="$store.getters.user.userName != scope.row.userName" direction="vertical" />
                  <el-link v-if="$store.getters.user.userName != scope.row.userName" class="red-link"
                    @click="del(scope.row)"> 删除 </el-link>
                  <!-- </section> -->
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

      <!-- 用户弹窗 -->
      <el-dialog title="用户信息" :visible.sync="dialogVisible" width="360px">
        <el-form :model="user" :rules="rules" label-width="80px" ref="userForm" size="mini">
          <el-form-item label="用户名" prop="userName">
            <el-input v-model="user.userName" :disabled="dialogDisabled" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="passWord" v-if="!dialogDisabled">
            <el-input v-model="user.passWord" :disabled="dialogDisabled" placeholder="请输入密码" show-password></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="realName">
            <el-input v-model="user.realName" placeholder="请输入真实名称"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="gender">
            <el-radio v-model="user.gender" :label="1">男</el-radio>
            <el-radio v-model="user.gender" :label="2">女</el-radio>
          </el-form-item>
          <el-form-item label="手机" prop="phone">
            <el-input v-model="user.phone" placeholder="请输入手机"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="user.email" placeholder="请输入邮箱"></el-input>
          </el-form-item>
          <el-form-item label="所属机构" prop="organization">
            <el-input v-model="user.organization" placeholder="请输入所属机构"></el-input>
          </el-form-item>
          <el-form-item label="所属角色" prop="roleCodeList">
            <el-checkbox-group v-model="user.roleCodeList">
              <el-checkbox v-for="item in roleTreeData" :key="item.roleCode" :label="item.roleCode">{{ item.roleName
              }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer text-center">
          <el-button type="primary" @click="close" size="mini">取 消</el-button>
          <el-button type="primary" @click="save" size="mini">确 定</el-button>
        </div>
      </el-dialog>
    </section>
  </section>
</template>

<script>
import { getRoleData } from "@/api/role";
import { resetUserPassWord } from "@/api/user";
import { getAllUser, addUser, delUser, delBatchUser, updateUser, getUserByName, getCurrentUserMenuBtn } from "@/api/user";

export default {
  name: "User",
  computed: {
    checkAuth: function () {
      return function (buttonKey) {
        let flag = false;
        this.buttons.forEach((element) => {
          if (element.buttonKey == buttonKey) {
            flag = true;
          }
        });
        return flag;
      };
    },
  },
  data: function () {
    return {
      roleTreeData: [],
      formData: {
        userName: null,
        realName: null,
        empNo: null,
      },
      tableData: [],
      tableCheckedData: [],
      paging: {
        page: 1,
        size: 10,
        total: 0,
      },
      dialogVisible: false,
      dialogDisabled: false,
      userEditFlag: 1,
      selectRoleData: [],
      user: { roleCodeList: [] },
      rules: {
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 4, max: 18, message: "长度在 4 到 18 个字符", trigger: "blur" },
        ],
        realName: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          { min: 2, max: 32, message: "长度在 2 到 32 个字符", trigger: "blur" },
        ],
        passWord: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 4, max: 18, message: "长度在 4 到 18 个字符", trigger: "blur" },
        ],
        organization: [{ required: true, message: "请输入所属机构", trigger: "blur" }],
        phone: [
          { required: true, message: "请输入手机", trigger: "blur" },
          { validator: this.$validate.phone, trigger: "blur" },
        ],
        email: [
          { required: false, message: "请输入手机", trigger: "blur" },
          { validator: this.$validate.email, trigger: "blur" },
        ],
        roleCodeList: [{ required: true, message: "请选择角色", trigger: "change" }],
      },
      buttons: [],
    };
  },
  created: function () {
    this.init();
  },
  methods: {
    init() {
      this.getUserData();
      this.getCurrentUserMenuBtn();
      this.getRoleTree();
    },
    queryUser() {
      this.getUserData(this.formData);
    },
    resetUser() {
      this.formData = {};
      this.init();
    },
    addUser() {
      this.dialogVisible = true;
      this.dialogDisabled = false;
      this.userEditFlag = 1;
      this.user = {
        roleCodeList: this.$store.getters.user.roleCodeList.filter((value) => {
          return value != "00001";
        }),
      };
      this.$nextTick((res) => {
        this.$refs["userForm"].clearValidate();
      });
    },
    edit(userName) {
      this.dialogVisible = true;
      this.dialogDisabled = true;
      this.userEditFlag = 2;
      getUserByName(userName).then((res) => {
        this.user = res.data;
      });
    },
    checkUser(row) {
      return this.$store.getters.user.userName != row.userName;
    },
    del(row) {
      this.$confirm("确认删除该条内容？", "提示", {
        type: "warning", confirmButtonClass: 'confirm-btn ',
        cancelButtonClass: 'cancel-btn ',
      })
        .then(() => {
          delUser(row.userName).then((res) => {
            this.$message.success("删除成功");
            this.queryUser();
          });
        })
        .catch(() => { });
    },
    //重置密码
    resetPassWord(data) {
      this.$confirm("此操作，将重置" + data.realName + "的密码", "提醒", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          resetUserPassWord(data).then((res) => {
            if (res.code == 200) {
              this.$message({
                type: "success",
                message: data.realName + "的密码已重置成功",
              });
            } else {
              this.$message.error(res.msg);
            }
          });
        })
        .catch(() => { });
    },
    handleSelectionChange(val) {
      this.tableCheckedData = val;
    },
    delUsers() {
      let userNames = [];
      userNames = Array.from(this.tableCheckedData).map((v, k) => v.userName);
      if (userNames.length < 1) return this.$message.error("您没有选择任何数据");
      this.$confirm("确认删除选中的内容？", "提示", {
        type: "warning", confirmButtonClass: 'confirm-btn ',
        cancelButtonClass: 'cancel-btn ',
      }).then(() => {
        delBatchUser(userNames).then((res) => {
          if (res) {
            this.$message.success("删除成功");
            this.queryUser();
          }
        });
      });
    },
    save() {
      this.$refs["userForm"].validate((flag) => {
        if (flag) {
          if (1 === this.userEditFlag) {
            addUser(this.user).then((res) => {
              this.close();
              this.$message.success("新增成功");
              this.getUserData(this.formData);
            });
          } else {
            updateUser(this.user).then((res) => {
              this.close();
              this.$message.success("编辑成功");
              this.getUserData(this.formData);
            });
          }
        }
      });
    },
    close() {
      this.dialogVisible = false;
      this.$refs["userForm"].resetFields();
    },
    sizeChange(val) {
      this.paging.size = val;
      this.getUserData(this.formData);
    },
    pageChange(val) {
      this.paging.page = val;
      this.getUserData(this.formData);
    },
    getUserData(data) {
      getAllUser(data, this.paging).then((res) => {
        if (res) {
          this.tableData = res.data.list;
          this.paging.total = res.data.total;
        }
      });
    },
    getCurrentUserMenuBtn() {
      let url = this.$route.fullPath;
      getCurrentUserMenuBtn({ urlAddress: url }).then((res) => {
        this.buttons = res.data;
      });
    },
    getRoleTree() {
      getRoleData({}).then((res) => {
        if (res) this.roleTreeData = res.data.list;
      });
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

  .operation_btn {
    background: transparent !important;
    border: none !important;
    color: #b5bde6;
  }

  .operation_btn:hover {
    color: #fff;
  }

  .el-table--enable-row-hover .el-table__body tr button:hover {
    color: #fff;

    //编辑
    .el-icon-my-edit {
      background: url("@/assets/icon/btn_icon/edit_icon_hover.png") center no-repeat !important;
    }

    //重置密码
    .el-icon-my-resetPassWord-user {
      background: url("@/assets/icon/btn_icon/resetPassword_icon_hover.png") center no-repeat !important;
    }

    //删除
    .el-icon-my-delete {
      background: url("@/assets/icon/btn_icon/delete_icon_hover.png") center no-repeat !important;
    }
  }

  .el-input.is-disabled .el-input__inner {
    background: #f5f7fa;
    color: #606266;
  }

  .el-checkbox,
  .el-radio {
    color: #909399;
  }
}

//
::v-deep(.th-main-title) {
  h2 {
    line-height: normal !important;
    margin-left: 20px !important;
  }
}

::v-deep {
  .th-container-view {
    width: 100%;
    height: 100%;
    // padding: 0px 20px 0 20px;
  }
}

.th-main-title {
  height: 50px !important;
}

// .el-main {
// height: calc(100% - 50px)!important;
// }
.curDivider {
  left: 13px;
  top: 3px;
}

//
.th-main-view {
  padding: 0;
}

.th-table {
  height: calc(100vh - 280px) !important;
}

::v-deep .e_table {
  box-shadow: none !important;
  border: none !important;
}

::v-deep ::-webkit-scrollbar {
  display: block;
}

::v-deep .el-form-item {
  >.el-form-item__label {
    color: #000;
  }
}
</style>