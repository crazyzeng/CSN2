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
          text: '区域能耗',
          left: 'center',
          textStyle: {
            color: '#fff',
          },
        },
        tooltip: {
          trigger: 'item',
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          textStyle: {
            color: '#fff',
          },
        },
        series: [
          {
            name: '能耗总值',
            type: 'pie',
            radius: '50%',
            data: [],
          },
        ],
      },
    };
  },
  watch: {
    dataArr(data) {
      console.log(data);
      let arr = data;
      let maxValueArr = [];
      let minValueArr = [];
      let avgValueArr = [];
      this.chartData = [];
      arr.forEach((e) => {
        if (!e.maxValue) {
          maxValueArr.push('0');
        } else {
          maxValueArr.push(e.maxValue);
        }
        if (!e.minValue) {
          minValueArr.push('0');
        } else {
          minValueArr.push(e.minValue);
        }
        if (!e.avgValue) {
          avgValueArr.push('0');
        } else {
          avgValueArr.push(e.avgValue);
        }
        const tempNum = e.datas.reduce((prev, item) => {
          prev += Number(item)
          return Number(prev)
        }, 0)
        //绘图数据
        this.chartData.push({ value: tempNum || 0, name: e.orgName });
        console.log(this.chartData);
      });
      //算平均数
      console.log(avgValueArr);
      if (avgValueArr.length > 0) {
        let average = avgValueArr.reduce((num, item, index) => {
          if (index != avgValueArr.length - 1) {
            return num + item;
          } else {
            return ((Number(num) + Number(item)) / avgValueArr.length).toFixed(2);
          }
        });
        this.avgValue = average;
      } else {
        this.avgValue = '0';
        return;
      }
      this.maxValue = Math.max(...maxValueArr).toFixed(2);
      this.minValue = Math.min(...minValueArr).toFixed(2);
      this.options.series[0].data = this.chartData;
      if (this.myChart !== null) this.myChart.setOption(this.options);
    },
  },
  mounted() { },
  methods: {
    // 初始化
    async init() {
      this.optionNew = JSON.parse(JSON.stringify(this.options));
      this.myChart = this.$echarts.init(document.getElementById('totalPie'));
      this.myChart.setOption(this.options);
      //绘图
      this.optionNew.series[0].data = this.chartData;
      this.myChart.setOption(this.optionNew);
    },
    open() {
      this.$nextTick(() => { this.init(); });
    },

    getData() { },
    submit() {
      this.$emit('submit');
    },
    handleClose() {
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
  color: #fff;
}
.dialog-footer{
  text-align: center;
}
</style>
