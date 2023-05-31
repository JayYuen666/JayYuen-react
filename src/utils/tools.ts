import { isNil } from 'lodash-es'
import { Nullable, Arrayable } from './types'
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
function roundToFixed(value: any, precision = 2) {
  if (Number.isNaN(value as number) || value === '' || isNil(value)) {
    return value as string
  }
  if (+value >= 0) {
    return (Math.round(+`${value}e${precision}`) / Math.pow(10, precision)).toFixed(precision);
  }
  return ((Math.round((+`${value}e${precision}`) * -1) / Math.pow(10, precision)) * -1).toFixed(precision);
}
/**
 * 将 `Arrayable<T>` 转换为 `Array<T>`
 * @category Array
 * @param array  Nullable<Arrayable<T>>
 * @returns Array<T>
 */
function toArray<T>(array?: Nullable<Arrayable<T>>): Array<T> {
  array = array ?? []
  return Array.isArray(array) ? array : [array]
}

/**
 * 数组去重
 * @category Array
 * @param array readonly T[]
 * @returns T[]
 */
function uniq<T>(array: readonly T[]): T[] {
  return Array.from(new Set(array))
}

/**
 * 从数组中获取随机项
 * @category Array
 * @param arr T[]
 * @param quantity number
 * @returns T[]
 */
function sample<T>(arr: T[], quantity: number) {
  return Array.from({ length: quantity }, () => arr[Math.round(Math.random() * (arr.length - 1))])
}

/**
 * 移动数组中的元素
 * @category Array
 * @param arr
 * @param from
 * @param to
 */
function move<T>(arr: T[], from: number, to: number) {
  arr.splice(to, 0, arr.splice(from, 1)[0])
  return arr
}

const toString = (v: any) => Object.prototype.toString.call(v)

/**
 * 获取数据类型名称
 * @param v any
 * @returns string
 */
function getTypeName(v: any) {
  if (v === null) {
    return 'null'
  }
  const type = toString(v).slice(8, -1).toLowerCase()
  return (typeof v === 'object' || typeof v === 'function') ? type : typeof v
}

/**
 * 判断两个值是否相等
 * @param value1 any
 * @param value2 any
 * @returns boolean
 */
function isDeepEqual(value1: any, value2: any): boolean {
  const type1 = getTypeName(value1)
  const type2 = getTypeName(value2)
  if (type1 !== type2) {
    return false
  }

  if (type1 === 'array') {
    if (value1.length !== value2.length) {
      return false
    }

    return value1.every((item: any, i: number) => {
      return isDeepEqual(item, value2[i])
    })
  }
  if (type1 === 'object') {
    const keyArr = Object.keys(value1)
    if (keyArr.length !== Object.keys(value2).length) {
      return false
    }

    return keyArr.every((key: string) => {
      return isDeepEqual(value1[key], value2[key])
    })
  }
  return Object.is(value1, value2)
}
/**
 * 判断是否没有值
 * @param val
 * @returns boolean
 */
const isDef = <T = any>(val?: T): val is T => typeof val !== 'undefined'
const isBoolean = (val: any): val is boolean => typeof val === 'boolean'
const isFunction = <T extends Function>(val: any): val is T => typeof val === 'function'
const isNumber = (val: any): val is number => typeof val === 'number'
const isString = (val: unknown): val is string => typeof val === 'string'
const isObject = (val: any): val is object => toString(val) === '[object Object]'
const isUndefined = (val: any): val is undefined => toString(val) === '[object Undefined]'
const isNull = (val: any): val is null => toString(val) === '[object Null]'
const isRegExp = (val: any): val is RegExp => toString(val) === '[object RegExp]'
const isDate = (val: any): val is Date => toString(val) === '[object Date]'
const isWindow = (val: any): boolean => typeof window !== 'undefined' && toString(val) === '[object Window]'
const isBrowser = typeof window !== 'undefined'

/**
 * 确定对象是否具有具有指定名称的属性
 * @param obj
 * @param v
 * @returns
 */
function hasOwnProperty<T>(obj: T, v: PropertyKey) {
  if (isNull(obj)) {
    return false
  }
  return Object.prototype.hasOwnProperty.call(obj, v)
}
/**
  * 加减乘除运算
  */
const accAdd = (arg1, arg2) => {
    let r1, r2, m;
    try {
        r1 = arg1.toString().split(".")[1].length;
    } catch (e) {
        r1 = 0;
    };
    try {
        r2 = arg2.toString().split(".")[1].length;
    } catch (e) {
        r2 = 0;
    };
    m = Math.pow(10, Math.max(r1, r2));
    return (arg1 * m + arg2 * m) / m;
};
const accMul = (arg1, arg2) => {
    let m = 0;
    let s1 = arg1.toString();
    let s2 = arg2.toString();
    try {
        m += s1.split(".")[1].length;
    } catch (e) { };
    try {
        m += s2.split(".")[1].length;
    } catch (e) { };
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
};
const accDiv = (arg1, arg2) => {
    let s1 = arg1.toString();
    let s2 = arg2.toString();
    let t1 = 0;
    let t2 = 0;
    let r1;
    let r2;
    try {
        t1 = s1.split(".")[1].length;
    } catch (e) { };
    try {
        t2 = s2.split(".")[1].length;
    } catch (e) { };
    r1 = Number(s1.replace(".", ""));
    r2 = Number(s2.replace(".", ""));
    return (r1 / r2) * Math.pow(10, t2 - t1);
};
const calcFn = {
    add() {
        let arg = Array.from(arguments);
        return arg.reduce((total, num) => accAdd(total, num));
    },
    sub() {
        let arg = Array.from(arguments);
        return arg.reduce((total, num) => accAdd(total, num * -1));
    },
    mul() {
        let arg = Array.from(arguments);
        return arg.reduce((total, num) => accMul(total, num));
    },
    div() {
        let arg = Array.from(arguments);
        return arg.reduce((total, num) => accDiv(total, num));
    },
};

export {
  roundToFixed,
  toArray,
  uniq,
  sample,
  move,
  toString,
  getTypeName,
  isDeepEqual,
  isDef,
  isBoolean,
  isFunction,
  isNumber,
  isString,
  isObject,
  isUndefined,
  isNull,
  isRegExp,
  isDate,
  isWindow,
  isBrowser,
  hasOwnProperty
}
