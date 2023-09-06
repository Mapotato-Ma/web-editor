import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { numberToPx } from '@/utils';

/**
 * 画布数据数据库
 */
export const useDrawContainerStore = defineStore('drawContainerStore', () => {
  // 宽高
  const [width, height] = [ref(1920), ref(1080)];
  // 宽高包装样式
  const [widthWithPx, heightWithPx] = [
    computed(() => numberToPx(width.value)),
    computed(() => numberToPx(height.value))
  ];
  // 偏移量
  const [top, left] = [ref(0), ref(0)];
  // 偏移量包装样式
  const [topWithPx, leftWithPx] = [
    computed(() => numberToPx(top.value)),
    computed(() => numberToPx(left.value))
  ];
  // 缩放
  const scale = ref(1);
  // 缩放包装样式
  const transform = computed(() => `scale(${scale.value})`);
  // 缩放百分比
  const scaleRelatedZoom = computed(() => Math.round(scale.value * 100));
  // 缩放百分比可选项
  const zoomOptions = [50, 70, 100, 125, 150, 175, 200];
  // 鼠标手势
  const cursor = ref<'default' | 'grab' | 'grabbing'>('default');

  /**
   * @description 设置缩放
   * @author Mapotato
   * @date 31/08/2023
   * @param {number} value
   */
  const setScale = (value: number) => {
    scale.value = value;
  };

  /**
   * @description 设置位置
   * @author Mapotato
   * @date 31/08/2023
   * @param {number[]} [x, y]
   */
  const setPosition = ([x, y]: number[]) => ((left.value = x), (top.value = y));

  /**
   * @description 居中画布
   * @author Mapotato
   * @date 31/08/2023
   */
  const centeredDrawContainer = () => {
    const { clientWidth, clientHeight } = document.body;
    const { clientWidth: drawContainerWidth, clientHeight: drawContainerHeight } =
      document.getElementById('drawContainer')!;
    // 设置画布位置
    (top.value = (clientHeight - drawContainerHeight) / 2),
      (left.value = (clientWidth - drawContainerWidth) / 2);
    // 设置画布缩放
    if (clientWidth <= 1920) {
      // 1920*1080
      scale.value = 0.7;
    } else {
      // 2k/4k
      scale.value = 1;
    }
  };

  return {
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
