<template>
  <el-dialog width="600px" :title="dataTitle" :visible="dataFlag" :before-close="handleClose" @open="open()">
    <div id="totalPie" ref="totalPie" :style="{ height: '500px', width: '600px' }"></div>
    <div slot="footer" class="dialog-footer">
      <el-button class="confirm-btn" type="primary" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import resize from './mixins/resize';

export default {
  name: 'PieChart',
  mixins: [resize],
  props: {
    dataTitle: {
      type: String,
      default: '',
    },
    dataFlag: {
      type: Boolean,
      default: false,
    },
    dataArr: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      myChart: null,
      optionNew: {},
      curData: [],
      maxValue: '',
      minValue: '',
      avgValue: '',
      chartData: [],
      optionNew: {},
      options: {
        color: [
          '#02c2ae',
          '#2bd9d9',
          '#578cf7',
          '#52dff7',
          '#f8cc7e',
          '#f8ea95',
          '#c190f3',
          '#ecc2ec',
          '#4577cc',
          '#f38969',
        ],
        title: {
          text: '分项能耗饼图',
          left: 'center',
          textStyle: {
            color: '#000',
          },
        },
        tooltip: {
          trigger: 'item',
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          textStyle: {
            color: '#000',
          },
        },
        series: [
          {
            name: '能耗值',
            type: 'pie',
            radius: '50%',
            data: [],
          },
        ],
      },
    };
  },
  // watch: {
  //   dataArr(data) {
  //     this.chartData = [...data]

  //     this.options.series[0].data = this.chartData;
  //     if (this.myChart !== null) this.myChart.setOption(this.options);
  //   },
  // },
  watch: {
    dataFlag(val) {
      if (val) {
        this.$nextTick(() => {
          // setTimeout(() => {
            const chartDom = this.$refs.totalPie;
            if (!this.myChart) {
              this.myChart = this.$echarts.init(chartDom);
            } else {
              this.myChart.clear();
            }

            this.options.title.text = this.dataTitle;
            this.options.series[0].data = [...this.dataArr];
            this.myChart.setOption(this.options, true);
          // }, 5);
        });
      }
    }
  },

  mounted() { },

  methods: {
    // 初始化
    // async init() {
    //   this.optionNew = JSON.parse(JSON.stringify(this.options));
    //   this.myChart = this.$echarts.init(document.getElementById('totalPie'));
    //   this.myChart.setOption(this.options);
    //   //绘图
    //   this.optionNew.series[0].data = this.chartData;
    //   this.myChart.setOption(this.optionNew);
    // },
    open() {
      this.$nextTick(() => {
        if (this.myChart) this.myChart.resize();
      });
    }

    ,


    getData() { },
    submit() {
      if (this.myChart) {
        this.myChart.dispose();
        this.myChart = null;
      }
      this.$emit('submit');
    },
    handleClose() {
      if (this.myChart) {
        this.myChart.dispose();
        this.myChart = null;
      }
      this.$emit('close');
    },
  },
};
</script>

<style lang="scss" scoped>
.pie_bottom {
  display: flex;
  justify-content: space-around;
  align-items: center;
  color: #000;
}

.dialog-footer {
  text-align: center;
}
</style>
