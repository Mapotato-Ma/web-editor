// 项目
export interface project {
  // 项目id
  projectId: string;
  // 页签集合
  pages: pageInterface[];
}

// 页签
export interface pageInterface {
  // 页签id
  pageId: string;
  // 元素集合
  elements: element[];
}

// 当前操作元素
export interface element {
  elementId: string;
  elementType: '矩形';
  commonStyle: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
  privateStyle?: unknown;
}

// 操作栈项目
export interface stackItem {
  keyPath: Array<string>;
  keyName: string;
  currentValue: any;
  elementId: string;
}
