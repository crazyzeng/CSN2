<template>
    <div>
        <el-form-item label="日照运营时间" label-width="155px">
            <el-time-picker is-range v-model="model.sunRunningTime" value-format="HH:mm" format="HH:mm"
                range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围"
                style="width: 200px;">
            </el-time-picker>
        </el-form-item>
        <el-form-item label="夏秋季日照时间" label-width="155px">
            <el-time-picker is-range v-model="model.summerRunningTime" value-format="HH:mm" format="HH:mm"
                range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围"
                style="width: 200px;">
            </el-time-picker>
        </el-form-item>
        <el-form-item label="冬春季日照时间" label-width="155px">
            <el-time-picker is-range v-model="model.winterRunningTime" value-format="HH:mm" format="HH:mm"
                range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围"
                style="width: 200px;">
            </el-time-picker>
        </el-form-item>
        <el-form-item label="早晨照明设定挡位" label-width="155px">
            <el-slider v-model="model.morningSetting" :marks="marks" style="width: 300px;">
            </el-slider>
        </el-form-item>
        <el-form-item label="日间照明设定挡位" label-width="155px">
            <el-slider v-model="model.daySetting" :marks="marks" style="width: 300px;">
            </el-slider>
        </el-form-item>
        <el-form-item label="夜间照明设定挡位" label-width="155px">
            <el-slider v-model="model.nightSetting" :marks="marks" style="width: 300px;">
            </el-slider>
        </el-form-item>
        <el-form-item label="深夜照明设定挡位" label-width="155px">
            <el-slider v-model="model.darkNightSetting" :marks="marks" style="width: 300px;">
            </el-slider>
        </el-form-item>
    </div>
</template>

<script>
export default {
    name: "OutdoorLighting",
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
    },
    data() {
        return {
            marks: {
                0: '0%',
                25: '25%',
                50: '50%',
                75: '75%',
                100: '100%',
                // 25: {
                //     style: {
                //         color: '#1989FA'
                //     },
                //     label: this.$createElement('strong', '25%')
                // }
            }
        }
    }
}
</script>