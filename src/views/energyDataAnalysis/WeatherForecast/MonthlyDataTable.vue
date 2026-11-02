<template>
    <div class="div-table">
        <div class="div-table-row div-table-head">
            <div class="div-table-cell">月份</div>
            <!-- Generate header cells for each month -->
            <div class="div-table-cell" v-for="month in 12" :key="month">
                {{ month }}月
            </div>
        </div>
        <div class="div-table-row">
            <div class="div-table-cell">用电量 (kWh)</div>
            <!-- Generate data cells for each month's value -->
            <div class="div-table-cell" v-for="(value, index) in monthsDataArray" :key="index">
                {{ value }}
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'MonthlyDataTable',
    props: {
        standardDataList: {
            type: String,
            required: true,
        },
    },
    computed: {
        monthsDataArray() {
            // Convert the comma-separated string to an array
            return this.standardDataList.split(',');
        }
    }
};
</script>

<style>
.div-table {
    display: table;
    width: 100%;
    background: e9efff;
    /* Navy blue background */
    color: white;
    /* White text color */
    border-collapse: collapse;
}

.div-table-row {
    display: table-row;
}

.div-table-head {
    display: table-header-group;
    font-weight: bold;
    background: e9efff;
    /* Darker blue background for header */
}

.div-table-cell {
    display: table-cell;
    padding: 10px;
    border: 1px solid #cde1f7;
    /* White borders */
}</style>
