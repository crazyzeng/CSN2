import html2canvas from 'html2canvas';
import JsPDF from 'jspdf';
import { v4 as uuidv4 } from 'uuid';

/**
 * @description 平级数据 转换成 有上下级关系的
 * @param {Object} data 参数 示例：{ name: 'xxx_xxx' }
 */
export function isFatherAndSon(arr, idName = 'id', parentIDName = 'parentId', parentID = '') {
    let list = [];
    arr.forEach(v => {
        if (v[parentIDName] == parentID || (parentID == '' && (v[parentIDName] == null || v[parentIDName] == 'null'))) {
            v.children = isFatherAndSon(arr, idName, parentIDName, v[idName]);
            if (v.children && v.children.length <= 0) delete v.children;
            list.push(v);
        }
    });
    return list;
}

/**
 * @description 获取 url图片 的宽高
 * @param {string} url
 * @returns {object}
 */

export function getImageData(url) {
    return new Promise((resolve, reject) => {
        let img = new Image();
        img.src = url;
        if (img.complete) {
            resolve(img);
        } else {
            img.onload = function() {
                resolve(img);
            };
        }
    });
}

/**
 * @description 数组去重
 * @param {array} arr
 * @returns {arr}
 */

export function arrayDeDuplication(arr) {
    return arr.sort().reduce((init, current) => {
        if (init.length === 0 || init[init.length - 1] !== current) {
            init.push(current);
        }
        return init;
    }, []);
}

//对象数组去重 
export function removeDuplicateObj(arr) {
    let obj = {};
    arr = arr.reduce((newArr, next) => {
      obj[next.id] ? "" : (obj[next.id] = true && newArr.push(next));
      return newArr;
    }, []);
    return arr;
  }

/**
 * 
 * @description 数组去重，筛选不同 
 */
export function arrDiff(arr1,arr2) {
    let c = [...arr1, ...arr2]
    let d = new Set(c)
    let e = Array.from(d)
    let f = [...e.filter(_=>!arr1.includes(_)),...e.filter(_=>!arr2.includes(_))]
    return f
}
/**
 * @description 清空对象自身属性
 * @param {array} Object
 */
export function resetFormData(formData, value = '') {
    for (const key in formData) {
        if (formData.hasOwnProperty(key)) {
            formData[key] = value;
        }
    }
}

/**
 * @description 深拷贝
 * @param {any} 数据
 */
export function deepCopy(data) {
    if (typeof data !== 'object ' || typeof data == 'function' || data === null) {
        return data;
    }

    let item;
    if (Array.isArray(data)) item = [];
    if (!Array.isArray(data)) item = {};

    for (let i in data) {
        if (data.hasOwnProperty(i)) {
            item[i] = deepCopy(data[i]);
        }
    }
    return item;
}

/**
 * @description 打印日志
 */
export function consoleLog() {
    if (process.env.NODE_ENV === 'development') console.log(...arguments);
}

export function getUrl(path) {
    const debug = process.env.NODE_ENV !== 'production';
    let url;
    if (debug) url = 'api/' + path;
    else url = path;
    return url;
}

export const requestAnimationFrame =
    window.requestAnimationFrame ||
    function(callback) {
        setTimeout(callback, 1000 / 60);
    };


//导出页面为图片
export function dataURLToBlob(dataurl) {
    //ie 图片转格式
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
}
export function exportImage(elementId,name) {
    let canvasID = document.getElementById(elementId);
    let a = document.createElement('a');
    html2canvas(canvasID).then(canvas => {
        let dom = document.body.appendChild(canvas);
        dom.style.display = 'none';
        a.style.display = 'none';
        document.body.removeChild(dom);
        let blob = dataURLToBlob(dom.toDataURL('image/png'));
        a.setAttribute('href', URL.createObjectURL(blob));
        a.setAttribute('download', name + '.png');
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(blob);
        document.body.removeChild(a);
    });
}
//防抖
export function debounce(fn, delay) {
    var delay = delay || 200;
    var timer;
    return function () {
      var th = this;
      var args = arguments;
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(function () {
        timer = null;
        fn.apply(th, args);
      }, delay);
    };
  }

  //节流
  export function throttle (func, delay) {
    var timer = null;
    return function () {
        var context = this;
        var args = arguments;
        if (!timer) {
            timer = setTimeout(function () {
                func.apply(context, args);
                timer = null;
            }, delay);
        }
    }
}

