import { arrayDeDuplication, consoleLog } from './index'

/**
 * 获取 数组-对象 下指定 key 值对应的数据
 * @param {array} arr
 * @param {string} keyValue
 * @param {string} keyName
 * @returns {object}
 */

export function queryArrayItem(dataArr, keyValue, keyName = 'name') {
    if(Array.isArray(dataArr) && dataArr.length > 0) {
        for(let i = 0, l = dataArr.length; i < l; i++) {
            if(dataArr[i][keyName] == keyValue) return dataArr[i];
        }
    }
    return false;
};

/**
 * 分解 条件 格式
 * @param {string} formula
 * @returns {string}
 */

export function compileTerms(formula, pointData) {

    if(formula != '' && formula != null && formula != undefined) {

        let regExpPointId = /\{(.+?)\}/g;

        let idArr = formula.match(regExpPointId);

        if(idArr != null) {

            idArr = arrayDeDuplication(idArr);

            idArr.forEach(v => {
                
                let id = v.substr(1), value;

                id = id.substr(0, id.length-1);

                for (let item of pointData) {
                    
                    if(item.pointId == id) {

                        value = item.value.value;
                        break;
                    }
                }

                formula = formula.replace(new RegExp('\\{' + id + '\\}', 'g'), value);
            });

            consoleLog('formula=', formula);

            return eval(formula);
        }
    }
    return null;
};