/**
 * 通过百度echart的最大余额算法来，
 * 但是实际的算法用的对应的小数，而不是余数
 * 来解决百分比相加不为100%，的问题
 * 如果用，保留1个数据不处理，
 * 用1减去处理的数据得到最后的一个数据
 * 如果数据过多过大，误差就会越大
 */
export function   getPercentValue (valueList, idx, precision) {
    // console.log(valueList)
    // valueList,传入的数组
    // idx，index值
    // 保留位数
    // console.log(valueList);
    // 测试数组 [0.10906223,0.26846088,0.62247688],余数[190,1948,3776]
    // 判断是否为空
    // valueList = [0.10906223,0.26846088,0.62247688];
    if (!valueList[idx]) {
        return 0;
    }
    // 求和
    let sum = valueList.reduce(function (acc, val) {
        return acc + (isNaN(val) ? 0 : val);
    }, 0)
    if (sum === 0) {
        return 0;
    }
    
    // 10的2次幂是100，用于计算精度，次方
    let digits = Math.pow(10, precision);
    // 扩大比例100，因为是取百分比
    let votesPerQuota = valueList.map(function (val) {
        return (isNaN(val) ? 0 : val) / sum * digits * 100;
    })
    
    // 总数，扩大比例意味的总数要扩大
    let targetSeats = digits * 100;
    // 再向下取值，组成数组
    let seats = votesPerQuota.map(function (votes) {
        return Math.floor(votes);
    })

    // 再新计算合计，用于判断与总数量是否相同，相同则占比会100%
    let currentSum = seats.reduce(function (acc, val) {
        return acc + val;
    }, 0)
    
    // 余数部分的数组：原先数组减去向下取值的数组，得到余数（小数）部分的数组
    // 也就是获取到，小数部分的数组
    // 因为没有基数，所以可以直接取小数部分

    // 百度的echart是采用的小数，而不是余数，
    // 位保持一致，在此也选用小数

    //小数数组
    let remainder = votesPerQuota.map(function (votes, idx) {
        return votes - seats[idx];
    })
    //余数数组
    let remainder1 = seats.map(function (votes, idx) {
        return targetSeats%votes;
    })
    // console.log(remainder)//小数部分arr [ 0.6223109062229923, 0.6088268460880499, 0.7688622476880482 ]
    // 默认取15位做计算，不足15位，会循环前面的数
    // console.log(currentSum)//当前总和 9998
    // console.log(targetSeats)//应该为的总和 10000
    // 给最大最大的余额加1，凑个占比100%；
    while (currentSum < targetSeats) {
        //  找到下一个最大的余额，给其加1
        let max = Number.NEGATIVE_INFINITY;//负无穷大
        let maxId = null;
        for (let i = 0, len = remainder.length; i < len; ++i) {
            if (remainder[i] > max) {
                max = remainder[i];
                maxId = i;
            }
        }
        // 对最大项余额加1,放大后的数
        ++seats[maxId];

        // 已经增加最大余数加1，则下次判断就可以不需要再判断这个余额数。
        remainder[maxId] = 0;

        // 总的也要加1，为了判断是否总数是否相同，跳出循环。
        ++currentSum;
    }
    // 这时候的seats就会总数占比会100%
    return seats[idx] / digits
}
