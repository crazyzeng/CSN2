import { resetFormData } from '@/utils'

export default {
    methods: {
        query() {
            this.$emit('query', this.formData)
        },

        reset() {
            resetFormData(this.formData)
            this.$emit('reset')
        },

        append() {
            this.$emit('append')
        },

        edit() {
            this.$emit('edit')
        },

        dels() {
            this.$emit('dels')
        },

        exportData() {
            this.$emit('exportData')
        },
    },
}