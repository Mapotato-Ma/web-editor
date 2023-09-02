<template>
  <div class="drag-box">
    <div class="db-rotate"></div>
    <DBDrag />
  </div>
</template>

<script lang="ts" setup>
import { filter, fromEvent, tap } from 'rxjs';
import { onMounted } from 'vue';
import { createVNode } from 'vue';

enum E_Direction {
  左上 = '左上',
  中上 = '中上',
  右上 = '右上',
  左中 = '左中',
  右中 = '右中',
  左下 = '左下',
  中下 = '中下',
  右下 = '右下'
}

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

onMounted(() => {
  const operateDom = Array.from(document.getElementsByClassName('db-drag'));
  const mousemove$ = fromEvent<MouseEvent>(document, 'mousemove');
  operateDom.forEach((element) => {
    fromEvent<MouseEvent>(element, 'mousedown').subscribe(() =>
      element.setAttribute('drag-active', 'true')
    );
    fromEvent<MouseEvent>(document, 'mouseup').subscribe(() =>
      element.removeAttribute('drag-active')
    );
  });
  if (operateDom.length > 0) {
    mousemove$
      .pipe(
        tap((e) => e.preventDefault()),
        filter(() => operateDom.some((element) => element.getAttribute('drag-active')))
      )
      .subscribe(({ movementX, movementY }) => {
        console.log(
          '🚀 ~ drag-box.vue ~ 49行\n',
          operateDom
            .find((element) => element.getAttribute('drag-active'))
            ?.getAttribute('direction'),
          movementX,
          movementY
        );
      });
  }
});

const DBDrag = () =>
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
  :deep(.db-drag) {
    position: absolute;
    width: 10px;
    height: 10px;
    border-radius: 5px;
    background: #512da8;
    border: 1px solid #fff;
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
  }
}
</style>
