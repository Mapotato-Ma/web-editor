import { defineStore } from 'pinia';
import { element, stackItem } from './type';
import { useProjectManageStore } from '.';

/**
 * 操作栈数据库
 */
export const useOperationStackStore = defineStore('operationStackStore', () => {
  // 撤销回退栈
  const historyStack: Array<stackItem> = [];
  // 撤销游标
  let historyStackPointer = 0;
  // 项目管理数据库
  const projectManageStore = useProjectManageStore();

  // 入栈
  const pushStack = (stackItem: stackItem) => {
    if (historyStack.length === 100) {
      historyStack.shift();
    }
    historyStack.push(stackItem);
    historyStackPointer = historyStack.length - 1;
    console.trace('🚀 ~ 入栈 ~ 23行', historyStack);
  };
  // 出栈
  const popStack = () => {
    historyStack.pop();
    historyStackPointer--;
    console.trace('🚀 ~ 出栈 ~ 23行', historyStack);
  };

  // 撤销
  const redo = () => {
    console.log('🚀 ~  ~ 45行', historyStack, historyStackPointer);
    if (historyStack.length > 1 && historyStackPointer > 0) {
      historyStackPointer--;
      const element = projectManageStore.selectedPage.elements.find(
        (element) => element.elementId === historyStack?.[historyStackPointer]?.elementId
      );
      if (element) {
        setAttribute(element);
      }
    }
  };

  // 回退
  const undo = () => {
    console.log('🚀 ~  ~ 45行', historyStack, historyStackPointer);
    if (historyStack.length - 1 > historyStackPointer) {
      historyStackPointer++;
      const element = projectManageStore.selectedPage.elements.find(
        (element) => element.elementId === historyStack[historyStackPointer].elementId
      );
      element && setAttribute(element);
    }
  };

  /**
   * @description 设置属性
   * @author Mapotato
   * @date 06/09/2023
   * @param {element} element
   */
  const setAttribute = (element: element) => {
    try {
      historyStack[historyStackPointer].keyPath.reduce((pre: any, cur: string) => {
        return pre?.[cur];
      }, element)[historyStack[historyStackPointer].keyName] = JSON.parse(
        historyStack[historyStackPointer].currentValue
      );
    } catch (error) {
      console.log('🚀 ~ 撤销解析数据失败 ~ 68行');
    }
    // if (element.elementId === projectManageStore.selectedElement.elementId) {
    //   // 更新右侧面板
    // }
  };

  return { historyStack, pushStack, popStack, redo, undo };
});
