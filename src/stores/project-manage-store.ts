import { ref } from 'vue';
import { defineStore } from 'pinia';
import { element, pageInterface, project } from './type';

/**
 * 项目管理数据库
 */
export const useProjectManageStore = defineStore('projectManageStore', () => {
  const project: project = {
    pages: [
      {
        pageId: '页面1',
        elements: [
          {
            elementId: '页面1-元素1',
            elementType: '矩形',
            commonStyle: {
              top: 200,
              left: 200,
              width: 200,
              height: 200
            }
          },
          {
            elementId: '页面1-元素2',
            elementType: '矩形',
            commonStyle: {
              top: 300,
              left: 800,
              width: 100,
              height: 100
            }
          }
        ]
      },
      {
        pageId: '页面2',
        elements: [
          {
            elementId: '页面2-元素1',
            elementType: '矩形',
            commonStyle: {
              top: 300,
              left: 400,
              width: 100,
              height: 100
            }
          }
        ]
      }
    ],
    projectId: '项目1'
  };

  const selectedPage = ref<pageInterface>(project.pages[0]);
  const selectedElement = ref<element>(project.pages[0].elements[0]);

  const activeElement = (element: element) => (selectedElement.value = element);

  return { project, selectedPage, selectedElement, activeElement };
});
