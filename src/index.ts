import RenderSystem from './Systems/RenderSystem';
import NodeManager from './Managers/NodeManager';
import EdgeManager from './Managers/EdgeManager';
import { Options, NodeOptions, EdgeOptions, Bounds } from './types';
import SpringSystem from './Systems/SpringSystem';
import ForceSystem from './Systems/ForceSystem';
import CentralGravity from './Systems/CentralGravity';
import VelocityVerlet from './Systems/VelocityVerlet';
import InputSystem from './Systems/InputSystem';

export default class VNetGraph {
  private _renderer: RenderSystem;
  private _nodeManager: NodeManager;
  private _edgeManager: EdgeManager;
  private _forceSystem: ForceSystem;
  private _springSystem: SpringSystem;
  private _velocityVerlet: VelocityVerlet;
  private _centralGravity: CentralGravity;
  private _inputSytem: InputSystem;
  private _runs = 0;
  private _worldBounds: Bounds;

  constructor(
    container: HTMLElement,
    nodes: NodeOptions[],
    edges: EdgeOptions[],
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
    this._forceSystem = new ForceSystem(
      {
        left: 0,
        top: 0,
        bottom: this._renderer._canvas.height,
        right: this._renderer._canvas.width
      },
      this._nodeManager,
      {
        gravitationalConstant: -30000,
        theta: 0.7
      }
    );

    this._springSystem = new SpringSystem(
      this._nodeManager,
      this._edgeManager,
      { stiffness: 20 }
    );

    this._velocityVerlet = new VelocityVerlet(this._nodeManager);
    this._centralGravity = new CentralGravity(this._nodeManager);

    this._worldBounds = {
      left: 0,
      top: 0,
      bottom: this._renderer._canvas.height,
      right: this._renderer._canvas.width
    };

    // end physics setup

    // Setup input
    this._inputSytem = new InputSystem(
      this._renderer,
      this._forceSystem,
      this._nodeManager
    );
  }

  private _update() {
    // if (this._runs < 1000) {
    //   this._runs++;
    //   requestAnimationFrame(() => {
    //     this._update();
    //   });
    // }
    requestAnimationFrame(() => {
      this._update();
    });
    // console.log('run: ', this._runs);
    // console.time('physics');
    // console.log(this._worldBounds);
    this._centralGravity.update({
      x: this._renderer._canvas.width / 2,
      y: this._renderer._canvas.height / 2
    });
    this._forceSystem.update(this._worldBounds);
    this._springSystem.update();
    this._velocityVerlet.update(0.5, this._worldBounds);
    // console.timeEnd('physics');
    // console.time('render');
    this._renderer.render(
      this._edgeManager,
      this._nodeManager,
      this._forceSystem.barnesHutTree,
      false
    );
    // console.timeEnd('render');
  }
}

if (!(window as any).VNetGraph) {
  (window as any).VNetGraph = VNetGraph;
}
