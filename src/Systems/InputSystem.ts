import {
  addWheelListener,
  GenerationalIndex as Entity,
  TypedEventEmitter,
  Event
} from '../Utils';
import { Renderer, Graphics, interaction, Container } from 'pixi.js';
import RenderSystem from './RenderSystem';
import ForceSystem from './ForceSystem';
import PositionComponent from '../Components/PositionComponent';
import NodeManager from '../Managers/NodeManager';
import UserControlledComponent from '../Components/UserControlledComponent';

export default class InputSystem {
  public graphContainer: HTMLElement;
  public graphGraphics: Graphics;
  public graphStage: Container;
  public isDragging = false;
  public mouseDown = false;
  public mousePos = {
    x: 0,
    y: 0
  };
  public mouseGraphPos = {
    x: 0,
    y: 0
  };
  public forceSystem: ForceSystem;
  public nodeUnderMouse: {
    node: Entity | null;
    nodePos: PositionComponent | null;
  } = {
    node: null,
    nodePos: null
  };
  private _eventEmitter: TypedEventEmitter;

  constructor(
    renderer: RenderSystem,
    forceSystem: ForceSystem,
    nodeManager: NodeManager,
    eventEmitter: TypedEventEmitter
  ) {
    this.graphContainer = renderer._canvasContainer;
    this.graphGraphics = renderer._graphics;
    this.graphStage = renderer._stage;
    this.forceSystem = forceSystem;
    this._eventEmitter = eventEmitter;

    addWheelListener(
      renderer._canvasContainer,
      (e: MouseWheelEvent) => {
        e.preventDefault();
        this.zoom(e.clientX, e.clientY, e.deltaY < 0);
      },
      false
    );

    this.addPanning(nodeManager);
  }

  public getGraphCoordinates(x: number, y: number) {
    let ctx = {
      global: {
        x: 0,
        y: 0
      }
    };
    ctx.global.x = x;
    ctx.global.y = y;
    return interaction.InteractionData.prototype.getLocalPosition.call(
      ctx,
      this.graphGraphics
    );
  }

  public zoom(x: number, y: number, isZoomIn: boolean) {
    let direction = isZoomIn ? 1 : -1;
    let factor = 1 + direction * 0.1;
    this.graphGraphics.scale.x *= factor;
    this.graphGraphics.scale.y *= factor;

    let beforeTransform = this.getGraphCoordinates(x, y);
    this.graphGraphics.updateTransform();
    let afterTransform = this.getGraphCoordinates(x, y);

    this.graphGraphics.position.x +=
      (afterTransform.x - beforeTransform.x) * this.graphGraphics.scale.x;
    this.graphGraphics.position.y +=
      (afterTransform.y - beforeTransform.y) * this.graphGraphics.scale.y;
    this.graphGraphics.updateTransform();
  }

  public addPanning(nodeManager: NodeManager) {
    let container = this.graphContainer;

    let prevX: number, prevY: number;

    container.addEventListener('pointerdown', (event: MouseEvent) => {
      this.isDragging = true;
      this.mouseDown = true;
      prevX = event.pageX - container.offsetLeft;
      prevY = event.pageY - container.offsetTop;
      this.mousePos = {
        x: prevX,
        y: prevY
      };
      this.mouseGraphPos = this.getGraphCoordinates(prevX, prevY);

      const nodesUnderMouse = this.forceSystem.getNodeAt(
        this.mouseGraphPos.x,
        this.mouseGraphPos.y
      );

      if (nodesUnderMouse.length === 1) {
        this.nodeUnderMouse.node = nodesUnderMouse[0];
        this.nodeUnderMouse.nodePos = nodeManager.getComponent(
          this.nodeUnderMouse.node,
          PositionComponent
        );
        nodeManager.getComponent(
          this.nodeUnderMouse.node,
          UserControlledComponent
        ).isControlled = true;
        this._eventEmitter.emit(Event.NODE_SELECTED, '');
      }
      this._eventEmitter.emit(Event.DRAG_START, '');
      event.preventDefault();
    });

    container.addEventListener('pointermove', (event: MouseEvent) => {
      if (this.isDragging) {
        let mouseX = event.pageX - container.offsetLeft;
        let mouseY = event.pageY - container.offsetTop;

        if (this.nodeUnderMouse.node) {
          const graphPos = this.getGraphCoordinates(mouseX, mouseY);
          this.nodeUnderMouse.nodePos.x = graphPos.x;
          this.nodeUnderMouse.nodePos.y = graphPos.y;
          this._eventEmitter.emit(Event.DRAGGING, '');
        } else {
          let dx = mouseX - prevX;
          let dy = mouseY - prevY;

          this.graphGraphics.position.x += dx;
          this.graphGraphics.position.y += dy;
          this.graphGraphics.updateTransform();
        }

        prevX = mouseX;
        prevY = mouseY;
      }
    });

    container.addEventListener('pointerup', () => {
      if (this.nodeUnderMouse.node) {
        nodeManager.getComponent(
          this.nodeUnderMouse.node,
          UserControlledComponent
        ).isControlled = false;
        this.nodeUnderMouse = {
          node: null,
          nodePos: null
        };
      }
      this.mouseDown = false;
      this.isDragging = false;
      this._eventEmitter.emit(Event.DRAG_END, '');
    });

    container.addEventListener('pointerleave', () => {
      if (this.nodeUnderMouse.node) {
        nodeManager.getComponent(
          this.nodeUnderMouse.node,
          UserControlledComponent
        ).isControlled = false;
        this.nodeUnderMouse = {
          node: null,
          nodePos: null
        };
        this._eventEmitter.emit(Event.NODE_DESELECTED, '');
      }
      this.mouseDown = false;
      this.isDragging = false;
      this._eventEmitter.emit(Event.DRAG_END, '');
    });
  }
}
