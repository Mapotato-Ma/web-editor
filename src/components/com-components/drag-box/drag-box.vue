<template>
  <Moveable
    ref="moveable"
    :origin="false"
    :target="selector"
    :draggable="true"
    :rotatable="true"
    :resizable="true"
    :renderDirections="['n', 'nw', 'ne', 's', 'se', 'sw', 'e', 'w']"
    :throttleResize="5"
    @dragGroup="onDragGroup"
    @drag="onDrag"
    @resizeGroup="onResizeGroup"
    @resize="onResize"
    @rotateGroup="onRotateGroup"
    @rotate="onRotate"
    @render="onRender"
  ></Moveable>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { useProjectManageStore } from '@/stores';
import Moveable, {
  OnDrag,
  OnDragGroup,
  OnRender,
  OnResize,
  OnResizeGroup,
  OnRotate,
  OnRotateGroup
} from 'vue3-moveable';
const projectManageStore = useProjectManageStore();
const onRender = (e: OnRender) => {
  console.log('🚀 ~ e ~ 53行', e);
  e.target.style.cssText += e.cssText;
};
const onDragGroup = ({ events }: OnDragGroup) => {
  events.forEach((ev) => {
    ev.target!.style.transform = ev.transform;
  });
  projectManageStore.setTransformGroup(events.map((ev: any) => ev.transform));
};
const onDrag = ({ target, transform }: OnDrag) => {
  target.style.transform = transform;
  projectManageStore.setTransform(transform);
};
const onResize = ({ target, width, height, drag }: OnResize) => {
  target.style.width = `${width}px`;
  target.style.height = `${height}px`;
  target.style.transform = drag.transform;
  projectManageStore.setReSize(width, height);
  projectManageStore.setTransform(drag.transform);
};
const onResizeGroup = ({ events }: OnResizeGroup) => {
  events.forEach((ev: any) => {
    ev.target.style.width = `${ev.width}px`;
    ev.target.style.height = `${ev.height}px`;
    ev.target.style.transform = ev.drag.transform;
  });
  const sizes = events.map((ev: any) => ({ width: ev.width, height: ev.height }));
  projectManageStore.setReSizeGroup(sizes);
  projectManageStore.setTransformGroup(events.map((ev: any) => ev.transform));
};
const onRotate = ({ target, drag }: OnRotate) => {
  target.style.transform = drag.transform;
  projectManageStore.setTransform(drag.transform);
};
const onRotateGroup = ({ events }: OnRotateGroup) => {
  events.forEach((ev: any) => {
    ev.target!.style.transform = ev.transform;
  });
  projectManageStore.setTransformGroup(events.map((ev: any) => ev.transform));
};

// const onResizeStart = ({ target, drag }: any) => {
//   console.log('🚀 ~ 触发onResizeStart ~ 36行', target, drag);
// };
// const onResizeEnd = ({ target, drag }: any) => {
//   console.log('🚀 ~ 触发onResizeEnd ~ 36行', target, drag);
// };

// const onDragStart = ({ target }: any) => {
//   console.log('🚀 ~ 触发dragStart ~ 36行', target);
// };
// const onDragEnd = ({ target }: any) => {
//   console.log('🚀 ~ 触发dragStart ~ 36行', target);
// };

const selector = computed(() => {
  // Moveable.updateTarget();
  moveable.value?.updateSelectors();
  return projectManageStore.selectedElementsIds.map((id) => `#${id}`);
});
const moveable = ref<Moveable>();

onMounted(() => {
  console.log('🚀 ~ moveable ~ 116行', moveable);
});
</script>

<style lang="less" scoped>
.drag-box {
  position: relative;
  .moveable {
    background-color: red;
  }
}
</style>
