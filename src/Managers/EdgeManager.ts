import {
  GenerationalIndexAllocator as EntityAllocator,
  GenerationalIndex as Entity,
  GenerationalIndexArray as EntityMap
} from '../Utils/index';
import SpringComponent from '../Components/SpringComponent';
import LabelComponent from '../Components/LabelComponent';
import ColorComponent from '../Components/ColorComponent';
import DataComponent from '../Components/DataComponent';
import {
  Newable,
  Component,
  EdgeComponents,
  EdgeComponent,
  EdgeOptions
} from '../types';

export default class EdgeManager {
  private _allocator: EntityAllocator;
  private _edges: Entity[];
  private _componentStores: Map<String, EntityMap<Component>>;

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
    this.addComponent(_edge, new SpringComponent());
    this.addComponent(_edge, new LabelComponent());
    this.addComponent(_edge, new ColorComponent());
    this.addComponent(_edge, new DataComponent());

    // Set component data
    const _spring = this.getComponent<SpringComponent>(_edge, SpringComponent)!;
    _spring.from = from;
    _spring.to = to;

    const _label = this.getComponent<LabelComponent>(_edge, LabelComponent)!;
    _label.text = label.text;
    _label.alignment = label.alignment;

    const _color = this.getComponent<ColorComponent>(_edge, ColorComponent)!;
    _color.fillColor = color.fillColor;
    _color.textColor = color.textColor;
  }

  public addComponent<T extends Component>(edge: Entity, component: T): T {
    const componentName = component.name;

    let store = this._componentStores.get(componentName);

    if (store === undefined) {
      store = new EntityMap<T>();
      this._componentStores.set(componentName, store);
    }

    store.set(edge, component);
    return component;
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
        components[storeName.toString()] = store.get(edge);
      }
    });
    return components;
  }
}
