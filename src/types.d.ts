import SpringComponent from './Components/SpringComponent';
import LabelComponent from './Components/LabelComponent';
import ColorComponent from './Components/ColorComponent';
import DataComponent from './Components/DataComponent';
import {
  GenerationalIndexAllocator as EntityAllocator,
  GenerationalIndexArray as EntityMap,
  GenerationalIndex as Entity
} from './Utils/index';
import ShapeComponent from './Components/ShapeComponent';
import PositionComponent from './Components/PositionComponent';
import SizeComponent from './Components/SizeComponent';
import VelocityComponent from './Components/VelocityComponent';
import ImageComponent from './Components/ImageComponent';
import AccelerationComponent from './Components/AccelerationComponent';

interface Component {
  readonly name: string;
}

type Newable<T> = { new (...args: any[]): T };

type Options = {
  [key: string]: any;
};

type Shape = 'circle' | 'square' | 'rectangle' | 'image' | 'imageCircular';
type Alignment = 'top' | 'middle' | 'bottom' | 'left' | 'right';

type Vector2D = {
  x: number;
  y: number;
};

type Option<T> = T | undefined | null;

type EdgeComponent =
  | SpringComponent
  | LabelComponent
  | ColorComponent
  | DataComponent;

type NodeComponent =
  | ShapeComponent
  | PositionComponent
  | SizeComponent
  | LabelComponent
  | VelocityComponent
  | ColorComponent
  | ImageComponent
  | DataComponent
  | AccelerationComponent;

type NodeComponents = {
  shape?: ShapeComponent;
  position?: PositionComponent;
  size?: SizeComponent;
  label?: LabelComponent;
  velocity?: VelocityComponent;
  color?: ColorComponent;
  image?: ImageComponent;
  data?: DataComponent;
  acceleration?: AccelerationComponent;
};

type EdgeComponents = {
  spring?: SpringComponent;
  label?: LabelComponent;
  color?: ColorComponent;
  data?: DataComponent;
};

type NodeOptions = {
  id: string | number;
  size: {
    width: number;
    height: number;
  };
  shape: Shape;
  image?: string;
  label?: {
    text: string;
    alignment: Alignment;
  };
  color?: {
    textColor: string;
    fillColor: string;
  };
  data?: {
    [key: string]: any;
  };
};

type EdgeOptions = {
  id: string | number;
  to: string | number;
  from: string | number;
  label?: {
    text: string;
    alignment: Alignment;
  };
  color?: {
    textColor: string;
    fillColor: string;
  };
  data?: {
    [key: string]: any;
  };
};

type Bounds = {
  left: number;
  right: number;
  top: number;
  bottom: number;
};
