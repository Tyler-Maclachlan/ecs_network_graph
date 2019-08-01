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

export default class RenderSystem {
  private _canvas: HTMLCanvasElement;
  private _renderer: Renderer;
  private _container: Container;
  private _nodesContainer: Container;
  private _edgesContainer: Container;
  private _ticker: Ticker;
  private _graphics: Graphics;

  constructor(canvas: HTMLCanvasElement) {
    // Create renderer and keep reference to canvas
    this._canvas = canvas;
    this._renderer = autoDetectRenderer({
      view: canvas,
      autoDensity: true,
      transparent: true,
      antialias: true,
      resolution: window.devicePixelRatio
    });

    this._renderer.plugins.interaction.on('click', (e: any) => {
      console.log(e);
    });

    // Create ticker and graphics
    this._ticker = new Ticker();
    this._graphics = new Graphics();

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

    window.addEventListener('resize', this._onResize);
  }

  public getBounds(): Bounds {
    const { left, right, top, bottom } = this._container.getBounds();
    return { left, right, top, bottom };
  }

  public render(edgeManager: EdgeManager, nodeManager: NodeManager) {
    const edges = edgeManager.getComponentsOfType(SpringComponent);
    const nodes = nodeManager.getComponentsOfType(PositionComponent);
    const shapes = nodeManager.getComponentsOfType(ShapeComponent);

    const eLen = edges.length;
    const nLen = nodes.length;
    let i;
    this._graphics.clear();

    // draw edges
    this._graphics.lineStyle(1, 0x0000ff, 1);
    for (i = 0; i < eLen; i++) {
      const edge = edges[i];
      this._graphics.moveTo(nodes[edge.from.index].x, nodes[edge.from.index].y);
      this._graphics.lineTo(nodes[edge.to.index].x, nodes[edge.to.index].y);
    }

    // draw nodes
    this._graphics.lineStyle(0);
    for (i = 0; i < nLen; i++) {
      const { x, y } = nodes[i];
      switch (shapes[i].shape) {
        case 'rectangle': {
          this._graphics.drawRect(x, y, 20, 20);
          break;
        }
        default: {
          this._graphics.drawRect(x, y, 20, 20);
        }
      }
    }
  }

  private _onResize() {
    this._renderer.resize(this._canvas.width, this._canvas.height);
  }
}
