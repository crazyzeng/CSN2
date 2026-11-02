/*
This file contains all the global variables shared among the .js file.

I have grouped them all here so there is no repetition, hence, it should be easier to fix issues and maintain consistency.

Remember to include this file in the HTML file if you want to access these variables
 */

let d = {
    ta: '',
    tr: '',
    vel: '',
    rh: '',
    met: '',
    clo: '',
    trm: '',
    vel_a: ''
};

let d_cache = {
    ta: '',
    tr: '',
    vel: '',
    rh: '',
    met: '',
    clo: '',
    trm: '',
    vel_a: ''
};

let keys = ["ta", "tr", "vel", "rh", "met", "clo", "trm", "vel_a"];

// Clothes ensambles that are shown in the drop down menu. The values are sorted by clo in ascending order
let cloInsulationTypicalEnsambles = [
    {
        clothing: '夏季室内典型着装: 0.5',
        clo: 0.5
    }, {
        clothing: '冬季室内典型着装: 1.0',
        clo: 1.0
    }, {
        clothing: '休闲短裤+短袖衬衫+拖鞋+内裤: 0.36',
        clo: 0.36
    }, {
        clothing: '短裙+短袖衬衫+拖鞋+内裤: 0.54',
        clo: 0.54
    }, {
        clothing: '薄裤+短袖衬衫+袜+鞋+内裤: 0.57',
        clo: 0.57
    }, {
        clothing: '薄裤+长袖衬衫+袜+鞋+内裤: 0.61',
        clo: 0.61
    }, {
        clothing: '短裙+长袖衬衫+拖鞋+长衬裙+内裤: 0.67',
        clo: 0.67
    }, {
        clothing: '运动裤+长袖运动衫+拖鞋+内裤: 0.74',
        clo: 0.74
    }, {
        clothing: '薄裤+长袖衬衫+西服上衣+袜+鞋+内裤: 0.96',
        clo: 0.96
    }];

