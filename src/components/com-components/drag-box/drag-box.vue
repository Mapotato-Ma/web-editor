<template>
  <div class="drag-box">
    <DOTS />
  </div>
</template>

<script lang="ts" setup>
import { Subject, filter, fromEvent, takeUntil, tap } from 'rxjs';
import { onMounted } from 'vue';
import { createVNode } from 'vue';
import { useProjectManageStore } from '@/stores';
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
          e.stopPropagation();
          projectManageStore.commitState('start', { keys: ['commonStyle', 'size'] });
        })
      )
      .subscribe(() => element.setAttribute('id', 'drag-active'));
  });
  mouseup$
    .pipe(
      takeUntil(destroy$),
      filter(() => !!document.getElementById('drag-active')) // 解决在画布任意地方鼠标抬起触发冗余入栈操作的问题
    )
    .subscribe(() => {
      projectManageStore.commitState('end', { keys: ['commonStyle', 'size'] });
      document.getElementById('drag-active')?.removeAttribute('id');
    });
  if (operateDom.length > 0) {
    mousemove$
      .pipe(
        tap((e) => e.preventDefault()),
        filter((e) => {
          return operateDom.some((element) => element.getAttribute('id')) && e.buttons === 1;
        })
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

  :deep(.db-drag) {
    position: absolute;
    width: 10px;
    height: 10px;
    border-radius: 5px;
    background: #512da8;
    border: 1px solid #fff;
    transition: box-shadow 233ms;
    // display: none;

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
      display: block;
    }

    &[id='drag-active'] {
      box-shadow: 0 0 2px 3px rgba(255, 255, 255, 0.6);
    }
  }
}
</style>
