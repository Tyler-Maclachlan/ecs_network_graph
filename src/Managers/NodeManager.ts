import {
  GenerationalIndexAllocator as EntityAllocator,
  GenerationalIndex as Entity,
  GenerationalIndexArray as EntityMap,
  uuid
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
import { Newable, NodeOptions } from '../types';
import { Component } from '../Components/Component';
import UserControlledComponent from '../Components/UserControlledComponent';
import ForceComponent from '../Components/ForceComponent';

export default class NodeManager {
  private _allocator: EntityAllocator;
  private _nodes: Entity[];
  private _idToEntityMap: Map<string | number, Entity>;
  private _entityToIdMap: Map<Entity, string | number>;
  private _componentStores: Map<string, EntityMap<Component>>;

  constructor() {
    this._allocator = new EntityAllocator();
    this._idToEntityMap = new Map();
    this._entityToIdMap = new Map();
    this._nodes = [];
    this._componentStores = new Map<string, EntityMap<Component>>();
  }

  public createNode(options: NodeOptions) {
    let { id, shape, color, size, label, data } = options;
    if (id === null || id === undefined) {
      id = uuid();
    }
    if (this._idToEntityMap.has(id)) {
      throw new Error('Node already exists');
    }
    const _node = this._allocator.allocate();
    this._idToEntityMap.set(id, _node);
    this._entityToIdMap.set(_node, id);
    this._nodes.push(_node);

    //Create components
    // Mandatory components
    const pos = this.addComponent(_node, new PositionComponent());
    this.addComponent(_node, new VelocityComponent());
    this.addComponent(_node, new AccelerationComponent());
    this.addComponent(_node, new ForceComponent());

    pos.x = 20 + Math.random() * 1130;
    pos.y = 20 + Math.random() * 944;

    //Components that can have values in 'options'
    const colorComponent = this.addComponent(_node, new ColorComponent());
    const shapeComponent = this.addComponent(_node, new ShapeComponent());
    const sizeComponent = this.addComponent(_node, new SizeComponent());

    if (shape === 'image' || shape === 'imageCircular') {
      const imageComponent = this.addComponent(_node, new ImageComponent());
      imageComponent.image = options.image;
    }
    if (shape) {
      shapeComponent.shape = shape;
    }

    if (size) {
      sizeComponent.height = size.height || sizeComponent.height;
      sizeComponent.width = size.width || sizeComponent.width;
    }

    if (color) {
      colorComponent.fillColor = color.fillColor || colorComponent.fillColor;
      colorComponent.textColor = color.textColor || colorComponent.textColor;
    }

    // Optional Components
    if (data) {
      const dataComponent = this.addComponent(_node, new DataComponent());
      dataComponent.data = data;
    }
    if (label) {
      const labelComponent = this.addComponent(_node, new LabelComponent());
      labelComponent.text = label.text;
      labelComponent.alignment = label.alignment;
    }
  }

  public bulkCreateNodes(nodes: NodeOptions[]) {
    nodes.forEach(node => {
      this.createNode(node);
    });
  }

  public addComponent<T extends Component>(node: Entity, component: T): T {
    const componentName = component.constructor.name;

    let store = this._componentStores.get(componentName);

    if (store === undefined) {
      store = new EntityMap<T>();
      this._componentStores.set(componentName, store);
    }

    store.set(node, component);

    return component;
  }

  public removeComponent<T extends Component>(
    node: Entity,
    component: Newable<T>
  ): boolean {
    const store = this._componentStores.get(component.name);
    if (store && store.has(node)) {
      store.delete(node);
      return true;
    }

    return false;
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

  public getNonUserControlledNodesWithComponent<T extends Component>(
    component: Newable<T>
  ): Array<T> {
    const store = this._componentStores.get(component.name) as EntityMap<T>;
    const controlledStore = this._componentStores.get(
      'usercontrolled'
    ) as EntityMap<UserControlledComponent>;

    if (store === undefined) {
      return [];
    }

    if (!controlledStore || !controlledStore.length) {
      return Array.from(store);
    } else {
      let storeArr = Array.from(store);
      controlledStore.indices().forEach(node => {
        if (store.has(node) && controlledStore.get(node).isControlled) {
          storeArr = storeArr.splice(node.index, 1);
        }
      });
      return storeArr;
    }
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

  public deleteNode(node: Entity) {
    if (this._allocator.deallocate(node)) {
      this._componentStores.forEach(store => {
        if (store.has(node)) {
          store.delete(node);
        }
      });
    }
  }

  public getNodeEntity(id: string | number) {
    return this._idToEntityMap.get(id);
  }

  get nodes(): Entity[] {
    return this._nodes;
  }
}
