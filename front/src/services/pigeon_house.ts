import http from '@/utils/http'


// 创建鸽舍信息
export function serviceCreatePigeonHouse(data: PigeonHouseType.CreateReq) {
  return http.post('/pigeonHouseManage/create', data)
}

// 更新鸽舍信息
export function serviceUpdatePigeonHouse(id: string, data: PigeonHouseType.UpdateReq) {
  return http.put('/pigeonHouseManage/' + id, data)
}

// 获取鸽舍信息
export function serviceGetPigeonHouseById(id: string) {
  return http.get('/pigeonHouseManage/' + id)
}

// 获取鸽舍列表
export function serviceGetPigeonHouseList(data: CommonType.Conditions, headers: CommonType.Headers = {} ) {
  return http.post('/pigeonHouseManage', data, { headers })
}

// 删除鸽舍信息
export function serviceDeletePigeonHouse(id: string) {
  return http.delete('/pigeonHouseManage/' + id)
}

// 投喂饲料
export function servicePostFeedPigeon(data: PigeonHouseType.Feed) {
  return http.post('/pigeonHouseManage/feed', data)
}
