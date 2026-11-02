<template>
  <el-header class="th-header theme-header" height="90px">
    <!-- <div class="th-header-logo">
      <el-image style="width: 100px; height: 80px" :src="getLogoUrl" fit="scale-down"></el-image>
    </div> -->
    <div class="th-header-title">
      <h1 v-text="title"></h1>
    </div>
    <div class="th-header-user flex items-center">
      <!-- 告警图标 -->
      <!-- <warn-info :data-number="warnNumber" :data-msg="warnNotify" @click="goJump({ name: 'AlarmLog' })" /> -->

      <el-tooltip v-if="!isScreen" content="大屏" placement="bottom" effect="dark">
        <img src="@/assets/header/screenIcon.png" alt="" @click="goScreen">
      </el-tooltip>

      <el-tooltip v-else content="管理平台" placement="bottom" effect="dark">
        <img src="@/assets/header/platformIcon.png" alt="" @click="goPlatform">
      </el-tooltip>

      <user-info @logout="logout" @editPassword="editPassword" />
    </div>
    <model-edit-password :data-flag="modelEditPassword.flag" @close="modelEditPasswordClose"
      @submit="modelEditPasswordSubmit"></model-edit-password>

    <!-- 右下角能源告警弹窗 -->
    <!-- <div v-draggable class="box1" :style="{ left: `${screen.x - 340}px`, top: `${screen.y - 210}px` }"
      v-if="dialogVisible">
      <el-dialog title="能源告警提示" :close-on-click-modal="false" :show-close="false" :modal-append-to-body='false'
        :close-on-press-escape="false" :visible.sync="dialogVisible" width="30%" :append-to-body="false"
        modal-class="custom-dialog">
        <div class="box">
          <div class="list" :style="{ top: listTop + 'px' }">
            <div v-for="(item, index) in defalutAlarmData" :key="index">
              {{ item?.content }}
            </div>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handleAlarm">去处理</el-button>
        </span>
      </el-dialog>
    </div> -->
  </el-header>
</template>

<script>

import WarnInfo from './WarnInfo.vue'
import SelTheme from './SelTheme.vue'
import UserInfo from './UserInfo.vue'
import ModelEditPassword from './model/editPassword.vue'

import { editPassword } from '@/api/user'
import { getSystemTitle, getDefaultAlarm } from '@/api/common'
import { getWebSocket } from '@/utils/websocket'
import draggable from '@/utils/vuedraggable.js'
import logoUrl from '@/assets/header/LOGO-4.png'

