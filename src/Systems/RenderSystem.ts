import { Renderer, autoDetectRenderer, Container, Graphics } from 'pixi.js';
import { Bounds } from '../types';
import PositionComponent from '../Components/PositionComponent';
import SpringComponent from '../Components/SpringComponent';
import EdgeManager from '../Managers/EdgeManager';
import NodeManager from '../Managers/NodeManager';
import ShapeComponent from '../Components/ShapeComponent';
import { QuadTree } from '../Utils';
import LabelComponent from '../Components/LabelComponent';
import SizeComponent from '../Components/SizeComponent';

export default class RenderSystem {
  public _canvasContainer: HTMLElement;
  public _canvas: HTMLCanvasElement;
  public _renderer: Renderer;
  public _graphicsContainer: Container;
  private _nodesContainer: Container;
  private _edgesContainer: Container;
  public _graphics: Graphics;

  constructor(container: HTMLElement) {
    // Create renderer and keep reference to canvas
    this._renderer = autoDetectRenderer({
      height: container.clientHeight,
      width: container.clientWidth,
      autoDensity: true,
      transparent: true,
      antialias: true,
      resolution: window.devicePixelRatio
    });

    this._canvasContainer = container;
    this._canvas = this._renderer.view;
    this._canvasContainer.appendChild(this._renderer.view);

    // Create ticker and graphics
    this._graphics = new Graphics();
    // this._graphics.scale.set(0.5, 0.5);
    /*
        Create global container
        Panning will be done on this container
    */
    this._graphicsContainer = new Container();
    this._graphicsContainer.interactive = true;
    this._graphicsContainer.buttonMode = true;

    // Create Node container
    this._nodesContainer = new Container();
    this._nodesContainer.interactive = true;
    this._nodesContainer.buttonMode = true;

    // Create Edge/Link container
    this._edgesContainer = new Container();
    this._edgesContainer.interactive = true;
    this._edgesContainer.buttonMode = true;

    // Add Node and Edge containers to global container
    this._graphicsContainer.addChild(this._graphics);
    this._graphicsContainer.addChild(this._nodesContainer);
    this._graphicsContainer.addChild(this._edgesContainer);

    window.addEventListener('resize', this._onResize.bind(this));
  }

  public getBounds(): Bounds {
    const { left, right, top, bottom } = this._graphicsContainer.getBounds();
    return { left, right, top, bottom };
  }

  public fitToScreen() {
    // TODO: fix this
    const renderBounds = this.getBounds();
    const renderHeight = renderBounds.bottom - renderBounds.top;
    const renderWidth = renderBounds.right - renderBounds.left;

    const canvasHeight = this._canvasContainer.clientHeight;
    const canvasWidth = this._canvasContainer.clientWidth;

    const scaleX = canvasWidth / renderWidth;
    const scaleY = canvasHeight / renderHeight;

    const scale = scaleX > scaleY ? scaleY : scaleX;

    this._graphics.scale.set(scale, scale);
    this._graphics.updateTransform();
    this._renderer.render(this._graphicsContainer);
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
    const edgeLabels = edgeManager.getComponentsOfType(LabelComponent);

    const nodePositions = nodeManager.getComponentsOfType(PositionComponent);
    const nodeLabels = nodeManager.getComponentsOfType(LabelComponent);
    const nodeSizes = nodeManager.getComponentsOfType(SizeComponent);
    const shapes = nodeManager.getComponentsOfType(ShapeComponent);

    const eLen = edges.length;
    const nLen = nodes.length;
    let i, nodeSize, nodeLabel;
    this._graphics.clear();

    // draw edges
    this._graphics.lineStyle(1, 0xff0000, 1);
    for (i = 0; i < eLen; i++) {
      const edge = edges[i];
      const spring = springs[edge.index];
      const to = nodePositions[spring.to.index];
      const from = nodePositions[spring.from.index];
      this._graphics.moveTo(from.x, from.y);
      this._graphics.lineTo(to.x, to.y);
    }

    // draw nodes
    this._graphics.beginFill(0x0033ff, 1);
    this._graphics.lineStyle(0);
    for (i = 0; i < nLen; i++) {
      const node = nodes[i];
      nodeSize = nodeSizes[node.index];
      nodeLabel = nodeLabels[node.index];
      const { x, y } = nodePositions[node.index];
      this._graphics.drawRect(
        x - nodeSize.width / 2,
        y - nodeSize.height / 2,
        nodeSize.width,
        nodeSize.height
      );
      this._graphics
        .addChild(nodeLabel.text)
        .position.set(x - nodeLabel.text.width / 2, y + nodeSize.height / 2);
    }
    this._graphics.endFill();

    // this._graphics.beginFill(0x0033ff, 0);
    // this._graphics.lineStyle(1, 0x00ff00);

    // debug draw barnes hut tree
    if (debug) {
      let i = -1;
      const colors = [
        '#79baf2',
        '#7b9686',
        '#3c4dff',
        '#dd703e',
        '#ce67ea',
        '#da0c3d',
        '#8c2496',
        '#9098ad',
        '#f1460b',
        '#EDFFAB',
        '#FDB833',
        '#3BC14A'
      ];
      const renderTree = (branch: QuadTree) => {
        i++;
        if (i >= colors.length) {
          i = 0;
        }
        if (branch.divided) {
          renderTree(branch.TL);
          renderTree(branch.TR);
          renderTree(branch.BL);
          renderTree(branch.BR);
        }
        this._graphics.lineStyle(
          1,
          parseInt(colors[i].toLowerCase().replace('#', '0x'), 16)
        );
        this._graphics.drawRect(
          branch.bounds.position.x,
          branch.bounds.position.y,
          branch.bounds.size.x,
          branch.bounds.size.y
        );
      };

      renderTree(tree);
    }

    this._renderer.render(this._graphicsContainer);
  }

  private _onResize() {
    this._renderer.resize(
      this._canvasContainer.clientWidth,
      this._canvasContainer.clientHeight
    );
    this._graphics.updateTransform();
    this._renderer.render(this._graphicsContainer);
  }
}
