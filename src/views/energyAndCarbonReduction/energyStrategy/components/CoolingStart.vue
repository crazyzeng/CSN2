<template>
    <div>
        <el-form-item label="设定舒适温度" label-width="155px">
            <!-- 自定义label -->
             <template slot="label">
                <el-checkbox v-model="model.isTemp"></el-checkbox>
                <span class=" ml-2">设定舒适温度</span>
            </template>
            <el-input-number v-model="model.temp" :precision="1" :step="0.1" controls-position="right" :min="24"
                :max="27"></el-input-number>
            <span class=" text-xs text-gray-500 ml-3">(负载范围24°C-27°C)</span>
        </el-form-item>

        <el-form-item label="设定舒适湿度" label-width="155px">
            <template slot="label">
                <el-checkbox v-model="model.isHumidity"></el-checkbox>
                <span class=" ml-2">设定舒适湿度</span>
            </template>
            <el-input-number v-model="model.humidity" :precision="1" :step="0.1" controls-position="right" :min="40"
                :max="60"></el-input-number>
            <span class=" text-xs text-gray-500 ml-3">(负载范围40%-60%)</span>
        </el-form-item>

        <el-form-item label="设定回水温度" label-width="155px">
            <el-input-number v-model="model.returnTemp" :precision="1" :step="0.1" controls-position="right" :min="28"
                :max="30"></el-input-number>
            <span class=" text-xs text-gray-500 ml-3">(温度范围28°C-30°C)</span>
        </el-form-item>

        <el-form-item label="设定启动时间" label-width="155px">
            <el-date-picker v-model="model.startTime" placeholder="选择时间" style="width: 160px" />
        </el-form-item>
    </div>
</template>

<script>
export default {
    name: "CoolingStart",
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