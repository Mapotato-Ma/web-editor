import { useProjectManageStore } from '@/stores';
import { IElement } from '@/stores/element-type';
import { computed, ref } from 'vue';

export const PropertyPanelData = new (class {
  // 当前选中元素集合
  selectedElements = ref<Array<IElement<unknown>>>([]);
  // 选择模式:单选还是多选
  selectMode = computed<'单选' | '多选'>(() =>
    this.selectedElements.value.length === 1 ? '单选' : '多选'
  );

  constructor() {
    this.refreshSelectedElements();
  }

  refreshSelectedElements() {
    this.selectedElements.value = useProjectManageStore().selectedElementsCopyForPropertyPanel;
  }
})();
