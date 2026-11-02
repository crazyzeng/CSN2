<!-- 节能策略设置 -->

<template>
    <section class="container_warp">
        <el-divider class="curDivider" direction="vertical" />
        <section class="page-title">
            <p>
                <!-- <el-button icon="el-icon-arrow-left" style="font-size: 14px; color: #eee" type="text" @click="$router.push('devicePlan')">返回</el-button> -->
                <span>节能策略{{ isEdit ? '编辑' : '新增' }}</span>
            </p>
            <p style="position: absolute; right: 24px; top: 4px">
                <el-button type="primary" icon="" v-if="!disabled" @click="save" size="small">保 存</el-button>
                <el-button type="primary" icon="" class="border-btn b-b-b" @click="$router.push('energySavingStrategy')"
                    size="small">返 回</el-button>
            </p>
        </section>
        <div class="content_box">
            <el-form :inline="false" ref="formRef" :model="formData" label-width="90px" :rules="rules"
                label-position="right" class="demo-form-inline">
                <el-form-item label="策略名称" prop="strategyName">
                    <el-input v-model="formData.strategyName" :disabled="disabled" placeholder="请输入策略名称"
                        style="width: 240px"></el-input>
                </el-form-item>
                <el-form-item label="执行周期" prop="executeMode">
                    <el-select v-model="formData.executeMode" :disabled="disabled"
                        style="width: 240px; vertical-align: top" placeholder="" @change="cycleModeChange()">
                        <el-option v-for="item in loopTimeOptions" :key="item.itemValue" :label="item.itemText"
                            :value="item.itemValue"></el-option>
                    </el-select>
                    <ul class="ul_cus" v-if="formData.executeMode === 'week'">
                        <li v-for="(item, index) in weekList" :key="item.label" class="li_cus">
                            <span class="week_btn" :class="item.curIndex ? 'active' : ''"
                                :style="{ cursor: disabled ? 'not-allowed' : 'pointer' }"
                                @click="weekItemClick(item)">{{ item.label }}</span>
                        </li>
                        <li class="li_cus">
                            <span class="week_btn active" :style="{ cursor: disabled ? 'not-allowed' : 'pointer' }"
                                @click="selectAll">全选</span>
                        </li>
                    </ul>
                </el-form-item>
                <el-form-item label="执行时间" prop="executeTime">
                    <!-- <el-time-picker v-model="formData.executeTime" :disabled="disabled" value-format="HH:mm" format="HH:mm"
                        placeholder="选择时间">
                    </el-time-picker> -->
                    <el-time-picker is-range v-model="executeTempTime" :disabled="disabled" value-format="HH:mm"
                        format="HH:mm" range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间"
                        placeholder="选择时间范围" @change="executeTimeChange">
                    </el-time-picker>
                </el-form-item>
                <el-form-item label="执行日期" prop="executeDate">
                    <el-date-picker v-model="formData.executeDate" class="mr-3" ref="timeRef" :disabled="disabled"
                        style="width: 240px" type="daterange" range-separator="-" start-placeholder="开始日期"
                        end-placeholder="结束日期" @change="executeDateChange" value-format="yyyy-MM-dd"
                        format="yyyy-MM-dd">
                    </el-date-picker>
                    <el-tag v-for="tag in executeTimeArr" :class="disabled ? 'disabled_ele' : ''" :key="tag"
                        class="custom_tag" closable :disable-transitions="false" @close="executeTimeArrRemove(tag)">
                        {{ tag }}
                    </el-tag>
                    <el-button icon="el-icon-plus" circle @click="timeAdd" class="ml-5"></el-button>
                </el-form-item>
                <section style="margin: 20px 0">
                    <!-- <el-button class="border-btn b-b-b" type="primary" icon="el-icon-delete" v-show="!disabled"
                        @click="delDevice">删除</el-button> -->
                    <el-button class="border-btn b-b-b" type="primary" icon="el-icon-plus" v-show="!disabled"
                        @click="addDevice">新增</el-button>
                </section>
                <el-table :data="tableData" class="curtable" ref="tableRef" :key="Math.random()" border
                    style="margin-bottom: 20px">
                    <!-- <el-table-column align="center" type="selection" width="60"> </el-table-column> -->
                    <el-table-column align="center" type="index" label="序号" width="80"></el-table-column>
                    <el-table-column align="center" prop="name" label="属性名称" min-width="200"></el-table-column>
                    <el-table-column align="center" prop="typeName" label="类型" min-width="200"></el-table-column>
                    <el-table-column align="center" prop="orgName" label="资源" min-width="200"></el-table-column>
                    <el-table-column align="center" prop="deviceName" label="所属通讯设备" min-width="200"></el-table-column>
                    <el-table-column align="center" prop="executeStatus" label="" min-width="100">
                        <template #default="{ row }">
                            <el-button type="text" icon="el-icon-delete" :disabled="disabled"
                                @click="delDevice(row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div v-for="(item, index) in formData.configDetail" :key="index" class="flex">
                    <el-form-item :label="'控制属性'" :prop="'configDetail.' + index + '.name'"
                        :rules="[{ required: true, message: '控制属性必填', trigger: 'blur' }]">
                        <el-input v-model="item.name" readonly></el-input>
                    </el-form-item>

                    <el-form-item class="ml-6" label="执行操作" :prop="'configDetail.' + index + '.executeVal'"
                        :rules="[{ required: true, message: '请选择执行操作', trigger: 'change' }]">
                        <el-select v-if="item.translateDetail && item.translateDetail.length > 0"
                            v-model="item.executeVal" :disabled="disabled" placeholder="请选择" @change="controlChange">
                            <el-option v-for="(el, idx) in item.translateDetail" :key="idx" :label="el.translateVal"
                                :value="el.maxValue"></el-option>
                        </el-select>
                        <el-input v-else v-model="item.executeVal" :disabled="disabled"
                            placeholder="请输入执行操作"></el-input>
                    </el-form-item>
                </div>

                <el-form-item class="mt-5" label="参数条件" prop="conditionOpen">
                    <el-radio-group class="ml-3" v-model="formData.conditionOpen" :disabled="disabled">
                        <el-radio :label="1">启用</el-radio>
                        <el-radio :label="0">禁用</el-radio>
                    </el-radio-group>
                    <el-button v-if="formData.conditionOpen" :disabled="disabled" class="border-btn b-b-b ml-10"
                        type="primary" icon="el-icon-plus" @click="add">新增</el-button>
                </el-form-item>

                <el-table v-if="formData.conditionOpen" :data="paramsTable" class="curtable" ref="paramsTableRef"
                    border>
                    <el-table-column align="center" label="参数属性" prop="name" min-width="100"></el-table-column>
                    <el-table-column align="center" label="判断条件" min-width="100">
                        <template #default="{ row }">
                            <el-select v-model="row.condition" :disabled="disabled" placeholder="请选择"
                                class="short_input">
                                <el-option label=">" value=">"></el-option>
                                <el-option label="<" value="<"></el-option>
                                <el-option label="=" value="="></el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="threshold" label="判断阈值" min-width="100">
                        <template #default="{ row }">
                            <el-input v-model="row.threshold" :disabled="disabled" type="number" placeholder="请输入阈值"
                                class="short_input"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="range" label="浮动值" min-width="100">
                        <template #default="{ row }">
                            <el-input v-model="row.range" :disabled="disabled" type="number" placeholder="请输入浮动值"
                                class="short_input"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="" width="100">
                        <template #default="{ row }">
                            <el-button type="text" icon="el-icon-delete" :disabled="disabled"
                                @click="del(row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form>
        </div>
        <selectPointModal ref="pointRef" :data-flag="dataFlag" :is-params="isParams" @data="receviePoint"
            :isEdit="isEdit" :selected-points="selectedPoints" @close="dataFlag = false">
        </selectPointModal>
    </section>
