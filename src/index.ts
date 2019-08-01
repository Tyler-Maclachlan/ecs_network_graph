import RenderSystem from './Systems/RenderSystem';
import NodeManager from './Managers/NodeManager';
import EdgeManager from './Managers/EdgeManager';
import { Options, NodeOptions, EdgeOptions } from './types';
import { SpringSystem } from './Systems/SpringSystem';
import ForceSystem from './Systems/ForceSystem';

export default class VNetGraph {
  private _renderer: RenderSystem;
  private _nodeManager: NodeManager;
  private _edgeManager: EdgeManager;
  private _forceSystem: ForceSystem;

  constructor(
    container: HTMLCanvasElement,
    nodes: [],
    edges: [],
    options: Options
  ) {
    this._renderer = new RenderSystem(container);
    this._nodeManager = new NodeManager();
    this._edgeManager = new EdgeManager();
    this._setup(nodes, edges, options);
  }

  public start() {
    requestAnimationFrame(() => {
      this._update();
    });
  }

  private _setup(nodes: NodeOptions[], edges: EdgeOptions[], options: Options) {
    // TODO: setup all systems and components
    const nLen = nodes.length;
    const eLen = edges.length;
    let i;

    for (i = 0; i < nLen; i++) {
      this._nodeManager.createNode(nodes[i]);
    }

    for (i = 0; i < eLen; i++) {
      const edge = edges[i];
      const to = this._nodeManager.getNodeEntity(edge.to);
      const from = this._nodeManager.getNodeEntity(edge.from);
      this._edgeManager.createEdge(to, from, edge);
    }

    this._forceSystem = new ForceSystem(
      this._renderer.getBounds(),
      this._nodeManager,
      0.5,
      {}
    );
  }

  private _update() {
    requestAnimationFrame(() => {
      this._update();
    });
    SpringSystem(this._edgeManager, this._nodeManager);
    this._renderer.render(this._edgeManager, this._nodeManager);
  }
}

if (!(window as any).VNetGraph) {
  (window as any).VNetGraph = VNetGraph;
}
