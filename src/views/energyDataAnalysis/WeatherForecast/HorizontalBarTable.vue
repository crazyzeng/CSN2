<template>
    <div class="div-table">
        <div class="div-table-row div-table-head">
            <div class="div-table-cell">月份</div>
            <div class="div-table-cell" v-for="item in 12" :key="item">
                {{ item }}月
            </div>
        </div>
        <div class="div-table-row">
            <div class="div-table-cell">高温天数(天)</div>
            <div class="div-table-cell" v-for="(value, index) in hotData" :key="index">
                {{ value }}
            </div>
        </div>
        <div class="div-table-row">
            <div class="div-table-cell">低温天数(kWh)</div>
            <div class="div-table-cell" v-for="(value, index) in coldData" :key="index">
                {{ value }}
            </div>
        </div>
    </div>
</template>
  
<script>

export default {
    name: 'HorizontalBarTable',
    props: {
        weatherCaseList: {
            type: Object,
            default: () => { }
        },
    },
    computed: {
        hotData() {
            return this.weatherCaseList.hot
        },
        coldData() {
            return this.weatherCaseList.cool
        },
    },
    mounted() {
        this.initChart();
    },
    methods: {
        initChart() {
        }
    }
};
</script>
  
<style scoped>
.echart-container {
    height: 500px;
    /* Adjust as needed */
}
</style>
  