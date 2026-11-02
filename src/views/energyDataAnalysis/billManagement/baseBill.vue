<!-- 账单管理--基本电费 -->
<template>
  <div>
    <el-row type="flex" justify="center">
      <div class="capacity" :class="overviewData.type === '按容量计算' ? 'curr_active' : ''">
        <img src="@/assets/img/bills/capacity.png" alt="" />
        <span class="main_title">按容量计算</span>
        <span class="sub_title" v-if="overviewData.type === '按容量计算'">当前计算</span>
        <div class="bot_data">
          <div>
            <p><span>{{ overviewData.transformerCapacity }}</span><span>kva</span></p>
            <p>变压器容量</p>
          </div>
          <div>
            <p><span>{{ overviewData.transformerCapacityPrice }}</span><span>元/千伏安·月</span></p>
            <p>单价</p>
          </div>
          <div>
            <p><span>{{ capacityCost }}</span><span>元</span></p>
            <p>电费</p>
          </div>
        </div>
      </div>
      <div class="demand" :class="overviewData.type === '按需量计算' ? 'curr_active' : ''">
        <img src="@/assets/img/bills/demand.png" alt="" />
        <span class="main_title">按需量计算</span>
        <span class="sub_title" v-if="overviewData.type === '按需量计算'">当前计算</span>
        <div class="bot_data">
          <div>
            <p><span>{{ overviewData.maximumDemand }}</span><span>KW</span></p>
            <p>最大需量</p>
          </div>
          <div>
            <p><span>{{ overviewData.maximumDemandPrice }}</span><span>元/千瓦·月</span></p>
            <p>单价</p>
          </div>
          <div>
            <p><span>{{ demandCost }}</span><span>元</span></p>
            <p>电费</p>
          </div>
        </div>
      </div>
    </el-row>
    <!--bar图-->
    <el-row class="barChart2">
      <barChart2 :data-option="dataOption"></barChart2>
    </el-row>
    <addPrice :data-flag="modal.flag" @dialog1Save="dialog1Save" @dialog1Cancel="dialog1Cancel"></addPrice>
  </div>
</template>

<script>
import barChart2 from './charts/barChart2.vue';
import addPrice from './dialog/dialog1.vue';
import { fetchBaseBill } from '@/api/bill-management.js'

export default {
  components: { barChart2, addPrice },
  props: {
    dataDialog1Flag: {
      type: Boolean,
      required: false,
    },
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
      modal: {
        flag: false,
      },
      overviewData: {
        maximumDemand: 0,
        maximumDemandPrice: 0,
        transformerCapacity: 0,
        transformerCapacityPrice: 0,
        type: ''
      },
      dataOption: {
        xData: [],
        seriesData: [],
        seriesData1: []
      },
      demandCost: 0,
      capacityCost: 0
    };
  },
  watch: {
    dataDialog1Flag: {
      handler(data) {
        this.modal.flag = data;
      },
      deep: true,
      immediate: true,
    },
    searchResult: function (data) {
      this.getData()
    }
  },
  computed: {},

  mounted() {
    this.getData()
  },

  methods: {
    getData() {
      fetchBaseBill(this.dataTime).then(res => {
        if (res && res.code == 200) {
          for (const k in res.data.rule) { this.overviewData[k] = res.data.rule[k] }
          this.demandCost = res.data.data.reduce((prev, item) => { prev += item.maximumDemandAmount; return prev }, 0)
          this.capacityCost = res.data.data.reduce((prev, item) => { prev += item.transformerAmount; return prev }, 0)
          this.dataOption.xData = res.data.data.map(v => { return v.billDate })
          this.dataOption.seriesData = res.data.data.map(v => { return v.transformerAmount })
          this.dataOption.seriesData1 = res.data.data.map(v => { return v.maximumDemandAmount })
        }
      })
    },
    dialog1Save() {
      this.modal.flag = false;
      this.$emit('dialog1Save', false);
    },
    dialog1Cancel() {
      this.modal.flag = false;
      this.$emit('dialog1Cancel', false);
    },
  },
};
</script>
<style lang="scss" scoped>
.capacity,
.demand {
  width: 400px;
  height: 160px;
  background-color: #2a3e62;
  margin-top: 50px;
  border-radius: 10px;
  position: relative;
}

.curr_active {
  border: none;
  box-sizing: border-box;
  background-image: linear-gradient(#2a3e62, #2a3e62), linear-gradient(#e7570b, #fbae62);
  padding: 2px;
  border-radius: 10px;
  background-clip: content-box, padding-box;
  transition: filter 0.5s ease;
}

.capacity {
  margin-right: 25px;

  img {
    position: absolute;
    left: 30px;
    top: 18px;
  }

  .main_title {
    position: absolute;
    left: 80px;
    top: 25px;
    font-size: 18px;
    font-weight: bold;
  }

  .sub_title {
    position: absolute;
    left: 181px;
    top: 30px;
    background-image: linear-gradient(125deg, #e7570b, #fbae62);
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
    font-size: 14px;
  }

  .bot_data {
    position: absolute;
    bottom: 20px;
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;

    div {
      margin-top: 20px;
    }

    div:first-child,
    div:nth-child(2) {
      p:first-child {
        text-align: center;

        span:first-child {
          font-size: 20px;
          color: #ff5a00;
          font-weight: bold;
        }

        span:nth-child(2) {
          font-size: 14px;
        }
      }

      p:nth-child(2) {
        font-size: 20px;
        margin-top: 20px;
        text-align: center;
      }
    }

    div:nth-child(3) {
      p:first-child {
        text-align: center;

        span:first-child {
          font-size: 20px;
          color: #ff0000;
          font-weight: bold;
        }

        span:nth-child(2) {
          font-size: 14px;
        }
      }

      p:nth-child(2) {
        font-size: 20px;
        margin-top: 20px;
        text-align: center;
      }
    }
  }
}

.demand {
  margin-left: 25px;

  img {
    position: absolute;
    left: 30px;
    top: 18px;
  }

  .main_title {
    position: absolute;
    left: 80px;
    top: 25px;
    font-size: 18px;
    font-weight: bold;
  }

  .sub_title {
    position: absolute;
    left: 181px;
    top: 30px;
    background-image: linear-gradient(125deg, #e7570b, #fbae62);
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
    font-size: 14px;
  }

  .bot_data {
    position: absolute;
    bottom: 20px;
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;

    div {
      margin-top: 20px;
    }

    div:first-child,
    div:nth-child(2) {
      p:first-child {
        text-align: center;

        span:first-child {
          font-size: 20px;
          color: #7254ff;
          font-weight: bold;
        }

        span:nth-child(2) {
          font-size: 14px;
        }
      }

      p:nth-child(2) {
        font-size: 20px;
        margin-top: 20px;
        text-align: center;
      }
    }

    div:nth-child(3) {
      p:first-child {
        text-align: center;

        span:first-child {
          font-size: 20px;
          color: #00e70b;
          font-weight: bold;
        }

        span:nth-child(2) {
          font-size: 14px;
        }
      }

      p:nth-child(2) {
        font-size: 20px;
        margin-top: 20px;
        text-align: center;
      }
    }
  }
}

.barChart2 {
  // height: 100%;
  height: 520px;
}
</style>
