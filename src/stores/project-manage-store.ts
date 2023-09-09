import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { element, pageInterface, project } from './type';
import { DrawContainerEventController } from '@/services';
import { filter, switchMap, takeUntil, tap } from 'rxjs';
import { useDrawContainerStore, useOperationStackStore } from '.';

/**
 * 项目管理数据库
 */
export const useProjectManageStore = defineStore('projectManageStore', () => {
  const project: project = {
    pages: [
      {
        pageId: '页面1',
        elements: [
          {
            elementId: '页面1-元素1',
            elementType: '矩形',
            commonStyle: {
              position: {
                top: 200,
                left: 200
              },
              size: {
                width: 200,
                height: 200
              }
            }
          },
          {
            elementId: '页面1-元素2',
            elementType: '矩形',
            commonStyle: {
              position: {
                top: 300,
                left: 800
              },
              size: {
                width: 100,
                height: 100
              }
            }
          }
        ]
      },
      {
        pageId: '页面2',
        elements: [
          {
            elementId: '页面2-元素1',
            elementType: '矩形',
            commonStyle: {
              position: {
                top: 300,
                left: 800
              },
              size: {
                width: 100,
                height: 100
              }
            }
          }
        ]
      }
    ],
    projectId: '项目1'
  };

  const selectedPage = ref<pageInterface>(project.pages[0]);
  const selectedElements = ref<Array<element>>([project.pages[0].elements[0]]);
  const selectedElementsIds = computed(() =>
    selectedElements.value.map((element) => element.elementId)
  );

  const operationStackStore = useOperationStackStore();

  // 选择模式:单选还是多选
  const selectMode = computed<'单选' | '多选'>(() =>
    selectedElements.value.length === 1 ? '单选' : '多选'
  );

  let drawContainerEventController: DrawContainerEventController;

  // 单选
  const activeElement = (element: element) => (selectedElements.value = [element]);
  // 多选
  const activeElements = (elements: element[]) => (selectedElements.value = elements);

  const initDrawContainerEventController = (drawContainer: HTMLElement) => {
    drawContainerEventController = new DrawContainerEventController(drawContainer);
    registerElementsMoveEvent();
  };

  /**
   * @description 元素移动事件注册
   * @author Mapotato
   * @date 08/09/2023
   */
  const registerElementsMoveEvent = () => {
    let tempPosition: string;
    drawContainerEventController.mousedown$
      .pipe(
        filter((e) => {
          return selectedElementsIds.value.includes((e.target as HTMLElement).id);
        }),
        tap(() => {
          if (selectMode.value === '单选') {
            operationStackStore.pushStack({
              elementId: selectedElements.value[0].elementId,
              currentValue: JSON.stringify(selectedElements.value[0].commonStyle.position),
              keyName: 'position',
              keyPath: ['commonStyle']
            });
            tempPosition = JSON.stringify(selectedElements.value[0].commonStyle.position);
          }
        }),
        switchMap(() =>
          drawContainerEventController.mousemove$.pipe(
            takeUntil(
              drawContainerEventController.globalMouseup$.pipe(
                tap(() => {
                  if (selectMode.value === '单选') {
                    if (
                      JSON.stringify(selectedElements.value[0].commonStyle.position) ===
                      tempPosition
                    ) {
                      // 位置没有发生变化，撤销无意义
                      operationStackStore.popStack();
                    } else {
                      operationStackStore.pushStack({
                        elementId: selectedElements.value[0].elementId,
                        currentValue: JSON.stringify(
                          selectedElements.value[0].commonStyle.position
                        ),
                        keyName: 'position',
                        keyPath: ['commonStyle']
                      });
                    }
                  }
                })
              )
            )
          )
        )
      )
      .subscribe(({ movementX, movementY }) => {
        selectedElements.value[0].commonStyle.position.top +=
          movementY / useDrawContainerStore().scale;
        selectedElements.value[0].commonStyle.position.left +=
          movementX / useDrawContainerStore().scale;
      });
  };

  const initProject = () => {
    // TODO
    // 获取project数据
    // 数据预处理
  };

  return {
    project,
    selectedPage,
    selectedElementsIds,
    selectedElements,
    selectMode,
    activeElement,
    activeElements,
    initProject,
    initDrawContainerEventController
  };
});
