<template>
    <div class="div-table">
        <div class="div-table-row div-table-head">
            <div class="div-table-cell">分项</div>
            <div class="div-table-cell" v-for="item in headerData" :key="item">
                {{ item }}
            </div>
        </div>
        <div class="div-table-row">
            <div class="div-table-cell">用电量 (kWh)</div>
            <div class="div-table-cell" v-for="(value, index) in percentData" :key="index">
                {{ value }}
            </div>
        </div>
        <div class="div-table-row">
            <div class="div-table-cell">占比</div>
            <div class="div-table-cell" v-for="(value, index) in bodyData" :key="index">
                {{ `${value} %` }}
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name: 'ElecSubDataTable',
    props: {
        elecSubDataList: {
            type: Object,
            required: true,
        },
    },
    computed: {
        headerData() {
            return Object.keys(this.elecSubDataList)
        },
        bodyData() {
            return Object.values(this.elecSubDataList)
        },
        percentData() {
            // 2019年数据作为基准数据写死
            const tempArr = [14771845, 2500811, 877989, 1244164, 14143522, 4169405, 3828196];
            return tempArr
        }
    }
};
</script>

<style>
.div-table {
    display: table;
    width: 100%;
    background: #e9efff;
    /* Navy blue background */
    color: #333;
    /* White text color */
    border-collapse: collapse;
}

.div-table-row {
    display: table-row;
}

.div-table-head {
    display: table-header-group;
    font-weight: bold;
    background: #e9efff;
    /* Darker blue background for header */
}

.div-table-cell {
    display: table-cell;
    padding: 10px;
    border: 1px solid #cde1f7;
    /* White borders */
}
</style>
