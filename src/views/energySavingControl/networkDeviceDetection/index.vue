<!-- 网络设备监测 -->
<template>
  <section class="container_warp">
    <section class="container_box">
      <!-- <el-divider class="curDivider" direction="vertical" />
      <wl-main-container data-title="网络设备监测"> -->
      <el-container class="h-full">
          <el-main>
      <section class="content_warp">
        <!-- <section class="legend_box">
                        <p><span class="box_shape"></span><span>在线</span><span class="box_shape"></span><span>离线</span></p>
                    </section> -->
        <ul class="firstClass">
          <li class="flex items-center justify-center" v-for="item in firstClasslist" :key="item.id" :data-text="item.name">
            <span>{{ item.name }}</span>
          </li>
        </ul>
        <section class="secondClass">
          <div v-for="item in deviceList" :key="item.id" class="device_item"
            :class="item.reachable ? 'onLine' : 'offLine'">
            <!-- <span class="device_label" v-if="item.deviceName.length === 6">
                                {{ item.deviceName.substr(0, 3) }}
                                <br />
                                {{ item.deviceName.substr(3) }}
                            </span> -->
            <span class="device_label">{{ item.deviceName }}</span>
            <span class="device_tips" v-if="item.deviceName === '智能分析服务器'">智能车站<br />生产管控平台<br />(引导屏接口)</span>
          </div>
        </section>
      </section>
      </el-main>
        </el-container>
      <!-- </wl-main-container> -->
    </section>
  </section>
</template>

<script>
import { getAllDevice } from "@/api/network-device.js";
import { getWebSocket } from "@/utils/websocket";
export default {
  data() {
    return {
      deviceList: [],
      firstClasslist: [
        {
          id: 1,
          name: "中心机房",
        },
        {
          id: 2,
          name: "高架层夹层",
        },
        {
          id: 3,
          name: "高架候车层",
        },
        {
          id: 4,
          name: "设备夹层",
        },
        {
          id: 5,
          name: "站台层",
        },
        {
          id: 6,
          name: "出站夹层(沪昆侧)",
        },
        {
          id: 7,
          name: "出站层",
        },
      ],
    };
  },

  components: {},

  computed: {},

  mounted() {
    this.init();
  },

  methods: {
    init() {
      this.getData();
    },
    getData() {
      getAllDevice().then((res) => {
        if (res.code === 200 && res.data.length > 0) {
          this.deviceList = res.data;
        }
        this.initWs();
      });
    },
    initWs() {
      const ws = getWebSocket("custom/netDevice");
      ws.setMessage((res) => {
        const data = JSON.parse(res.data);
        if (data.length > 0) {
          this.deviceList.forEach((v) => {
            data.forEach((w) => {
              if (v.ip === w.ip) v.reachable = w.reachable;
            });
          });
        }
      });
      ws.init();
      this.$once("hook:beforeDestroy", () => ws.getWS().close());
    },
  },
};
</script>
<style src="../../../styles/network-device.scss" lang="scss" scoped></style>
<style lang="scss" scoped>
.legend_box {
  position: absolute;
  top: -40px;
  right: 0px;

  .box_shape {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 2px;
    vertical-align: middle;
    padding: 0 10px;
    margin: 0 5px;
  }

  .box_shape:first-child {
    background-color: #6c9dd1;
  }

  .box_shape:nth-child(3) {
    background-color: darkgray;
    margin-left: 25px;
  }
}

.device_item.onLine {
  >.device_label {
    color: #0091ff;
  }
}

.device_item.offLine {
  >.device_label {
    color: #666 !important;
  }
}

.device_item.onLine {
  >.device_tips {
    color: #666;
  }
}

.device_item.offLine {
  >.device_tips {
    color: darkgray !important;
  }
}

.device_item {
  text-align: center;
  position: absolute;

  >.device_label {
    color: #6c9dd1;
    font-size: 14px;
    // font-weight: bold;
  }

  .device_tips {
    color: #666;
    display: block;
    position: relative;
    left: 110px;
    top: 10px;
    width: 88px;
    font-size: 14px;
    // font-weight: bold;
  }
}

.device_item:nth-child(n + 2):nth-child(-n + 11) {
  >.device_label {
    color: #0091ff;
    font-weight: bold !important;
  }
}

.device_item.device_item.offLine:nth-child(n + 2):nth-child(-n + 11) {
  >.device_label {
    color: #666 !important;
    font-weight: bold !important;
  }

  >.device_tips {
    color: #666 !important;
  }

}

