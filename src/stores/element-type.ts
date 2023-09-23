import { IRectPrivateStyle, IRoundPrivateStyle } from '@/components/component-library';

// 当前操作元素
export interface IElement<T> {
  elementId: string;
  elementType: EElementType;
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
  privateStyle?: T;
}

/**
 * @description 元素类型
 * @enum {number}
 */
export enum EElementType {
  矩形 = '矩形',
  圆形 = '圆形'
}

/**
 * 私有样式映射
 */
export type TPrivateStyleTypeMap<T> = T extends EElementType.矩形
  ? IRectPrivateStyle
  : T extends EElementType.圆形
  ? IRoundPrivateStyle
  : unknown;
