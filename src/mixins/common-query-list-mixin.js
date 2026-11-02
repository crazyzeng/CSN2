import { consoleLog, resetFormData } from '@/utils'

import { findDic } from '@/api/dictionary'

export default {
    data() {
        return {
            // 查询数据 - 防止未定义报错
            queryData: {},
            // 表格数据
            tableData: [],
            // 表格选中数据
            tableSelection: [],
            // 分页数据
            paging: {
                pageNum: 1,
                pageSize: 10,
                total: 0
            },
        }
    },
    mounted() { this.init() },
    methods: {
        // 模板 - 防止没有定义报错
        init() {
            consoleLog('请定义 init 方法')
        },

        // 查询
        query(formData) {
            for(let i in formData) { this.queryData[i] = formData[i]; }
            this.paging.pageNum = 1
            this.getData(this.queryData);
        },

        // 重置
        reset() {
            this.paging.pageNum = 1
            resetFormData(this.queryData)
            this.getData(this.queryData)
        },

        // table 选中
        handleSelectionChange(data) {
            this.tableSelection = data
        },

        //分页条数改变事件
        sizeChange(val) {
            this.paging.pageSize = val;
            this.getData(this.queryData);
        },

        //分页页数改变事件
        pageChange(val) {
            this.paging.pageNum = val;
            this.getData(this.queryData);
        },

        // 获取数据 - 防止没有定义报错
        getData() {
            consoleLog('请定义 getData 方法')
        },

        // 获取字典数据
        getDictionaryData(options) {
            return findDic(options)
        }
    },
}
