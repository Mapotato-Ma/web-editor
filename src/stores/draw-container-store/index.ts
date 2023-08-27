import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

/**
 * 画布数据Store
 */
export const useDrawContainerStore = defineStore('drawContainerStore', () => {
  const top = ref(0);
  const left = ref(0);
  const scale = ref(0.7);
  const topWithPx = computed(() => `${top.value}px`);
  const leftWithPx = computed(() => `${left.value}px`);
  const transform = computed(() => `scale(${scale.value})`);

  return {
    top,
    left,
    scale,
    transform,
    topWithPx,
    leftWithPx
  };
});
