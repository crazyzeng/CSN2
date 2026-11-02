<script>
export default {
    name: 'MenuItem',
    functional: true,
    props: {
        icon: { type: String, default: '' },
        title: { type: String, default: '' }
    },
    render(h, context) {
        const { icon, title } = context.props
        const vnodes = []
        // 原实现使用 JSX 语法书写 render，迁移到 Vite 后改用 h() 等价实现，避免额外的 JSX 编译配置
        if (title) vnodes.push(h('span', { slot: 'title' }, title))
        if (icon) vnodes.push(h('i', { class: 'iconfont customFont ' + icon }))
        return vnodes
    }
}
</script>
