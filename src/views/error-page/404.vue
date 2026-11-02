<template>
    <div class="th-404">
        <img width="90%" :src="image404" alt="404">
    </div>
</template>

<script>
    import image404 from '@/assets/error-page/404.png'

    export default {
        name: 'ErrorPage404',
        props: {},
        data() {
            return {
                image404
            }
        },
        created() {},
        mounted() {},
        methods: {}
    }
</script>

<style lang="scss" scoped>
    .th-404 {

        height: 100%;
        text-align: center;

        > img {
            height: 100%;
            display: inline-block;
        }
    }
</style>
