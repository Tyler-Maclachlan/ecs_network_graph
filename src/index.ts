import {
  uuid,
  GenerationalIndex as Entity,
  GenerationalIndexArray as EntityMap,
  GenerationalIndexAllocator as EntityAllocator
} from "./Utils/index";
import {
  SpringComponent,
  DataComponent,
  PositionComponent,
  SizeComponent,
  ShapeComponent,
  ImageComponent,
  VelocityComponent,
  AccelerationComponent,
  LabelComponent
} from "./Components/components";

const VNetGraph = function VNetGraph(
  this: any,
  container: HTMLCanvasElement,
  nodes: any[],
  edges: any[],
  options: Options
): any {
  const _entity_allocator: EntityAllocator = new EntityAllocator();
  this._entity_allocator = _entity_allocator;

  const _nodes: Entity[] = [];
  const _edges: Entity[] = [];

  const components = {
    spring: new EntityMap<SpringComponent>(),
    data: new EntityMap<DataComponent>(),
    position: new EntityMap<PositionComponent>(),
    size: new EntityMap<SizeComponent>(),
    shape: new EntityMap<ShapeComponent>(),
    image: new EntityMap<ImageComponent>(),
    velocity: new EntityMap<VelocityComponent>(),
    acceleration: new EntityMap<AccelerationComponent>(),
    label: new EntityMap<LabelComponent>()
  };

  return this;
};

if (!(window as any).VNetGraph) {
  (window as any).VNetGraph = VNetGraph;
}

export default VNetGraph;