</template>
<script>
import {
    fetchEnergyStrategyDetail,
    addEnergyStrategy,
    updateEnergyStrategy,
    getPointListByIds,
} from '@/api/energy-saving-strategy';
import selectPointModal from './components/selectPointModal.vue';
import { deepClone } from '@/utils/index';
export default {
    data() {
        return {
            paging: {
                pageNo: 1,
                pageSize: 10,
                total: 0,
            },
            executeTempTime: '',
            formData: {
                strategyName: '',
                executeMode: 'day', // day week
                weeks: '', // 1,2,3 周几
                executeTime: '', // 执行时间
                executeDate: [], // 执行日期
                configDetail: [
                    {
                        pointId: '',
                        executeVal: '', // 执行值
                    },
                ],
                conditionOpen: 0, // 0 关闭 1 开启
                configCondition: [],
            },
            options: [
                {
                    value: 1,
                    label: '开启',
                },
                {
                    value: 0,
                    label: '关闭',
                },
            ],
            loopTimeOptions: [
                { itemText: '每日重复', itemValue: 'day' },
                { itemText: '每周重复', itemValue: 'week' },
            ],
            weekList: [
                {
                    label: '周一',
                    value: 2,
                    curIndex: false,
                },
                {
                    label: '周二',
                    value: 3,
                    curIndex: false,
                },
                {
                    label: '周三',
                    value: 4,
                    curIndex: false,
                },
                {
                    label: '周四',
                    value: 5,
                    curIndex: false,
                },
                {
                    label: '周五',
                    value: 6,
                    curIndex: false,
                },
                {
                    label: '周六',
                    value: 7,
                    curIndex: false,
                },
                {
                    label: '周日',
                    value: 1,
                    curIndex: false,
                },
            ],
            isAll: true,
            executeTimeArr: [],
            selectedData: [],
            disabled: false,
            rules: {
                strategyName: [{ required: true, message: '请输入策略名称', trigger: 'blur' }],
                executeTime: [{ required: true, message: '请选择执行时间', trigger: 'blur' }],
                executeMode: [{ required: true, message: '请选择执行周期', trigger: 'change' }],
                conditionOpen: [{ required: true, message: '请选择参数条件', trigger: 'blur' }],
            },
            tableData: [],
            paramsTable: [],
            dataFlag: false,
            isParams: false,
            isEdit: false,
            selectedPoints: [],
        };
    },
    components: { selectPointModal },

    computed: {},

    mounted() {
        this.init();
    },
    methods: {
        init() {
            const curId = this.$route.query.id;
            const type = this.$route.query.type;
            if (type == 'edit') this.isEdit = true;
            if (type == 'view') this.disabled = true;
            if (curId) this.getDetail(curId);
        },
        getDetail(id) {
            fetchEnergyStrategyDetail(id).then((res) => {
                if (res.code === 200 && res.data) {
                    this.echoData(res.data);
                }
            });
        },
        echoData(data) {
            this.formData.id = data.id;
            this.formData.strategyName = data.strategyName;
            this.formData.executeMode = data.executeMode;
            this.formData.conditionOpen = data.conditionOpen;
            if (data.executeDate.length > 0) {
                this.formData.executeDate = [
                    data.executeDate[0].split('~')[0],
                    data.executeDate[0].split('~')[1],
                ];
                // this.executeTimeArr = data.executeDate;
            }
            this.formData.executeTime = data.executeTime;
            this.executeTempTime = [data.executeTime.split('~')[0], data.executeTime.split('~')[1]];
            this.executeTimeArr = data.executeDate;
            if (data.weeks.length > 0) {
                data.weeks.split(',').forEach((v) => {
                    this.weekList.forEach((w) => {
                        if (v == w.value) w.curIndex = true;
                    });
                });
            }
            this.tableData = data.configDetail.map((item) => {
                return {
                    ...item.pointPageVo,
                };
            });
            this.formData.configDetail = data.configDetail.map((item) => {
                return {
                    ...item.pointPageVo,
                    ...item,
                    executeVal: Number(item.executeVal),
                };
            });
            this.paramsTable = data.configCondition.map((item) => {
                return {
                    ...item,
                };
            });
            this.paging.total = this.tableData.length;
        },

        controlChange(val) {
            this.formData.configDetail.forEach((item) => {
                if (item.executeVal == val) {
                    item.executeText = item.translateDetail.find((el) => el.maxValue == val).translateVal;
                }
            });
        },

        addDevice() {
            // this.$refs.pointRef?.open({});
            this.selectedPoints = this.tableData.map((item) => item.pointId);
            this.dataFlag = true;
            this.isParams = false;
        },
        delDevice(row) {
            this.tableData = this.tableData.filter((item) => item.pointId !== row.pointId);
            this.formData.configDetail = this.formData.configDetail.filter((item) => item.pointId !== row.pointId);
        },
        pageChange(e) {
            this.paging.pageNo = e;
            this.getData();
        },
        handleSizeChange(e) {
            this.paging.pageSize = e;
            this.getData();
        },
        save() {
            this.$refs.formRef?.validate((valid) => {
                if (!valid) {
                    return false;
                }
                const tempData = deepClone(this.formData);
                tempData.configDetail = this.formData.configDetail.map((item) => {
                    return {
                        pointId: item.pointId,
                        executeVal: item.executeVal,
                        executeText: item.executeText,
                    };
                });
                if (tempData.conditionOpen == 1) {
                    tempData.configCondition = this.paramsTable.map((item) => {
                        return {
                            pointId: item.pointId,
                            condition: item.condition,
                            threshold: item.threshold,
                            range: item.range,
                        };
                    });
                } else {
                    tempData.configCondition = [];
                }
                tempData.executeDate = this.executeTimeArr;
                const type = this.$route.query.type;
                const curId = this.$route.query.id;
                if (type === 'edit') {
                    if (this.formData.executeMode === 'week') this.getWeekNum();
                    tempData.weeks = this.formData.weeks;
                    tempData.id = curId;
                    updateEnergyStrategy(tempData).then((res) => {
                        if (res.code === 200) {
                            this.$message.success('编辑成功');
                            this.$router.push('energySavingStrategy');
                        }
                    });
                } else {
                    addEnergyStrategy(tempData).then((res) => {
                        if (res.code === 200) {
                            this.$message.success('保存成功');
                            this.$router.push('energySavingStrategy');
                        }
                    });
                }
            });
        },

        getWeekNum() {
            const tempArray = [];
            const tempArr = this.weekList.filter((v) => {
                if (v.curIndex) return v.value;
            });
            tempArr.forEach((v) => {
                tempArray.push(v.value);
            });
            this.formData.weeks = tempArray.join(',');
        },
        weekItemClick(item) {
            item.curIndex = !item.curIndex;
            this.getWeekNum();
        },
        selectAll() {
            this.weekList.forEach((v) => {
                v.curIndex = this.isAll;
            });
            let tempArr = [];
            if (this.isAll) tempArr = this.weekList;
            else tempArr = [];
            const tempArray = [];
            tempArr.forEach((v) => {
                tempArray.push(v.value);
            });
            this.formData.weeks = tempArray.join(',');
            this.isAll = !this.isAll;
        },
        executeTimeArrRemove(e) {
            this.executeTimeArr.splice(this.executeTimeArr.indexOf(e), 1);
        },
        executeDateChange() {
            this.executeTimeArr.push(this.formData.executeDate[0] + '~' + this.formData.executeDate[1]);
        },
        executeTimeChange() {
            this.formData.executeTime = `${this.executeTempTime[0]}~${this.executeTempTime[1]}`;
        },
        timeAdd() {
            this.$refs.timeRef.focus();
        },
        getDetails(e, e1) {
            e[0].equipmentName = e1[0].equipmentName;
            e[0].equipmentNumber = e1[0].equipmentNumber;
            const tempArr = deepClone(e);
            this.formData.configDetail = e;
            this.tableData = this.tableData.concat(tempArr);
            this.paging.total = this.tableData.length;
        },
        cycleModeChange() {
            if (this.formData.circleMode === 'DAY') this.formData.weeks = '';
        },
        handleSelectionChange(e) {
            this.selectedData = e;
            e.forEach((item) => {
                this.multipleSelectArray.push(item.id);
            });
        },
        add() {
            this.selectedPoints = this.paramsTable.map((item) => item.pointId);
            this.isParams = true;
            this.dataFlag = true;
        },
        del(row) {
            this.paramsTable = this.paramsTable.filter((item) => item.pointId !== row.pointId);
        },

        receviePoint(e, isParams) {
            if (e.length === 0) {
                if (isParams) {
                    this.paramsTable = [];
                } else {
                    this.tableData = [];
                    this.formData.configDetail = [];
                }
                this.selectedPoints = [];
                return;
            }
            // 根据id获取列表
            const data = {
                name: '',
                type: '',
                orgName: '',
                deviceId: '',
                pointIds: e,
            };
            getPointListByIds(data, { pageNo: 1, pageSize: 999 }).then((res) => {
                if (res.code == 200 && res.data) {
                    const pointList = res.data.records;
                    if (isParams) {
                        const tempArr = deepClone(pointList);
                        this.paramsTable = tempArr;
                        return;
                    } else {
                        const tempArr = deepClone(pointList);
                        this.tableData = tempArr;
                        this.formData.configDetail = this.tableData.map((item) => {
                            return {
                                ...item,
                                executeVal: '',
                                executeText: '',
                            };
                        });
                    }
                }
            });
        },
    },
};
</script>
<style lang="scss" scoped>
.custom_btn {
    font-size: 16px;
    border-radius: 18px;
}

