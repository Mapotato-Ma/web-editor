import { defineStore } from 'pinia';
import { IDataSlice, IProject } from './type';
import { useProjectManageStore } from '.';
import { Subject } from 'rxjs';
import { ref } from 'vue';

/**
 * 操作栈数据库
 */
export const useOperationStackStore = defineStore('operationStackStore', () => {
  // TODO 此处为了调试撤销回退特意做了响应式数据展示右侧面板，后期去掉以节省性能
  const historyStackMap = ref<
    Map<string, { historyStackPointer: number; historyStack: Array<IDataSlice> }>
  >(new Map());

  const redoUndo$: Subject<{
    type: 'redo' | 'undo';
  }> = new Subject();

  // 项目管理数据库
  const projectManageStore = useProjectManageStore();

  // 入栈
  const pushStack = (sliceValue: string) => {
    const currentHistory = historyStackMap.value.get(projectManageStore.selectedPageId);
    console.trace('🚀 ~ 入栈 ~ 23行', projectManageStore.selectedPage);
    if (currentHistory) {
      const { historyStack } = currentHistory;
      if (historyStack.length === 100) {
        historyStack.shift();
      }
      currentHistory.historyStack.push({ sliceValue });
      currentHistory.historyStackPointer = historyStack.length - 1;
    }
  };

  // 撤销
  const redo = () => {
    const currentHistory = historyStackMap.value.get(projectManageStore.selectedPageId);
    if (currentHistory) {
      const { historyStack, historyStackPointer } = currentHistory;
      if (historyStack.length > 1 && historyStackPointer > 0) {
        projectManageStore.selectedPage.elements = JSON.parse(
          currentHistory.historyStack[--currentHistory.historyStackPointer].sliceValue
        );
        redoUndo$.next({ type: 'redo' });
      }
    }
  };

  // 回退
  const undo = () => {
    const currentHistory = historyStackMap.value.get(projectManageStore.selectedPageId);
    if (currentHistory) {
      const { historyStack, historyStackPointer } = currentHistory;
      if (historyStack.length - 1 > historyStackPointer) {
        projectManageStore.selectedPage.elements = JSON.parse(
          currentHistory.historyStack[++currentHistory.historyStackPointer].sliceValue
        );
        redoUndo$.next({ type: 'undo' });
      }
    }
  };

  /**
   * @description 初始化撤销回退栈
   * @author Mapotato
   * @date 09/09/2023
   * @param {IProject} project 项目数据
   */
  const initHistoryStackMap = (project: IProject) => {
    project.pages.forEach((page) => {
      historyStackMap.value.set(page.pageId, {
        historyStackPointer: 0,
        historyStack: [
          {
            sliceValue: JSON.stringify(page.elements)
          }
        ]
      });
    });
  };

  return { historyStackMap, initHistoryStackMap, pushStack, redo, undo };
});
