<template>
    <div>
        <el-form-item label="平均利用设备减少损耗">
            <el-switch v-model="model.adjust" active-color="#3c6dfe" inactive-color="#bfbfbf" active-text="启动"
                inactive-text="停止">
            </el-switch>
        </el-form-item>
        <el-form-item label="">
            <el-radio-group v-model="model.reduce">
                <el-radio name="1" label="1">单日启用单号主机</el-radio>
                <el-radio name="2" label="2">单日启用双号主机</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="加机电流负载上限" label-width="155px">
            <el-input-number v-model="model.loadLimit" :precision="1" :step="0.1" controls-position="right" :min="90"
                :max="95"></el-input-number>
            <span class=" text-xs text-gray-500 ml-3">(负载范围90%-95%)</span>
        </el-form-item>
        <el-form-item label="减机电流负载下限" label-width="155px">
            <el-input-number v-model="model.loadLover" :precision="1" :step="0.1" controls-position="right" :min="60"
                :max="70"></el-input-number>
            <span class=" text-xs text-gray-500 ml-3">(负载范围60%-70%)</span>
        </el-form-item>
        <el-form-item label="冷冻水出水温度设定" label-width="155px">
            <el-input-number v-model="model.waterTemp" :precision="1" :step="0.1" controls-position="right" :min="7"
                :max="9"></el-input-number>
            <span class=" text-xs text-gray-500 ml-3">(温度范围7°C-9°C)</span>
        </el-form-item>
        <el-form-item label="加减机时间" label-width="155px">
            <el-input-number v-model="model.machineTime" controls-position="right" :min="30"
                :max="60"></el-input-number>
            <span class=" text-xs text-gray-500 ml-3">(时间范围30min-60min)</span>
        </el-form-item>

    </div>
</template>

<script>
export default {
    name: "CoolingAddReduce",
    props: {
        value: Object
    },
    computed: {
        model: {
            get() {
                return this.value
            },
            set(val) {
                this.$emit('input', val)
            }
        }
    }
}
</script>