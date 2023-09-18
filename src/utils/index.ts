import { isReactive, isRef, toRaw, unref } from 'vue';

/**
 * 清空页面焦点状态
 * @returns
 */
export const clearFocusStatus = () => (<HTMLInputElement>document.activeElement)?.blur();

/**
 * 将数字转化为px值（默认保留两位小数）
 * @param number 需要转化的数字
 * @returns 组装好的px值
 */
export const numberToPx = (number: number, precision?: number) =>
  `${number.toFixed(precision ?? 2)}px`;

/**
 * 弧度转角度
 * @param arc 弧度值
 * @returns 角度值
 */
export const arcToDeg = (arc: number) => arc * (180 / Math.PI);

/**
 * 深拷贝
 * @param data 拷贝数据
 * @returns 拷贝后数据
 */
export const deepClone = <T>(data: T) => {
  if (isRef(data) || isReactive(data)) {
    return structuredClone(toRaw(unref(data)));
  } else {
    return structuredClone(data);
  }
};

/**
 * 给dom元素设置样式
 * @param dom 需设置的元素
 * @param param 设置值
 */
export const setStyle = (dom: HTMLElement | null, [key, value]: string[]) => {
  dom?.style.setProperty(key, value);
};

export const getObjectAttribute = (object: any, keys: string[]) =>
  keys.reduce((a, v) => a?.[v], object);
