import { useDrawContainerStore, useProjectManageStore } from '@/stores';
import { Observable, filter, fromEvent, merge, switchMap, takeUntil, tap } from 'rxjs';
/**
 * @description 画布事件控制抽象类
 * @author Mapotato
 * @date 26/08/2023
 * @class DrawContainerEventController
 */
export class DrawContainerEventController {
  // ctrl键按下触发
  ctrlDown$!: Observable<KeyboardEvent>;
  // 空格键按下触发
  spaceDown$!: Observable<KeyboardEvent>;
  // 鼠标滚轮触发
  wheel$!: Observable<WheelEvent>;
  // 鼠标键按下触发
  mousedown$!: Observable<MouseEvent>;
  // 鼠标键抬起触发
  mouseup$!: Observable<MouseEvent>;
  // 鼠标移动触发
  mousemove$!: Observable<MouseEvent>;
  // 鼠标移出触发
  mouseleave$!: Observable<MouseEvent>;
  // 点击事件
  click$!: Observable<MouseEvent>;

  // 全局按键按下事件
  globalKeydown$!: Observable<KeyboardEvent>;
  // 全局按键抬起事件
  globalKeyup$!: Observable<KeyboardEvent>;
  // 全局鼠标抬起事件
  globalMouseup$!: Observable<MouseEvent>;
  // 全局鼠标移动事件
  globalMousemove$!: Observable<MouseEvent>;

  // 画布数据库
  drawContainerStore = useDrawContainerStore();

  projectManageStore = useProjectManageStore();

  constructor(drawContainer: HTMLElement) {
    // 初始化事件流
    this.initialFlow(drawContainer);
    // 画布赋能
    this.drawMove();
    this.drawScale();
    this.drawClick();
  }

  /**
   * 注册画布操作事件
   * @param drawContainer 画布容器
   */
  initialFlow(drawContainer: HTMLElement) {
    this.globalKeydown$ = fromEvent<KeyboardEvent>(document, 'keydown');
    this.globalKeyup$ = fromEvent<KeyboardEvent>(document, 'keyup');
    this.globalMouseup$ = fromEvent<MouseEvent>(document, 'mouseup');
    this.globalMousemove$ = fromEvent<MouseEvent>(document, 'mousemove');
    this.ctrlDown$ = this.globalKeydown$.pipe(filter((e) => e.ctrlKey));
    this.spaceDown$ = this.globalKeydown$.pipe(filter((e) => e.code === 'Space'));
    this.mousedown$ = fromEvent<MouseEvent>(drawContainer, 'mousedown');
    this.mouseup$ = fromEvent<MouseEvent>(drawContainer, 'mouseup');
    this.wheel$ = fromEvent<WheelEvent>(drawContainer, 'wheel');
    this.mousemove$ = fromEvent<MouseEvent>(drawContainer, 'mousemove');
    this.mouseleave$ = fromEvent<MouseEvent>(drawContainer, 'mouseleave');
    this.click$ = fromEvent<MouseEvent>(drawContainer, 'click');
  }

  /**
   * @description 注册画布移动事件
   * @author Mapotato
   * @date 31/08/2023
   * @memberof DrawContainerEventController
   */
  drawMove() {
    this.spaceDown$
      .pipe(
        tap(
          () =>
            this.drawContainerStore.cursor === 'default' &&
            (this.drawContainerStore.cursor = 'grab')
        ),
        switchMap(() =>
          merge(this.mousedown$, this.mousemove$, this.mouseup$).pipe(
            tap((e) => {
              e.preventDefault();
              this.drawContainerStore.cursor = 'grabbing';
            }),
            filter((e) => e.buttons > 0),
            takeUntil(
              this.globalKeyup$.pipe(tap(() => (this.drawContainerStore.cursor = 'default')))
            )
          )
        )
      )
      .subscribe(({ movementX, movementY }) => {
        this.drawContainerStore.setPosition([
          this.drawContainerStore.left + movementX,
          this.drawContainerStore.top + movementY
        ]);
      });
  }

  /**
   * @description 注册画布缩放事件
   * @author Mapotato
   * @date 31/08/2023
   * @memberof DrawContainerEventController
   */
  drawScale() {
    this.spaceDown$
      .pipe(
        switchMap(() =>
          this.wheel$.pipe(
            takeUntil(this.globalKeyup$),
            filter(({ deltaY }) => {
              return (
                (deltaY > 0 && this.drawContainerStore.scale > 0.2) ||
                (deltaY < 0 && this.drawContainerStore.scale < 4)
              );
            })
          )
        )
      )
      .subscribe(({ deltaY }) => {
        if (deltaY < 0) {
          this.drawContainerStore.setScale(
            Number(((this.drawContainerStore.scale * 100 + 10) / 100).toFixed(1))
          );
        } else {
          this.drawContainerStore.setScale(
            Number(((this.drawContainerStore.scale * 100 - 10) / 100).toFixed(1))
          );
        }
      });
  }

  /**
   * @description 注册画布点击事件
   * @author Mapotato
   * @date 06/09/2023
   * @memberof DrawContainerEventController
   */
  drawClick() {
    this.mousedown$.subscribe((e) => {
      this.projectManageStore.selectedPage.elements.some((element) => {
        if (element.elementId === (e.target as HTMLElement).id) {
          this.projectManageStore.activeElement(element);
          return true;
        }
      });
    });
  }
}
