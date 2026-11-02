<template>
    <div style="position: relative; width: 100%; height: 100%">
        <!-- 顶部标签页 + 站内切换工具栏，悬浮在 3D 画布之上 -->
        <div class="absolute top-4 z-10 flex flex-col">
            <el-tabs v-model="activeName" type="card" @tab-click="onTabChange">
                <el-tab-pane v-for="(item, index) in stationMenus" :key="item.value" :label="item.label"
                    :name="item.label">
                    <div class="flex">
                        <el-radio-group v-model="curStation" size="small" @change="onStationChange">
                            <el-radio-button v-for="(el, idx) in item.children" :key="el.value" :label="el.label">{{
                                el.label
                                }}</el-radio-button>
                        </el-radio-group>
                        <!-- 关闭图标：一键恢复到主模型视图 -->
                        <i v-if="item.children" class="el-icon-circle-close cursor-pointer ml-2" @click="reset"></i>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>

        <!-- three.js 画布挂载容器 -->
        <div ref="container" class="three-container"></div>

        <!-- 模型加载遮罩 -->
        <div v-if="loading" class="loading-mask">
            <div class="loading-box">
                <span class="text-[#327cec] mr-2">正在加载模型...</span>
                <i class="el-icon-loading text-lg"></i>
            </div>
        </div>
    </div>
</template>

<script>
import { initThree } from '@/utils/threeD/init.js';
import ThreeSelectionController from './selectionController';

export default {
    name: 'ThreeView',
    emits: ['change'],
    props: {
        // 站/区域菜单结构：用于渲染顶部标签与选择按钮
        stationMenus: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            // 选择控制器：负责高亮、隐藏、相机飞行等交互
            selector: null,
            // three 实例：initThree 返回的场景/相机/渲染器等控制句柄
            three: null,
            // 当前激活的标签页名
            activeName: '',
            // 当前选中的站/区域
            curStation: '',
            // 模型加载状态与进度
            loading: false,
            loadingProgress: 0,
        };
    },
    mounted() {
        this.$nextTick(async () => {
            // 初始化 three 场景（此处不自动加载模型，交由下方手动 loadModel）
            this.three = initThree(this.$refs.container, null, { enableHighlight: false });

            // 手动加载主模型，并开启加载遮罩
            this.loading = true;
            this.loadingProgress = 0;

            const model = await this.three.loadModel(import.meta.env.BASE_URL + 'models/CSN.glb', {}, (p) => {
                this.loadingProgress = p;
            });

            this.loading = false;

            const { scene, camera, controls, renderer } = this.three;

            // 创建选择控制器并登记主模型，供后续高亮/隐藏/聚焦使用
            this.selector = new ThreeSelectionController(scene, camera, controls, renderer);
            if (model) {
                this.selector.setModel(model);
            }
        });
    },
    watch: {
        // 当离开「能源站」标签时，通知父组件清空当前站信息
        activeName(newName, oldName) {
            if (oldName == '能源站' && newName !== '能源站') {
                this.$emit('change', '', '');
            }
        },
    },
    beforeDestroy() {
        // 组件销毁时释放 three 资源，避免 WebGL 内存泄漏
        if (this.three) {
            this.three.dispose?.();
            this.three = null;
        }
    },
    methods: {
        /**
         * 标签页切换：
         *  - 切到非「能源站」标签时，重新加载主模型；
         *  - 然后复位所有高亮/可见性，再按配置隐藏指定对象。
         */
        async onTabChange(val) {
            if (!this.selector) return;

            const tab = this.stationMenus.find((t) => t.label == val.name);
            if (!tab) return;

            // 离开能源站 -> 回到主模型
            if (val.name !== '能源站') {
                const model = await this.three.loadModel(import.meta.env.BASE_URL + 'models/CSN.glb');
                // 同步主模型到选择控制器，保证后续操作作用于当前模型
                this.selector.setModel(model);
            }

            // 复位高亮与可见性
            this.selector.resetAll();

            // 按标签配置隐藏指定对象
            if (tab.hideNames) {
                this.selector.handleHide(tab.hideNames);
            }
        },

        /**
         * 站/区域单选切换：
         *  - 通知父组件当前选中的标签与站；
         *  - 在能源站下可切换不同模型并聚焦；
         *  - 普通标签下仅按名称高亮对应模型区域。
         */
        async onStationChange(val) {
            if (!val || !this.selector) return;

            // 能源站标签：把「标签 + 站」透传给父组件；其它标签只透传标签
            if (this.activeName == '能源站') {
                this.$emit('change', this.activeName, val);
            } else {
                this.$emit('change', this.activeName, '');
            }

            const tab = this.stationMenus.find((t) => t.label == this.activeName);
            if (!tab) return;

            const item = tab.children.find((c) => c.label == val);
            if (!item) return;

            // 能源站：切换整站模型并聚焦
            if (this.activeName == '能源站' && item.modelUrl) {
                this.selector.clearHighlight();

                const model = await this.three.loadModel(item.modelUrl);
                this.selector.setModel(model);
                this.selector.fitToCurrentModel();

                return;
            }

            // 普通 tab：仅高亮指定模型区域
            if (item.modelName) {
                this.selector.selectByName(item.modelName);
            }
        },

        /**
         * 恢复初始状态：复位高亮与可见性、重载主模型、清空选中态并通知父组件。
         */
        async reset() {
            this.selector.resetAll();
            const model = await this.three.loadModel(import.meta.env.BASE_URL + 'models/CSN.glb');
            this.selector.setModel(model);

            this.activeName = '';
            this.curStation = '';
            this.$emit('change', '', '');
        },
    },
};
</script>

<style scoped lang="scss">
.three-container {
    width: 100%;
    height: 100%;
}

.loading-mask {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.2);
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: center;
}

.loading-box {
    background: #fff;
    padding: 20px 30px;
    border-radius: 8px;
    text-align: center;
    min-width: 200px;
    font-size: 12px;
    font-weight: bold;
    color: #327cec;
}
</style>
