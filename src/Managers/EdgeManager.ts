import {
  GenerationalIndexAllocator as EntityAllocator,
  GenerationalIndex as Entity,
  GenerationalIndexArray as EntityMap
} from '../Utils/index';
import SpringComponent from '../Components/SpringComponent';
import LabelComponent from '../Components/LabelComponent';
import ColorComponent from '../Components/ColorComponent';
import DataComponent from '../Components/DataComponent';
import { Newable, EdgeComponents, EdgeComponent, EdgeOptions } from '../types';
import { Component } from '../Components/Component';

export default class EdgeManager {
  private _allocator: EntityAllocator;
  private _edges: Entity[];
  private _componentStores: Map<string, EntityMap<Component>>;

  constructor() {
    this._allocator = new EntityAllocator();
    this._edges = [];
    this._componentStores = new Map();
  }

  public createEdge(to: Entity, from: Entity, options: EdgeOptions) {
    const { label, color } = options;
    const _edge = this._allocator.allocate();
    this.edges.push(_edge);

    // Create components
    const _spring = this.addComponent(_edge, new SpringComponent());
    const _label = this.addComponent(_edge, new LabelComponent());
    const _color = this.addComponent(_edge, new ColorComponent());
    const _data = this.addComponent(_edge, new DataComponent());

    // Set component data
    _spring.from = from;
    _spring.to = to;

    if (label) {
      _label.text.text = label.text || _label.text.text;
      _label.alignment = label.alignment || _label.alignment;
    }

    if (color) {
      _color.fillColor = color.fillColor || _color.fillColor;
      _color.textColor = color.textColor || _color.textColor;
    }
  }

  public deleteEdge(edge: Entity): boolean {
    if (this._allocator.deallocate(edge)) {
      this._componentStores.forEach(store => {
        if (store.has(edge)) {
          store.delete(edge);
        }
      });
      return true;
    }

    return false;
  }

  public addComponent<T extends Component>(edge: Entity, component: T): T {
    const componentName = component.constructor.name;

    let store = this._componentStores.get(componentName);

    if (store === undefined) {
      store = new EntityMap<T>();
      this._componentStores.set(componentName, store);
    }

    store.set(edge, component);
    return component;
  }

  public removeComponent<T extends Component>(
    edge: Entity,
    component: Newable<T>
  ): boolean {
    const store = this._componentStores.get(component.name);

    if (store && store.has(edge)) {
      store.delete(edge);
      return true;
    }

    return false;
  }

  public bulkCreateEdges(edges: SpringComponent[], options: EdgeOptions) {
    edges.forEach(edge => {
      this.createEdge(edge.to, edge.from, options);
    });
  }

  get edges(): Entity[] {
    return this._edges;
  }

  public getComponent<T extends Component>(
    edge: Entity,
    component: Newable<T>
  ): T | null {
    const store = this._componentStores.get(component.name);

    if (!store) {
      throw new Error(`No entities with attached component: ${component.name}`);
    }

    const instance = store.get(edge) as T;

    if (!instance) {
      throw new Error(
        `Edge ${JSON.stringify(edge)} does not have component: ${
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

  public getEdgeComponents(edge: Entity): EdgeComponents {
    const components: { [key: string]: Component } = {};
    this._componentStores.forEach((store, storeName) => {
      if (store.has(edge)) {
        components[storeName] = store.get(edge);
      }
    });
    return components;
  }
}
