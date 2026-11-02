<template>
    <el-row type="flex" justify="center" class="aa">
        <el-col class="left-img" :span="12" :offset="0">
            <img src="@/assets/theme/loginBg.png" alt="" />
        </el-col>
        <el-col class="right-img" :span="12" :offset="0">
            <!-- <img src="@/assets/theme/bg-right.png" alt="" /> -->
            <el-form :model="loginForm" :rules="loginRules" ref="loginForm" class="th-login-form" autocomplete="on"
                label-position="top">
                <el-form-item prop="username">
                    <div class="login_tit">登录</div>
                    <!-- <img class="logo_title" src="@/assets/theme/logo_title.png" alt="" /> -->
                    <!-- <p style="font-size: 40px;font-weight: bold;"><span>长沙南综合节能管理控制系统</span></p> -->
                </el-form-item>
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="loginForm.username" placeholder="请输入用户名">
                        <i slot="prefix" class="icon_i">
                            <img class="people_icon" src="@/assets/theme/login_people.png" alt="" />
                        </i>
                    </el-input>
                </el-form-item>

                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="loginForm.password" placeholder="请输入密码">
                        <i slot="prefix" class="icon_i">
                            <img class="lock_icon" src="@/assets/theme/login_lock.png" alt="" />
                        </i>
                    </el-input>
                </el-form-item>

                <el-form-item label="验证码" prop="validcode">
                    <el-row type="flex" class=" justify-between">
                        <el-input v-model="loginForm.validcode" class="validCode_input" placeholder="请输入验证码">
                            <i slot="prefix" class="icon_i">
                                <img class="validCode_icon" src="@/assets/theme/login_validCode.png" alt="" />
                            </i>
                        </el-input>
                        <valid-code class="validCodeC" width="100px" height="55px" border-color="#647f90"
                            :value.sync="validcode" />
                    </el-row>
                </el-form-item>

                <el-form-item>
                    <el-button class="th-login-submit" type="primary" :loading="loading" @click="handleLogin">
                        登录
                    </el-button>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
</template>

<script>
import ValidCode from '../ValidCode/index.vue';
import LoginHandle from '../../mixin/LoginHandle';

export default {
    name: 'WhiteLogin',
    components: { ValidCode },
    mixins: [LoginHandle],
    props: {},
    data() {
        return {};
    },
    created() { },
    mounted() { },
    methods: {},
};
</script>

<style lang="scss" scoped>
::v-deep {
    .el-input__inner {
        height: 55px !important;
        // padding-left: 20px !important;
        font-size: 20px;
        // background-color: transparent !important;
        // width: 430px;
        // color: #fff;
        // border-radius: 5px;
        // border: 1px solid #647f90;
        padding-left: 70px !important;
    }

    // .el-form-item {
    //     margin-bottom: 40px !important;
    // }

    // .validCode_input {
    //     .el-input__inner {
    //         width: 335px !important;
    //         margin-left: -8px;
    //     }
    // }

    // .el-form-item__error {
    //     left: 105px;
    //     top: 110%;
    // }
}

.aa {
    width: 100%;
    height: 100%;
    // background: url('@/assets/theme/login_border.png') no-repeat;
    // background-size: 100% 100%;
}

//登录按钮
.th-login-submit {
    // width: 436px;
    width: 100%;
    height: 60px;
    margin-top: 15px;
    font-size: 28px;
    border: none;
    letter-spacing: 5px;
    // background: linear-gradient(to right, #264962, #222d40);
    border-radius: 5px;
    // box-shadow: 0px 3px 3px rgba($color: #000000, $alpha: 0.7);
}

//表单样式
.th-login-form {
    width: 80%;
    padding: 0 20px;
    padding-top: 35%;
    // background: red;
    // padding: 20px 20px 0 20px;
    // margin-top: 60px;
    // display: block;
    // text-align: center;
    // background: url('@/assets/theme/theme-white-logins-box.png') no-repeat center right;
    // background: url('@/assets/theme/bg-left.png') no-repeat center right;
}

.login_tit {
    font-size: 40px;
    font-weight: bold;
    letter-spacing: 4px;
    border-bottom: 1px solid #c0bfbf;
    padding: 30px 0;
    margin-bottom: 20px;
}

.left-img {
    // width: 640px;
    // height: 583px;
    // width: 640px;
    // height: 590px;
    width: 70%;
    height: 100%;

    img {
        width: 100%;
        // height: 554px;
        height: 100%;
        position: relative;
        // top: 12px;
        // left: 19px;
    }
}

.right-img {
    // width: 640px;
    // height: 583px;
    // width: 640px;
    // height: 590px;
    // border: 2px solid #486073;
    // border-radius: 0 25px 25px 0;
    // border-left: none;
    width: 30%;
    height: 100%;
    display: flex;
    justify-content: center;
    // align-items: center;
    color: #333;

    img {
        width: 100%;
    }

    .logo_title {
        width: 80%;
        margin: auto;
    }

    .validCodeC {
        position: relative;
        // left: -100px;
        border-radius: 5px;
        padding: 0 10px;
        margin-left: 10px;
    }

    .icon_i {
        width: 30px;
        height: 30px;
        position: absolute;
        // left: 120px;
        left: 10px;
        top: 10px;
    }

    .lock_icon {
        width: 24px;
        height: 32px;
    }
}
</style>
