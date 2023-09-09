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
  };
  privateStyle?: unknown;
}

// 撤销回退栈数据切片
export interface IDataSlice {
  sliceValue: string; // 页面json化数据
}
