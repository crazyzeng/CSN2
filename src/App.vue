<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<script>
    export default {
        name: 'App',
        created() {
            document
                .querySelector('body')
                .className = `${this.$store.getters.themeType}-theme`
        },
    }
</script>