// Clothing insulation of individual
let cloInsulationGarments = [
	{
        article: '内衣类--内裤(男)',
        clo: 0.04
    }, {
        article: '内衣类--内裤(女)',
        clo: 0.03
    }, {
        article: '内衣类--胸罩',
        clo: 0.01
    }, {
        article: '内衣类--T恤',
        clo: 0.08
    }, {
        article: '内衣类--长衬裙',
        clo: 0.16
    }, {
        article: '内衣类--短衬裙',
        clo: 0.14
    }, {
        article: '内衣类--秋衣',
        clo: 0.2
    }, {
        article: '内衣类--秋裤',
        clo: 0.15
    }, {
        article: '鞋袜类--踝袜(短袜)',
        clo: 0.02
    }, {
        article: '鞋袜类--小腿袜(中袜)',
        clo: 0.03
    }, {
        article: '鞋袜类--厚膝袜(厚长袜)',
        clo: 0.06
    }, {
        article: '鞋袜类--丝袜裤(女)',
        clo: 0.02
    }, {
        article: '鞋袜类--人字拖',
        clo: 0.02
    }, {
        article: '鞋袜类--普通拖鞋',
        clo: 0.03
    }, {
        article: '鞋袜类--皮靴',
        clo: 0.1
    }, {
        article: '衬衣类--无袖圆领衬衫(女)',
        clo: 0.12
    }, {
        article: '衬衣类--短袖衬衫(正装)',
        clo: 0.19
    }, {
        article: '衬衣类--长袖衬衫(正装)',
        clo: 0.25
    }, {
        article: '衬衣类--长袖绒衫',
        clo: 0.34
    }, {
        article: '衬衣类--短袖针织衫',
        clo: 0.17
    }, {
        article: '衬衣类--长袖运动衫',
        clo: 0.34
    }, {
        article: '裤子类--短裤',
        clo: 0.06
    }, {
        article: '裤子类--休闲短裤',
        clo: 0.08
    }, {
        article: '裤子类--直筒长裤(薄)',
        clo: 0.15
    }, {
        article: '裤子类--直筒长裤(厚)',
        clo: 0.24
    }, {
        article: '裤子类--运动裤',
        clo: 0.28
    }, {
        article: '裤子类--挂肩工装裤',
        clo: 0.30
    }, {
        article: '裤子类--连衣工装裤',
        clo: 0.49
    }, {
        article: '西服类--单排扣上衣(薄)',
        clo: 0.36
    }, {
        article: '西服类--单排扣上衣(厚)',
        clo: 0.44
    }, {
        article: '西服类--双排扣上衣(薄)',
        clo: 0.42
    }, {
        article: '西服类--双排扣上衣(厚)',
        clo: 0.48
    }, {
        article: '西服类--马甲/背心(薄)',
        clo: 0.1
    }, {
        article: '西服类--马甲/背心(厚)',
        clo: 0.17
    }, {
        article: '毛衣类--马甲/背心(薄)',
        clo: 0.13
    }, {
        article: '毛衣类--马甲/背心(厚)',
        clo: 0.22
    }, {
        article: '毛衣类--长袖毛衣(薄)',
        clo: 0.25
    }, {
        article: '毛衣类--长袖毛衣(厚)',
        clo: 0.36
    }, {
        article: '裙子类--长裙(薄)',
        clo: 0.14
    }, {
        article: '裙子类--长裙(厚)',
        clo: 0.23
    }, {
        article: '裙子类--长袖连衣裙(薄)',
        clo: 0.33
    }, {
        article: '裙子类--长袖连衣裙(厚)',
        clo: 0.47
    }, {
        article: '裙子类--短袖连衣裙(薄)',
        clo: 0.29
    }, {
        article: '裙子类--无袖圆连衣裙(薄)',
        clo: 0.23
    }, {
        article: '裙子类--无袖圆连衣裙(厚)',
        clo: 0.27
    }, {
        article: '睡衣类--无袖短睡裙(薄,女)',
        clo: 0.18
    }, {
        article: '睡衣类--无袖长睡裙(薄,女)',
        clo: 0.2
    }, {
        article: '睡衣类--短袖长睡裙(薄,女)',
        clo: 0.31
    }, {
        article: '睡衣类--长袖长睡裙(厚,女)',
        clo: 0.46
    }, {
        article: '睡衣类--长袖睡衣(厚)',
        clo: 0.57
    }, {
        article: '睡衣类--短袖睡衣(薄)',
        clo: 0.42
    }, {
        article: '睡衣类--长袖长袍(厚)',
        clo: 0.69
    }, {
        article: '睡衣类--长袖短袍(厚)',
        clo: 0.48
    }, {
        article: '睡衣类--短袖短袍(薄)',
        clo: 0.34
    }, {
        article: '坐椅类--金属椅',
        clo: 0.00
    }, {
        article: '坐椅类--木板凳',
        clo: 0.01
    }, {
        article: '坐椅类--普通办公椅',
        clo: 0.10
    }, {
        article: '坐椅类--沙发椅',
        clo: 0.15
    }];

// Metabolic rates of typical activities
let metRatesTypicalTasks = [
    {
        activity: '睡眠: 0.7',
        met: 0.7
    }, {
        activity: '倚靠: 0.8',
        met: 0.8
    }, {
        activity: '静坐: 1.0',
        met: 1.0
    }, {
        activity: '坐着阅读: 1.0',
        met: 1.0
    }, {
        activity: '坐着写字: 1.0',
        met: 1.0
    }, {
        activity: '坐着打字: 1.1',
        met: 1.1
    }, {
        activity: '坐着整理文件: 1.2',
        met: 1.2
    }, {
        activity: '放松站立: 1.2',
        met: 1.2
    }, {
        activity: '站着整理文件: 1.4',
        met: 1.4
    }, {
        activity: '闲逛: 1.7',
        met: 1.7
    }, {
        activity: '做饭: 1.8',
        met: 1.8
    }, {
        activity: '提东西/打包东西: 2.1',
        met: 2.1
    }, {
        activity: '打扫卫生: 2.7',
        met: 2.7
    }, {
        activity: '散步(3.2km/h): 2.0',
        met: 2.0
    }, {
        activity: '散步(4.8km/h): 2.6',
        met: 2.6
    }, {
        activity: '散步(6.4km/h): 3.8',
        met: 3.8
    }, {
        activity: '坐着做重型肢体运动: 2.2',
        met: 2.2
    }, {
        activity: '跳舞: 3.4',
        met: 3.4
    }, {
        activity: '做健美操/体操: 3.5',
        met: 3.5
    }, {
        activity: '打网球: 3.8',
        met: 3.8
    }, {
        activity: '打篮球: 6.3',
        met: 6.3
    }, {
        activity: '摔跤: 7.8',
        met: 7.8
    }, {
        activity: '开民航飞机: 1.2',
        met: 1.2
    }, {
        activity: '开轿车: 1.5',
        met: 1.5
    }, {
        activity: '开战斗机: 2.4',
        met: 2.4
    }, {
        activity: '开大型汽车: 3.2',
        met: 3.2
    }, {
        activity: '锯工: 1.8',
        met: 1.8
    }, {
        activity: '轻型器械工作: 2.2',
        met: 2.2
    }, {
        activity: '重型器械工作: 4.0',
        met: 4.0
    }, {
        activity: '举起45kg的物体: 4.0',
        met: 4.0
    }, {
        activity: '体力挖掘工作: 4.4',
        met: 4.4
    }];

