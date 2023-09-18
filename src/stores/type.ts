// 项目
export interface IProject {
  // 项目id
  projectId: string;
  // 页签集合
  pages: IPageInterface[];
}

// 页签
export interface IPageInterface {
  // 页签id
  pageId: string;
  // 元素集合
  elements: IElement[];
}

// 当前操作元素
export interface IElement {
  elementId: string;
  elementType: '矩形';
  commonStyle: {
    position: {
      top: number;
      left: number;
    };
    size: {
      width: number;
      height: number;
    };
    rotate: number;
  };
  privateStyle?: unknown;
}

// 撤销回退栈数据切片
export interface IDataSlice {
  sliceValue: { elements: IElement[] }; // 页面json化数据
}

// 拖拽方向
export enum E_Direction {
  左上 = '左上',
  中上 = '中上',
  右上 = '右上',
  左中 = '左中',
  右中 = '右中',
  左下 = '左下',
  中下 = '中下',
  右下 = '右下'
}
