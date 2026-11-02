<template>
  <wl-main-container data-title="告警详情">
    <template v-slot:header>
      <wl-main-title data-title="告警管理 - 查看">
        <el-button round class="r mt15" type="primary" icon="el-icon-d-arrow-left"
          @click="$router.push({ name: 'AlarmLog' })">返回</el-button>
      </wl-main-title>
    </template>
    <div class="th-warn-detail-wrapper">
      <p class="th-warn-detail-title">位置信息</p>
      <div class="th-position-info">
        <wl-card class="_left">
          <div class="_warn-img">
            <img src="@/assets/warn/warn-img-01.png" alt="warn logo" />
          </div>
          <div class="_position">
            <div class="_info-box _flex-01">
              <p>类别：</p>
              <p>{{ warnDatailData.masterplateName }}</p>
            </div>
            <div class="_info-box _flex-01">
              <p>级别：</p>
              <p>{{ warnDatailData.gradeNumName }}</p>
            </div>
            <div class="_info-box _flex-01">
              <p>设备名称：</p>
              <p>{{ warnDatailData.orgName }}</p>
            </div>
          </div>
        </wl-card>
        <wl-card class="_right">
          <div class="border-right">
            <div class="_info-box">
              <p>运营单位：</p>
              <p>{{ `${warnDatailData['operationName']}` }}</p>
            </div>
            <div class="_info-box">
              <p>监控站点：</p>
              <p>{{ warnDatailData['stationName'] }}</p>
            </div>
            <div class="_info-box">
              <p>区域：</p>
              <p>{{ warnDatailData['areaName'] }}</p>
            </div>
          </div>
          <div>
            <div class="_info-box">
              <p>子系统：</p>
              <p>{{ warnDatailData['systemName'] }}</p>
            </div>
          </div>
        </wl-card>
      </div>
      <p class="th-warn-detail-title">告警信息</p>
      <wl-card class="th-warn-info">
        <div class="_left border-right">
          <div class="_info-box _flex-01">
            <p>告警时间：</p>
            <p>{{ warnDatailData.alarmDate }}</p>
          </div>
          <div class="_info-box _flex-01">
            <p>告警状态：</p>
            <p :class="alarmStatusClass(warnDatailData.status)">{{ warnDatailData.alarmStatusName }}</p>
          </div>
          <div class="_info-box _flex-01">
            <p>处理时间：</p>
            <p>{{ warnDatailData.handleDate }}</p>
          </div>
          <div class="_info-box _flex-01">
            <p>解除时间：</p>
            <p>{{ warnDatailData.resolveDate }}</p>
          </div>
          <div class="_info-box _flex-01">
            <p>告警内容：</p>
            <p>{{ warnDatailData.content }}</p>
          </div>
        </div>
        <div class="_right">
          <el-collapse v-model="activeName" accordion
            v-if="'detailList' in warnDatailData && warnDatailData.detailList.length > 0">
            <el-collapse-item :name="index" v-for="(item, index) in warnDatailData.detailList" :key="item.id">
              <template slot="title">
                <div class="_collapse-title">
                  <p>
                    处理时间：<time>{{ item.handleDate }}</time>
                  </p>
                  <p>处理人：{{ item.realName }}</p>
                </div>
              </template>
              <div>
                <p>处理意见：</p>
                <p>{{ item.handleSuggestion }}</p>
              </div>
            </el-collapse-item>
          </el-collapse>
          <p class="text-not-data" style="margin-top: 15%" v-else>
            暂无数据...
          </p>
        </div>
      </wl-card>
    </div>
  </wl-main-container>
</template>

<script>
import { getWarnDetail } from '@/api/warn';

export default {
  name: 'WarnDetail',
  data() {
    return {
      warnDatailData: {},
      // 手风琴
      activeName: 0
    };
  },
  computed: {
    warnId() {
      return this.$route.params.id;
    },

    alarmStatusClass() {
      return data => { return data };
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    // 初始化
    async init() {
      const res = await getWarnDetail(this.warnId);
      this.handlewarnDatailData(res.data);
    },

    // 处理 告警详情数据
    handlewarnDatailData(data) {
      this.warnDatailData = data;
    }
  },
  beforeRouteUpdate(to, from, next) {
    next();
  }
};
</script>

<style lang="scss" scoped>
.NEW {
  color: red;
}

.OLD {
  color: rgb(11, 226, 29);
}

.SURE {
  color: orange;
}

.ERROR {}

.border-right {
  border-right: 1px dashed #ccc;
}

.th-warn-detail-title {
  position: relative;
  padding-bottom: 10px;
  margin: 20px 0;

  &::after,
  &::before {
    position: absolute;
    content: '';
  }

  &::before {
    left: 0;
    bottom: 0;
    width: 20px;
    height: 2px;
    background-color: $light-blue;
  }

  &::after {
    top: 8px;
    right: 0;
    width: calc(100% - 70px);
    height: 1px;
    background-color: #666;
  }
}

._info-box {
  width: 100%;
  display: flex;
  padding: 0 20px;

  &._flex-01 {
    >*:first-child {
      flex: 0 0 70px;
      color: $light-blue;
      font-weight: 800;
    }
  }

  >* {
    flex: 1;
    padding-right: 10;
  }

  >*:first-child {
    flex: 0 0 40%;
    color: $light-blue;
    font-weight: 800;
  }
}

.th-warn-detail-wrapper {
  display: flex;
  height: 100%;
  flex-direction: column;

  >.th-position-info,
  >.th-warn-info {
    height: 100%;
    display: flex;
  }

  >.th-position-info {
    flex: 0 0 30%;
    margin-bottom: 10px;

    >._left {
      flex: 0 0 35%;
      display: flex;
      margin-right: 10px;

      >._warn-img {
        flex: 0 0 40%;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        font-size: 10vw;
        color: red;
      }

      >._position {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
      }
    }

    >._right {
      display: flex;
      margin-left: 10px;

      >div {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        padding-right: 20px;
      }
    }
  }

  >.th-warn-info {
    display: flex;
    margin-top: 10px;

    >._left {
      flex: 0 0 35%;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
    }

    >._right {
      flex: 1;
      padding: 6px 12px;
    }
  }

  ::v-deep .th-card {
    border: none;
    border-radius: 10px;
    box-shadow: 0 0 15px rgba($light-blue, 0.2);
  }
}

._collapse-title {
  width: 100%;
  display: flex;
  justify-content: space-between;

  >p {
    margin: 0 10px;
  }
}

::v-deep .el-collapse {
  border-color: #666 !important;
}

::v-deep .is-active .el-collapse-item__header {
  color: #fff;
  background-color: transparent !important;
}

::v-deep .el-collapse-item__wrap {
  background-color: transparent !important;
  border-color: #666 !important;
}

::v-deep .el-collapse-item__header {
  transition: 1s all;
  background-color: transparent !important;
  color: #fff !important;
  border-color: #666 !important;
}

::v-deep .el-collapse-item__content {
  padding: 6px 12px;
  color: #fff !important;
}
</style>