// Metabolic rates of typical activities ASHRAE removed reclining and sleeping
let metRatesTypicalTasksASHRAE = metRatesTypicalTasks.filter(function (el) {
    return el.met >= 0.7 && // 0.8 is the reclining met
        el.met <= 4.0  // as defined in page 36 ASHRAE 55
});

// defined below the upper and lower limits for environmental variables as specified in ISO 7730 and ASHRAE
let envVarLimits = {
    'ta': {
        'si': {
            'step': 0.5,
            'default': 25,
            'min': 0,
            'max': 50
        },
        'ip': {
            'step': 0.5,
            'default': 77,
            'min': 32,
            'max': 122
        },
    },
    'tr': {
        'si': {
            'step': 0.5,
            'default': 25,
            'min': 0,
            'max': 50
        },
        'ip': {
            'step': 0.5,
            'default': 77,
            'min': 32,
            'max': 122
        },
    },
    'vel': {
        'si': {
            'step': 0.1,
            'default': 0.1,
            'min': 0,
            'max': 4,
            'elevated_air_speed': 0.2,
        },
        'ip': {
            'step': 0.1,
            'default': 20,
            'min': 0,
            'max': 790
        },
    },
    'rh': {
        'step': 1,
        'default': 50,
        'min': 0,
        'max': 100
    },
    'met': {
        'step': 0.1,
        'default': 1,
        'min': 0.7,
        'max': 4
    },
    'clo': {
        'step': 0.1,
        'default': 0.6,
        'min': 0,
        'max': 4  // ISO imposes 2 and ASHRAE 1.5
    },
    'trm': {
        'si': {
            'step': 0.5,
            'default': 25,
            'min': 10,
            'max': 35
        },
        'ip': {
            'step': 0.5,
            'min': 40,
            'max': 95
        },
    },
    'twb': {
        'si': {
            'step': 0.1,
            'default': 25,
            'min': 0.1,
            'max': 36
        },
        'ip': {
            'step': 0.1,
            'default': 50,
            'min': 33.2,
            'max': 100
        },
    },
    'tdp': {
        'si': {
            'step': 0.1,
            'default': 0.1,
            'min': 15,
            'max': 32
        },
        'ip': {
            'step': 0.1,
            'default': 45,
            'min': 0.1,
            'max': 90
        },
    },
};

