import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

/**
 * 画布数据Store
 */
export const useDrawContainerStore = defineStore('drawContainerStore', () => {
  const width = ref(1920);
  const height = ref(1080);
  const top = ref(0);
  const left = ref(0);
  const scale = ref(1);
  const scaleRelatedZoom = computed(() => Math.round(scale.value * 100));
  const cursor = ref<'default' | 'grab' | 'grabbing'>('default');
  const zoomOptions = [50, 70, 100, 125, 150, 175, 200];
  const topWithPx = computed(() => `${top.value}px`);
  const leftWithPx = computed(() => `${left.value}px`);
  const widthWithPx = computed(() => `${width.value}px`);
  const heightWithPx = computed(() => `${height.value}px`);
  const transform = computed(() => `scale(${scale.value})`);
  const centerStatus = ref(true);

  const setScale = (value: number) => {
    scale.value = value;
  };

  const setPosition = ([x, y]: number[]) => ((left.value = x), (top.value = y));

  const centeredDrawContainer = () => {
    const { clientWidth, clientHeight } = document.body;
    const { clientWidth: drawContainerWidth, clientHeight: drawContainerHeight } =
      document.getElementById('drawContainer')!;
    top.value = (clientHeight - drawContainerHeight) / 2;
    left.value = (clientWidth - drawContainerWidth) / 2;
    scale.value = 1;
  };

  return {
    centerStatus,
    width,
    height,
    widthWithPx,
    heightWithPx,
    top,
    left,
    scale,
    scaleRelatedZoom,
    cursor,
    zoomOptions,
    transform,
    topWithPx,
    leftWithPx,
    setScale,
    setPosition,
    centeredDrawContainer
  };
});
