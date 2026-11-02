<!--其他支撑数据管理-->
<template>
  <section class="container_warp">
    <el-tabs v-model="activeTab" style="height: 100%">
      <el-tab-pane label="天气预报" name="天气预报">
        <Weather />
      </el-tab-pane>
      <el-tab-pane label="发送旅客数管理" name="发送旅客数管理">
        <PassengerManagement />
      </el-tab-pane>
    </el-tabs>
  </section>
</template>

<script>
import Weather from "@/views/energyDataAnalysis/WeatherForecast/weather.vue";
import PassengerManagement from "@/views/energyDataAnalysis/WeatherForecast/PassengerManagement.vue";

export default {
  components: { PassengerManagement, Weather },
  data() {
    return {
      activeTab: "天气预报", // 默认选中的标签
    };
  },
  methods: {
    // handleTabClick(newTab) {
    //   this.activeTab = newTab; // 更新当前选中的标签
    // },
  },
};
</script>

<style lang="scss" scoped>
.container_warp {
  width: 100%;
  height: 100%;
  background-color: #fff !important;
  border-radius: 10px;
  box-shadow: 0 0 6px rgba(90, 151, 250, 0.3);
  padding: 20px;
  display: flex;
  flex-direction: column;
}
</style>