export function exportPdf(id, title) {
    // Vue.prototype.getPDF = function(id, title) {
      let node = document.getElementById(id);
      let parentNode = node.parentNode;
      parentNode.style = 'position:relative;'; // 需要导出的dom的父节点需要设置 position:relative; 否则计算高度会出问题；
      const SCALE = 4; // html2Canvas 缩放倍数，数字越大越清晰 pdf越大
      html2canvas(node, {
        allowTaint: false,
        scale: SCALE
      }).then(function(canvas) {
        // 得到canvas画布的单位是px 像素单位
        var contentWidth = canvas.width;
        var contentHeight = canvas.height;

        // 将canvas转为base64图片
        var pageData = canvas.toDataURL('image/jpeg', 1.0);

        // 设置pdf的尺寸，pdf要使用pt单位 已知 1pt/1px = 0.75   pt = (px/scale)* 0.75
        // 2为上面的scale 缩放了2倍
        var pdfX = ((contentWidth + 10) / SCALE) * 0.75;
        var pdfY = ((contentHeight + 300) / SCALE) * 0.75; // 300为底部留白

        // 设置内容图片的尺寸，img是pt单位
        var imgX = pdfX;
        var imgY = (contentHeight / SCALE) * 0.75; //内容图片这里不需要留白的距离

        // 初始化jspdf 第一个参数方向：默认''时为纵向，第二个参数设置pdf内容图片使用的长度单位为pt，第三个参数为PDF的大小，单位是pt
        var PDF = new JsPDF('1', 'pt', [pdfX, pdfY]);

        // 将内容图片添加到pdf中，因为内容宽高和pdf宽高一样，就只需要一页，位置就是 0,0
        PDF.addImage(pageData, 'jpeg', 0, 0, imgX, imgY);
        PDF.save(title + '.pdf');
      });
    // };
  }

export function deepClone(obj){
    var result = typeof obj.splice === "function" ? [] : {},
        key;

    if (obj && typeof obj === "object") {
        for (key in obj) {
            if (obj[key] && typeof obj[key] === "object") {
                result[key] = deepClone(obj[key]);
            } else {
                result[key] = obj[key];
            }
        }
        return result;
    }
    return obj;
}
/**
     * 字典翻译
     *
     * @param {*} code 需要翻译的编码（一般是某id或者code）
     * @param {*} arr 翻译的字典（list）
     * @param {string} [key='code'] 与字典匹配的属性（对象中的O[key]与code相同）
     * @param {string} [valueKey='value'] 翻译值在对象中的属性
     * @param {*} [callback=this.getWordbookValue] 回调
     * @returns 返回翻译结果
     */
export function getWordbookValue(code, arr, key = 'code', valueKey = 'value', callback = getWordbookValue) {
    for(let i = 0, length = arr.length; i < length; i++) {
        let v = arr[i];
        if(v[key] == code) {
            return v[valueKey];
        } else if(v.children && v.children.length > 0) {
            let value = callback(code, v.children, key, valueKey, callback);
            if(value != code) return value;
        }
    }

    return code;
}

  //将阿拉伯数字转换为大写数字
  export function numberTransfer(n){
    var cnum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
    var s = '';
    n = '' + n; // 数字转为字符串
    for (var i = 0; i < n.length; i++) {
        s += cnum[parseInt(n.charAt(i))];
    }
    if (s.length == 2) { // 两位数的时候
        // 如果个位数是0的时候，0改成十
        if (s.charAt(1) == cnum[0]) {
            s = s.charAt(0) + cnum[10];
            // 如果是一十改成十
            if (s == cnum[1] + cnum[10]) {
                s = cnum[10]
            }
        } else if (s.charAt(0) == cnum[1]) {
            // 如果十位数是一的话改成十
            s = cnum[10] + s.charAt(1);
        }else if (s.charAt(0) == cnum[2]) {
            // 如果十位数是二的话改成十二
            s = cnum[2] + cnum[10] + s.charAt(1);
        }else if (s.charAt(0) == cnum[3]) {
            s = cnum[3] + cnum[10] + s.charAt(1);
        }else if (s.charAt(0) == cnum[4]) {
            s = cnum[4] + cnum[10] + s.charAt(1);
        }else if (s.charAt(0) == cnum[5]) {
            s = cnum[5] + cnum[10] + s.charAt(1);
        }else if (s.charAt(0) == cnum[6]) {
            s = cnum[6] + cnum[10] + s.charAt(1);
        }else if (s.charAt(0) == cnum[7]) {
            s = cnum[7] + cnum[10] + s.charAt(1);
        }else if (s.charAt(0) == cnum[8]) {
            s = cnum[8] + cnum[10] + s.charAt(1);
        }else if (s.charAt(0) == cnum[9]) {
            s = cnum[9] + cnum[10] + s.charAt(1);
        }else if (s.charAt(0) == cnum[10]) {
            s = cnum[10] + cnum[10] + s.charAt(1);
        }
    }
    return s;
}

export function getWebSocketURlConfigUration(path) {
    let url = `ws://${location.hostname+':'+location.port}/websocket/cacheThemePointDataWebSocket/`;
    return url + path;
}


/**
 * @description 添加单位
 * @author tonghan(798008773@qq.com)
 * @param { Number | String } val 数值 或者是带单位的 数值 例如 10 && 10px
 * @returns { String }
 */
export function setUnit(data) {
    if(typeof Number(data) === 'number' && !isNaN(data)) {
        return `${data}px`
    }

    if(data === undefined || data === null) {
        return 0
    }

    return data
}

/**
 * 是否为空
 * @author tonghan(798008773@qq.com)
 * @param { any } data
 * @returns { Boolean }
 */

export function isEmpty(data) {
    return  data === '' || 
            data === null || 
            data === undefined || 
            data === 'null' || 
            data === 'undefined'
}

/**
 * @description 生成唯一id
 * @author tonghan(798008773@qq.com)
 * @param { String } text 前缀
 * @param { Number | String } val 数值 或者是带单位的 数值 例如 10 && 10px
 * @returns { Number }
 */
export function uuid(text, val) {
    return `${text + uuidv4()}`
}