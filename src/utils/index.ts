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
