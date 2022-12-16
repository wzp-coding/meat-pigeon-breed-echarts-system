import http from '@/utils/http'


// 创建饲料信息
export function serviceCreateFeed(data: FeedType.CreateReq) {
  return http.post('/feedManage/create', data)
}

// 更新饲料信息
export function serviceUpdateFeed(id: string, data: FeedType.UpdateReq) {
  return http.put('/feedManage/' + id, data)
}

// 获取饲料信息
export function serviceGetFeedById(id: string) {
  return http.get('/feedManage/' + id)
}

// 获取饲料列表
export function serviceGetFeedList(data: CommonType.Conditions, headers: CommonType.Headers = {} ) {
  return http.post('/feedManage', data, { headers })
}

// 删除饲料信息
export function serviceDeleteFeed(id: string) {
  return http.delete('/feedManage/' + id)
}
