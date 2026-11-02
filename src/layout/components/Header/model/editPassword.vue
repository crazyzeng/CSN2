<template>
  <el-dialog title="修改密码" width="30%" :visible="dataFlag" @close="close">
    <el-form :model="formData" :rules="rules" :label-position="'right'" label-width="80px" ref="form">
      <!-- 修改密码 -->
      <el-form-item label="密码" prop="password">
        <el-input v-model="formData.password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <!-- 告警内容 -->
      <el-form-item label="重复密码" prop="checkPassword">
        <el-input v-model="formData.checkPassword" placeholder="请再次输入密码"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="modalCancel">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'ModelEditPassword',
  props: {
    dataFlag: {
      type: Boolean,
      required: false
    }
  },
  data() {

    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else if (value.length < 6) {
        callback(new Error('密码长度不小于6位'));
      } else {
        if (this.formData.checkPassword !== '') {
          this.$refs.form.validateField('checkPassword');
        }
        callback();
      }
    }

    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.formData.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    }

    return {
      formData: {
        password: '',
        checkPassword: ''
      },

      rules: {
        password: [{ validator: validatePass, trigger: 'blur' }],
        checkPassword: [{ validator: validatePass2, trigger: 'blur' }]
      }
    }
  },
  methods: {
    close() {
      this.formData.password = ''
      this.formData.checkPassword = ''
      this.$emit('close')
    },

    modalCancel() {
      this.close()
    },

    submit() {
      this.$refs.form.validate(flag => {
        if (flag) this.$emit('submit', this.formData.password)
      })
    }
  }
}
</script>

<style></style>
