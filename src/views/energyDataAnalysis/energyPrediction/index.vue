<!-- 能耗预测 -->
<template>
  <div class="energy_prediction">
    <div class="header">
      <div class="header_card bg_color1">
        <div class="header_card_left">
          <div class="date_range">
            <span>{{ cardData.seasonProgress ? cardData.seasonProgress.split('/')[0] + '天' : '' }}</span>
            <span class="selected_line">/</span>
            <span class="selected_days">{{ cardData.seasonProgress ? cardData.seasonProgress.split('/')[1] + '天' : ''
            }}</span>
          </div>
          <div class="season_label">{{ cardData.seasonType }}</div>
        </div>
        <div class="header_card_righ">
          <div class="date_range">{{ (cardData.seasonEnergy / 1000).toFixed(2) }}<span class="selected_days"> MWh</span>
          </div>
          <div class="season_label">季度能耗</div>
        </div>
      </div>
      <div class="header_card bg_color2">
        <div class="header_card_left">
          <div class="date_range">{{ (cardData.seasonBenchmark / 1000).toFixed(2) }}<span class="selected_days">
              MWh</span></div>
          <div class="season_label">当季基准</div>
        </div>
        <div class="header_card_righ">
          <div class="date_range">{{ cardData.seasonBenchamrkChange }}<span class="selected_days"> %</span></div>
          <div class="season_label">预测基准调节</div>
        </div>
      </div>
      <div class="header_card bg_color3">
        <div class="header_card_left">
          <div class="date_range">{{ cardData.temperatureDiff }}<span class="selected_days"> %</span></div>
          <div class="season_label">温度距平</div>
        </div>
        <div class="header_card_righ">
          <div class="date_range">{{ cardData.passengerFlowDiff }}<span class="selected_days"> %</span></div>
          <div class="season_label">客流距平</div>
        </div>
      </div>
    </div>
    <div class="echars_box">
      <div class="content_title">能耗预测趋势</div>
      <BarChart :energyData="energyData"></BarChart>
    </div>
    <div class="echars_box">
      <div class="content_title">月均温度变化</div>
      <LineChart :temperatureData="temperatureData"></LineChart>
    </div>
    <div class="echars_box">
      <div class="content_title">月均客流变化</div>
      <LineChart2 :passengerFlowData="passengerFlowData"></LineChart2>
    </div>
  </div>
</template>

<script>
import BarChart from "./chart/BarChart.vue";
import LineChart from "./chart/LineChart.vue";
import LineChart2 from "./chart/LineChart2.vue";
import { handleNewEnergyPredict } from '@/api/newEnergyDataAnalysis/newEnergyPrediction';
export default {
  components: { BarChart, LineChart, LineChart2 },
  data() {
    return {
      cardData: {
        passengerFlowDiff: "",
        seasonBenchamrkChange: "",
        seasonBenchmark: "",
        seasonEnergy: "",
        seasonProgress: "",
        seasonType: "",
        temperatureDiff: "",
      },
      energyData: {
        currentMonthBenchmark: '',
        currentMonthEnergy: '',
        currentMonthPrediction: '',
        data: [],
        labels: [],
        xAxis: [],
      },
      passengerFlowData: {
        data: [],
        labels: [],
        xAxis: [],
        current: "",
        tb: "",
      },
      temperatureData: {
        data: [],
        labels: [],
        xAxis: [],
      },
    };
  },
  computed: {},

  mounted() {
    this.init();
  },

  methods: {
    async init() {
      this.getNewEnergyPredict()
    },
    // 获取能耗预测数据
    async getNewEnergyPredict() {
      const res = await handleNewEnergyPredict()
      console.log('res1111111111111111111', res);
      if (res.code === 200) {
        this.cardData = res.data.card
        this.energyData = res.data.energy
        this.passengerFlowData = res.data.passengerFlow
        this.temperatureData = res.data.temperature
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.energy_prediction {
  width: 100%;
  height: 100%;
  position: relative;
  color: #000;

  .header {
    height: 10%;
    width: 100%;
    background-color: #fff;
    border-radius: 8px;
    display: flex;
    min-height: 0;

    .header_card {
      flex: 1;
      min-width: 0;
      display: flex;
      text-align: center;
      margin: 10px;
      border-radius: 8px;

      .header_card_left,
      .header_card_righ {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        position: relative;

        .date_range {
          font-size: 20px;
          font-weight: 600;
        }

        .selected_line {
          font-size: 20px;
          font-weight: 400;
          color: #666;
        }

        .selected_days {
          font-size: 14px;
          font-weight: 400;
          color: #666;
        }

        .season_label {
          font-size: 14px;
          font-weight: 500;
        }
      }

      .header_card_left::after {
        content: '';
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 1px;
        height: 40%;
        background-color: #e1dede;
      }
    }
  }

  .echars_box {
    height: calc(30% - 10px);
    width: 100%;
    background-color: #fff;
    border-radius: 8px;
    margin-top: 10px;
    position: relative;

    .content_title {
      width: 223px;
      height: 25px;
      line-height: 25px;
      color: #313131;
      font-size: 14px;
      text-indent: 35px;
      background-image: url(../../../assets/img/energyManagement/title_bg.png);
      background-size: contain;
      background-repeat: no-repeat;
      position: relative;
      top: 10px;
      left: 15px;
    }
  }
}

.bg_color1 {
  background-color: #FFF6E7;
}

.bg_color2 {
  background-color: #F0E8FF;
}

.bg_color3 {
  background-color: #E3EAFC;
}
</style>
