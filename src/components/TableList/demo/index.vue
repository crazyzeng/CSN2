<template>
    <table-list
        :query-form="queryForm"
        :buttons="buttons"
        :table-list="tableList"
        :pagination="pagination"></table-list>
</template>

<script>

    import TableList from '@/components/TableList/index.vue'

    export default {
        name: 'home',
        props: {},
        components: {
            TableList,
        },
        data() {
            return {

                /* 查询配置 */
                queryForm: {
                    formList: [
                        {
                            tag: 'el-input',
                            label: '名称',
                            modelName: 'name',
                            defaultValue: '',
                            attribute: { placeholder: '请输入名称' },
                        }, {
                            tag: 'el-select',
                            label: '类型',
                            modelName: 'type',
                            defaultValue: '',
                            attribute: { placeholder: '请选择类型' },
                            children: {
                                tag: 'el-option',
                                label: 'label',
                                value: 'value',
                                dataArr: [{id: 1, label: 'A', value: 'A'}],
                                attribute: {}
                            }
                        }, {
                            tag: 'el-date-picker',
                            label: '开始时间',
                            modelName: 'time',
                            defaultValue: '',
                            attribute: {
                                format: 'yyyy-MM-dd',
                                'value-format': 'yyyy-MM-dd',
                                placeholder: '选择日期'
                            }
                        }
                    ],
                    onQuery(data) {
                        console.log('ajax', data)
                    },
                    // onReset(formData) {

                    // }
                },
                /* 按钮配置 */
                buttons: {
                    group: true,
                    float: 'right',
                    attribute: {
                        circle: false,
                        round: false,
                        plain: false,
                    },
                    buttonList: [
                        {
                            id: '1',
                            text: '新增',
                            type: 'primary',
                            icon: 'el-icon-edit',
                            onClick() {
                                console.log('新增')
                            }
                        }, 
                        {
                            id: '2',
                            text: '删除',
                            type: 'warning',
                            icon: 'el-icon-delete',
                            onClick() {
                                console.log('删除')
                            }
                        }
                    ]
                },
                /* 表格列表配置 */
                tableList: {
                    tableData: [
                        {name: 'aaa'},
                        {name: 'bbb'}
                    ],
                    tableConfig: {
                        width: '100%',
                        attribute: {
                            border: true,
                            'max-height': '500px'
                        },
                        handleCurrentChange(a, b, c, d) {
                            console.log('handleCurrentChange: ',a, b, c, d)
                        },
                        handleSelectionChange(data) {
                            console.log('handleSelectionChange: ',data)
                        }
                    },
                    columnConfig: [
                        {
                            id: 1,
                            type: 'selection',
                            attribute: {}
                        },
                        {
                            id: 2,
                            type: 'index',
                            label: '序号',
                            attribute: {}
                        },
                        {
                            id: 3,
                            label: '名称',
                            prop: 'name',
                            attribute: {}
                        },
                        {
                            id: 4,
                            type: 'btn',
                            label: '按钮',
                            attribute: {
                                width: 100
                            },
                            buttonList: [
                                {
                                    id: 41,
                                    text: '删除',
                                    type: 'warning',
                                    icon: 'el-icon-delete',
                                    if(scope) {
                                        return true
                                    },
                                    onClick(scope) {
                                        console.log('删除')
                                    }
                                }
                            ]
                        }
                    ]
                },

                pagination: {
                    paging: {
                        pageNum: 1,
                        pageSize: 10,
                        total: 0
                    },
                    layout: 'total, sizes, prev, pager, next, jumper',
                    onChange(paging) {
                        console.log('paging', paging)
                    }
                }
            }
        },
        created() {},
        mounted() {},
        methods: {}
    }
</script>

<style lang="scss" scoped>

</style>