.disabled_ele {
    pointer-events: none;
}

::v-deep.el-input.is-disabled {
    .el-input__inner {
        color: #fff;
    }
}

::v-deep.el-select .el-input.is-disabled {
    .el-input__inner {
        color: #fff;
    }
}

// ::v-deep.el-range-editor.is-disabled {
//     background-color: #293852;

//     input {
//         background-color: #293852;
//     }
// }

.cus_section {
    // width: 301px;
    display: flex;
    justify-content: space-evenly;
    margin-bottom: 5px;
    // display: inline-block;
}

.ul_cus {
    display: inline-block;
    margin-left: 20px;
    list-style: none;
}

.li_cus {
    float: left;
    width: 50px;
    height: 30px;
}

.week_btn {
    display: block;
    width: 50px;
    height: 30px;
    background-color: #999999;
    border-radius: 4px;
    text-align: center;
    cursor: pointer;
}

.li_cus:not(:first-child) {
    margin-left: 10px;
}

.week_btn.active {
    background-color: #3399ff;
}

::v-deep.el-form-item {
    >.el-form-item__label {
        color: #fff;
    }
}

.el-form {
    padding: 15px;
    border-radius: 8px;
    margin: 15px 0 0 0;
    // background-color: #1e2a45;
}

.content_box {
    background-color: #1e2a45;
    padding: 15px;
    border-radius: 8px;
    height: calc(100% - 80px);
    overflow-y: scroll;
    margin-top: 20px;
}

.container_warp {
    width: 100%;
    height: 100%;
    overflow: auto;
    padding: 0 20px;
}

::-webkit-scrollbar-track-piece {
    background: transparent;
}

::-webkit-scrollbar {
    width: 6px;
    height: 10px;
}

::-webkit-scrollbar-thumb {
    background: $light-blue;
    border-radius: 20px;
}

::-webkit-scrollbar-corner {
    background: transparent;
}

.page-title {
    span {
        padding-left: 20px;
        font-size: 20px;
        font-weight: 400;
    }
}

::v-deep.el-input__inner {
    background-color: #2a3e62;
    border-radius: 15px;
}

::v-deep {
    .el-input>.el-input__inner {
        width: 240px;
    }
}

::v-deep .curtable.el-table .el-table__body tr:hover>td.el-table__cell {
    background-color: transparent !important;
}

::v-deep .short_input .el-input__inner {
    width: 150px !important;
}

::v-deep .el-input-number__decrease {
    display: none;
}

::v-deep .el-input-number__increase {
    display: none;
}
</style>
