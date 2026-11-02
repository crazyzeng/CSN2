//
// 验证
// ---------------------------------------

let text = '格式有误！';

const validate = {
    // 手机号码
    phone(rule, value, callback) {
        if (!value) return callback();
        let reg = /^1[3,4,5,7,8]\d{9}$/;
        if (!reg.test(value)) callback(new Error(`手机号码${text}`));
        callback();
    },

    // 电话 & 座机
    telephone(rule, value, callback) {
        let reg1 = /^1[3,4,5,7,8]\d{9}$/;
        let reg2 = /^(\d{3,4}-)?\d{7,8}$/;
        if (!reg1.test(value) && !reg2.test(value)) callback(new Error(`电话号码${text}`));
        callback();
    },

    // 传真号码
    fax(rule, value, callback) {
        let reg = /^(\d{3,4}-)?\d{7,8}$/;
        if (!reg.test(value)) callback(new Error(`传真号码${text}`));
        callback();
    },

    // 邮箱
    email(rule, value, callback) {
        if (value == '' || value == null) {
            callback();
            return;
        }
        let reg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
        if (!reg.test(value)) callback(new Error(`邮箱${text}`));
        callback();
    },

    // 身份证号码
    idCard(rule, value, callback) {
        let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X)$)/;;
        if (!reg.test(value)) callback(new Error(`身份证号码${text}`));
        callback();
    },

    number1_3(rule, value, callback) {
        if (!value) return callback();
        let reg1 = /^[0]/;
        let reg2 = /^[1-9]\d{0,2}$/;
        if (reg1.test(value)) callback(new Error(`首位不能为0`));
        if (!reg2.test(value)) callback(new Error(`长度为 1 到 3 位的正整数`));
        callback();
    },

    // 正整数
    posNumber(rule, value, callback) {
        if (!value) return callback();
        let reg2 = /^(0|[1-9]\d{0,9})$/;
        if (!reg2.test(value)) callback(new Error(`长度不超过10位的正整数`));
        callback();
    },

    firstZero(rule, value, callback){
        if (!value) return callback();
        let reg1 = /^[0]/;
        if (reg1.test(value)) callback(new Error(`首位不能为0`));
        callback();
    },

    // 端口号
    port(rule, value, callback) {
        if (value == '' || value == null) {
            callback();
            return;
        }
        let reg = /^[1-9]$|(^[1-9][0-9]$)|(^[1-9][0-9][0-9]$)|(^[1-9][0-9][0-9][0-9]$)|(^[1-6][0-5][0-5][0-3][0-5]$)/;
        if (!reg.test(value)) callback(new Error(`端口号${text}`));
        callback();
    },

    // ip
    ip(rule, value, callback) {
        if (value == '' || value == null) {
            callback();
            return;
        }
        let reg = /(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)/;
        if (!reg.test(value)) callback(new Error(`IP${text}`));
        callback();
    },

    //用户名
    username(rule, value, callback) {
        if (value == '' || value == null) {
            callback();
            return;
        }
        let regEn = /[`~!@#$%^&*()-_+<>?:"{},.\/;'[\]]/im,
            regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im,
            reg = /^[\u4E00-\u9FA5A-Za-z0-9]{2,20}$/;
        if (!reg.test(value) || !regCn.test(value) || !regEn.test(value)) callback(new Error(`用户名不能含有特殊字符！`));
        callback();
    },

    //设备规格型号（不能有汉字）
    spec(rule, value, callback) {
        if (value == '' || value == null) {
            callback();
            return;
        }
        let reg = /^[^\u4e00-\u9fa5]+$/;
        if (!reg.test(value)) callback(new Error(`不可以包含中文字符`));
        callback();
    },
}

export default validate;
