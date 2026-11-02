<template>
  <el-dialog title="" :visible.sync="dialogVisible" width="1680px" :before-close="handleClose" center>
    <section class="content_box">
      <div class="left_form_box">
        <p class="box_title"><span>设备基础信息(必填)</span></p>
        <el-form ref="basicFormRef" :inline="true" :rules="leftRules" :model="basicFormData" class="">
          <el-form-item label="设备编号" prop="equipmentNumber">
            <el-input
              v-model="basicFormData.equipmentNumber"
              ref="equipmentNumRef"
              :disabled="isEdit"
              @blur="checkNumber"
              placeholder="请输入设备编号"
            ></el-input>
          </el-form-item>
          <el-form-item label="设备名称" prop="equipmentName">
            <el-input v-model="basicFormData.equipmentName" placeholder="请输入设备名称"></el-input>
          </el-form-item>
          <el-form-item label="设备类型" prop="equipmentType">
            <el-select v-model="basicFormData.equipmentType">
              <el-option v-for="item in deviceTypeOptions" :key="item.itemValue" :label="item.itemText" :value="item.itemValue"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="设备区域" prop="equipmentLocation">
            <el-input v-model="basicFormData.equipmentLocation" placeholder="请输入设备区域"></el-input>
          </el-form-item>
          <el-form-item label="系统类型" prop="equipmentSystem">
            <el-select v-model="basicFormData.equipmentSystem">
              <el-option v-for="item in systemTypeList" :key="item.itemValue" :label="item.itemText" :value="item.itemValue"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="安装位置" prop="installLocation">
            <el-input v-model="basicFormData.installLocation" placeholder="请输入设备安装位置"></el-input>
          </el-form-item>
          <el-form-item label="使用状态" prop="equipmentStatus">
            <el-select v-model="basicFormData.equipmentStatus">
              <el-option v-for="item in deviceStatusList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="安装日期" prop="installDate">
            <el-date-picker
              v-model="basicFormData.installDate"
              type="date"
              
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="设备图片">
            <el-upload
              class="avatar-uploader"
              action="#"
              ref="upload"
              :show-file-list="false"
              :http-request="customUpload"
              :on-success="handleAvatarSuccess"
              accept=".jpg,.jpeg,.png,.gif"
              :limit="1"
            >
              <img v-if="imageUrl" :src="imageUrl" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-form>
      </div>
      <div class="right_form_box">
        <p class="box_title"><span>设备拓展信息(选填)</span></p>
        <el-form ref="expandForm" :inline="true" :model="expandFormData" :rules="expandFormRules" class="">
          <el-row>
            <p class="form_label"><span></span><span>设备出厂信息</span></p>
            <el-col :span="6">
              <el-form-item label="品牌">
                <el-input v-model="expandFormData.brand"  placeholder="请输入品牌"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="规格型号">
                <el-input v-model="expandFormData.specification"  placeholder="请输入规格型号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="使用年限" prop="serviceLife">
                <el-input v-model="expandFormData.serviceLife"  placeholder="请输入使用年限"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <p class="form_label"><span></span><span>设备维保信息</span></p>
            <el-col :span="6">
              <el-form-item label="维保单位">
                <el-input v-model="expandFormData.maintenanceUnit"  placeholder="请输入维保单位"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="负责人">
                <el-input v-model="expandFormData.dutyPerson"  placeholder="请输入负责人"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="联系方式">
                <el-input v-model="expandFormData.contact"  placeholder="请输入联系方式"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="维保期限" prop="maintenancePeriod">
                <el-input v-model="expandFormData.maintenancePeriod"  placeholder="请输入维保期限"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <p class="form_label"><span></span><span>设备购置信息</span></p>
            <el-col :span="6">
              <el-form-item label="购入产地">
                <el-input v-model="expandFormData.originOfPurchase"  placeholder="请输入购入产地"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="购入日期">
                <el-date-picker
                  v-model="expandFormData.purchaseDate"
                  
                  type="date"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="制造商">
                <el-input v-model="expandFormData.producer"  placeholder="请输入制造商"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <p class="form_label"><span></span><span>设备归属信息</span></p>
            <el-col :span="6">
              <el-form-item label="所属部门">
                <el-input v-model="expandFormData.department"  placeholder="请输入所属部门"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="所属子专业">
                <el-input v-model="expandFormData.subMajor"  placeholder="请输入所属子专业"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="所属系统">
                <el-input v-model="expandFormData.system"  placeholder="请输入所属系统"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="所属标段">
                <el-input v-model="expandFormData.section"  placeholder="请输入所属标段"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <p class="form_label"><span></span><span>设备安装信息</span></p>
            <el-col :span="6">
              <el-form-item label="安装单位">
                <el-input v-model="expandFormData.installationUnit"  placeholder="请输入安装单位"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </section>
    <span slot="footer" class="dialog-footer">
      <el-button  round type="primary" @click="handleClose">返 回</el-button>
      <el-button  round type="primary" @click="submit">保 存</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { getDict } from "@/api/common.js";
