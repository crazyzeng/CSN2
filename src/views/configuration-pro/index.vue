<template>
  <el-container class="th-config" direction="vertical">
    <!-- title -->
    <wl-main-title :data-title="title"></wl-main-title>

    <!-- main -->
    <el-main class="th-panel">
      <div v-if="offLinePoint.length > 0" class="th-off-line" :class="{ '_close': closeFlag }">
        <i class="th-btn" :class="{ 'el-icon-arrow-left': !closeFlag, 'el-icon-arrow-right': closeFlag }"
          @click="closeFlag = !closeFlag"></i>
        <div class="_box">
          <p v-for="item in offLinePoint" :key="item.pointId">
            {{ `名称: ${item.value.deviceName || '--'}; 状态: 离线; 点位: ${item.pointId}` }}
          </p>
        </div>
      </div>

      <div class="th-material" :style="canvasStyle">
        <div class="th-material-wrapper" v-for="item in materials" :key="item.id" :style="createStyle(item)">
          <wl-material :source="item" :name="item.name" :point="dots" :simulate="simulateList"
            @materialEvent="handleMaterialEvent" />
        </div>
      </div>
    </el-main>

    <el-dialog :width="dialog.w == 'auto' ? '400px' : (dialog.width + 45) + 'px'" :visible.sync="dialog.flag"
      :before-close="handleDialogClose">

      <iframe :src="dialog.src" :style="{ width: dialog.w, height: dialog.h }"></iframe>
    </el-dialog>
  </el-container>
</template>

<script>
import { mapState } from 'vuex'
import { setUnit } from '@/utils/index'
import { getWebSocket as createWebSocket } from '@/utils/websocket'
import { getConfigTheme, getConfigPointTrendData, doWriteTask, handleBatchCtrl,handleLightModelCtrl } from '@/api/configuration'
import { createConfigMaterial } from '@/utils/configurationModel/index'

