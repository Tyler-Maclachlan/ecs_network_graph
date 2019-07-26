import {
  GenerationalIndexAllocator as EntityAllocator,
  GenerationalIndex as Entity,
  GenerationalIndexArray as EntityMap
} from '../Utils/index';
import ShapeComponent from '../Components/ShapeComponent';
import PositionComponent from '../Components/PositionComponent';
import SizeComponent from '../Components/SizeComponent';
import LabelComponent from '../Components/LabelComponent';
import VelocityComponent from '../Components/VelocityComponent';
import ColorComponent from '../Components/ColorComponent';
import ImageComponent from '../Components/ImageComponent';
import DataComponent from '../Components/DataComponent';
import AccelerationComponent from '../Components/AccelerationComponent';

export default class NodeManager {
  private _allocator: EntityAllocator;
  private _nodes: Entity[];
  private _components: {
    shape: EntityMap<ShapeComponent>;
    position: EntityMap<PositionComponent>;
    size: EntityMap<SizeComponent>;
    label: EntityMap<LabelComponent>;
    velocity: EntityMap<VelocityComponent>;
    color: EntityMap<ColorComponent>;
    image: EntityMap<ImageComponent>;
    data: EntityMap<DataComponent>;
    acceleration: EntityMap<AccelerationComponent>;
  };

  constructor() {
    this._allocator = new EntityAllocator();
    this._nodes = [];
    this._components = {
      shape: new EntityMap<ShapeComponent>(),
      position: new EntityMap<PositionComponent>(),
      size: new EntityMap<SizeComponent>(),
      label: new EntityMap<LabelComponent>(),
      velocity: new EntityMap<VelocityComponent>(),
      color: new EntityMap<ColorComponent>(),
      image: new EntityMap<ImageComponent>(),
      data: new EntityMap<DataComponent>(),
      acceleration: new EntityMap<AccelerationComponent>()
    };
  }

  public createNode(options: { [key: string]: any }) {
    const { shape, color, size, label } = options;
    const _node = this._allocator.allocate();
    this._nodes.push(_node);

    this._components.shape.set(_node, { shape });
    this._components.color.set(_node, color);
    this._components.size.set(_node, size);
    this._components.position.set(_node, new PositionComponent());
    this._components.velocity.set(_node, new VelocityComponent());
    this._components.acceleration.set(_node, new AccelerationComponent());
    this._components.label.set(_node, label);
    this._components.data.set(_node, new DataComponent());
  }

  public bulkCreateNodes(nodes: [], options: { [key: string]: any }) {
    nodes.forEach(node => {
      this.createNode(options);
    });
  }

  public getNodeComponentData(node: Entity, component: string) {
    if (!this._components[component])
      throw new Error('This component does not exist');
    if (!this._components[component].has(node)) return null;

    return this._components[component].get(node);
  }

  public getNodeComponents(node: Entity) {
    const components = {};
    Object.keys(this._components).forEach(key => {
      if (this._components[key].has(node)) {
        components[key] = this.getNodeComponentData(node, key);
      }
    });
    return components;
  }

  get nodes(): Entity[] {
    return this._nodes;
  }
}
