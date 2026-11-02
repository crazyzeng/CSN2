<!-- 账单管理--力度电费 -->
<template>
  <div>
    <el-row type="flex" justify="start">
      <div class="fine">
        <div class="title">
          <span>无功罚款</span>
          <span>（元）</span>
        </div>
        <div class="blocks">
          <div class="border" v-for="item in a1" :key="item">
            <div class="bl">{{ item }}</div>
          </div>
        </div>
        <div class="bot_data">
          <ul>
            <li>最大值</li>
            <li>{{ infoData.maxFine }}</li>
            <li>{{ infoData.maxDate }}月</li>
          </ul>
          <ul>
            <li>平均罚款</li>
            <li>{{ infoData.averageFine }}</li>
          </ul>
        </div>
      </div>
      <div class="assessment">
        <div class="title">
          <span>功率因素考核值</span>
        </div>
        <div class="blocks">
          <div class="border" v-for="item in a2" :key="item">
            <div class="bl">{{ item }}</div>
          </div>
        </div>
        <div class="bot_data">
          <ul>
            <li>平均功率因素</li>
            <li>{{ infoData.averagePowerFactor }}</li>
          </ul>
          <ul>
            <li>低于考核值次数</li>
            <li>{{ infoData.times }}<span>次</span></li>
          </ul>
        </div>
      </div>
    </el-row>
    <!--line图-->
    <el-row class="lineChart">
      <lineChart :data-option="dataOption"></lineChart>
    </el-row>
    <!--table-->
    <el-row class="table_row">
      <div class="tableTitle">
        <span>力调电费统计表</span>
        <img src="@/assets/icon/total_energy/arrow_left.png" alt="" />
      </div>
      <el-table :data="tableData" height="155px" border>
        <el-table-column prop="billDate" align="center" label="时间"> </el-table-column>
        <el-table-column prop="activePower" align="center" label="总有功电量"> </el-table-column>
        <el-table-column prop="reactivePower" align="center" label="总无功电量"> </el-table-column>
        <el-table-column prop="powerFactor" align="center" label="实际功率因素"> </el-table-column>
        <el-table-column prop="" align="center" label="功率因素考核值">
          <template>
            {{ standardFactor }}
          </template>
        </el-table-column>
        <el-table-column prop="adjustmentAmount" align="center" label="力调电费" width="400">
          <template slot="header">
            <span>（电度电费+基本电费）*力调系数=力调电费</span>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
  </div>
</template>

<script>
import lineChart from './charts/lineChart.vue';
import { fetchAdjustmentData } from '@/api/bill-management.js'

export default {
  components: { lineChart },
  props: {
    dataTime: {
      type: String,
      default: ''
    },
    searchResult: {
      type: Object
    }
  },
  data() {
    return {
      a1: [],
      a2: [],
      tableData: [],
      standardFactor: 0,
      infoData: {},
      dataOption: {
        xData: [],
        seriesData: [],
        seriesData1: []
      }
    };
  },
  watch: {
    searchResult: function () {
      this.init()
    }
  },
  computed: {},
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.getData();
    },
    initData() {
      this.a2 = [];
      const tempStr = this.standardFactor.toString();
      for (let i = 0; i < tempStr.length; i++) { this.a2.push(tempStr.charAt(i)); }
      this.a1 = [];
      const tempStr1 = this.infoData.totalFine.toString();
      for (let i = 0; i < tempStr1.length; i++) { this.a1.push(tempStr1.charAt(i)); }
    },
    getData() {
      fetchAdjustmentData(this.dataTime).then(res => {
        if (res && res.code === 200) {
          this.tableData = res.data.data
          this.standardFactor = res.data.info.standardPowerFactor
          this.infoData.averageFine = res.data.info.averageFine;
          this.infoData.averagePowerFactor = res.data.info.averagePowerFactor;
          this.infoData.maxDate = res.data.info.maxDate;
          this.infoData.maxFine = res.data.info.maxFine;
          this.infoData.times = res.data.info.times;
          this.infoData.totalFine = res.data.data.reduce((prev, item) => { prev += item.fine; return prev }, 0)
          this.dataOption.xData = res.data.data.map(v => { return v.billDate })
          this.dataOption.seriesData = res.data.data.map(v => { return v.fine })
          this.dataOption.seriesData1 = res.data.data.map(v => { return v.powerFactor })
          this.initData()
        }
      })
    }
  },
};
</script>
<style lang="scss" scoped>
::v-deep {
  .el-table {
    background-color: #2a3e62;
    margin-top: 10px;
  }

  .el-table .el-table__cell {
    border-color: #5a87a9 !important;
  }
}

.fine,
.assessment {
  width: 455px;
  height: 222px;
  background-image: url('@/assets/img/bills/otherBill_border.png');
  position: relative;
  top: 5px;

  .title {
    position: absolute;
    top: 25px;
    left: 80px;

    span {
      color: #fec173;
      font-size: 18px;
      font-weight: bold;
    }
  }

  .blocks {
    display: flex;
    // justify-content: center;
    // align-items: center;
    position: absolute;
    top: 75px;

    .border {
      margin-left: 5px;
      width: 40px;
      height: 40px;
      border: 1px solid #5fc0ed;
      border-radius: 4px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .border:first-child {
      margin-left: 50px;
    }

    .bl {
      color: #1e2a45;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 34px;
      height: 34px;
      background: linear-gradient(0deg, #ffffff 0%, #40effb 0%, #00bff0 100%);
      border-radius: 4px;
      font-size: 18px;
      font-weight: bold;
    }
  }

  .bot_data {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    position: relative;
    top: 145px;

    ul {
      position: relative;
    }

    ul li:first-child {
      color: #fec173;
      font-size: 14px;
    }

    ul li:nth-child(2) {
      margin-top: 20px;
    }

    ul li:nth-child(3) {
      width: 36px;
      height: 16px;
      position: absolute;
      top: 35px;
      left: -40px;
      color: #1e2c4c;
      font-size: 12px;
      font-weight: bold;
      background: linear-gradient(0deg, #40effb 0%, #00bff0 100%);
      border-radius: 8px;
      text-align: center;
      line-height: 16px;
    }
  }
}

.fine {
  .title {
    span:nth-child(2) {
      font-size: 12px;
    }
  }
}

.assessment {
  margin-left: 30px;
}

.lineChart {
  height: 320px;
}

//table
.table_row {
  margin: 0 10px 10px 10px;

  .tableTitle {
    position: relative;
    top: 0px;
    left: 16px;

    span {
      position: absolute;
      left: 16px;
      top: 3px;
      font-size: 18px;
      font-weight: bold;
    }
  }
}
</style>