export default {
  name: 'SeeConfigUrationPro',
  data() {
    return {
      screen: {},
      materials: [],
      dots: [],
      webSocket: null,

      // 离线点位
      closeFlag: false,
      offLinePoint: [],

      dialog: {
        flag: false,
        src: '',
        w: '0px',
        h: '0px',
        width: '',
        height: ''
      },
      simulateList: []
    }
  },
  computed: {
    title() { return this.screen.name },

    themeId() { return this.$route.params.id },

    queryParams() { return this.$route.query },

    attribute() { return (this.screen && this.screen.attribute) || { w: '100%', h: '100%' } },

    canvasStyle() {
      const { w, h } = this.attribute
      return {
        width: setUnit(w),
        height: setUnit(h)
      }
    },

    // ...mapState({
    //     dots: (state) => { state.point.dots }
    // })
    // ...mapState(
    //     ['dots']
    // )
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.initThemeData()
      this.initWebSocket()
      this.handlerQueryParams()
    },

    // 初始化 - 主题数据
    initThemeData() {
      this.getTheme()
    },

    // 初始化 - websocket
    initWebSocket() {
      if (this.webSocket){ 
        this.webSocket.ws.close()
      }
      this.webSocket = createWebSocket(`cacheThemePointDataWebSocket/${this.themeId}`)
      this.webSocket.setMessage((res) => {
        this.initWsResult(JSON.parse(res.data));
        // 更新离线信息
        this.getOffLinePoint()
      })
      this.webSocket.init()
      this.webSocket.setClose()
      this.$once('hook:beforeDestroy', () => { this.webSocket.ws.close(); this.webSocket = null; })
    },

    initWsResult(data) {
      this.dots = [];
      const tempData = data['actual'];
      const tempSimulate = data['simulate'];
      if (tempData && Object.keys(tempData).length > 0) {
        for (let key in tempData) {
          const tempObj = {}
          tempObj.pointId = key;
          tempObj.value = tempData[key];
          this.dots.push(tempObj)
        }
      }
      if (tempSimulate && Object.keys(tempSimulate).length > 0) {
        for (let key in tempSimulate) {
          const tempObj = {
            pointId: key,
            value: tempSimulate[key]
          };
          this.simulateList.push(tempObj);
        }
      }
    },
    // 处理 - URI 上的查询条件
    handlerQueryParams() {
      const queryParams = this.queryParams
      if (queryParams.type && queryParams.type === 'model') {
        this.$store.dispatch('setFlag', { key: 'header', value: false });
        this.$store.dispatch('setFlag', { key: 'sidebar', value: false });
      }
    },

    // 创建样式
    createStyle(data) {
      let filp
      const { attribute } = data

      switch (attribute.flip) {
        case 'horizontal':
          filp = 'rotateY(180deg)'
          break;
        case 'vertical':
          filp = 'rotateX(180deg)'
          break;
        default:
          filp = ''
          break;
      }

      return {
        top: setUnit(attribute.y),
        left: setUnit(attribute.x),
        width: setUnit(attribute.w),
        height: setUnit(attribute.h),
        zIndex: attribute.z,
        transform: `rotate(${attribute.deg}deg) ${filp}`
      }
    },

    // 处理 - 物料的事件
    handleMaterialEvent(eventData) {
      const { type, data, param } = eventData
      this[`handler${type}`](data, param)
    },

    // 处理 - batch-switch组件行为
    handlerBatchSwitch(data, param) {
      this.$confirm('确认执行操作吗？', '提示', { type: 'warning' })
        .then(_ => {
          handleBatchCtrl(data.pointIdList, param).then(res => {
            if (res.code === 200) this.$message.success('操作成功')
          })
        })
        .catch(_ => { });
    },
    // 处理 - 照明模式 组件行为
    handlerLightModel(data, param) {
      this.$confirm('确认执行操作吗？', '提示', { type: 'warning' })
        .then(_ => {
          handleLightModelCtrl(data.partPointLightControlId, param).then(res => {
            if (res.code === 200) this.$message.success('操作成功')
          })
        })
        .catch(_ => { });
    },
    // 处理 - bit switch 组件行为
    handlerBitSwitch(data) {
      const _data = { pointId: data.writePoint, value: data.writePointValue }
      this.execWriteTask(_data)
    },

    // 处理 - drop list menu 组件行为
    handlerDropListMenu(data, param) {
      const _data = { pointId: data.point, value: param }
      this.execWriteTask(_data)
    },

    // 处理 - checkbox 组件行为
    handlerCheckbox(data, param) {
      const _data = { pointId: data.point, value: param }
      this.execWriteTask(_data)
    },

    // 处理 - switch 组件行为
    handlerSwitch(data, param) {
      const _data = { pointId: data.point, value: param }
      this.execWriteTask(_data)
    },

    // 处理 - radio 组件行为
    handlerRadio(data) {
      const _data = { pointId: data.point, value: data.pointValue }
      this.execWriteTask(_data)
    },

    // 处理 - number 组件行为
    handlerNumber(data, param) {
      const _data = { pointId: data.point, value: param, type: 'number' }
      this.execWriteTask(_data)
    },

    // 处理 - chart 组件行为
    async handlerChart(data, param) {
      // 日期补全
      function padStartTime(s) {
        return s.padStart(2, '0')
      }

      function getTime() {
        const date = new Date()
        return {
          year: date.getFullYear(),
          month: padStartTime(`${date.getMonth() + 1}`),
          day: padStartTime(`${date.getDate()}`)
        }
      }

      // 获取开始时间
      function getStartTime(dateType) {
        const res = {}
        const { year, month, day } = getTime()
        switch (dateType) {
          case '1': // 年
            res.trend = year
            res.withs = year - 1
            res.ring = year - 1
            break;
          case '2': // 月
            res.trend = year + month
            res.withs = (year - 1) + month
            res.ring = year + padStartTime(`${month - 1}`)
            break;
          case '3': // 日
            res.trend = year + month + day
            res.withs = (year - 1) + month + day
            res.ring = year + month + padStartTime(`${day - 1}`)
            break;
          default:
            throw new Error('趋势图 时间曲度 不对！')
        }
        return res
      }

      // 处理图表数据
      function handlerChartDatas(data1, data2) {
        const data = data1.length >= data2.length
          ? data1
          : data2
        const length = data.length
        const _data1 = []
        const _data2 = []
        for (let i = 0; i < length; i++) {
          if (data1[i]) {
            _data1.push(data1[i].dataValue)
          } else {
            _data1.push(0)
          }

          if (data2[i]) {
            _data2.push(data2[i].dataValue)
          } else {
            _data2.push(0)
          }
        }

        return {
          axisData: data.map(item => item.dataDate),
          data1: _data1,
          data2: _data2
        }
      }

      const getChartData = async (partPointTrendId, startTime) => {
        return getConfigPointTrendData({
          partPointTrendId,
          startTime
        })
      }
      const { _id, callback } = param
      const { dateType, chartType } = data
      try {
        const { trend, withs, ring } = getStartTime(dateType)
        // 图表类型
        switch (chartType) {
          case '1': // 趋势图
            {
              const { data } = await getChartData(_id, trend)
              callback({
                axisData: data.map(item => item.dataDate),
                seriesData: { name: trend, type: 'line', data: data.map(item => item.dataValue) }
              })
            }
            break;
          case '2': // 同比图
            {
              const { data: trendRes } = await getChartData(_id, trend)
              const { data: withTes } = await getChartData(_id, withs)
              const { axisData, data1, data2 } = handlerChartDatas(trendRes, withTes)
              callback({
                axisData,
                seriesData: [
                  { name: trend, type: 'line', data: data1 },
                  { name: withs, type: 'line', data: data2 }
                ]
              })
            }
            break;
          case '3': // 环比图
            {
              const { data: trendRes } = await getChartData(_id, trend)
              const { data: ringTes } = await getChartData(_id, ring)
              const { axisData, data1, data2 } = handlerChartDatas(trendRes, ringTes)
              callback({
                axisData,
                seriesData: [
                  { name: trend, type: 'line', data: data1 },
                  { name: ring, type: 'line', data: data2 }
                ]
              })
            }
            break;
          default:
            throw new Error('趋势图 图表类型 错误！')
        }
      } catch (error) {
        throw new Error(error.message)
      }
    },

    // 处理 - img 组件行为
    handlerImage(data) {
      this.handlerText(data)
    },

    // 处理 - text 组件行为
    handlerText(data) {
      if (!data.url) return false
      const { url, urlType } = data
      const { href: routerUrl } = this.parseConfigUrl(url)
      switch (urlType) {
        case 1:
          // 新页面
          window.open(routerUrl, '_blank')
          break;
        case 2:
          // 转跳
          window.location.href = `${routerUrl}?linkType=link&type=model`;
          break;
        case 3:
          // 弹框
          const { modelHeight, modelWidth } = data
          this.dialog = Object.assign(this.dialog, {
            flag: true,
            w: modelWidth ? `${modelWidth}px` : 'auto',
            h: modelHeight ? `${modelHeight}px` : 'auto',
            width: modelWidth ? modelWidth : 'auto',
            src: `http://${window.location.host + routerUrl}?type=model`
          })
          break;
      }
    },

    // 处理 - 弹框关闭
    handleDialogClose() {
      this.dialog = Object.assign(this.dialog, {
        flag: false,
        src: '',
        w: '0px',
        h: '0px',
        width: '',
        height: ''
      })
    },

    // 解析 - 配置的 url 地址
    parseConfigUrl(url) {
      // url 转换为 NaN 的情况即代表是路径
      if (Number.isNaN(Number(url))) {
        if (url.startsWith('www') || url.startsWith('http') || url.startsWith('https')) {
          return { href: url }
        }
        return this.$router.resolve({ path: url })
      }
      // 转换为数值的就是 id
      return this.$router.resolve({ name: "SeeConfigUrationPro", params: { id: url } })
    },

    // 是否执行 writeTask
    execWriteTask(data) {
      const inputVal = data.value;
      if (data.type !== undefined && data.type === 'number') {
        this.$prompt('', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValue: inputVal,
          inputPattern: /^[1-9]*[0-9]?(\.[0-9]{1,4})?$/,
          inputErrorMessage: '格式不正确'
        }).then(({ value }) => {
          this.writeTask({ pointId: data.pointId, value: value })
        }).catch(() => { });
      } else {
        this.$confirm('确认执行操作吗？', '提示', { type: 'warning' })
          .then(_ => { this.writeTask(data) })
          .catch(_ => { });
      }
    },

    // 获取主题
    getTheme() {
      getConfigTheme(this.themeId)
        .then(res => res && res.data)
        .then(res => {
          const { screen, materials } = createConfigMaterial(res)
          this.screen = screen
          this.materials = materials
        })
        ;
    },

    // 获取离线点位
    getOffLinePoint() {
      const dots = this.dots
      if (Array.isArray(dots) && dots.length > 0) {
        this.offLinePoint = dots.filter(item => !item.value.connStatus)
      }
    },

    // 写入任务
    writeTask(data) {
      doWriteTask(data).then(res => {
        if (res.code === 200) {
          this.$message.success('操作成功！')
        }
      })
    }
  },
}
</script>

<style lang="scss" scoped>
.th-config {
  width: 100%;
  height: 100%;
  background: #ddddde;
  border-radius: 10px;
  box-shadow: 0px 1px 10px 0px rgba(57, 160, 248, 0.2);
}

.th-material {
  position: relative;
  padding: 0;
  margin: 0;
  overflow: hidden;

  >.th-material-wrapper {
    position: absolute;
  }
}

.th-off-line {

  position: absolute; 
  top: 50px;
  left: 10px;
  max-height: 170px;
  color: white;
  font-size: 14px;
  border: 1px solid #71b5f5;
  z-index: 9;
  background-color: rgba(#78bbf9, .2);
  padding: 5px;
  box-sizing: border-box;

  >.th-btn {

    position: absolute;
    top: 5px;
    right: 5px;
    width: 14px;
    cursor: pointer;
    transition: transform .5s ease-in-out;

    &:hover {
      transform: rotate(360deg);
    }
  }

  >._box {

    @include scrollBar;
    height: 150px;
    padding: 6px 18px;
    overflow-y: auto;
  }
}

._close {

  width: 15px;
  height: 15px;

  >.th-btn {
    top: 0;
    left: 0;
  }

  >._box {
    display: none;
  }
}
</style>