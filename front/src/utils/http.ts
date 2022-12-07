import axios from 'axios'
import type { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios'
import CONFIG from '@/config'
import type { IStore } from '@/store'
import { message, notification } from 'antd'
import { LOCAL_STORAGE } from '@/constants'

interface RespData {
  code?: number,
  msg?: string
  data?: any
  [key: string]: any
}

let exiting = false

function handleError(error: AxiosError) {
  const response = error.response
  notification.error({
    message: `Error Code: ${response?.status ?? -1}`,
    description: response?.statusText ?? '服务器出小差'
  })
}

interface IAxiosInstance {
  get(url: string, config?: AxiosRequestConfig): Promise<Record<string, any>>
  delete(url: string, config?: AxiosRequestConfig): Promise<Record<string, any>>
  post(url: string, data?: any, config?: AxiosRequestConfig): Promise<Record<string, any>>
  put(url: string, data?: any, config?: AxiosRequestConfig): Promise<Record<string, any>>
}

const httpInstance: IAxiosInstance & AxiosInstance = axios.create({
  timeout: 60000,
  baseURL: CONFIG.http.baseURL
})
httpInstance.defaults.headers.common.isLoading = 'true'
httpInstance.defaults.headers.common.errorAlert = 'true'
httpInstance.defaults.headers.common.successAlert = 'true'
httpInstance.defaults.withCredentials = true;
Object.setPrototypeOf(httpInstance, axios)

httpInstance.interceptors.request.use(function (config) {
  const method = config.method
  const userState: LoginType.Res['userInfo'] = JSON.parse(localStorage.getItem(LOCAL_STORAGE.USER)!) || {};

  if (userState.token && config.headers) {
    config.headers.token = userState.token;
    config.headers['x-csrf-token'] = userState.csrfToken!;
  }

  const data: Record<string, any> = {}

  if (method === 'post' || method === 'put') {
    if (config.data instanceof FormData) {
      for (let key in data) {
        config.data.append(key, data[key])
      }
    } else {
      config.data = Object.assign(data, config.data)
    }
  }

  return config
}, function (error) {
  handleError(error)
  return Promise.reject(error)
})


httpInstance.interceptors.response.use(function (res) {
  const headers = res.config.headers
  const data: RespData = res.data

  if (data.code === 1 && headers?.successAlert) {
    message.success(data.msg || '操作成功')
  }
  if (data.code === -1 && headers?.errorAlert) {
    message.error(data.msg || '操作失败')
  }

  if (data.code === 401 && !exiting) {
    exiting = true
    message.error(data.msg)
    location.href = '/'
  }

  if (res.status === 500) {
    if (headers?.errorAlert) {
      notification.error({
        message: `Error Code: ${data.code ?? -1}`,
        description: data.msg ?? '服务器出小差'
      })
    }
    throw res
  }
  return data || res
}, function (error) {
  handleError(error)
  return Promise.reject(error)
})


export default httpInstance
