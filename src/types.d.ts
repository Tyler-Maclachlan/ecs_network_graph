import SpringComponent from "./Components/SpringComponent";
import LabelComponent from "./Components/LabelComponent";
import ColorComponent from "./Components/ColorComponent";
import DataComponent from "./Components/DataComponent";
import {
  GenerationalIndexAllocator as EntityAllocator,
  GenerationalIndexArray as EntityMap,
  GenerationalIndex as Entity
} from "./Utils/index";
import ShapeComponent from "./Components/ShapeComponent";
import PositionComponent from "./Components/PositionComponent";
import SizeComponent from "./Components/SizeComponent";
import VelocityComponent from "./Components/VelocityComponent";
import ImageComponent from "./Components/ImageComponent";
import AccelerationComponent from "./Components/AccelerationComponent";

type Options = {
  [key: string]: any;
};

type Entity = string;

type Shape =
  | "circle"
  | "triangle"
  | "square"
  | "rectangle"
  | "image"
  | "imageCircular";

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
  shape?: EntityMap<ShapeComponent>;
  position?: EntityMap<PositionComponent>;
  size?: EntityMap<SizeComponent>;
  label?: EntityMap<LabelComponent>;
  velocity?: EntityMap<VelocityComponent>;
  color?: EntityMap<ColorComponent>;
  image?: EntityMap<ImageComponent>;
  data?: EntityMap<DataComponent>;
  acceleration?: EntityMap<AccelerationComponent>;
};

type EdgeComponents = {
  spring?: EntityMap<SpringComponent>;
  label?: EntityMap<LabelComponent>;
  color?: EntityMap<ColorComponent>;
  data?: EntityMap<DataComponent>;
};
