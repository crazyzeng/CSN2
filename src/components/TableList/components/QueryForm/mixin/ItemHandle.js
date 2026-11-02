export default {
    model: {
        prop: 'modelValue',
        event: 'change'
    },
    props: {
        dataItem: {
            type: Object,
            default() { return {}}
        },
        modelValue: {
            type: String | Array | Object | Number,
            default: ''
        }
    },
    data() {
        return {
            value: '',
            attribute: {},
            children: {},
            childrenAttribute: {}
        }
    },
    watch: {
        value(newValue, oldValue) {
            this.$emit('change', this.value)
        },
        modelValue(newValue) {
            if(newValue != this.value) this.value = newValue
        }
    },
    mounted() {
        this.init()
    },
    methods: {
        init() {
            this.value = this.dataItem.defaultValue ? this.dataItem.defaultValue : ''
            this.attribute = this.dataItem.attribute ? this.dataItem.attribute : {}
        }
    },
}