<template>
    <el-container class="theme-bg" direction="vertical">
        <head-nav v-if="headerShow" class="header"></head-nav>
        <el-container>
            <!-- <section class="custom_title">{{ $route.meta.title }}</section> -->
            <left-nav v-if="sidebarShow"></left-nav>
            <el-main class="th-main" :class="{ 'ml16': !sidebarShow }">
                <div class="theme-main">
                    <!-- <transition name="slide-fade"> -->
                    <router-view :key="$route.path"></router-view>
                    <!-- </transition> -->
                </div>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
import HeadNav from './components/Header/index.vue';
import LeftNav from './components/Sidebar/index.vue';

export default {
    name: 'Layout',
    components: { HeadNav, LeftNav },
    created: function () { console.log(this.$route) },
    computed: {
        headerShow() { return this.$store.getters.headerFlag },
        sidebarShow() { return this.$store.getters.sidebarFlag },
    },
}
</script>

<style lang="scss" scoped>
.custom_title {
    height: 50px;
    line-height: 50px;
    width: 200px;
    position: absolute;
    left: 15px;
    font-size: 20px;
    font-weight: bold;
    background-image: linear-gradient(180deg, #d3effa, #3990df);
    background-clip: text;
    color: transparent;
}

.theme-bg {
    background-color: #e9edf8;
    // background-image: url('@/assets/theme/bg.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-position: 100% 100%;
}

.header {
    background-image: url('@/assets/header/headerBg.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-position: 100% 100%;
}

.th-main {
    position: relative;
    padding: 0px 20px 20px 20px;
    overflow: hidden;
    // overflow: auto;
    @include scrollBar
}

.theme-main {
    padding: 0;
    // overflow: hidden;
    // overflow: auto;
    border-radius: 10px 10px 0 0;
    @include scrollBar;

    >div {
        // min-width: 1280px;

    }
}
</style>