// .device_item:nth-last-child(-n+3) {
//     >.device_label {
//         color: #fff;
//     }
// }

.device_item:nth-child(n + 14):nth-child(-n + 17) {}

.el-main {
  // @include scrollBar;
  overflow: inherit;
}

::v-deep.th-container-view {
  padding-left: 0;
}

// e85b11
// ffaf60
// 068dff
// 8357fc
// 00bae0
section.content_warp {
  display: flex;
  // width: 1748px;
  // height: auto !important;
  height: 100%;
  position: relative;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0px 1px 10px 0px rgba(57, 160, 248, 0.2);
  // overflow: hidden;

  >ul.firstClass {
    width: 140px;
    border-radius: 10px 0 0 10px;
    overflow: hidden;

    >li {
      // line-height: 147px;
      // background-size: contain;
      text-align: center;
      background: #6b9dff;
      border-bottom: 1px solid #fff;

      &:nth-last-child {
        border-bottom: none;
      }

      >span {
        width: 100%;
        color: #fff;
        font-size: 18px;
        line-height: 22px;
        font-weight: bold;
        // background-clip: text;
        // -webkit-background-clip: text;
        // -webkit-text-fill-color: transparent;
      }
    }

    >li:first-child {
      // background-image: url(../../../assets/img/bg_1.png);

      // >span {
      //   background-image: -webkit-linear-gradient(bottom, #e7570b, #f6905a);
      // }

      height: 147px;
      line-height: 147px;
    }

    >li:nth-child(2) {
      // background-image: url(../../../assets/img/bg_2.png);
      height: 99px;
      line-height: 99px;

      // >span {
      //   background-image: -webkit-linear-gradient(bottom, #ffad5b, #ffcd9c);
      // }
    }

    >li:nth-child(3) {
      // background-image: url(../../../assets/img/bg_3.png);
      height: 171px;
      line-height: 171px;

      // >span {
      //   background-image: -webkit-linear-gradient(bottom, #82e17b, #9cf196);
      // }
    }

    >li:nth-child(4) {
      // background-image: url(../../../assets/img/bg_4.png);
      background-size: contain;
      height: 49px;
      line-height: 49px;

      // >span {
      //   background-image: -webkit-linear-gradient(bottom, #008aff, #51afff);
      // }
    }

    >li:nth-child(5) {
      // background-image: url(../../../assets/img/bg_5.png);
      height: 130px;
      line-height: 130px;

      // >span {
      //   background-image: -webkit-linear-gradient(bottom, #8357fc, #a68bf1);
      // }
    }

    >li:nth-child(6) {
      // background-image: url(../../../assets/img/bg_6.png);
      background-size: contain;
      height: 60px;
      line-height: 55px;

      // >span {
      //   background-image: -webkit-linear-gradient(bottom, #e7466c, #ec708d);
      // }
    }

    >li:nth-child(7) {
      // background-image: url(../../../assets/img/bg_7.png);
      height: 270px;
      line-height: 246px;

      // >span {
      //   background-image: -webkit-linear-gradient(bottom, #00bae0, #59e3ff);
      // }
    }
  }

  >section.secondClass {
    // width: 1562px;
    height: 900px;
    // 宽高比例
    aspect-ratio: 1523 / 900;
    background-repeat: no-repeat;
    background-image: url(../../../assets/img/networkdevice_bg2.png);
    position: relative;
    margin-top: 23px;
  }
}

//
::v-deep(.th-main-title) {
  h2 {
    line-height: normal !important;
    margin-left: 20px !important;
  }
}

.th-main-view {
  padding: 0;
}

.curDivider {
  left: 13px;
  top: 3px;
}

//
.container_warp {
  width: 100%;
  height: 100%;
  // overflow: hidden;
  // width: calc(100% - 20px)!important;
  border-radius: 10px;
  overflow-x: scroll;
}

.container_box {
  // width: 1740px;
  // height: 100%;
  // overflow: auto;
  // min-width: 1740px;
}

.el-main {
  // height: calc(100% - 60px);
  height: 100%;
}

.content_title {
  display: block;
  width: 223px;
  height: 27px;
  line-height: 27px;
  text-indent: 20px;
  background-image: url(../../../assets/img/title_bg.png);
  // margin: 20px 0 39px 0;
}
</style>
