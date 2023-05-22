import { isNil } from 'lodash-es'
/**
 * 返回传入值的保留小数值
 * @remarks
 * 值四舍五入并保留几位小数
 * @param number - 默认值
 * @param precision - 小数点位数
 * @returns string
 * @example
 * ```ts
 * roundToFixed(6, 2)
 * => 6.00
 * roundToFixed(6.345)
 * => 6.35
 * roundToFixed('你好')
 * => '你好'
 * roundToFixed(undefined)
 * => undefined
 * roundToFixed(null)
 * => null
 * roundToFixed('')
 * => ''
 * ```
 */
function roundToFixed(value: string | number, precision = 2) {
  if (Number.isNaN(value as number) || value === '' || isNil(value)) {
    return value as string
  }
  if (+value >= 0) {
    return (Math.round(+`${value}e${precision}`) / Math.pow(10, precision)).toFixed(precision);
  }
  return ((Math.round((+`${value}e${precision}`) * -1) / Math.pow(10, precision)) * -1).toFixed(precision);
}

export {
  roundToFixed
}