// Handles the toggling of the units between SI and IP
function toggleUnits() {
    let v;
    let hs = $('#humidity-spec').val();
    isCelsius = !isCelsius;

    // if the unit system is the SI
    if (isCelsius) {

        // change the temperature unit
        $('.tempunit').each(function () {
            $(this).html(' &deg;C');
        });

        // Convert the temperature to Celisus and revert the spinner limits
        $('#ta, #tr, #trm').each(function () {
            v = util.FtoC($(this).val());
            $(this).val(v.toFixed(1)).spinner({
                step: envVarLimits.ta.si.step,
                min: envVarLimits.ta.si.min,
                max: envVarLimits.ta.si.max,
            });
        });

        // change the air velocity unit
        $('#vel-unit').html(' m/s');

        // Convert the air velocity to m/s and revert the spinner limits
        v = $('#vel').val();
        $('#vel').val(v / 196.9).spinner({
            step: envVarLimits.vel.si.step,
            min: envVarLimits.vel.si.min,
            max: envVarLimits.vel.si.max,
            numberFormat: "n"
        });

        // change dewpoint and wetbulb temperature units
        if (hs === 'dewpoint') {
            $('#rh-unit').html(' &deg;C');
            v = (util.FtoC($('#rh').val()));
            $('#rh').val(v.toFixed(1)).spinner({
                step: envVarLimits.tdp.si.step,
                min: envVarLimits.tdp.si.min,
                max: envVarLimits.tdp.si.max,
                numberFormat: "n"
            });
        } else if (hs == 'wetbulb') {
            $('#rh-unit').html(' &deg;C');
            v = (util.FtoC($('#rh').val()));
            $('#rh').val(v.toFixed(1)).spinner({
                step: envVarLimits.twb.si.step,
                min: envVarLimits.twb.si.min,
                max: envVarLimits.twb.si.max,
                numberFormat: "n"
            });
        } else if (hs == 'vappress') {
            $('#rh-unit').html(' KPa');
            v = $('#rh').val() * 2.953;
            $('#rh').val(v.toFixed(2));
        } else if (hs === 'w') {
            $('#rh-unit').html(' <sup>g<sub>w</sub></sup>&frasl;<sub>kg<sub>da</sub></sub>');
        }

        // if instead the unit system is IP
    } else {
        // change the temperature unit
        $('.tempunit').each(function () {
            $(this).html(' &deg;F');
        });

        // Convert the temperature to Fahrenheit and change the spinner limits
        $('#ta, #tr, #trm').each(function () {
            v = util.CtoF($(this).val());
            $(this).val(v.toFixed(1)).spinner({
                step: envVarLimits.ta.ip.step,
                min: envVarLimits.ta.ip.min,
                max: envVarLimits.ta.ip.max,
            });
        });

        // change the air velocity unit
        $('#vel-unit, #vel-a-unit').html(' fpm');

        // Convert the air velocity to fpm and change spinner limit
        v = $('#vel').val();
        $('#vel').val(v * 196.9).spinner({
            step: envVarLimits.vel.ip.step,
            min: envVarLimits.vel.ip.min,
            max: envVarLimits.vel.ip.max,
            numberFormat: 'n'
        });

        if (hs === 'dewpoint') {
            $('#rh-unit').html(' &deg;F');
            v = (util.CtoF($('#rh').val()));
            $('#rh').val(v.toFixed(1)).spinner({
                step: envVarLimits.tdp.ip.step,
                min: envVarLimits.tdp.ip.min,
                max: envVarLimits.tdp.ip.max,
                numberFormat: "n"
            });
        } else if (hs === 'wetbulb') {
            $('#rh-unit').html(' &deg;F');
            v = (util.CtoF($('#rh').val()));
            $('#rh').val(v.toFixed(1)).spinner({
                step: envVarLimits.twb.ip.step,
                min: envVarLimits.twb.ip.min,
                max: envVarLimits.twb.ip.max,
                numberFormat: "n"
            });
        } else if (hs === 'vappress') {
            $('#rh-unit').html(' in HG');
            v = $('#rh').val() / 2.953;
            $('#rh').val(v.toFixed(2));
        } else if (hs === 'w') {
            $('#rh-unit').html(' <sup>lb<sub>w</sub></sup>&frasl;<sub>klb<sub>da</sub></sub>');
        }
    }
    pc.toggleUnits(isCelsius);
    bc.toggleUnits(isCelsius);
    vc.toggleUnits(isCelsius);
    ac.toggleUnits(isCelsius);
}

// check user entry
function validateUserEntry(i) {

    keys.forEach(function (element) {
        d_cache[element] = d[element];
        let e = document.getElementById(element + i).value;

        // replace comma with dot
        e = e.replace(/,/g, '.');

        // define which measurement system is being used
        let measurementSystem;
        if (isCelsius) {
            measurementSystem = 'si'
        } else {
            measurementSystem = 'ip'
        }

        // check user entry. if value is beyond the acceptability limit replace it with the default value
        try {
            if (e > envVarLimits[element][measurementSystem]['max'] || e < envVarLimits[element][measurementSystem]['min']) {
                $('#' + element + i).val(envVarLimits[element][measurementSystem]['default']);
                e = envVarLimits[element][measurementSystem]['default'];
                window.alert('错误：您输入的参数值超出适用范围！');
            }
        } catch (err) {
        }
        try {
            if (e > envVarLimits[element]['max'] || e < envVarLimits[element]['min']) {
                $('#' + element + i).val(envVarLimits[element]['default']);
                e = envVarLimits[element]['default'];
                window.alert('错误：您输入的参数值超出适用范围！');
            }
        } catch (err) {
        }

        // store the value into json
        d[element] = parseFloat(e);
    });

    if (d.clo > 0.7 || d.met > 1.3) {
        const select = document.getElementById("local-control" + i);
        select.selectedIndex = 1;
        $('#local-control' + i).hide();
    } else {
        $('#local-control' + i).show();
    }

}

