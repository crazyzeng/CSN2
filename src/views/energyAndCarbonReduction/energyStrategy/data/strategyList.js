// 节能策略方案图库
// 说明：原实现使用 require() 动态载入图片，Vite（ESM）环境下 require 不存在，
// 因此统一改为顶部静态 import，construction 时直接引用导入后的资源变量。

import strategy01 from '@/assets/energy/strategy01.png'
import strategy02 from '@/assets/energy/strategy02.png'
import strategy03 from '@/assets/energy/strategy03.png'
import strategy04 from '@/assets/energy/strategy04.png'
import strategy05 from '@/assets/energy/strategy05.png'
import hot1 from '@/assets/energy/hot-1.png'
import hot2 from '@/assets/energy/hot-2.png'
import light11 from '@/assets/energy/light-11.png'
import light22 from '@/assets/energy/light-22.png'

export const STRATEGY_MAP = {
    1: {
        name: '制冷策略',
        tabs: [
            { name: '1', label: '制冷加减机', title: '制冷主机自动加减机节能', component: 'CoolingAddReduce', image: strategy01 },
            { name: '2', label: '主机定时启动', title: '制冷主机定时启动节能', component: 'CoolingStart', image: strategy02 },
            { name: '3', label: '主机定时停止', title: '制冷主机定时停止节能', component: 'CoolingStop', image: strategy03 },
            { name: '4', label: '冷冻水泵变频节能', title: '冷冻水泵变频节能', component: 'CoolingPump', image: strategy04 },
            { name: '5', label: '冷却水泵变频节能', title: '冷却水泵变频节能', component: 'CoolingCoolingPump', image: strategy05 }
        ]
    },
    2: {
        name: '制热策略',
        tabs: [
            { name: '1', label: '风冷热泵定时启动', title: '', component: 'HeatStart', image: hot1 },
            { name: '2', label: '风冷热泵定时停止', title: '', component: 'HeatStop', image: hot2 },
        ]
    },
    3: {
        name: '照明策略',
        tabs: [
            { name: '1', label: '室内区域照明节能', title: '', component: 'IndoorLighting', image: light11 },
            { name: '2', label: '室外公共照明节能', title: '', component: 'OutdoorLighting', image: light22 },
        ]
    }
}