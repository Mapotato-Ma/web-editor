import { useDrawContainerStore } from '@/stores';
import { Observable, filter, fromEvent, merge, switchMap, takeUntil, tap } from 'rxjs';
/**
 * @description 画布事件控制抽象类
 * @author Mapotato
 * @date 26/08/2023
 * @class DrawContainerEventController
 */
export class DrawContainerEventController {
  ctrlDown$!: Observable<KeyboardEvent>;
  spaceDown$!: Observable<KeyboardEvent>;
  wheel$!: Observable<WheelEvent>;
  mousedown$!: Observable<MouseEvent>;
  mouseup$!: Observable<MouseEvent>;
  mousemove$!: Observable<MouseEvent>;
  mouseleave$!: Observable<MouseEvent>;

  globalKeydown$!: Observable<KeyboardEvent>;
  globalKeyup$!: Observable<KeyboardEvent>;
  globalMouseup$!: Observable<MouseEvent>;
  globalMousemove$!: Observable<MouseEvent>;

  move$!: Observable<{
    dx: number;
    dy: number;
    lastX: number;
    lastY: number;
    startX: number;
    startY: number;
  }>;

  drawContainerStore = useDrawContainerStore();

  constructor(drawContainer: HTMLElement) {
    this.initialFlow(drawContainer);
    this.drawMove();
    this.drawScale();
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
  }

  drawMove() {
    this.spaceDown$
      .pipe(
        switchMap(() =>
          this.mousedown$.pipe(takeUntil(merge(this.globalKeyup$, this.globalMouseup$)))
        ),
        switchMap(() =>
          this.globalMousemove$.pipe(
            tap((e) => e.preventDefault()),
            takeUntil(merge(this.globalKeyup$, this.globalMouseup$))
          )
        )
      )
      .subscribe(({ movementX, movementY }) => {
        (this.drawContainerStore.left += movementX), (this.drawContainerStore.top += movementY);
      });
  }

  drawScale() {
    this.spaceDown$
      .pipe(
        switchMap(() =>
          this.wheel$.pipe(
            takeUntil(this.globalKeyup$),
            filter(({ deltaY }) => {
              return (
                (deltaY > 0 && (this.drawContainerStore.scale * 10 + 1) / 10 > 0.3) ||
                (deltaY < 0 && (this.drawContainerStore.scale * 10 - 1) / 10 < 3.9)
              );
            })
          )
        )
      )
      .subscribe(({ deltaY }) => {
        if (deltaY < 0) {
          this.drawContainerStore.scale = (this.drawContainerStore.scale * 10 + 1) / 10;
        } else {
          this.drawContainerStore.scale = (this.drawContainerStore.scale * 10 - 1) / 10;
        }
      });
  }
}
