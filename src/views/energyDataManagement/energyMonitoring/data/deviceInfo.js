// 设备信息表

const deviceInfoList = [
    {
        name: '武广',
        children: [
            {
                name: '离心机',
                children: [
                    { name: '1#离心机', modelName: '离心冷水机组' },
                    { name: '2#离心机', modelName: '离心冷水机组A' },
                ],
                infos: [
                    { name: '冷冻进水', value: '5°C' },
                    { name: '冷冻出水', value: '5°C' },
                    { name: '冷却进水', value: '5°C' },
                    { name: '冷却出水', value: '5°C' },
                    { name: '冷凝温度', value: '5°C' },
                    { name: '油压差', value: '5Pa' },
                    { name: '油温', value: '5°C' },
                    { name: '电机功率百分比', value: '5%' },
                    { name: '运行状态', value: '运行中' },
                ]
            },
            {
                name: '冷却塔',
                children: [
                    { name: '1#水冷塔', modelName: '长沙南武广线冷却塔' },
                ],
                infos: [
                    { name: '出水温度', value: '5°C' },
                    { name: '进水温度', value: '5°C' },
                    { name: '频率反馈', value: '5Hz' },
                    { name: '进水阀开关状态', value: '关闭' },
                    { name: '水冷塔运行状态', value: '运行中' },
                ]
            },
            {
                name: '水泵',
                children: [
                    { name: '1#冷却水循环泵', modelName: '冷却水循环泵' },
                    { name: '2#冷却水循环泵', modelName: '冷却水循环泵A' },
                    { name: '3#冷却水循环泵', modelName: '冷却水循环泵B' },
                    { name: '1#冷冻水循环泵', modelName: '冷冻水循环泵' },
                    { name: '2#冷冻水循环泵', modelName: '冷冻水循环泵001' },
                    { name: '3#冷冻水循环泵', modelName: '冷冻水循环泵002' },
                    { name: '1#冷冻水循环泵_热泵', modelName: '冷冻水循环泵_热泵）' },
                    { name: '2#冷冻水循环泵_热泵', modelName: '冷冻水循环泵_热泵）001' },
                    { name: '3#冷冻水循环泵_热泵', modelName: '冷冻水循环泵_热泵）002' },
                    { name: '1#风冷热泵冷冻水循环泵', modelName: '风冷热泵冷冻水循环泵' },
                    { name: '2#风冷热泵冷冻水循环泵', modelName: '风冷热泵冷冻水循环泵001' },
                    { name: '3#风冷热泵冷冻水循环泵', modelName: '风冷热泵冷冻水循环泵002' },
                    { name: '1#地埋管循环泵', modelName: '地埋管循环泵' },
                    { name: '2#地埋管循环泵', modelName: '地埋管循环泵A' },
                    { name: '3#地埋管循环泵', modelName: '地埋管循环泵B' },
                    { name: '1#螺杆式水源热泵机组', modelName: '螺杆式水源热泵机组1' },
                    { name: '2#螺杆式水源热泵机组', modelName: '螺杆式水源热泵机组2' },
                ],
                infos: [
                    { name: '过滤器前压力', value: '5MPa' },
                    { name: '频率反馈', value: '5Hz' },
                    { name: '泵前压力', value: '5MPa' },
                    { name: '泵后压力', value: '5MPa' },
                    { name: '泵运行状态', value: '运行中' },
                ]
            },
        ]
    },
    {
        name: '沪昆',
        children: [
            {
                name: '离心机',
                children: [
                    { name: '1#离心机', modelName: 'CSN-沪昆冷冻站离心式冷水机组1' },
                    { name: '2#离心机', modelName: 'CSN-沪昆冷冻站离心式冷水机组2' },
                    { name: '3#离心机', modelName: 'CSN-沪昆冷冻站离心式冷水机组3' },
                ],
                infos: [
                    { name: '冷冻进水', value: '5°C' },
                    { name: '冷冻出水', value: '5°C' },
                    { name: '冷却进水', value: '5°C' },
                    { name: '冷却出水', value: '5°C' },
                    { name: '冷凝温度', value: '5°C' },
                    { name: '油压差', value: '5Pa' },
                    { name: '油温', value: '5°C' },
                    { name: '电机功率百分比', value: '5%' },
                    { name: '运行状态', value: '运行中' },
                ]
            },
            {
                name: '冷却塔',
                children: [
                    { name: '1#冷却塔', modelName: 'Lo-长沙南冷却塔颜色_01' },
                ],
                infos: [
                    { name: '出水温度', value: '5°C' },
                    { name: '进水温度', value: '5°C' },
                    { name: '频率反馈', value: '5Hz' },
                    { name: '进水阀开关状态', value: '关闭' },
                    { name: '水冷塔运行状态', value: '运行中' },
                ]
            },
            {
                name: '水泵',
                children: [
                    { name: '1#冷冻水水泵', modelName: 'CSN-沪昆冷冻站冷冻水水泵1' },
                    { name: '2#冷冻水水泵', modelName: 'CSN-沪昆冷冻站冷冻水水泵2' },
                    { name: '3#冷冻水水泵', modelName: 'CSN-沪昆冷冻站冷冻水水泵3' },
                    { name: '4#冷冻水水泵', modelName: 'CSN-沪昆冷冻站冷冻水水泵4' },
                    { name: '1#冷却水水泵', modelName: 'CSN-沪昆冷冻站冷却水水泵1' },
                    { name: '2#冷却水水泵', modelName: 'CSN-沪昆冷冻站冷却水水泵2' },
                    { name: '3#冷却水水泵', modelName: 'CSN-沪昆冷冻站冷却水水泵3' },
                ],
                infos: [
                    { name: '过滤器前压力', value: '5MPa' },
                    { name: '频率反馈', value: '5Hz' },
                    { name: '泵前压力', value: '5MPa' },
                    { name: '泵后压力', value: '5MPa' },
                    { name: '泵运行状态', value: '运行中' },
                ]
            }
        ]
    },
    {
        name: '锅炉房',
        children: [
            {
                name: '锅炉',
                children: [
                    { name: '1#锅炉', modelName: 'Lo-斯大真空热水锅炉主体_01' },
                    { name: '2#锅炉', modelName: 'Lo-天大真空热水锅炉_01' },
                    { name: '3#锅炉', modelName: 'Lo-天大真空热水锅炉_002' },
                ],
                infos: [
                    { name: '进水压力', value: '5Pa' },
                    { name: '进水温度', value: '5°C' },
                    { name: '出水压力', value: '5Pa' },
                    { name: '出水温度', value: '5°C' },
                    { name: '瞬时流量', value: '10L/h' },
                    { name: '累计流量', value: '2400L' },
                ]
            },
            {
                name: '热水泵',
                children: [
                    { name: '1#热水循环泵', modelName: 'CSN-锅炉房热水循环泵1' },
                    { name: '2#热水循环泵', modelName: 'CSN-锅炉房热水循环泵2' },
                    { name: '3#热水循环泵', modelName: 'CSN-锅炉房热水循环泵3' },
                    { name: '4#热水循环泵', modelName: 'CSN-锅炉房热水循环泵4' },
                ],
                infos: [
                    { name: '过滤器前压力', value: '5MPa' },
                    { name: '频率反馈', value: '5Hz' },
                    { name: '泵前压力', value: '5MPa' },
                    { name: '泵后压力', value: '5MPa' },
                    { name: '泵运行状态', value: '运行中' },
                ]
            },
        ]

    }
]

export default deviceInfoList;