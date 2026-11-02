<template>
  <!--
    组态物料渲染器（对应原 cict-configuration 的 Material，模板标签 <wl-material>）
    根据 source.name（Text/Image/Number/Radio/Checkbox/Switch/DropListMenu/
    BitSwitch/MultiStatus/Chart/DimensionChart/FireAlarm/BatchSwitch/LightingMode）
    分派渲染不同类型的小组件，并通过 materialEvent 事件把交互回传给父页面。
  -->
  <div class="wl-material" :style="visibilityStyle">
    <!-- 文本 -->
    <div
      v-if="materialName === 'Text'"
      class="mm-text"
      :style="textStyle"
      @click="handleClick('Text')"
    >{{ options.text }}</div>

    <!-- 图片 -->
    <img
      v-else-if="materialName === 'Image'"
      class="mm-image"
      :src="options.imgSrc"
      :style="imageStyle"
      @click="handleClick('Image')"
    />

    <!-- 数值 -->
    <div v-else-if="materialName === 'Number'" class="mm-number" :style="numberStyle">
      {{ numberText }}
    </div>

    <!-- 单选 -->
    <el-radio v-else-if="materialName === 'Radio'" v-model="radioChecked" class="mm-radio" @change="onRadioChange">
      &nbsp;
    </el-radio>

    <!-- 复选 -->
    <el-checkbox v-else-if="materialName === 'Checkbox'" v-model="checkboxChecked" class="mm-checkbox" @change="onCheckboxChange">
      &nbsp;
    </el-checkbox>

    <!-- 开关 -->
    <el-switch v-else-if="materialName === 'Switch'" v-model="switchChecked" class="mm-switch" @change="onSwitchChange" />

    <!-- 下拉菜单 -->
    <el-select v-else-if="materialName === 'DropListMenu'" v-model="dropValue" class="mm-drop" size="mini" @change="onDropChange">
      <el-option v-for="opt in options.config || []" :key="opt.value" :label="opt.text" :value="opt.value" />
    </el-select>

    <!-- 位开关 -->
    <div v-else-if="materialName === 'BitSwitch'" class="mm-bit-switch" @click="onBitSwitch">
      <img v-if="bitImg" :src="bitImg" :style="imageStyle" />
      <span v-else>{{ bitText }}</span>
    </div>

    <!-- 多状态 -->
    <img v-else-if="materialName === 'MultiStatus'" class="mm-image" :src="multiStatusImg" :style="imageStyle" />

    <!-- 火警监测 -->
    <div v-else-if="materialName === 'FireAlarm'" class="mm-fire" :style="textStyle">
      <img v-if="options.imgSrc" :src="options.imgSrc" :style="imageStyle" />
      <span>{{ options.text }}</span>
    </div>

    <!-- 趋势图 -->
    <div v-else-if="materialName === 'Chart'" ref="chartRef" class="mm-chart" :style="chartStyle"></div>

    <!-- 多维趋势图 -->
    <div v-else-if="materialName === 'DimensionChart'" class="mm-chart-placeholder" :style="chartStyle">
      {{ options.pointName || '多维趋势图' }}
    </div>

    <!-- 群控开关 -->
    <div v-else-if="materialName === 'BatchSwitch'" class="mm-batch">
      <el-button size="mini" type="primary" @click="onBatchSwitch(options.onValue)">开</el-button>
      <el-button size="mini" @click="onBatchSwitch(options.offValue)">关</el-button>
    </div>

    <!-- 照明模式 -->
    <el-select v-else-if="materialName === 'LightingMode'" v-model="lightValue" class="mm-drop" size="mini" @change="onLightChange">
      <el-option v-for="opt in options.config || []" :key="opt.value" :label="opt.text" :value="opt.value" />
    </el-select>

    <!-- 兜底 -->
    <div v-else class="mm-fallback">{{ materialName }}</div>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'WlMaterial',
  props: {
    // 物料数据（由 createConfigMaterial 生成）
    source: { type: Object, required: true },
    // 物料名称（等价于 source.name）
    name: { type: String, default: '' },
    // 实时点位数据：[{ pointId, value }]
    point: { type: Array, default: () => [] },
    // 模拟点位数据：[{ pointId, value }]
    simulate: { type: Array, default: () => [] },
  },
  data() {
    return {
      radioChecked: false,
      checkboxChecked: false,
      switchChecked: false,
      dropValue: null,
      lightValue: null,
    }
  },
  computed: {
    materialName() {
      return this.source.name || this.name
    },
    options() {
      return this.source.options || {}
    },
    // 处理后台 formatter.isShow 表达式：空则默认显示
    visibilityStyle() {
      const expr = this.source.formatter && this.source.formatter.isShow
      if (expr) {
        // 表达式解析较复杂，这里保守处理：只按布尔值表达式的直接结果决定显隐
        if (expr === 'false' || expr === '0') return { display: 'none' }
      }
      return {}
    },
    textStyle() {
      return {
        color: this.options.color || this.resolveColor(),
        fontSize: this.setUnit(this.options.size),
      }
    },
    imageStyle() {
      return { width: '100%', height: '100%', objectFit: 'fill' }
    },
    numberStyle() {
      return {
        color: this.options.color || this.resolveColor(),
        fontSize: this.setUnit(this.options.size),
      }
    },
    chartStyle() {
      return { width: '100%', height: '100%' }
    },
    numberText() {
      const val = this.getPointValue(this.options.point)
      const num = Number(val)
      if (Number.isNaN(num)) return '--'
      if (this.options.decimal != null) return num.toFixed(Number(this.options.decimal))
      return String(num)
    },
    bitImg() {
      const val = this.getPointValue(this.options.readPoint)
      const c = (this.options.config || []).find((i) => String(i.value) === String(val))
      return c && c.imgSrc
    },
    bitText() {
      const val = this.getPointValue(this.options.readPoint)
      const c = (this.options.config || []).find((i) => String(i.value) === String(val))
      return (c && c.imgSrc) || val || ''
    },
    multiStatusImg() {
      const val = Number(this.getPointValue(this.options.point))
      const c = (this.options.config || []).find((i) => val >= Number(i.minValue) && val <= Number(i.maxValue))
      return c && c.imgSrc
    },
  },
  watch: {
    point: {
      handler() {
        this.$forceUpdate()
      },
      deep: true,
    },
  },
  mounted() {
    this.syncFromPoint()
    if (this.materialName === 'Chart') {
      // 向父页面请求趋势数据，父页面通过 callback 回传 { axisData, seriesData }
      this.$emit('materialEvent', {
        type: 'Chart',
        data: this.options,
        param: {
          _id: this.source._id || this.source.id,
          callback: (chartData) => this.renderChart(chartData),
        },
      })
    }
  },
  destroyed() {
    if (this.chart) {
      this.chart.dispose()
      this.chart = null
    }
  },
  methods: {
    /* ---------- 工具方法 ---------- */
    setUnit(v) {
      if (v == null || Number.isNaN(Number(v))) return v
      return `${v}px`
    },
    resolveColor() {
      const expr = this.source.formatter && this.source.formatter.color
      if (expr && expr.startsWith('#')) return expr
      return '#333'
    },
    // 根据点位 ID 在实时/模拟数据中取原始 value 对象
    findPoint(pointId) {
      const inReal = (this.point || []).find((p) => p.pointId === pointId)
      if (inReal) return inReal.value
      const inSim = (this.simulate || []).find((p) => p.pointId === pointId)
      if (inSim) return inSim.value
      return null
    },
    // 尽力提取点位 value 对象中的“数值”字段
    getPointValue(pointId) {
      const raw = this.findPoint(pointId)
      if (raw == null) return null
      if (typeof raw === 'object') {
        return raw.value ?? raw.currentValue ?? raw.dataValue ?? raw.runStatus ?? raw
      }
      return raw
    },
    syncFromPoint() {
      const mapVal = (pointId) => this.getPointValue(pointId)
      if (this.materialName === 'Switch' || this.materialName === 'Checkbox') {
        const c = this.options.config || []
        const current = mapVal(this.options.point)
        this.switchChecked = Boolean(current) || String(current) === String(c[1] && c[1].value)
        this.checkboxChecked = Boolean(current) || String(current) === String(c[1] && c[1].value)
      }
      if (this.materialName === 'DropListMenu') this.dropValue = mapVal(this.options.point)
      if (this.materialName === 'LightingMode') this.lightValue = mapVal(this.options.config && this.options.pointIds?.[0])
    },

    /* ---------- 交互事件（type 需与父页面 handler* 方法对齐） ---------- */
    handleClick(type) {
      if (this.options.url) {
        this.$emit('materialEvent', { type, data: this.options })
      }
    },
    onRadioChange(val) {
      this.$emit('materialEvent', { type: 'Radio', data: this.options })
    },
    onCheckboxChange(val) {
      const c = (this.options.config || [])[1]
      this.$emit('materialEvent', { type: 'Checkbox', data: this.options, param: val ? c?.value : val })
    },
    onSwitchChange(val) {
      this.$emit('materialEvent', { type: 'Switch', data: this.options, param: val })
    },
    onDropChange(val) {
      this.$emit('materialEvent', { type: 'DropListMenu', data: this.options, param: val })
    },
    onBitSwitch() {
      this.$emit('materialEvent', { type: 'BitSwitch', data: this.options })
    },
    onBatchSwitch(val) {
      this.$emit('materialEvent', { type: 'BatchSwitch', data: this.options, param: val })
    },
    onLightChange(val) {
      this.$emit('materialEvent', { type: 'LightModel', data: this.options, param: val })
    },
    renderChart({ axisData, seriesData }) {
      if (!this.$refs.chartRef) return
      if (!this.chart) this.chart = echarts.init(this.$refs.chartRef)
      const series = (Array.isArray(seriesData) ? seriesData : [seriesData]).map((s) => ({
        ...s,
        type: s.type || 'line',
      }))
      this.chart.setOption({
        grid: { left: 10, right: 10, top: 20, bottom: 10, containLabel: true },
        xAxis: { type: 'category', data: axisData || [] },
        yAxis: { type: 'value' },
        series,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.wl-material {
  width: 100%;
  height: 100%;
  .mm-text,
  .mm-number,
  .mm-fire {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  .mm-image {
    display: block;
  }
  .mm-chart-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px dashed #ccc;
    color: #999;
  }
  .mm-batch {
    display: flex;
    gap: 6px;
    align-items: center;
  }
}
</style>