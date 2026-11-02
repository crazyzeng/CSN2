<template>
    <el-form
        :model="loginForm"
        :rules="loginRules"
        ref="loginForm"
        class="th-login-form"
        autocomplete="on"
        label-position="left"
        label-width="90px">

        <h3>用户登录</h3>

        <el-form-item label="用户名" prop="username">
            <span slot="label"> <i class="th-icon el-icon-user-solid" />用户名 </span>
            <el-input v-model="loginForm.username" placeholder="用户名"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
            <span slot="label"> <i class="th-icon el-icon-lock" />密码 </span>
            <el-input v-model="loginForm.password" show-password placeholder="密码"></el-input>
        </el-form-item>

        <el-form-item label="验证码" prop="validcode">
            <span slot="label"> <i class="th-icon el-icon-link" />验证码 </span>
            <el-row>
                <el-col :span="15">
                    <el-input v-model="loginForm.validcode" placeholder="验证码"></el-input>
                </el-col>
                <el-col :span="8" :offset="1">
                    <valid-code width="100%" height="46px" :value.sync="validcode" />
                </el-col>
            </el-row>
        </el-form-item>

        <el-form-item>
            <el-button
                class="th-login-submit"
                type="primary"
                :loading="loading"
                @click="handleLogin">登录</el-button>
        </el-form-item>
    </el-form>
</template>

<script>

    import ValidCode from '../ValidCode/index.vue'
    import LoginHandle from '../../mixin/LoginHandle'

    export default {
        name: 'BlueLogin',
        components: {ValidCode},
        mixins: [LoginHandle],
        data() { return {} },
        created() {},
        mounted() {},
        methods: {}
    }
</script>

<style lang="scss" scoped>

    ::v-deep .el-input__inner {

        height: 46px !important;
        background-color: transparent;
    }

    ::v-deep .el-form-item__label {

        line-height: 46px !important;
    }

    .th-login-submit {

        position: absolute;
        left: -80px;
        width: calc(100% + 80px);
        height: 46px;
        color: white;
        font-size: 16px;
        letter-spacing: 10px;
        background-color: $light-blue;
        box-shadow: 0 0 10px #00ffff,
                    0 0 20px #00ffff;

        &:hover { color: white; }

        &:active,
        &:focus { color: inherit}
    }

    .th-icon {

        font-size: 18px;
        padding-right: 6px;
        vertical-align: text-bottom;
    }

    .th-login-form {

        width: 600px;
        height: 400px;
        padding: 42px 112px;
        border: 2px solid $light-blue;
        border-radius: 10px;
        background-color: rgba(#00ffff, .1);

        > h3 {

            margin: 0;
            padding-bottom: 28px;
            line-height: 1;
            font-size: 20px;
            font-weight: 400;
            text-align: center;
        }
    }
</style>
