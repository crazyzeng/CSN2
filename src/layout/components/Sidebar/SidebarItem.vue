<template>
    <div>
        <!-- 有子菜单 -->
        <el-submenu v-if="item.children && item.children.length" :index="getMenuIndex(item)"
            :class="['menu-level-' + level]">
            <template #title>
                <span>{{ item.meta.title }}</span>
            </template>

            <sidebar-item v-for="child in item.children" :key="child._key" :item="child" :level="level + 1" />
        </el-submenu>

        <!-- 没有子菜单 -->
        <el-menu-item v-else :index="getMenuIndex(item)" :class="['menu-level-' + level]">
            <span>{{ item.meta.title }}</span>
        </el-menu-item>
    </div>
</template>

<script>
import Item from './Item.vue';

export default {
    name: 'SidebarItem',
    components: { Item },
    props: {
        item: Object,
        level: {
            type: Number,
            default: 1
        },
        parentPath: {
            type: String,
            default: ''
        }
    },
    data: function () {
        return {
            // iconUrl: home,
            hiddenMenu: [
                {
                    name: '告警详情',
                },
                {
                    name: '实时巡检轨迹',
                },
            ],
        };
    },
    methods: {
        // 统一路径
        getMenuIndex(item) {
            if (item.path) {
                return item.path.startsWith('/')
                    ? item.path
                    : '/' + item.path
            }
            return item._key
        },
        isHidden(name) {
            const tempObj = this.hiddenMenu.find((v) => v.name === name);
            return !tempObj ? true : false;
        },
        // 判断是否拥有子元素
        hasOneShowingChild(children = [], parent) {
            return Array.isArray(children) && children.length > 0;
        },

        // 获取 type 是普通菜单的菜单数据
        getChildMenu(arr) {
            let myArr = [];
            const white = [undefined, 'menu_lv.1_1', 'menu_lv.1_2'];
            arr.forEach((v) => {
                if (white.includes(v.menuType)) myArr.push(v);
            });
            return myArr;
        },
        handleLeftMenuClick(item) { },
    },
    watch: {},
};
</script>
<style lang="scss">
.el-submenu,
.el-menu-item {
    margin: 5px 0;
}

.el-submenu.menu-level-1,
.el-submenu.menu-level-2,
.el-submenu.menu-level-3,
.el-submenu.menu-level-4 {
    border-radius: 10px !important;

    &:hover>.el-submenu__title {
        background-color: #4c79ff !important;
        color: #fff;
        border-radius: 10px;
    }
}

.el-submenu__title {
    border-radius: 10px;

    &:hover,
    &:focus,
    &:active {
        i {
            color: #fff;
        }
    }
}

.el-submenu.menu-level-1.is-active>.el-submenu__title {
    background-color: #4c79ff !important;
    color: #fff;
    border-radius: 10px;

    i {
        color: #fff;
    }
}

.is-opened>.el-submenu__title {
    background-color: #4c79ff !important;
    color: #fff;
    border-radius: 10px;

    i {
        color: #fff;
    }
}

.el-submenu.menu-level-1.is-opened>.el-submenu__title {
    background-color: #4c79ff !important;
    color: #fff;
    border-radius: 10px;
}

.el-menu-item.menu-level-1 {
    &:hover {
        background-color: #4c79ff !important;
        color: #fff;
        border-radius: 10px;
    }
}

.el-menu-item {
    border-radius: 10px;
}

.el-menu-item.menu-level-1.is-active {
    background-color: #4c79ff !important;
    color: #fff;
}

.el-menu-item.menu-level-2.el-menu-item:focus {
    background-color: transparent !important;
}

.el-menu-item.menu-level-2.el-menu-item:hover,
.el-menu-item.menu-level-2.el-menu-item:focus {
    background-color: transparent !important;
    color: #409eff;
}
.el-menu-item.menu-level-3.el-menu-item:hover,
.el-menu-item.menu-level-3.el-menu-item:focus {
    background-color: transparent !important;
    color: #409eff;
}
.el-menu-item.menu-level-4.el-menu-item:hover,
.el-menu-item.menu-level-4.el-menu-item:focus {
    background-color: transparent !important;
    color: #409eff;
}

.el-submenu.menu-level-1 >.el-submenu__title {
    padding-left: 10px !important;
}
.el-submenu.menu-level-2 >.el-submenu__title {
    padding-left: 25px !important;
}
.el-submenu.menu-level-3 >.el-submenu__title {
    padding-left: 40px !important;
}
.el-menu-item.menu-level-4 {
    padding-left: 50px !important;
}
.el-submenu__icon-arrow {
    right: 15px;
}
.el-menu-item.menu-level-2 {
    padding-left: 25px !important;
}
.el-menu-item.menu-level-3 {
    padding-left: 40px !important;
}
.el-menu-item.menu-level-4 {
    // height: auto;
    line-height: normal;
    white-space: wrap;
    display: flex;
    align-items: center;
    padding-right: 30px !important;
}

</style>
