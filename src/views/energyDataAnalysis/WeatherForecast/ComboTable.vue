<template>
    <div class="div-table">
        <div class="div-table-row div-table-head">
            <div class="div-table-cell">月份</div>
            <div class="div-table-cell" v-for="item in 12" :key="item">
                {{ item }}月
            </div>
        </div>
        <div class="div-table-row">
            <div class="div-table-cell">发送量 (人次)</div>
            <div class="div-table-cell" v-for="(value, index) in peopleData" :key="index">
                {{ value }}
            </div>
        </div>
        <div class="div-table-row">
            <div class="div-table-cell">发送旅客人均耗电量(kWh)</div>
            <div class="div-table-cell" v-for="(value, index) in avgData" :key="index">
                {{ value }}
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name: 'ComboTable',
    props: {
        chartData: {
            type: Object,
            required: true
        },
    },
    computed: {
        peopleData() {
            return this.chartData.touristNumber
        },
        avgData() {
            return this.chartData.touristAvg
        },
    },
    data() {
        return {
        };
    },
    mounted() {
        this.initChart();
    },
    methods: {
        initChart() {
        }
    },
    watch: {
        chartData: {
            deep: true,
            handler(val) {
            }
        },
    }
};
</script>

<style scoped>
.echart-container {
    height: 400px;
    /* or any other dimensions */
}
</style>
