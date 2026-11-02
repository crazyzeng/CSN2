<template>
    <div class="ValidCode disabled-select" :style="`width:${width}; height:${height}; border-color:${borderColor}`" @click="refreshCode">
        <span v-for="(item, index) in codeList" :key="index" :style="getStyle(item)">{{item.code}}</span>
    </div>
</template>

<script>
    export default {
        name: 'validCode',
        props: {
            width: {
                type: String,
                default: '100px'
            },
            height: {
                type: String,
                default: '40px'
            },
            borderColor: {
                type: String,
                default: 'white'
            },
            length: {
                type: Number,
                default: 4
            }
        },
        data () {
            return {
                codeList: []
            }
        },
        mounted () {
            this.createdCode()
        },
        methods: {

            refreshCode () {
                this.createdCode()
            },

            createdCode () {
                let len = this.length,
                    codeList = [],
                    chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz0123456789',
                    charsLen = chars.length
                // 生成
                for (let i = 0; i < len; i++) {
                    let rgb = [Math.round(Math.random() * 220), Math.round(Math.random() * 240), Math.round(Math.random() * 200)]
                    codeList.push({
                        code: chars.charAt(Math.floor(Math.random() * charsLen)),
                        color: `rgb(${rgb})`,
                        fontSize: `${Math.floor(Math.random() * 10) + 14}px`,
                        padding: `${Math.floor(Math.random() * 10)}px`,
                        transform: `rotate(${Math.floor(Math.random() * 90) - Math.floor(Math.random() * 90)}deg)`
                    })
                }
                // 指向
                this.codeList = codeList
                // 将当前数据派发出去
                this.$emit('update:value', codeList.map(item => item.code).join(''))
            },

            getStyle (data) {
                // return `color: ${data.color}; font-size: ${data.fontSize}; padding: ${data.padding}; transform: ${data.transform}`
                return `color:#979fc9; font-size: ${data.fontSize}; padding: ${data.padding}; transform: ${data.transform}`
            }
        }
    }
</script>

<style scoped lang="scss">
    .ValidCode{
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid white;
        border-radius: 5px;
        cursor: pointer;
        overflow: hidden;
        span{ display: inline-block; }
    }
</style>
