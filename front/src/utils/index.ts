export * from './helper'
export * from './date'
export * from './aes'
import type { RcFile } from 'antd/es/upload'
import { isEmpty, isNull, isString, isUndefined } from 'lodash'

export function filterOption(input: string, option: any): boolean {
  if (Array.isArray(option.options)) {
    return option.options
      .some((item: any) => item.children.toLowerCase().indexOf(input.toLowerCase()) >= 0)
  } else {
    return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
  }
}

export function sleep(delay?: number) {
  return new Promise(resolve => setTimeout(resolve, delay))
}

export const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = error => reject(error)
  })

export function base64ToBlob(base64Data: string) {
  let arr = base64Data.split(',') as any,
    fileType = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    l = bstr.length,
    u8Arr = new Uint8Array(l)

  while (l--) {
    u8Arr[l] = bstr.charCodeAt(l)
  }
  return new Blob([u8Arr], {
    type: fileType
  })
}

export const trimInputValue = (e:any) => e.target?.value?.replace(/(^\s*)|(\s*$)/g, '');

export const trimObjectValue = (obj: any) => {
  const trimObj:any = {};
  Object.keys(obj).forEach(key => {
    if(isString(obj[key])) {
      trimObj[key] = obj[key].trim();
      return;
    }
    trimObj[key] = obj[key];
  })
  return trimObj
}

export const clearEmptyObject = (obj: any) => {
  const newObj:any = {};
  Object.keys(obj).forEach(key => {
    if(isEmpty(obj[key] || isNull(obj[key] || isUndefined(obj[key])))){
      return;
    }
    newObj[key] = obj[key];
  })
  return newObj
}