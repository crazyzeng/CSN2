import store from '@/store'
import router from '@/router/index'

export default {
    data() {
        const validateUsername = (rule, value, callback) => {
            if (value.length < 4) {
                callback(new Error('用户名不能少于四位数'))
            } else {
                callback()
            }
        }

        const validatePassword = (rule, value, callback) => {
            if (value.length < 4) {
                callback(new Error('密码不能少于四位数'))
            } else {
                callback()
            }
        }

        const validateValidCode = (rule, value, callback) => {
            if (value.toLowerCase() !== this.validcode.toLowerCase()) {
                callback(new Error('请输入正确的验证码'))
            } else {
                callback()
            }
        }

        return {
            loading: false,
            validcode: '',

            loginForm: {
                username: '',
                password: '',
                validcode: ''
            },
            checked: false,
            loginRules: {
                username: [
                    {
                        required: true,
                        trigger: 'blur',
                        validator: validateUsername
                    }
                ],
                password: [
                    {
                        required: true,
                        trigger: 'blur',
                        validator: validatePassword
                    }
                ],
                validcode: [
                    {
                        required: true,
                        trigger: 'blur',
                        validator: validateValidCode
                    }
                ]
            }
        }
    },
    watch: {
        validcode(newVal) {
            const debug = process.env.NODE_ENV !== 'production'
            if (debug) {
                this.loginForm.validcode = newVal
            }
        }
    },
    mounted() {
        this.init()
        this.getCookie()
    },
    methods: {
        init() {
            this.devSetUser()
        },

        devSetUser() {
            const debug = process.env.NODE_ENV !== 'production'
            if (debug) {
                this.loginForm.username = 'Jenny001'
                this.loginForm.password = '123456'
            }
        },

        handleLogin() {
            this.$refs.loginForm.validate(valid => {
                if (valid) {
                    this.loading = true
                    this.$store
                        .dispatch('user/login', this.loginForm)
                        .then(async () => {
                            // 登录成功后拉取用户信息 + 菜单，生成动态路由，再跳转大屏首页
                            const { allMenu } = await store.dispatch('user/getUserInfo')

                            const accessRoutes = await store.dispatch(
                                'routerPermission/generateRoutes',
                                allMenu
                            )

                            router.addRoutes(accessRoutes)
                            this.$router
                                .push({ path: '/screen' })
                                .catch(err => err)
                        })
                        .catch(err => {
                            // 登录链路上任何一步失败都要复位 loading，并给出可读提示
                            console.error('[login] 登录/加载菜单失败：', err)
                            this.loading = false
                        })
                    // .catch(() => {
                    //     this.loading = false
                    // })
                }
            })
            //判断复选框是否被勾选 勾选则调用配置cookie方法
            if (this.checked == true) {
                //传入账号名，密码，和保存天数3个参数
                this.setCookie(this.loginForm.username, this.loginForm.password, 7);
                // this.$refs.loginForm.validate(valid => {
                //     if (valid) {
                //         this.loading = true
                //         this.$store
                //             .dispatch('user/login', this.loginForm)
                //             .then(() => {
                //                 this.$router
                //                     .push({ path: '/home' })
                //                     .catch(err => err)
                //                 this.loading = false
                //             })
                //             .catch(() => {
                //                 this.loading = false
                //             })
                //     }
                // })
            }
        },
        addRoutesRecursively(routes) {
            routes.forEach(route => {
                if (route.children && route.children.length) {
                    addRoutesRecursively(route.children)
                } else {
                    router.addRoute('/', route) // ⭐ 挂到 Layout
                }
            })
        },
        //设置cookie
        setCookie: function (c_name, c_pwd, exdays) {
            let exdate = new Date();//获取时间
            exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays);//保存的天数
            //字符串拼接cookie
            window.document.cookie = "username" + "=" + c_name + ";path=/;expires=" + exdate.toGMTString();
            window.document.cookie = "password" + "=" + c_pwd + ";path=/;expires=" + exdate.toGMTString();
        },
        //读取cookie
        getCookie: function () {
            if (document.cookie.length > 0) {
                var arr = document.cookie.split('; ');//这里显示的格式需要切割一下自己可输出看下
                for (var i = 0; i < arr.length; i++) {
                    var arr2 = arr[i].split('=');//再次切割
                    //判断查找相对应的值
                    if (arr2[0] == 'username') {
                        this.loginForm.username = arr2[1];//保存到保存数据的地方
                    } else if (arr2[0] == 'password') {
                        this.loginForm.password = arr2[1];
                    }
                }
            }
        }
    },
    beforeDestroy() { }
}
