import http from '@/utils/http'


// 创建疾病信息
export function serviceCreateIllness(data: IllnessType.CreateReq) {
  return http.post('/illnessManage/create', data)
}

// 更新疾病信息
export function serviceUpdateIllness(id: string, data: IllnessType.UpdateReq) {
  return http.put('/illnessManage/' + id, data)
}

// 获取疾病信息
export function serviceGetIllnessById(id: string) {
  return http.get('/illnessManage/' + id)
}

// 获取疾病列表
export function serviceGetIllnessList(data: CommonType.Conditions, headers: CommonType.Headers = {} ) {
  return http.post('/illnessManage', data, { headers })
}

// 删除疾病信息
export function serviceDeleteIllness(id: string) {
  return http.delete('/illnessManage/' + id)
}
