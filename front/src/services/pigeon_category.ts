import http from '@/utils/http'


// 创建鸽子种类信息
export function serviceCreatePigeonCategory(data: PigeonCategoryType.CreateReq) {
  return http.post('/pigeonCategoryManage/create', data)
}

// 更新鸽子种类信息
export function serviceUpdatePigeonCategory(id: string, data: PigeonCategoryType.UpdateReq) {
  return http.put('/pigeonCategoryManage/' + id, data)
}

// 获取鸽子种类信息
export function serviceGetPigeonCategoryById(id: string) {
  return http.get('/pigeonCategoryManage/' + id)
}

// 获取鸽子种类列表
export function serviceGetPigeonCategoryList(data: CommonType.Conditions, headers: CommonType.Headers = {} ) {
  return http.post('/pigeonCategoryManage', data, { headers })
}

// 删除鸽子种类信息
export function serviceDeletePigeonCategory(id: string) {
  return http.delete('/pigeonCategoryManage/' + id)
}
