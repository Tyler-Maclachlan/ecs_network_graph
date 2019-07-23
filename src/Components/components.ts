import { GenerationalIndex as Entity } from "../Utils/index";

export type ColorComponent = {
  color: string;
};

export type PositionComponent = Vector2D;

export type SizeComponent = {
  width: number;
  height: number;
};

export type LabelComponent = {
  text: string;
  alignment: "top" | "bottom" | "left" | "right";
};

export type ShapeComponent = {
  shape: "box" | "circle" | "triangle";
};

export type SpringComponent = {
  node1: Entity;
  node2: Entity;
};

export type VelocityComponent = Vector2D;

export type AccelerationComponent = Vector2D;

export type ImageComponent = {
  image: string;
};

export type DataComponent = {
  [key: string]: any;
};
