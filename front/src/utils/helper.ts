import { message } from 'antd'

/**
 * 计算百分比
 * @example
 * totalPercentage(8589934592, 225492992)  // => 98
 */
export function totalPercentage(totalmem: number, freemem: number) {
  return Math.floor((totalmem - freemem) / totalmem * 100)
}

// 全屏浏览器
export function fullscreen() {
  try {
    const docElm = document.documentElement as any
    if (docElm.requestFullscreen) {
      docElm.requestFullscreen()
    } else if (docElm.webkitRequestFullScreen) {
      docElm.webkitRequestFullScreen()
    } else if (docElm.mozRequestFullScreen) {
      docElm.mozRequestFullScreen()
    } else if (docElm.msRequestFullscreen) {
      docElm.msRequestFullscreen()
    }
  } catch {
    message.warn('您所使用的浏览器不支持全屏')
  }
}

// 退出全屏浏览器
export function exitFullscreen() {
  try {
    const doc = document as any
    if (doc.exitFullscreen) {
      doc.exitFullscreen()
    } else if (doc.mozCancelFullScreen) {
      doc.mozCancelFullScreen()
    } else if (doc.webkitCancelFullScreen) {
      doc.webkitCancelFullScreen()
    } else if (doc.msExitFullscreen) {
      doc.msExitFullscreen()
    }
  } catch {
    message.warn('您所使用的浏览器不支持退出全屏, 请按ESC')
  }
}

// 随机字符串
export function randomCode(num = 4) {
  const CODE = 'qwertyuipasdfghjklxcvbnm13456789'
  let data = ''

  for (let i = 0; i < num; i++) {
    const random = Math.floor(Math.random() * CODE.length)
    data += CODE[random]
  }

  return data
}

interface Options {
  /** 大小的字段名 */
  sizeField: string;
  /** 总数的字段名 */
  countField: string;
  /** 列表的字段名 */
  listField: string;
  /** 当前页的字段名 */
  pageField: string;
}

/** 请求参数肯定需要 page 和 pageSize 才能做批量并发请求 */
interface Params {
  page: number;
  pageSize: number;
  [key: string]: any;
}

const defaultOptions: Options = {
  sizeField: 'pageSize',
  countField: 'totalElements',
  listField: 'content',
  pageField: 'page',
}

export const getTotalDataByPromiseAll = async (api: (params?: Params) => Promise<any>, params: Params, options = defaultOptions) => {
  const { sizeField, countField, listField, pageField } = options;
  const size = params[sizeField];
  // 覆盖 page 属性 为 0，保证从第一页请求
  params = { ...params, [pageField]: 0 };
  const firstRes = await api(params);
  const totalCount = firstRes[countField]
  // 数据量小于size 则 直接返回
  if (totalCount < size) {
    return Promise.resolve(firstRes[listField])
  }
  const promiseArr = [];
  const totalData = [{ index: 0, list: firstRes[listField] }];
  let page = 1; // 从第二页开始请求
  while (size * page < totalCount) {
    const Fn = api({ ...params, [pageField]: page }).then((res) => {
      totalData.push({
        index: page,
        list: res[listField],
      });
    });
    promiseArr.push(Fn);
    page++;
  }
  await Promise.all(promiseArr);
  return [].concat(...totalData.sort((a, b) => a.index - b.index).map(i => i.list));
}