import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { E_Direction, IPageInterface, IProject } from './type';
import { DrawContainerEventController } from '@/services';
import { filter, switchMap, takeUntil, tap } from 'rxjs';
import { useDrawContainerStore, useOperationStackStore } from '.';
import { deepClone, getObjectAttribute } from '@/utils';
import { EElementType, IElement } from './element-type';

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
            elementType: EElementType.矩形,
            commonStyle: {
              size: {
                width: 200,
                height: 200
              },
              transform: 'transform(200px, 200px) rotate(50deg)'
            }
          },
          {
            elementId: '页面1-元素2',
            elementType: EElementType.矩形,
            commonStyle: {
              size: {
                width: 100,
                height: 100
              },
              transform: 'transform(700px, 300px) rotate(20deg)'
            }
          }
        ]
      },
      {
        pageId: '页面2',
        elements: [
          {
            elementId: '页面2-元素1',
            elementType: EElementType.矩形,
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
  const selectedElements = ref<Array<IElement<unknown>>>([project.pages[0].elements[0]]);
  // 当前选中元素id集合
  const selectedElementsIds = computed(() =>
    selectedElements.value.map((element) => element.elementId)
  );

  // 当前选中元素集合数据副本，用于属性面板
  const selectedElementsCopyForPropertyPanel = ref<Array<IElement<unknown>>>(
    deepClone(selectedElements.value)
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
  const activeElement = (element: IElement<unknown>) => (selectedElements.value = [element]);
  // 多选
  const activeElements = (elements: IElement<unknown>[]) => (selectedElements.value = elements);

  // 初始化画布控制器
  const initDrawContainerEventController = (drawContainer: HTMLElement) => {
    drawContainerEventController = new DrawContainerEventController(drawContainer);
    operationStackStore.initHistoryStackMap(project);
    // registerElementsMoveEvent();
  };

  /**
   * @description 元素移动事件注册
   * @author Mapotato
   * @date 08/09/2023
   */
  // const registerElementsMoveEvent = () => {
  //   let _position: string;
  //   drawContainerEventController.mousedown$
  //     .pipe(
  //       filter((e) => {
  //         return (
  //           selectedElementsIds.value.includes((e.target as HTMLElement).id) &&
  //           useDrawContainerStore().cursor === 'default'
  //         );
  //       }),
  //       tap(() => {
  //         if (selectMode.value === '单选') {
  //           _position = JSON.stringify(selectedElements.value[0].commonStyle.position);
  //         }
  //       }),
  //       switchMap(() =>
  //         drawContainerEventController.mousemove$.pipe(
  //           takeUntil(
  //             drawContainerEventController.globalMouseup$.pipe(
  //               tap(() => {
  //                 if (selectMode.value === '单选') {
  //                   if (
  //                     JSON.stringify(selectedElements.value[0].commonStyle.position) !== _position
  //                   ) {
  //                     operationStackStore.pushStack();
  //                   }
  //                 }
  //               })
  //             )
  //           )
  //         )
  //       )
  //     )
  //     .subscribe(({ movementX, movementY }) => {
  //       selectedElements.value[0].commonStyle.position.top += Math.trunc(
  //         movementY / useDrawContainerStore().scale
  //       );
  //       selectedElements.value[0].commonStyle.position.left += Math.trunc(
  //         movementX / useDrawContainerStore().scale
  //       );
  //     });
  // };

  // 重置大小映射
  // const resizeDirectionMap = {
  //   [E_Direction.左上]: [1, 1, -1, -1],
  //   [E_Direction.中上]: [1, 1, -1, 0],
  //   [E_Direction.右上]: [1, 1, -1, 1],
  //   [E_Direction.左中]: [1, 1, 0, -1],
  //   [E_Direction.右中]: [1, 1, 0, 1],
  //   [E_Direction.左下]: [1, 1, 1, -1],
  //   [E_Direction.中下]: [1, 1, 1, 0],
  //   [E_Direction.右下]: [1, 1, 1, 1]
  // };

  // 设置当前元素大小
  // const setReSize = (resizeValue: {
  //   direction: E_Direction;
  //   distanceX: number;
  //   distanceY: number;
  // }) => {
  //   // 排除比例影响
  //   resizeValue.distanceY /= useDrawContainerStore().scale;
  //   resizeValue.distanceX /= useDrawContainerStore().scale;
  //   if (selectMode.value === '单选') {
  //     const [height, width] = resizeDirectionMap[resizeValue.direction];
  //     const { size } = selectedElements.value[0].commonStyle;
  //     // if (size.height + height * resizeValue.distanceY > 1) {
  //     //   // position.top += top * resizeValue.distanceY;
  //     //   size.height += height * resizeValue.distanceY;
  //     // }
  //     console.log('🚀 ~ height ~ 201行', size.height);
  //     console.log('🚀 ~ height * resizeValue.distanceY ~ 201行', height * resizeValue.distanceY);
  //     size.height += height * resizeValue.distanceY;
  //     size.width += width * resizeValue.distanceX;
  //     // if (size.width + width * resizeValue.distanceX > 1) {
  //     //   // position.left += left * resizeValue.distanceX;
  //     //   size.width += width * resizeValue.distanceX;
  //     // }
  //     // if (
  //     //   selectedElements.value[0].commonStyle.rotate > -45 &&
  //     //   selectedElements.value[0].commonStyle.rotate < 45
  //     // ) {
  //     //   if (size.height + height * resizeValue.distanceY > 1) {
  //     //     // position.top += top * resizeValue.distanceY;
  //     //     size.height += height * resizeValue.distanceY;
  //     //   }
  //     //   if (size.width + width * resizeValue.distanceX > 1) {
  //     //     // position.left += left * resizeValue.distanceX;
  //     //     size.width += width * resizeValue.distanceX;
  //     //   }
  //     // } else {
  //     //   // console.log('🚀 ~ 此时调整大小与预期偏差较大 ~ ');
  //     // }
  //   }
  // };

  // 设置元素大小
  const setReSize = (width: number, height: number) => {
    const { size } = selectedElements.value[0].commonStyle;
    size.width = width;
    size.height = height;
  };
  // 批量设置元素大小
  const setReSizeGroup = (sizes: { width: number; height: number }[]) => {
    selectedElements.value.forEach((element) => {
      element.commonStyle.size = sizes.shift()!;
    });
  };

  // 设置元素变换
  const setTransform = (transform: string) => {
    selectedElements.value[0].commonStyle.transform = transform;
  };

  // 批量设置元素变换
  const setTransformGroup = (transformGroup: string[]) => {
    selectedElements.value.forEach((element) => {
      element.commonStyle.transform = transformGroup.shift()!;
    });
  };

  const initProject = () => {
    // TODO
    // 获取project数据
    // 数据预处理
  };

  // 状态值
  let stateValue: unknown;

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
    selectedElementsCopyForPropertyPanel,
    commitState,
    setReSize,
    setReSizeGroup,
    setTransform,
    setTransformGroup,
    activeElement,
    activeElements,
    initProject,
    initDrawContainerEventController
  };
});
