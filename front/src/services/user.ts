import http from '@/utils/http'

// 通过账号密码登录
export function serviceLogin(data: LoginType.Req) {
  return http.post('/login', data)
}

// 创建用户信息
export function serviceCreateUser(data: UserType.CreateReq) {
  return http.post('/user', data)
}

// 检查用户名重复
export function serviceCheckAccount(data: { account: string }) {
  return http.post('/user/check_account', data, {
    headers: {
      successAlert: false,
      errorAlert: false
    }
  })
}

// 更新用户信息
export function serviceUpdateUser(id: string, data: UserType.UpdateReq) {
  return http.put('/user/' + id, data)
}

// 获取用户信息
export function serviceGetUserById(id: string) {
  return http.get('/user/' + id)
}

// 获取用户列表
export function serviceGetUserList(params: CommonType.Pagination) {
  return http.get('/user', { params })
}

// 删除用户信息
export function serviceDeleteUser(id: string) {
  return http.delete('/user/' + id)
}
