import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { IElement, IPageInterface, IProject } from './type';
import { DrawContainerEventController } from '@/services';
import { filter, switchMap, takeUntil, tap } from 'rxjs';
import { useDrawContainerStore, useOperationStackStore } from '.';

/**
 * 项目管理数据库
 */
export const useProjectManageStore = defineStore('projectManageStore', () => {
  const project: IProject = {
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

  // 当前选中页面
  const selectedPage = ref<IPageInterface>(project.pages[0]);
  // 当前选中页面id
  const selectedPageId = computed(() => selectedPage.value.pageId);
  // 当前选中元素集合
  const selectedElements = ref<Array<IElement>>([project.pages[0].elements[0]]);
  // 当前选中元素id集合
  const selectedElementsIds = computed(() =>
    selectedElements.value.map((element) => element.elementId)
  );

  // 撤销回退数据库
  const operationStackStore = useOperationStackStore();

  // 选择模式:单选还是多选
  const selectMode = computed<'单选' | '多选'>(() =>
    selectedElements.value.length === 1 ? '单选' : '多选'
  );

  // 画布控制器
  let drawContainerEventController: DrawContainerEventController;

  // 单选
  const activeElement = (element: IElement) => (selectedElements.value = [element]);
  // 多选
  const activeElements = (elements: IElement[]) => (selectedElements.value = elements);

  // 初始化画布控制器
  const initDrawContainerEventController = (drawContainer: HTMLElement) => {
    drawContainerEventController = new DrawContainerEventController(drawContainer);
    operationStackStore.initHistoryStackMap(project);
    registerElementsMoveEvent();
    registerElementsResizeEvent();
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
                      JSON.stringify(selectedElements.value[0].commonStyle.position) !==
                      tempPosition
                    ) {
                      operationStackStore.pushStack(JSON.stringify(selectedPage.value.elements));
                    }
                  }
                })
              )
            )
          )
        )
      )
      .subscribe(({ movementX, movementY }) => {
        selectedElements.value[0].commonStyle.position.top += Math.round(
          movementY / useDrawContainerStore().scale
        );
        selectedElements.value[0].commonStyle.position.left += Math.round(
          movementX / useDrawContainerStore().scale
        );
      });
  };

  /**
   * @description 元素大小变更事件注册
   * @author Mapotato
   * @date 08/09/2023
   */
  const registerElementsResizeEvent = () => {
    // TODO 接管编辑器组件发出的resize事件
    // let tempPosition: string;
    // drawContainerEventController.mousedown$
    //   .pipe(
    //     filter((e) => {
    //       return selectedElementsIds.value.includes((e.target as HTMLElement).id);
    //     }),
    //     tap(() => {
    //       if (selectMode.value === '单选') {
    //         tempPosition = JSON.stringify(selectedElements.value[0].commonStyle.position);
    //       }
    //     }),
    //     switchMap(() =>
    //       drawContainerEventController.mousemove$.pipe(
    //         takeUntil(
    //           drawContainerEventController.globalMouseup$.pipe(
    //             tap(() => {
    //               if (selectMode.value === '单选') {
    //                 if (
    //                   JSON.stringify(selectedElements.value[0].commonStyle.position) !==
    //                   tempPosition
    //                 ) {
    //                   operationStackStore.pushStack(JSON.stringify(selectedPage.value.elements));
    //                 }
    //               }
    //             })
    //           )
    //         )
    //       )
    //     )
    //   )
    //   .subscribe(({ movementX, movementY }) => {
    //     selectedElements.value[0].commonStyle.position.top += Math.round(
    //       movementY / useDrawContainerStore().scale
    //     );
    //     selectedElements.value[0].commonStyle.position.left += Math.round(
    //       movementX / useDrawContainerStore().scale
    //     );
    //   });
  };

  const initProject = () => {
    // TODO
    // 获取project数据
    // 数据预处理
  };

  return {
    project,
    selectedPage,
    selectedPageId,
    selectedElementsIds,
    selectedElements,
    selectMode,
    activeElement,
    activeElements,
    initProject,
    initDrawContainerEventController
  };
});
