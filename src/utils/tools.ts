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
const isObject = (val: any) => toString(val) === '[object Object]'
const isArray = (val: any): val is any[] => toString(val) === '[object Array]'
const isUndefined = (val: any): val is undefined => toString(val) === '[object Undefined]'
const isNull = (val: any): val is null => toString(val) === '[object Null]'
const isRegExp = (val: any): val is RegExp => toString(val) === '[object RegExp]'
const isDate = (val: any): val is Date => toString(val) === '[object Date]'
const isSet = (val: any): boolean => toString(val) === '[object Set]'
const isSymbol = (val: any): val is Symbol => toString(val) === '[object Symbol]'
const isMap = (val: any) => toString(val) === '[object Map]'
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
 * 深拷贝
 * @param {Object} obj 要拷贝的对象
 * @param {weakMap} weakMap 用于存储循环引用对象的地址
 */
function deepClone(value: any, weakMap: any = new WeakMap()) {
  if (isFunction(value)) {
    if (/^function/.test(value.toString()) || /^\(\)/.test(value.toString())) {
      return new Function('return ' + value.toString())()
    }
    return new Function('return function ' + value.toString())()
  }
  if (isDate(value)) {
    return new Date(value.valueOf())
  }
  if (isSymbol(value)) {
    return Symbol(value.description)
  }
  if (isSet(value)) {
    const newSet = new Set()
    for (const item of value) {
      newSet.add(deepClone(item, weakMap))
    }
    return newSet
  }
  if (isMap(value)) {
    const newMap = new Map()
    for (const item of value) {
      newMap.set(deepClone(item[0], weakMap), deepClone(item[1], weakMap))
    }
    return newMap
  }
  if (weakMap.has(value)) {
    return weakMap.get(value)
  }
  if (isArray(value)) {
    const newArr: any[] = [];
    for (const item in value) {
      newArr[item] = deepClone(value[item], weakMap);
    }
    return newArr
  }
  if (!(isObject(value))) {
    return value
  }
  const newObj: any = isArray(value) ? [] : {}
  weakMap.set(value, newObj)

  for (const key in value) {
    if (isArray(value[key])) {
      deepClone(value[key], weakMap);
    }
    weakMap.set(value, newObj)
    newObj[key] = deepClone(value[key], weakMap)
  }
  const symbolKeys = Object.getOwnPropertySymbols(value)
  for (const sKey of symbolKeys) {
    newObj[sKey] = deepClone(value[sKey], weakMap)
  }
  return newObj
}
/**
 * 获取当前时间
 * @param needTime Boolean 是否需要返回时分秒
 * @returns
 */
function getCurrentDate(needTime = false) {
  const d = new Date();
  let month: string | number = d.getMonth() + 1;
  month = month < 10 ? `0${month}` : month;
  const date = `${d.getFullYear()}-${month}-${d.getDate()}`;
  const time = `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
  if (needTime) {
    return [date, time].join(' ');
  }
  return date;
}
/**
  *
  */
const accAdd = (arg1: number, arg2: number) => {
  let r1, r2;
  try {
    r1 = arg1.toString().split('.')[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    r2 = arg2.toString().split('.')[1].length;
  } catch (e) {
    r2 = 0;
  }
  const m = Math.pow(10, Math.max(r1, r2));
  return (arg1 * m + arg2 * m) / m;
};
const accMul = (arg1: number, arg2: number) => {
  let m = 0;
  const s1 = arg1.toString();
  const s2 = arg2.toString();
  try {
    m += s1.split('.')[1].length;
  } catch (e) { /* empty */ }
  try {
    m += s2.split('.')[1].length;
  } catch (e) { /* empty */ }
  return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m);
};
const accDiv = (arg1: number, arg2: number) => {
  const s1 = arg1.toString();
  const s2 = arg2.toString();
  let t1 = 0;
  let t2 = 0;
  try {
    t1 = s1.split('.')[1].length;
  } catch (e) { /* empty */ }
  try {
    t2 = s2.split('.')[1].length;
  } catch (e) { /* empty */ }
  const r1 = Number(s1.replace('.', ''));
  const r2 = Number(s2.replace('.', ''));
  return (r1 / r2) * Math.pow(10, t2 - t1);
};
/**
 * 加减乘除运算
 */
const calcFn = {
  add(...args: number[]) {
    return args.reduce((total, num) => accAdd(total, num));
  },
  sub(...args: number[]) {
    return args.reduce((total, num) => accAdd(total, num * -1));
  },
  mul(...args: number[]) {
    return args.reduce((total, num) => accMul(total, num));
  },
  div(...args: number[]) {
    return args.reduce((total, num) => accDiv(total, num));
  }
};

/**
 * 数组对象根据某属性去重
 * @param array 数组
 * @param key 对象属性值
 * @returns
 */
function uniqueArrayObject(array: { [key: string]: any }[], key: string) {
  const map = new Map()
  const result: { [key: string]: any }[] = []
  array.forEach(item => {
    if (!map.has(item[key])) {
      map.set(item[key], true)
      result.push(item)
    }
  })
  return result
}

/**
 * 去除请求参数中的无效值
 * @param obj
 * @returns
 */
function filterParams(obj: { [x: string]: any; }) {
  const _newPar: { [x: string]: any; } = {};
  for (const key in obj) {
    if (([0, false].includes(obj[key]) || obj[key]) && obj[key].toString().replace(/(^\s*)|(\s*$)/g, '') !== '') {
      _newPar[key] = obj[key];
    }
  }
  return _newPar;
}

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
  hasOwnProperty,
  deepClone,
  getCurrentDate,
  calcFn,
  uniqueArrayObject,
  filterParams
}
