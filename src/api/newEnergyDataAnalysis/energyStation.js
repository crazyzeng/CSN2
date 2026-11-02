// 能源站监测
import request from '@/utils/request';


// 能源站监测数据
export function handleEnergyStation() { 
  return request({
    method: 'get',
    url: `/homePage/new/energyStationData`
  })
}

// 能源站树
export function handleEnergyStationTree() { 
  return request({
    method: 'get',
    url: `/homePage/new/energyStationTree`
  })
}

// websocket
