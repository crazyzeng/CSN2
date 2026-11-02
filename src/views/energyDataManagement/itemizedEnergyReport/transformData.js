// export const transformTableData = (rawData) => {
//     const nameMap = new Map();
//     const firstMap = new Map();
//     const secondMap = new Map();
//     let currentNum = 1;

//     rawData.forEach((item, index) => {
//         const nameKey = item.name;
//         const firstKey = `${item.name}>>${item.firstName}`;
//         const secondKey = `${item.name}>>${item.firstName}>>${item.secondName}`;

//         if (!nameMap.has(nameKey)) {
//             nameMap.set(nameKey, { count: 1, index, num: currentNum++ });
//         } else {
//             nameMap.get(nameKey).count++;
//         }

//         if (!firstMap.has(firstKey)) {
//             firstMap.set(firstKey, { count: 1, index });
//         } else {
//             firstMap.get(firstKey).count++;
//         }

//         if (item.secondName) {
//             if (!secondMap.has(secondKey)) {
//                 secondMap.set(secondKey, { index });
//             }
//         }

//         item._nameKey = nameKey;
//         item._firstKey = firstKey;
//         item._secondKey = secondKey;
//     });

//     return rawData.map((item, index) => {
//         const nameInfo = nameMap.get(item._nameKey);
//         const firstInfo = firstMap.get(item._firstKey);
//         const secondIndex = secondMap.get(item._secondKey)?.index;

//         return {
//             ...item,
//             _nameCount: nameInfo.count,
//             _nameIndex: nameInfo.index,
//             _firstCount: firstInfo.count,
//             _firstIndex: firstInfo.index,
//             _showFirstTotal: index === firstInfo.index,
//             _showSecondTotal: index === secondIndex,
//             _showTotal: index === nameInfo.index,
//             _numShow: index === nameInfo.index ? nameInfo.num : null
//         };
//     });
// }

export const flattenData = (data) => {
    const flatList = [];
    let num = 1;

    const dfs = (list, parentNum = null) => {
        list?.forEach((item) => {
            const currentNum = num++;
            const baseRow = {
                ...item,
                num: currentNum,
                parentNum: parentNum || currentNum,
                secondName: item.children ? '' : item.name,
                firstName: item.children ? item.name : '',
                detail: item.detail || []
            };

            if (item.children) {
                const allChildren = [];
                const collect = (arr) => {
                    arr.forEach((c) => {
                        allChildren.push(c);
                        if (c.children) collect(c.children);
                    });
                };
                collect(item.children);

                const total = allChildren.reduce((sum, i) => sum + (i.total || 0), 0);
                baseRow.total = total;
                baseRow.firstTotal = total;

                flatList.push(baseRow);
                dfs(item.children, currentNum);
            } else {
                baseRow.total = item.total || 0;
                baseRow.secondTotal = item.total || 0;
                flatList.push(baseRow);
            }
        });
    };

    dfs(data);
    return flatList;
}

export const buildRowspanMap = (flatData) => {
    const map = new Map();
    flatData.forEach((row, index) => {
        const key = row.parentNum;
        if (!map.has(key)) {
            map.set(key, { start: index, span: 1 });
        } else {
            map.get(key).span++;
        }
    });
    return map;
}