export default {
  name: "Header",
  components: { UserInfo, SelTheme, WarnInfo, ModelEditPassword },
  directives: {
    draggable,
  },
  data() {
    return {
      // 标题
      title: '长沙南综合节能管理控制系统',
      // 告警数量
      warnNumber: 0,
      warnWebSocket: null,
      warnNotify: null,
      modelEditPassword: { flag: false },
      imgsUrl: '',
      dialogVisible: false,
      defalutAlarmData: [],
      listTop: 0,
      screen: { x: 0, y: 0 }
    }
  },
  created() {
    const timer = setInterval(this.showMarquee, 2000)
    this.$once('hook:beforeDestroy', function () {
      clearTimeout(timer)
    })
  },
  mounted() {
    this.init()
    this.windowResize();
    addEventListener("resize", (event) => {
      this.windowResize()
    });
  },
  computed: {
    getLogoUrl() {
      return logoUrl
    },
    windowX() {
      return window.innerWidth;
    },
    windowY() {
      return window.innerHeight;
    },
    isScreen() {
      return this.$route.meta.type === 'screen'
    }
  },
  methods: {
    init() {
      // this.getSystemTitle()
      // this.initWebSocket()
      // this.fetchDefalutAlarm()
    },
    windowResize() {
      this.screen.x = window.innerWidth;
      this.screen.y = window.innerHeight;
    },
    fetchDefalutAlarm() {
      getDefaultAlarm().then(res => {
        if (res.code === 200) {
          this.warnNumber = res.data.count;
          this.defalutAlarmData = res.data.energyAlarm;
          if (res.data.energyAlarm.length > 0) this.dialogVisible = true
          if (this.defalutAlarmData.length >= 1) this.setScroll();
        }
      })
    },
    setScroll() {
      let t1 = null;
      var t = setInterval(() => {
        this.listTop -= 60;
        if (this.listTop === -60 * this.defalutAlarmData.length) {
          if (this.defalutAlarmData.length > 0) this.defalutAlarmData.push(this.defalutAlarmData.splice(0, 1)[0]);//删除数组第一个元素，插入到数组后面
          this.listTop = 0;//重置top
          clearInterval(t);//取消定时器
          //设置一个2秒后执行的定时器,重新开启滚动
          t1 = setTimeout(() => {
            this.setScroll();
          }, 500)
        }
      }, 6000)
      this.$once('hook:beforeDestroy', function () {
        clearTimeout(t)
        clearTimeout(t1)
      })
    },

    initWebSocket() {
      this.headerInfoWebSocket()
    },
    handleAlarm() {
      // this.dialogVisible = false;
      if (this.$route.name != 'AlarmLog') {
        this.$router.replace({ name: 'AlarmLog', params: { type: 'energy' } });
      }
    },
    headerInfoWebSocket() {
      const ws = getWebSocket('custom/alarm')
      ws.setMessage((res) => {
        const data = JSON.parse(res.data)
        let warnMsg = '';
        const headerAlarm = data.count;
        let headerMsg = '';
        if (data.isEnergy === 0) {
          headerMsg = data.showMsg;
          warnMsg = data.data;
        } else {
          // flag 0:新增；1:已处理
          if (data.flag === 0) {
            this.defalutAlarmData.push({ alarmRecordId: data.alarmRecordId, content: data.data })
          } else {
            // 从现有列表中移除已处理信息
            const getIndex = (v) => v.alarmRecordId == data.alarmRecordId
            const index = this.defalutAlarmData.findIndex(getIndex)
            this.defalutAlarmData.splice(index, 1);
          }
          if (this.defalutAlarmData.length > 0) this.dialogVisible = true;
          if (this.defalutAlarmData.length === 0) this.dialogVisible = false;
        }
        if (headerAlarm) {
          this.warnNumber = headerAlarm
        }
        if (warnMsg && data.isEnergy === 0) {
          this.$notify({
            title: '告警提示',
            message: warnMsg,
            duration: 3000,
            position: 'bottom-right',
            offset: this.dialogVisible ? 200 : 0,
            type: 'warning',
            onClick: () => this.$router.push({ name: "AlarmLog" })
          })
        }
        if (headerMsg) this.warnNotify = headerMsg;
      })
      ws.init()
      this.$once('hook:beforeDestroy', () => ws.getWS().close())
    },

    goPlatform() {
      this.$router.replace('/analysis')
    },

    goScreen() {
      this.$router.push('/screen')
    },

    // 跳转
    goJump(data) {
      this.$router.push(data)
    },

    // 注销
    logout() {
      this
        .$store
        .dispatch('user/logout')
        .then(() => {
          this.$router.push({ path: '/login' })
          // 清空store
          this.$store.dispatch('user/resetToken')
        })
    },

    // 修改密码 - 弹框展示
    editPassword() {
      this.modelEditPassword.flag = true
    },

    // 修改密码 - 弹框关闭
    modelEditPasswordClose() {
      this.modelEditPassword.flag = false
    },

    // 修改密码 - 弹框提交
    modelEditPasswordSubmit(passWord) {
      const data = { userName: this.$store.getters.user.userName, passWord }
      this.modelEditPasswordClose()
      editPassword(data)
        .then(res => {
          this.$message.success('密码修改成功')
        })
    },

    getSystemTitle() {
      getSystemTitle()
        .then(res => {
          this.title = res.data
        })
    },
  },
};
</script>
<style lang="scss">
.custom-dialog.v-modal {
  display: none;
}
</style>
<style lang="scss" scoped>
// ::v-deep.el-dialog__wrapper {
//   width: 100%;
//   position: absolute !important;
//   overflow: hidden !important;

//   .el-dialog {
//     width: 100% !important;
//     height: 100% !important;
//     margin: 0 !important;
//     background-color: #fff;

//     .el-dialog__title {
//       color: #000;
//     }

//     .el-dialog__body {
//       padding: 0px 20px;
//       height: 100px;
//       text-indent: 20px;
//     }
//   }
// }

.box1 {
  width: 330px;
  height: 200px;
  position: fixed;
  z-index: 999;
}

.th-header {

  margin: 0;
  padding: 0;
  display: flex;
  align-items: start;
  justify-content: space-between;
  padding-top: 10px;

  >div {
    float: left;
  }

  >.th-header-logo {

    // width: 284px;
    height: 100%;
    display: flex;
    align-items: center;
    // justify-content: center;
    overflow: hidden;
    margin: 0px 12px;
  }

  >.th-header-title>h1 {
    // color: #fff;
    margin: 0;
    font-size: 36px;
    font-family: SourceHanSansCN;
    font-weight: bold;
    color: #507cff;
    letter-spacing: 3px;
    margin-left: 40px;
  }

  >.th-header-user {

    float: right;
    padding-right: 28px;
    font-size: 16px;

    >* {
      margin-left: 25px;
      cursor: pointer;
    }
  }
}

.box {
  height: 60px;
  line-height: 20px;
  overflow: hidden;
  position: relative;
}

.list {
  position: absolute;
  left: 0;
  transition: all .3s;
}
</style>
