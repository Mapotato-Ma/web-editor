<template>
  <div class="drag-box">
    <div class="db-rotate" ref="rotateHandle"></div>
    <div class="db-center" ref="rotateCenter"></div>
    <DOTS />
  </div>
</template>

<script lang="ts" setup>
import { Subject, filter, fromEvent, switchMap, takeUntil, tap } from 'rxjs';
import { onMounted, ref } from 'vue';
import { createVNode } from 'vue';
import { useProjectManageStore } from '@/stores';
import { arcToDeg, setStyle } from '@/utils';
import { E_Direction } from '@/stores/type';

const projectManageStore = useProjectManageStore();

const destroy$ = new Subject();

const dragMap = {
  [E_Direction.左上]: { class: 'db-drag-top-left' },
  [E_Direction.中上]: { class: 'db-drag-top-center' },
  [E_Direction.右上]: { class: 'db-drag-top-right' },
  [E_Direction.左中]: { class: 'db-drag-center-left' },
  [E_Direction.右中]: { class: 'db-drag-center-right' },
  [E_Direction.左下]: { class: 'db-drag-bottom-left' },
  [E_Direction.中下]: { class: 'db-drag-bottom-center' },
  [E_Direction.右下]: { class: 'db-drag-bottom-right' }
};

const mousemove$ = fromEvent<MouseEvent>(document, 'mousemove').pipe(takeUntil(destroy$));
const mouseup$ = fromEvent<MouseEvent>(document, 'mouseup').pipe(takeUntil(destroy$));

onMounted(() => {
  const operateDom = Array.from(document.getElementsByClassName('db-drag'));
  operateDom.forEach((element) => {
    fromEvent<MouseEvent>(element, 'mousedown')
      .pipe(
        takeUntil(destroy$),
        tap((e) => {
          console.log('🚀 ~ 鼠标按下 ~ 49行');
          e.stopPropagation();
          projectManageStore.commitState('start', { keys: ['commonStyle', 'size'] });
        })
      )
      .subscribe(() => element.setAttribute('id', 'drag-active'));
  });
  mouseup$.pipe(takeUntil(destroy$)).subscribe(() => {
    // console.log('🚀 ~ 鼠标抬起 ~ 49行');
    // projectManageStore.commitState('end', { keys: ['commonStyle', 'size'] });
    // document.getElementById('drag-active')?.removeAttribute('id');
  });
  if (operateDom.length > 0) {
    mousemove$
      .pipe(
        tap((e) => e.preventDefault()),
        filter(() => operateDom.some((element) => element.getAttribute('id')))
        // TODO: 鼠标抬起后，停止移动
      )
      .subscribe(({ movementX, movementY }) => {
        projectManageStore.setReSize({
          direction: operateDom
            .find((element) => element.getAttribute('id'))
            ?.getAttribute('direction') as E_Direction,
          distanceX: movementX,
          distanceY: movementY
        });
      });
  }
});

const DOTS = () =>
  Object.values(E_Direction).map((key) =>
    createVNode('div', { class: ['db-drag', dragMap[E_Direction[key]].class], direction: key })
  );

// 旋转把手
const rotateHandle = ref<HTMLElement>();
// 旋转中心
const rotateCenter = ref<HTMLElement>();

onMounted(() => {
  fromEvent<MouseEvent>(rotateHandle.value!, 'mousedown')
    .pipe(
      tap((e) => {
        e.stopPropagation();
        projectManageStore.commitState('start', { keys: ['commonStyle', 'rotate'] });
        setStyle(document.getElementById('drawContainer'), [
          'cursor',
          'url(cursor-rotate.svg) 15 15,pointer'
        ]);
      }),
      switchMap(() =>
        mousemove$.pipe(
          takeUntil(
            mouseup$.pipe(
              tap(() => {
                projectManageStore.commitState('end', { keys: ['commonStyle', 'rotate'] });
                setStyle(document.getElementById('drawContainer'), ['cursor', '']);
              })
            )
          )
        )
      ),
      filter((e) => e.buttons > 0)
    )
    .subscribe((e) => {
      const [centerX, centerY] = [
        rotateCenter.value!.getBoundingClientRect().x,
        rotateCenter.value!.getBoundingClientRect().y
      ];
      if (e.clientY < centerY) {
        // 旋转点位于中心点之上
        const lineB = e.clientX - centerX;
        const lineC = centerY - e.clientY;
        projectManageStore.setRotate(Math.trunc(arcToDeg(Math.atan(lineB / lineC))));
      } else if (e.clientY > centerY) {
        // 旋转点位于中心点之下
        const lineB = e.clientX - centerX;
        const lineC = e.clientY - centerY;
        projectManageStore.setRotate(180 - Math.trunc(arcToDeg(Math.atan(lineB / lineC))));
      } else if (e.clientX === centerY && e.clientX > centerX) {
        // 旋转点在中心点右侧
        projectManageStore.setRotate(90);
      } else if (e.clientX === centerY && e.clientX < centerX) {
        // 旋转点在中心点左侧
        projectManageStore.setRotate(270);
      }
    });
});
</script>

<style lang="less" scoped>
.drag-box {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  &:active {
    cursor: move;
  }
  .db-rotate {
    cursor:
      url(cursor-rotate.svg) 15 15,
      pointer;
    position: absolute;
    top: -50px;
    left: 50%;
    transform: translateX(-50%);
    width: 12px;
    height: 12px;
    background: #512da8;
    border: 1px solid #fff;
    border-radius: 50%;
    &::after {
      content: '';
      position: absolute;
      top: 14px;
      left: 50%;
      transform: translateX(-50%);
      width: 1px;
      height: 30px;
      background: #fff;
    }
  }
  .db-center {
    width: 1px;
    height: 1px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    // background-color: #ffffff;
  }
  :deep(.db-drag) {
    position: absolute;
    width: 10px;
    height: 10px;
    border-radius: 5px;
    background: #512da8;
    border: 1px solid #fff;
    transition: box-shadow 233ms;
    &-top-left {
      cursor: nwse-resize;
      top: 0;
      left: 0;
      transform: translate(-50%, -50%);
    }
    &-top-center {
      cursor: ns-resize;
      top: 0;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    &-top-right {
      cursor: nesw-resize;
      top: 0;
      left: 100%;
      transform: translate(-50%, -50%);
    }
    &-center-left {
      cursor: ew-resize;
      top: 50%;
      left: 0;
      transform: translate(-50%, -50%);
    }
    &-center-right {
      cursor: ew-resize;
      top: 50%;
      left: 100%;
      transform: translate(-50%, -50%);
    }
    &-bottom-left {
      cursor: nesw-resize;
      top: 100%;
      left: 0;
      transform: translate(-50%, -50%);
    }
    &-bottom-center {
      cursor: ns-resize;
      top: 100%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    &-bottom-right {
      cursor: nwse-resize;
      top: 100%;
      left: 100%;
      transform: translate(-50%, -50%);
    }
    &[drag-active='true'] {
      box-shadow: 0 0 2px 3px rgba(255, 255, 255, 0.6);
    }
  }
}
</style>
