<template>
    <div class="w-full h-full flex items-center justify-between">
        <div class=" h-full text-base flex flex-col items-center justify-between gap-7 mx-2">
            <span>热感觉</span>
            <span>PMV值</span>
        </div>
        <div class="pmv-scale">
            <!-- 上方标签 -->
            <div class="labels top">
                <span v-for="t in topLabels" :key="t">{{ t }}</span>
            </div>

            <!-- 渐变条 -->
            <div class="bar">
                <!-- 指针 -->
                <div class="indicator" :style="{
                    left: indicatorPosition,
                    background: indicatorGradient,
                    '--arrow-color': indicatorColor
                }">{{ pmv }}
                </div>
            </div>

            <!-- 下方 PMV 数值 -->
            <div class="labels bottom">
                <span v-for="b in bottomLabels" :key="b">{{ b }}</span>
            </div>
        </div>
    </div>

</template>

<script>
export default {
    name: "PMVScale",
    props: {
        pmv: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            topLabels: ["冷", "凉", "微凉", "适中", "微暖", "暖", "热"],
            bottomLabels: ["-3", "-2", "-1", "0", "+1", "+2", "+3"],
            colors: [
                "#8e6ad8", // -3 冷
                "#5b7bd5", // -2
                "#3fa7d6", // -1
                "#58b368", // 0
                "#9bc53d", // +1
                "#f2c14e", // +2
                "#f78154"  // +3
            ]
        };
    },
    computed: {
        // 把 -3 ~ 3 映射成 0% ~ 100%
        indicatorPosition() {
            let value = Math.round(this.pmv);
            value = Math.max(-3, Math.min(3, value));

            const index = value + 3; // 转成 0~6
            return ((index + 0.5) / 7) * 100 + "%";
        },
        currentIndex() {
            let value = Math.round(this.pmv);
            value = Math.max(-3, Math.min(3, value));
            return value + 3;
        },
        indicatorColor() {
            return this.colors[this.currentIndex];
        },
        indicatorGradient() {
            const color = this.colors[this.currentIndex];

            return `linear-gradient(135deg, ${this.lighten(color, 15)}, ${color})`;
        }
    },
    methods: {
        lighten(color, percent) {
            const num = parseInt(color.replace("#", ""), 16);
            let r = (num >> 16) + percent;
            let g = ((num >> 8) & 0x00FF) + percent;
            let b = (num & 0x0000FF) + percent;

            r = r > 255 ? 255 : r;
            g = g > 255 ? 255 : g;
            b = b > 255 ? 255 : b;

            return `rgb(${r}, ${g}, ${b})`;
        }
    }
};
</script>

<style scoped>
.pmv-scale {
    width: calc(100% - 120px);
    /* max-width: 800px; */
    margin: 0 auto;
    font-family: sans-serif;
}

/* 标签 */
.labels {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    text-align: center;
    font-size: 14px;
}

.labels.top {
    margin-bottom: 10px;
}

.labels.bottom {
    margin-top: 10px;
    color: #666;
}

/* 渐变条 */
.bar {
    position: relative;
    height: 16px;
    /* border-radius: 8px; */
    background: linear-gradient(to right,
            #8e6ad8,
            #5b7bd5,
            #3fa7d6,
            #58b368,
            #9bc53d,
            #f2c14e,
            #f78154,
            #ff3b30);
    /* overflow: hidden; */
}

/* 分割线 */
.bar::after {
    content: "";
    position: absolute;
    inset: 0;
    background-image: repeating-linear-gradient(to right,
            transparent,
            transparent calc(100% / 7 - 1px),
            rgba(255, 255, 255, 0.6) calc(100% / 7 - 1px),
            rgba(255, 255, 255, 0.6) calc(100% / 7));
}

/* 指针 */
.indicator {
    position: absolute;
    bottom: -1px;
    transform: translateX(-50%);
    transition: left 0.4s cubic-bezier(0.4, 1.6, 0.6, 1);

    /* background: linear-gradient(135deg, #ffb347, #ff8c42); */
    color: #fff;
    font-weight: bold;
    font-size: 14px;
    border-radius: 6px;
    padding: 3px 14px;

    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

/* 小三角 */
.indicator::after {
    content: "";
    position: absolute;
    left: 50%;
    bottom: -6px;
    transform: translateX(-50%);

    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    /* border-top: 6px solid #ff8c42; */
    border-top: 6px solid var(--arrow-color);
}
</style>