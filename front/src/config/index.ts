
const { VITE_HTTP_BASE, VITE_DEV } = import.meta.env
const PROD = VITE_DEV === 'false'
const isDevelopment = !PROD

const CONFIG = {
  isProduction: PROD,
  isDevelopment,
  // 路由 basename
  baseURL: '/',
  // 网页标题
  title: '肉鸽可视化养殖系统',
  http: {
    baseURL: VITE_HTTP_BASE as string
  }
}

export default CONFIG
