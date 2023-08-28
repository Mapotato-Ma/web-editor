import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

/**
 * 画布数据Store
 */
export const useDrawContainerStore = defineStore('drawContainerStore', () => {
  const top = ref(0);
  const left = ref(0);
  const scale = ref(0.7);
  const cursor = ref<'default' | 'grab' | 'grabbing'>('default');
  const zoomOptions = [50, 70, 100, 125, 150, 175, 200];
  const topWithPx = computed(() => `${top.value}px`);
  const leftWithPx = computed(() => `${left.value}px`);
  const transform = computed(() => `scale(${scale.value})`);

  return {
    top,
    left,
    scale,
    cursor,
    zoomOptions,
    transform,
    topWithPx,
    leftWithPx
  };
});
