<template>
    <div>
        <el-form-item label="设定水泵运行频率" label-width="155px">
            <el-input-number v-model="model.runningFreq" :precision="1" :step="0.1" controls-position="right" :min="30"
                :max="50"></el-input-number>
            <span class=" text-xs text-gray-500 ml-3">(设定范围30hz-50hz)</span>
        </el-form-item>
        <el-form-item label="水泵前后默认压差" label-width="155px">
            <el-input-number v-model="model.pressure" :precision="1" :step="1" controls-position="right" :min="0"
                ></el-input-number>
        </el-form-item>
        <el-form-item label="水泵最低运行频率" label-width="155px">
            <el-input-number v-model="model.lowerFreq" :precision="1" :step="1" controls-position="right" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="水泵最高运行频率" label-width="155px">
            <el-input-number v-model="model.higherFreq" :precision="1" :step="1" controls-position="right" :min="0"></el-input-number>
        </el-form-item>

    </div>
</template>

<script>
export default {
    name: "CoolingCoolingPump",
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