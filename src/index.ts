import RenderSystem from './Systems/RenderSystem';
import NodeManager from './Managers/NodeManager';
import EdgeManager from './Managers/EdgeManager';
import { Options, NodeOptions, EdgeOptions, Bounds } from './types';
import InputSystem from './Systems/InputSystem';
import PhysicsSystem from './Systems/PhysicsSystem';
import { TypedEventEmitter, Event } from './Utils';

export default class VNetGraph {
  private _renderer: RenderSystem;
  private _nodeManager: NodeManager;
  private _edgeManager: EdgeManager;
  private _physicsSystem: PhysicsSystem;
  private _inputSytem: InputSystem;
  private _runs = 0;
  private _worldBounds: Bounds;
  private _eventEmitter: TypedEventEmitter;

  constructor(
    container: HTMLElement,
    nodes: NodeOptions[],
    edges: EdgeOptions[],
    options: Options
  ) {
    this._renderer = new RenderSystem(container);
    this._nodeManager = new NodeManager();
    this._edgeManager = new EdgeManager();
    this._eventEmitter = new TypedEventEmitter();
    this._setup(nodes, edges, options);
  }

  public start() {
    requestAnimationFrame(() => {
      this._update();
    });
  }

  private _setup(nodes: NodeOptions[], edges: EdgeOptions[], options: Options) {
    const eLen = edges.length;
    let i;

    // begin setup nodes and edges
    this._nodeManager.bulkCreateNodes(nodes);

    for (i = 0; i < eLen; i++) {
      const edge = edges[i];
      const to = this._nodeManager.getNodeEntity(edge.to);
      const from = this._nodeManager.getNodeEntity(edge.from);
      this._edgeManager.createEdge(to, from, edge);
    }

    // end setup nodes and edges

    // begin physics setup
    this._physicsSystem = new PhysicsSystem(
      this._nodeManager,
      this._edgeManager,
      {
        left: 0,
        top: 0,
        bottom: this._renderer._canvas.height,
        right: this._renderer._canvas.width
      },
      this._renderer._canvas,
      this._eventEmitter,
      {
        force: {
          theta: 0.7
        }
      }
    );

    // end physics setup

    // Setup input
    this._inputSytem = new InputSystem(
      this._renderer,
      this._physicsSystem.forceSystem,
      this._nodeManager,
      this._eventEmitter
    );

    this._eventEmitter.on(Event.STABILIZATION_END, payload => {
      console.log(payload);
    });
  }

  private _update() {
    requestAnimationFrame(() => {
      this._update();
    });
    this._physicsSystem.update(0.5);
    this._renderer.render(
      this._edgeManager,
      this._nodeManager,
      this._physicsSystem.forceSystem.barnesHutTree
    );
  }
}

if (!(window as any).VNetGraph) {
  (window as any).VNetGraph = VNetGraph;
}