// changed humidity dropdown selection
function change_humidity_selection() {
    const v = $('#humidity-spec').val();
    let ta = parseFloat($('#ta').val());
    if (!isCelsius) ta = util.FtoC(ta);
    const maxVapPress = parseFloat(psy.satpress(ta));
    const maxHumRatio = psy.humratio(psy.PROP.Patm, maxVapPress);
    let rh = parseFloat($('#rh').val());
    if (!isCelsius && (window.humUnit === 'wetbulb' || window.humUnit === 'dewpoint')) rh = util.FtoC(rh);
    if (window.humUnit === 'vappress') if (!isCelsius) rh *= 2953;
    else rh *= 1000;
	if (window.humUnit === 'w') rh /= 1000;//新增：含湿量单位换算1000

    if (v === 'rh') {
        $('#rh').val(psy.convert(rh, ta, window.humUnit, 'rh'));
        $('#rh-unit').html(' %');
        $('#rh-description').html('相对湿度');
        $('#rh').spinner({
            step: envVarLimits.rh.step,
            min: envVarLimits.rh.min,
            max: envVarLimits.rh.max,
            numberFormat: "n"
        });
    } else if (v === 'dewpoint') {
        $('#rh-description').html('露点温度');
        if (isCelsius) {
            $('#rh').val(psy.convert(rh, ta, window.humUnit, 'dewpoint'));
            $('#rh-unit').html(' &deg;C');
        } else {
            $('#rh').val(util.CtoF(psy.convert(rh, ta, window.humUnit, 'dewpoint')));
            $('#rh-unit').html(' &deg;F');
        }
        $('#rh').spinner({
            step: envVarLimits.tdp.si.step,
            min: envVarLimits.tdp.si.min,
            max: envVarLimits.tdp.si.max,
            numberFormat: "n"
        });
    } else if (v === 'wetbulb') {
        $('#rh-description').html('湿球温度');
        if (isCelsius) {
            $('#rh').val(psy.convert(rh, ta, window.humUnit, 'wetbulb'));
            $('#rh-unit').html(' &deg;C');
        } else {
            $('#rh').val(util.CtoF(psy.convert(rh, ta, window.humUnit, 'wetbulb')));
            $('#rh-unit').html(' &deg;F');
        }
        $('#rh').spinner({
            step: envVarLimits.twb.si.step,
            min: envVarLimits.twb.si.min,
            max: envVarLimits.twb.si.max,
            numberFormat: "n"
        });
    } else if (v === 'w') {
        $('#rh-description').html('含湿量');
        $('#rh').val(psy.convert(rh, ta, window.humUnit, 'w') * 1000);//修改：* 1变为 * 1000，含湿量单位换算1000
        $('#rh-unit').html('');
        $('#rh').spinner({
            step: 0.1,//修改：0.001变为0.1，含湿量单位换算1000
            min: 0,
            max: maxHumRatio * 1000//修改：* 1变为* 1000，含湿量单位换算1000
        });
        if (isCelsius) {
            $('#rh-unit').html(' <sup>g<sub>w</sub></sup>&frasl;<sub>kg<sub>da</sub></sub>');
        } else {
            $('#rh-unit').html(' <sup>lb<sub>w</sub></sup>&frasl;<sub>klb<sub>da</sub></sub>');
        }
    } else if (v === 'vappress') {
        $('#rh-description').html('水蒸气分压力');
        if (isCelsius) {
            $('#rh').val(psy.convert(rh, ta, window.humUnit, 'vappress') / 1000);
            $('#rh-unit').html(' KPa');
        } else {
            $('#rh').val(psy.convert(rh, ta, window.humUnit, 'vappress') / 2953);
            $('#rh-unit').html(' in HG');
        }
        $('#rh').spinner({
            step: 0.01,
            min: 0,
            max: maxVapPress / 1000.0
        });
    }
    window.humUnit = v;
}