import { updateAccountList, addAccountList, checkEquipmentNumber } from "@/api/account-list.js";
import { deepClone } from "@/utils/index";
import { uploadTempFile, getUploadFile } from "@/api/file.js";
import imgBg from "@/assets/img/bills/img_bg.png";
export default {
  props: {},
  data() {
    var validateNumber = (rule, value, callback) => {
      const reg = /^[0-9]+(.[0-9]{1,2})?$/;
      if (value === null || value === "") {
        callback();
      } else if (value > 100) {
        callback(new Error("最大年限小于100"));
      } else if (!reg.test(value)) {
        callback(new Error("输入格式不正确"));
      } else {
        callback();
      }
    };
    return {
      dialogVisible: false,
      deviceTypeOptions: [],
      systemTypeList: [],
      deviceStatusList: [
        {
          label: "使用中",
          value: 0,
        },
        {
          label: "报废",
          value: 7,
        },
      ],
      detailData: {},
      imageUrl: imgBg,
      basicFormData: {
        equipmentName: "",
        equipmentNumber: "",
        equipmentType: "",
        installLocation: "",
        equipmentStatus: "",
        installDate: "",
        equipmentLocation: "",
      },
      expandFormData: {
        brand: "",
        specification: "",
        serviceLife: "",
        maintenanceUnit: "",
        dutyPerson: "",
        contact: "",
        maintenancePeriod: "",
        originOfPurchase: "",
        purchaseDate: "",
        producer: "",
        department: "",
        subMajor: "",
        system: "",
        section: "",
        installationUnit: "",
      },
      leftRules: {
        equipmentName: [{ required: true, message: "请输入设备名称", trigger: "blur" }],
        equipmentNumber: [{ required: true, message: "请输入设备编号", trigger: "blur" }],
        equipmentType: [{ required: true, message: "请选择设备类型", trigger: "change" }],
        equipmentSystem: [{ required: true, message: "请选择系统类型", trigger: "change" }],
        equipmentStatus: [{ required: true, message: "请选择设备使用状态", trigger: "change" }],
        installLocation: [{ required: true, message: "请输入设备安装位置", trigger: "blur" }],
        installDate: [{ required: true, message: "请选择安装日期", trigger: "change" }],
        equipmentLocation: [{ required: true, message: "请输入设备区域", trigger: "blur" }],
      },
      expandFormRules: {
        serviceLife: [{ validator: validateNumber, trigger: "blur" }],
        maintenancePeriod: [{ validator: validateNumber, trigger: "blur" }],
      },
      fileObj: {},
      isEdit: false,
    };
  },
  computed: {
    title: function () {
      return "编辑";
    },
  },
  mounted() {
    this.initData();
  },
  methods: {
    initData() {
      getDict("equipment_type").then((res) => {
        if (res.code === 200 && res.data.length > 0) this.deviceTypeOptions = res.data;
      });
      getDict("system_type").then((res) => {
        if (res.code === 200 && res.data.length > 0) this.systemTypeList = res.data;
      });
    },
    open(data) {
      if (Object.keys(data).length > 0) {
        this.isEdit = true;
        for (let k in data) {
          for (let key in this.basicFormData) {
            this.basicFormData[k] = data[k];
          }
        }
        for (let m in data.equipmentDetail) {
          this.expandFormData[m] = data.equipmentDetail[m];
        }
      } else {
        this.isEdit = false;
        for (let k in this.expandFormData) this.expandFormData[k] = "";
      }
      this.detailData = data;
      this.dialogVisible = true;
      this.getImgById(this.detailData.url);
      this.$nextTick(() => {
        this.$refs.basicFormRef?.clearValidate();
      });
    },
    getImgById(id) {
      getUploadFile(id).then((res) => {
        if (res.code === 200 && res.data.length > 0) {
          if (process.env.NODE_ENV === "development") {
            this.imageUrl = `http://192.168.2.132:9000${res.data[0].fileUrl}`;
          } else {
            this.imageUrl = `${window.location.host}/${res.data[0].fileUrl}`;
          }
        }
      });
    },
    handleClose() {
      for (let k in this.basicFormData) this.basicFormData[k] = "";
      for (let k in this.expandFormData) this.expandFormData[k] = "";
      this.dialogVisible = false;
      this.imageUrl = imgBg;
    },
    submit() {
      this.$refs.basicFormRef?.validate((valid) => {
        if (valid) {
          this.$refs.expandForm?.validate((expandValid) => {
            if (expandValid) {
              let tempUploads = [];
              if (Object.keys(this.fileObj).length > 0) {
                tempUploads.push(this.fileObj);
              }
              if (Object.keys(this.detailData).length > 0) {
                const tempObj = { ...this.basicFormData };
                tempObj.equipmentDetail = this.expandFormData;
                tempObj.fileUploads = tempUploads;
                updateAccountList(tempObj).then((res) => {
                  if (res.code === 200) {
                    this.$message.success("编辑成功");
                    this.$emit("success");
                    this.handleClose();
                  }
                });
              } else {
                const tempObj = deepClone(this.basicFormData);
                tempObj.equipmentDetail = this.expandFormData;
                tempObj.fileUploads = tempUploads;
                addAccountList(tempObj).then((res) => {
                  if (res.code === 200) {
                    this.$message.success("新增成功");
                    this.$emit("success");
                    this.handleClose();
                  }
                });
              }
            }
          });
        }
      });
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      this.$refs.upload.clearFiles();
    },
    checkNumber() {
      if (this.basicFormData.equipmentNumber.trim() !== "") {
        checkEquipmentNumber(this.basicFormData.equipmentNumber).then((res) => {
          if (res.code === 200 && !res.data) {
            this.$message.info("设备编号重复，请重新输入");
            this.basicFormData.equipmentNumber = "";
            this.$refs.equipmentNumRef.focus();
          }
        });
      }
    },
    async customUpload(params) {
      const res = await uploadTempFile(params.file);
      if (res.code === 200 && Object.keys(res.data).length > 0) {
        this.fileObj = res.data;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-dialog {
  .el-dialog__header {
    height: 40px;
  }

  .el-dialog__body {
    padding-top: 10px;
  }
}

::v-deep .el-upload {
  width: 100px;
  height: 100px px;
  line-height: 100px;
  border: 1px dashed #707070;
  font-size: 20px;
}

.box_title {
  margin-bottom: 30px;
  padding-left: 15px;

  > span:nth-child(1) {
    display: inline-block;
    font-size: 20px;
    font-weight: bold;
    color: #000;
    vertical-align: middle;
  }
}

.content_box {
  display: flex;

  .left_form_box {
    width: 320px;
    border-right: 1px solid #355271;
    padding-left: 16px;
  }

  .right_form_box {
    width: calc(100% - 320px);
    color: #000;
    padding-left: 25px;

    .form_label {
      margin-bottom: 20px;

      > span:first-child {
        display: inline-block;
        width: 4px;
        height: 4px;
        border-radius: 2px;
        color: #000;
        background-color: #fff;
        vertical-align: middle;
        margin-right: 10px;
      }

      > span:nth-child(2) {
        vertical-align: middle;
        display: inline-block;
      }
    }
  }
}
</style>
