import {
  GenerationalIndexAllocator as EntityAllocator,
  GenerationalIndex as Entity,
  GenerationalIndexArray as EntityMap
} from "../Utils/index";
import SpringComponent from "../Components/SpringComponent";
import LabelComponent from "../Components/LabelComponent";
import ColorComponent from "../Components/ColorComponent";
import DataComponent from "../Components/DataComponent";
import { EdgeComponent, EdgeComponents } from "../types";

export default class EdgeManager {
  private _allocator: EntityAllocator;
  private _edges: Entity[];
  private _components: {
    spring: EntityMap<SpringComponent>;
    label: EntityMap<LabelComponent>;
    color: EntityMap<ColorComponent>;
    data: EntityMap<DataComponent>;
  };

  constructor() {
    this._allocator = new EntityAllocator();
    this._edges = [];
    this._components = {
      spring: new EntityMap<SpringComponent>(),
      label: new EntityMap<LabelComponent>(),
      color: new EntityMap<ColorComponent>(),
      data: new EntityMap<DataComponent>()
    };
  }

  public createEdge(
    to: Entity,
    from: Entity,
    options: {
      label: string;
      color: { textColor: string; fillColor: string };
    }
  ) {
    const { label, color } = options;
    const _edge = this._allocator.allocate();
    this.edges.push(_edge);
    this._components.spring.set(_edge, { from, to });
    this._components.label.set(_edge, { text: label, alignment: "middle" });
    this._components.color.set(_edge, color);
    this._components.data.set(_edge, new DataComponent());
  }

  public bulkCreateEdges(
    edges: SpringComponent[],
    options: { label: string; color: { textColor: string; fillColor: string } }
  ) {
    edges.forEach(edge => {
      this.createEdge(edge.to, edge.from, options);
    });
  }

  get edges(): Entity[] {
    return this._edges;
  }

  public getEdgeComponentData(
    edge: Entity,
    component: string
  ): EdgeComponent | null {
    if (!this._components[component])
      throw new Error("This component does not exist");
    if (!this._components[component].has(edge)) return null;

    return this._components[component].get(edge);
  }

  public getEdgeComponents(edge: Entity): EdgeComponents {
    const components = {};
    Object.keys(this._components).forEach(key => {
      if (this._components[key].has(edge)) {
        components[key] = this._components[key].get(edge);
      }
    });
    return components;
  }
}
