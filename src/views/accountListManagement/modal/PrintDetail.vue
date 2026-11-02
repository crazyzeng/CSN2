<template>
  <section class="dialog_content">
    <div class="printTarget" id="printTarget">
      <template v-for="(item, index) in printData" class="">
        <section class="item_box" :class="(index + 1) % 9 === 0 ? 'page-break' : ''">
          <qrcode-vue :value="item.equipmentNumber" :size="200" level="H" class="qrCode_box" />
          <table class="border-collapse border border-gray-500 qrCode-table">
            <colgroup>
              <col width="20mm">
              <col width="45mm">
            </colgroup>
            <tbody>
              <tr>
                <td class="border border-gray-500 text-center">
                  设备编号
                </td>
                <td class="border border-gray-500 text-center" style="height: 20px">
                  {{ item.equipmentNumber }}
                </td>
              </tr>
              <tr>
                <td class="border border-gray-500 text-center">
                  设备名称
                </td>
                <td class="border border-gray-500 text-center" style="height: 20px">
                  {{ item.equipmentName }}
                </td>
              </tr>
              <tr>
                <td class="border border-gray-500 text-center">
                  设备系统
                </td>
                <td class="border border-gray-500 text-center" style="height: 20px">
                  {{ equipmentSystemLabel(item.equipmentSystem) }}
                </td>
              </tr>
              <tr>
                <td class="border border-gray-500 text-center">
                  设备类型
                </td>
                <td class="border border-gray-500 text-center" style="height: 20px">
                  {{ equipmentTypeLabel(item.equipmentType) }}
                </td>
              </tr>
              <tr>
                <td class="border border-gray-500 text-center">
                  安装位置
                </td>
                <td class="border border-gray-500 text-center" style="height: 20px">
                  {{ item.installLocation }}
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </template>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button round type="primary" @click="submit">打 印</el-button>
      <el-button round @click="handleClose">取 消</el-button>
    </div>
  </section>
</template>
<script>
import print from 'print-js'
import QrcodeVue from "qrcode.vue";
import { getDict, dictTrans } from '@/api/common.js'
export default {
  props: {
    printData: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      systemTypeList: [],
      deviceTypeOptions: [],
    }
  },
  components: { QrcodeVue },
  mounted() {
    this.getDict()
  },
  methods: {
    getDict() {
      getDict('equipment_type').then(res => {
        if (res.code === 200 && res.data.length > 0)
          this.deviceTypeOptions = res.data
      })
      getDict('system_type').then(res => {
        if (res.code === 200 && res.data.length > 0)
          this.systemTypeList = res.data
      })
    },
    handleClose() {
      this.$emit('close')
    },
    equipmentTypeLabel(val) {
      return dictTrans(this.deviceTypeOptions, val)
    },
    equipmentSystemLabel(val) {
      return dictTrans(this.systemTypeList, val)
    },
    submit() {
      const style = `
          @page{
          size: A4 portrait;
          margin: auto 0mm;
          }
          @media print {
              .page-break {
                  clear: both;
                  page-break-after: always;
              }
          }
      }`
      print({
        printable: 'printTarget',
        type: 'html',
        font_size: '8px;',
        targetStyles: ['*'],
        style,
      })
    },
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-dialog {
  .el-dialog__body {
    padding-top: 10px;
  }
}

.dialog-footer {
  margin: 20px 0 0 0;
  text-align: center;
}

.dialog_content {
  width: 100%;
}

.page-break {
  page-break-after: always;
}

.printTarget {
  width: 100%;
  text-align: center;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;

  .item_box {
    width: 255px;
    border: 1px solid;
    border-color: #6B7280;
    color: #000;
    margin: 0 5px 10px 5px;
  }
}

.border-collapse {
  border-collapse: collapse;
  width: 100%;
}

.border {
  border-width: 1px;
  border-style: solid;
}

.border-gray-500 {
  --tw-border-opacity: 1;
  border-color: rgba(107, 114, 128, var(--tw-border-opacity));
}

.qrCode-table {
  table-layout: fixed;

  td {
    font-size: 8px;
  }
}

.qrCode_box {
  padding: 10px 0;
  background-color: rgb(255 255 255 / 10%);
}

.text-center {
  text-align: center;
}
</style>