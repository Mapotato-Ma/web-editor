import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { E_Direction, IElement, IPageInterface, IProject } from './type';
import { DrawContainerEventController } from '@/services';
import { filter, switchMap, takeUntil, tap } from 'rxjs';
import { useDrawContainerStore, useOperationStackStore } from '.';
import { deepClone, getObjectAttribute } from '@/utils';

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
              },
              rotate: 0
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
              },
              rotate: 0
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
              },
              rotate: 0
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
          return (
            selectedElementsIds.value.includes((e.target as HTMLElement).id) &&
            useDrawContainerStore().cursor === 'default'
          );
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
                      operationStackStore.pushStack();
                    }
                  }
                })
              )
            )
          )
        )
      )
      .subscribe(({ movementX, movementY }) => {
        selectedElements.value[0].commonStyle.position.top += Math.trunc(
          movementY / useDrawContainerStore().scale
        );
        selectedElements.value[0].commonStyle.position.left += Math.trunc(
          movementX / useDrawContainerStore().scale
        );
      });
  };

  // 重置大小映射
  const resizeDirectionMap = {
    [E_Direction.左上]: [1, 1, -1, -1],
    [E_Direction.中上]: [1, 0, -1, 0],
    [E_Direction.右上]: [1, 0, -1, 1],
    [E_Direction.左中]: [0, 1, 0, -1],
    [E_Direction.右中]: [0, 0, 0, 1],
    [E_Direction.左下]: [0, 1, 1, -1],
    [E_Direction.中下]: [0, 0, 1, 0],
    [E_Direction.右下]: [0, 0, 1, 1]
  };

  // 设置当前元素大小
  const setReSize = (resizeValue: {
    direction: E_Direction;
    distanceX: number;
    distanceY: number;
  }) => {
    // 排除比例影响
    resizeValue.distanceY /= useDrawContainerStore().scale;
    resizeValue.distanceX /= useDrawContainerStore().scale;
    if (selectMode.value === '单选') {
      const [top, left, height, width] = resizeDirectionMap[resizeValue.direction];
      const { position, size } = selectedElements.value[0].commonStyle;
      position.top += top * resizeValue.distanceY;
      position.left += left * resizeValue.distanceX;
      size.height += height * resizeValue.distanceY;
      size.width += width * resizeValue.distanceX;
    }
  };

  // 设置当前元素旋转角度
  const setRotate = (rotate: number) => {
    if (selectMode.value === '单选') {
      selectedElements.value[0].commonStyle.rotate = rotate;
    }
  };

  const initProject = () => {
    // TODO
    // 获取project数据
    // 数据预处理
  };

  // 状态值
  let stateValue: any;

  /**
   * 操作状态过滤入栈
   * @param type 操作类型
   * @param state 操作状态值
   * @returns
   */
  const commitState = (type: 'start' | 'end', state: { keys: string[] }) => {
    const extractValue = getObjectAttribute(selectedElements.value[0], state.keys);
    if (type === 'start') {
      stateValue = deepClone(extractValue);
      return;
    }
    if (JSON.stringify(stateValue) === JSON.stringify(extractValue)) return;
    void operationStackStore.pushStack();
  };

  return {
    project,
    selectedPage,
    selectedPageId,
    selectedElementsIds,
    selectedElements,
    selectMode,
    commitState,
    setReSize,
    setRotate,
    activeElement,
    activeElements,
    initProject,
    initDrawContainerEventController
  };
});
