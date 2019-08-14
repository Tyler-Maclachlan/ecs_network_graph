import RenderSystem from './Systems/RenderSystem';
import NodeManager from './Managers/NodeManager';
import EdgeManager from './Managers/EdgeManager';
import { Options, NodeOptions, EdgeOptions, Bounds } from './types';
import { SpringSystem } from './Systems/SpringSystem';
import ForceSystem from './Systems/ForceSystem';
import PositionComponent from './Components/PositionComponent';
import VelocityComponent from './Components/VelocityComponent';
import AccelerationComponent from './Components/AccelerationComponent';
import CentralGravity from './Systems/CentralGravity';
import VelocityVerlet from './Systems/VelocityVerlet';
import ForceComponent from './Components/ForceComponent';
import InputSystem from './Systems/InputSystem';

export default class VNetGraph {
  private _renderer: RenderSystem;
  private _nodeManager: NodeManager;
  private _edgeManager: EdgeManager;
  private _forceSystem: ForceSystem;
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

    this._nodeManager.bulkCreateNodes(nodes);

    for (i = 0; i < eLen; i++) {
      const edge = edges[i];
      const to = this._nodeManager.getNodeEntity(edge.to);
      const from = this._nodeManager.getNodeEntity(edge.from);
      this._edgeManager.createEdge(to, from, edge);
    }

    this._forceSystem = new ForceSystem(
      {
        left: 0,
        top: 0,
        bottom: this._renderer._canvas.height,
        right: this._renderer._canvas.width
      },
      this._nodeManager,
      0.5,
      {
        gravitationalConstant: -30000
      }
    );

    this._worldBounds = {
      left: 0,
      top: 0,
      bottom: this._renderer._canvas.height,
      right: this._renderer._canvas.width
    };

    this._inputSytem = new InputSystem(this._renderer);
  }

  private _updateWorldBounds() {
    const nodes = this._nodeManager.nodes;
    const nodePositions = this._nodeManager.getComponentsOfType(
      PositionComponent
    );
    this._worldBounds = { left: 0, top: 0, right: 0, bottom: 0 };
    const nLen = nodes.length;
    for (let i = 0; i < nLen; i++) {
      const node = nodes[i];
      const pos = nodePositions[node.index];

      if (pos.x < this._worldBounds.left) {
        this._worldBounds.left = pos.x;
      } else if (pos.x > this._worldBounds.right) {
        this._worldBounds.right = pos.x;
      }

      if (pos.y < this._worldBounds.top) {
        this._worldBounds.top = pos.y;
      } else if (pos.y > this._worldBounds.bottom) {
        this._worldBounds.bottom = pos.y;
      }
    }
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
    console.time('physics');
    this._updateWorldBounds();
    // console.log(this._worldBounds);
    CentralGravity(this._nodeManager, {
      x: this._renderer._canvas.width / 2,
      y: this._renderer._canvas.height / 2
    });
    this._forceSystem.update(this._worldBounds, this._nodeManager);
    SpringSystem(this._edgeManager, this._nodeManager);
    VelocityVerlet(this._nodeManager, 0.5);
    console.timeEnd('physics');
    console.time('render');
    this._renderer.render(
      this._edgeManager,
      this._nodeManager,
      this._forceSystem.barnesHutTree,
      false
    );
    console.timeEnd('render');
  }
}

if (!(window as any).VNetGraph) {
  (window as any).VNetGraph = VNetGraph;
}
