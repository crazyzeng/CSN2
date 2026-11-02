
export default {
    methods: {
        // 处理
        handle(id) {
            this.$emit('handle', id)
        },

        // 编辑
        edit(id) {
            this.$emit('edit', id)
        },

        // 详情(查看)
        detail(id) {
            this.$emit('detail', id)
        },

        // 删除
        del(id) {
            this.$emit('delete', id)
        },

        // 启用
        start(id) {
            this.$emit('start', id)
        },

        // 禁用
        unstart(id) {
            this.$emit('unstart', id)
        },

        // 禁用
        video(id) {
            this.$emit('video', id)
        },

        //table勾选事件
        handleSelectionChange(val) {
            this.$emit('selectionChange', val)
        },
    },
}
