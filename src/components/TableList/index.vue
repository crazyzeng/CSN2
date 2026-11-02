<script>
import QueryForm from './components/QueryForm/index.vue'
import Buttons from './components/Buttons/index.vue'
import TableList from './components/TableList/index.vue'
import Pagination from './components/Pagination/index.vue'

export default {
    name: 'Functional-TableList',
    functional: true,
    props: {
        /**
         * 查询条件的配置类别
         * 目前已有 el-input el-select el-date-picker 全面支持这三个组件的配置
         * 
         * formList Array |
         *      tag: String | el-input || el-select || el-date-picker
         *      label: String | 设置该项的名称
         *      modelName: String | 设置该项的变量名称
         *      defaultValue: * | 设置该项的默认值
         *      attribute: Object | 
         *          设置该项的属性
         *          例如：
         *          el-input || el-select  placeholder
         *          el-date-picker  format value-format placeholder
         *      children: Object | 
         *          设置该项的子类，目前只有 el-select 支持该配置
         *          tag: String | el-option
         *          label: String | 对应 dataArr 单个对象里面的key值
         *          value: String | 对应 dataArr 单个对象里面的key值
         *          attribute: Object | 
         *          dataArr: Arrar
         * 
         * onQuery: Function | 点击查询后触发
         *      @param {Object} formData 接受查询表单的值
         * onReset: Function | 点击重置后触发 | 有默认设置一般无需配置
         *      @param {Object} formData 接受查询表单的值
         * 
         * 示例： 如有新增 可配置 组件请把示例更新
         *   formList: [
         *       {
         *           tag: 'el-input',
         *           label: '名称',
         *           modelName: 'name',
         *           defaultValue: '',
         *           attribute: { placeholder: '请输入名称' },
         *       }, {
         *           tag: 'el-select',
         *           label: '类型',
         *           modelName: 'type',
         *           defaultValue: '',
         *           attribute: { placeholder: '请选择类型' },
         *           children: {
         *               tag: 'el-option',
         *               dataArr: [{id: 1, label: 'A', value: 'A'}],
         *               label: 'label',
         *               value: 'value',
         *               attribute: {}
         *           }
         *       }, {
         *           tag: 'el-date-picker',
         *           label: '开始时间',
         *           modelName: 'time',
         *           defaultValue: '',
         *           attribute: {
         *               format: 'yyyy-MM-dd',
         *               'value-format': 'yyyy-MM-dd',
         *               placeholder: '选择日期'
         *           }
         *       }
         *   ],
         *   onQuery(formData) {
         *       console.log('ajax', formData)
         *   },
         *   onReset(formData) {
         *       // 有默认设置，一般无需配置，如果有，请把formData的值清空后再做操作
         *   }
         * */
        queryForm: {
            type: Object,
            default() { return {} }
        },

        /**
         * 配置单独的按钮组
         * 
         * group：Boolean | 是否以 按钮组 显示 默认值false
         * float：Boolean | 是否以 按钮浮动 显示 默认值false
         * attribute：Object | 配置按钮的属性
         *      例如：
         *          circle：Boolean | 是否以 圆形 显示 
         *          round：Boolean | 是否以 圆角 显示 
         *          plain：Boolean | 是否以 主按钮 显示 
         * buttonList：Array | 按钮配置数组
         *      id: String | key值
         *      text: String | 按钮文字
         *      type：String | 按钮类型
         *      icon: String | 按钮图标
         *      onClick：Function | 按钮点击事件
         * 示例：
         * buttons: {
         *      group: true,
         *      circle: false,
         *      round: false,
         *      plain: false,
         *      float: 'right',
         *      buttonList: [
         *          {
         *              id: '1',
         *              text: '新增',
         *              type: 'primary',
         *              icon: '',
         *              onClick() {
         *                  console.log('新增')
         *              }
         *          }
         *      ]
         *  }
         * */
        buttons: {
            type: Object,
            default() { return {} }
        },

        /**
         * 配置 table list
         * 
         * tableData: Array | 表格数据
         * tableConfig：Object | 表格配置
         *      width: String | 表格宽度
         *      attribute: Object | 表格属性
         *      handleCurrentChange： Function | 表格单选事件 注：需要在表格属性里面配置单选设置
         *      handleSelectionChange: Function | 表格多选事件： 注：需要在表格行配置里面添加selection
         *      handleCurrentChange & handleSelectionChange @param {Array} 被选中的数组
         * columnConfig：Array | 表格行配置
         *      id: String | Number 唯一标识符
         *      type: String | selection & index & btn 分别对应多选 序号 操作按钮 操作按钮请放最后一个
         *      prop： String | 参数名
         *      attribute： String | 属性
         *      buttonList：Array | 数组
         *          id: String | Number 唯一标识符
         *          text： String | 按钮类型
         *          icon： String | 按钮图标
         *          onClick: Function | 按钮点击事件
         *              @param {Object} scope 表格数据
         *
         * 示例：
         * tableData: [
         *      {name: 'aaa'},
         *      {name: 'bbb'},
         * ]
         * 
         * tableConfig: {
         *      width: '100%',
         *      attribute: {
         *          border: true,
         *          'max-height': '500px'
         *      },
         *      handleCurrentChange(data) {
         *          console.log('handleCurrentChange: ',data)
         *      },
         *      handleSelectionChange(data) {
         *          console.log('handleSelectionChange: ',data)
         *      }
         * }
         * 
         * columnConfig: [
         *      {
         *          id: 1,
         *          type: 'selection',
         *          attribute: {}
         *      },
         *      {
         *          id: 2,
         *          type: 'index',
         *          label: '序号',
         *          attribute: {}
         *      },
         *      {
         *          id: 3,
         *          label: '名称',
         *          prop: 'name',
         *          attribute: {}
         *      },
         *      {
         *          id: 4,
         *          type: 'btn',
         *          label: '按钮',
         *          attribute: {
         *              width: 100
         *          },
         *          buttonList: [
         *              {
         *                  id: 41,
         *                  text: '删除',
         *                  type: 'warning',
         *                  icon: 'el-icon-delete',
         *                  onClick(scope) {
         *                      console.log('删除')
         *                  }
         *              }
         *          ]
         *      }
         * ]
         *  
         * */

        tableList: {
            type: Object,
            default() { return {} }
        },

        /**
         * 分页配置
         * 
         * paging：Object |
         *      pageNum: Number 第几页
         *      pageSize: Number 单页多少数据
         *      total: Numebr 总页数
         * layout：String | 分页布局 详情看element-ui文档
         * onChange：Function | 分页 发生变化触发
         *      @param {Object} 返回当前的分页数据
        */
        pagination: {
            type: Object,
            default() { return {} }
        }
    },

    render(h, context) {

        const { props: { queryForm, buttons, tableList, pagination } } = context
        const children = []

        if (Object.keys(queryForm).length > 0) children.push(h(QueryForm, { props: queryForm }))
        if (Object.keys(buttons).length > 0) children.push(h(Buttons, { props: buttons }))
        if (Object.keys(tableList).length > 0) children.push(h(TableList, { props: tableList }))
        if (Object.keys(pagination).length > 0) children.push(h(Pagination, { props: pagination }))

        if (children.length <= 0) return h('div', {})
        else return h('div', {}, children)
    }
}
</script>