/**
 * 清空页面焦点状态
 * @returns
 */
export const clearFocusStatus = () => (<HTMLInputElement>document.activeElement)?.blur();
