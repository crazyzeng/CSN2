<template>
    <div ref="pieChart" class="echart-container"></div>
</template>

<script>
import * as echarts from 'echarts';

export default {
    name: 'XPieChart',
    props: {
        chartData: {
            type: String,
            required: true,

        },
    },
    data() {
        return {
            chartInstance: null,
        };
    },
    mounted() {
        this.initChart();
    },
    methods: {
        initChart() {
            this.chartInstance = echarts.init(this.$refs.pieChart);

            // Parse the JSON string into an object
            const parsedData = JSON.parse(this.chartData);

            // Transform the object into an array of objects with 'name' and 'value' keys
            const formattedData = Object.keys(parsedData).map(key => ({
                name: key,
                value: parsedData[key]
            }));

            const option = {
                tooltip: {
                    trigger: 'item',
                    formatter: function (v) {
                        return `${v.marker}${v.name}  :  ${v.percent || 0} %`
                    }
                },
                legend: {
                    orient: 'vertical',
                    left: 'right',
                    textStyle: {
                        color: '#ffffff',
                    },
                    data: formattedData.map(item => item.name),
                },
                series: [
                    {
                        name: '',
                        type: 'pie',
                        radius: '50%',
                        data: formattedData,
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)',
                            },
                        },
                    },
                ],
                // color: ['#1FE3FF', '#5470C6', '#91CC75', '#EE6666', '#c4ccd3', '#f2a695', '#bda29a', '#6e7074', '#546570', '#c4ccd3', '#37A2FF', '#73C0DE'],
                color: ['#1FE3FF', "#A4CC45", "#FFD287", "#39A0F8", "#f2a695", "#B08DF9", "#FD5655",]
            };

            this.chartInstance.setOption(option);
        },
    },
    watch: {
        chartData: {
            deep: true,
            handler(newVal) {
                if (this.chartInstance) {
                    this.chartInstance.setOption({
                        series: [
                            {
                                data: newVal,
                            },
                        ],
                    });
                }
            },
        },
    },
};
</script>

<style scoped>
.echart-container {
    width: 50%;
    height: 400px;
    /* or any other dimension */
}
</style>
