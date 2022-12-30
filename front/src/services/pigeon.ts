import http from '@/utils/http'


// 创建鸽子信息
export function serviceCreatePigeon(data: PigeonType.CreateReq) {
  return http.post('/pigeonManage/create', data)
}

// 更新鸽子信息
export function serviceUpdatePigeon(id: string, data: PigeonType.UpdateReq) {
  return http.put('/pigeonManage/' + id, data)
}

// 获取鸽子信息
export function serviceGetPigeonById(id: string) {
  return http.get('/pigeonManage/' + id)
}

// 获取鸽子列表
export function serviceGetPigeonList(data: CommonType.Conditions, headers: CommonType.Headers = {} ) {
  return http.post('/pigeonManage', data, { headers })
}

// 删除鸽子信息
export function serviceDeletePigeon(id: string) {
  return http.delete('/pigeonManage/' + id)
}
