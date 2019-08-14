import {
  Renderer,
  autoDetectRenderer,
  Container,
  Ticker,
  Graphics,
  Text,
  Rectangle
} from 'pixi.js';
import { Bounds } from '../types';
import PositionComponent from '../Components/PositionComponent';
import SpringComponent from '../Components/SpringComponent';
import EdgeManager from '../Managers/EdgeManager';
import NodeManager from '../Managers/NodeManager';
import ShapeComponent from '../Components/ShapeComponent';
import { QuadTree } from '../Utils';

export default class RenderSystem {
  public _canvas: HTMLCanvasElement;
  public _renderer: Renderer;
  public _container: Container;
  private _nodesContainer: Container;
  private _edgesContainer: Container;
  private _ticker: Ticker;
  public _graphics: Graphics;

  constructor(canvas: HTMLElement) {
    // Create renderer and keep reference to canvas
    this._renderer = autoDetectRenderer({
      height: canvas.clientHeight,
      width: canvas.clientWidth,
      autoDensity: true,
      transparent: true,
      antialias: true,
      resolution: window.devicePixelRatio
    });

    document.getElementById('container').appendChild(this._renderer.view);
    this._canvas = this._renderer.view;

    this._renderer.plugins.interaction.on('click', (e: any) => {
      console.log(e);
    });

    // Create ticker and graphics
    this._ticker = new Ticker();
    this._graphics = new Graphics();
    // this._graphics.scale.set(0.5, 0.5);
    /*
        Create global container
        Panning will be done on this container
    */
    this._container = new Container();

    // Create Node container
    this._nodesContainer = new Container();
    this._nodesContainer.interactive = true;
    this._nodesContainer.buttonMode = true;

    // Create Edge/Link container
    this._edgesContainer = new Container();
    this._edgesContainer.interactive = true;
    this._edgesContainer.buttonMode = true;

    // Add Node and Edge containers to global container
    this._container.addChild(this._nodesContainer);
    this._container.addChild(this._edgesContainer);
    this._container.addChild(this._graphics);

    console.log('canvas: ', this._canvas);

    window.addEventListener('resize', this._onResize.bind(this));
  }

  public getBounds(): Bounds {
    const { left, right, top, bottom } = this._container.getBounds();
    return { left, right, top, bottom };
  }

  public render(
    edgeManager: EdgeManager,
    nodeManager: NodeManager,
    tree: QuadTree,
    debug = false
  ) {
    const edges = edgeManager.edges;
    const nodes = nodeManager.nodes;
    const springs = edgeManager.getComponentsOfType(SpringComponent);
    const nodePositions = nodeManager.getComponentsOfType(PositionComponent);
    const shapes = nodeManager.getComponentsOfType(ShapeComponent);

    const eLen = edges.length;
    const nLen = nodes.length;
    let i;
    this._graphics.clear();

    // draw edges
    this._graphics.lineStyle(1, 0xff0000, 1);
    for (i = 0; i < eLen; i++) {
      const edge = edges[i];
      const spring = springs[edge.index];
      this._graphics.moveTo(
        nodePositions[spring.from.index].x,
        nodePositions[spring.from.index].y
      );
      this._graphics.lineTo(
        nodePositions[spring.to.index].x,
        nodePositions[spring.to.index].y
      );
    }

    // draw nodes
    this._graphics.beginFill(0x0033ff, 1);
    this._graphics.lineStyle(0);
    for (i = 0; i < nLen; i++) {
      const node = nodes[i];
      const { x, y } = nodePositions[node.index];
      this._graphics.drawRect(x - 10, y - 10, 20, 20);
    }

    // this._graphics.beginFill(0x0033ff, 0);
    // this._graphics.lineStyle(1, 0x00ff00);

    // debug draw tree
    if (debug) {
      const renderTree = (branch: QuadTree) => {
        if (branch.divided) {
          renderTree(branch.TL);
          renderTree(branch.TR);
          renderTree(branch.BL);
          renderTree(branch.BR);
        }
        this._graphics.beginFill(0x0033ff, 0);
        this._graphics.lineStyle(1, 0x00ff00);
        this._graphics.drawRect(
          branch.bounds.position.x,
          branch.bounds.position.y,
          branch.bounds.size.x,
          branch.bounds.size.y
        );
        this._graphics.beginFill(0x00ff33, 1);
        this._graphics.lineStyle(1, 0x00ff00);
        this._graphics.drawCircle(
          branch.centerOfMass.x,
          branch.centerOfMass.y,
          5
        );
      };

      renderTree(tree);
    }

    this._renderer.render(this._container);
  }

  private _onResize() {
    this._renderer.resize(
      this._canvas.parentElement.clientWidth,
      this._canvas.parentElement.clientHeight
    );
  }
}
