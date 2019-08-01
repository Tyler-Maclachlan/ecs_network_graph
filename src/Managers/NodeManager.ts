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
import { Component, Newable, NodeOptions } from '../types';

export default class NodeManager {
  private _allocator: EntityAllocator;
  private _nodes: Entity[];
  private _idToEntityMap: Map<string | number, Entity>;
  private _componentStores: Map<string, EntityMap<Component>>;

  constructor() {
    this._allocator = new EntityAllocator();
    this._idToEntityMap = new Map();
    this._nodes = [];
    this._componentStores = new Map<string, EntityMap<Component>>();
  }

  public createNode(options: NodeOptions) {
    const { id, shape, color, size, label } = options;
    if (this._idToEntityMap.has(id)) {
      throw new Error('Node already exists');
    }
    const _node = this._allocator.allocate();
    this._idToEntityMap.set(id, _node);
    this._nodes.push(_node);

    //Create components
    this.addComponent(_node, new PositionComponent());
    this.addComponent(_node, new VelocityComponent());
    this.addComponent(_node, new AccelerationComponent());
    this.addComponent(_node, new ShapeComponent());
    this.addComponent(_node, new DataComponent());
    this.addComponent(_node, new LabelComponent());
    this.addComponent(_node, new ColorComponent());
    this.addComponent(_node, new SizeComponent());
    if (shape === 'image' || shape === 'imageCircular') {
      this.addComponent(_node, new ImageComponent());
    }

    const sizeComponent = this.getComponent(_node, SizeComponent);
    sizeComponent.height = size.height;
    sizeComponent.width = size.width;

    const shapeComponent = this.getComponent(_node, ShapeComponent);
    shapeComponent.shape = shape;

    const colorComponent = this.getComponent(_node, ColorComponent);
    colorComponent.fillColor = color.fillColor;
    colorComponent.textColor = color.textColor;

    const labelComponent = this.getComponent(_node, LabelComponent);
    labelComponent.text = label.text;
    labelComponent.alignment = label.alignment;
  }

  public bulkCreateNodes(nodes: [], options: NodeOptions) {
    nodes.forEach(() => {
      this.createNode(options);
    });
  }

  public addComponent<T extends Component>(node: Entity, component: T): T {
    const componentName = component.name;

    let store = this._componentStores.get(componentName);

    if (store === undefined) {
      store = new EntityMap<T>();
      this._componentStores.set(componentName, store);
    }

    store.set(node, component);

    return component;
  }

  public getComponent<T extends Component>(
    node: Entity,
    component: Newable<T>
  ): T | null {
    const store = this._componentStores.get(component.name);

    if (!store) {
      throw new Error(`No entities with attached component: ${component.name}`);
    }

    const instance = store.get(node) as T;

    if (!instance) {
      throw new Error(
        `Node ${JSON.stringify(node)} does not have component: ${
          component.name
        }`
      );
    }

    return instance;
  }

  public getComponentsOfType<T extends Component>(
    component: Newable<T>
  ): Array<T> {
    const store = this._componentStores.get(component.name) as EntityMap<T>;

    if (store === undefined) {
      return [];
    }

    return Array.from(store);
  }

  public getAllNodesWithComponent<T extends Component>(
    component: Newable<T>
  ): Array<Entity> {
    const store = this._componentStores.get(component.name) as EntityMap<T>;

    if (store === undefined) {
      return [];
    }

    return store.indices();
  }

  public getNodeEntity(id: string | number) {
    return this._idToEntityMap.get(id);
  }

  get nodes(): Entity[] {
    return this._nodes;
  }
}
