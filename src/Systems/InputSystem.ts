import { addWheelListener } from '../Utils';
import { Renderer, Graphics, interaction, Container } from 'pixi.js';
import RenderSystem from './RenderSystem';

export default class InputSystem {
  public graphRenderer: Renderer;
  public graphGraphics: Graphics;
  public graphStage: Container;
  public isDragging = false;

  constructor(renderer: RenderSystem) {
    this.graphRenderer = renderer._renderer;
    this.graphGraphics = renderer._graphics;
    this.graphStage = renderer._graphicsContainer;

    addWheelListener(
      renderer._canvasContainer,
      (e: any) => {
        this.zoom(e.clientX, e.clientY, e.deltaY < 0);
      },
      false
    );

    this.addPanning();
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

  public addPanning() {
    console.log('add panning');
    let stage = this.graphStage;

    stage.interactive = true;

    let isDragging = false,
      prevX: number,
      prevY: number;

    stage.on('pointerdown', (moveData: interaction.InteractionEvent) => {
      console.log('pointerdown');
      let pos = moveData.data.global;
      prevX = pos.x;
      prevY = pos.y;
      isDragging = true;
    });

    stage.on('pointermove', (moveData: interaction.InteractionEvent) => {
      if (!isDragging) {
        return;
      }
      let pos = moveData.data.global;
      let dx = pos.x - prevX;
      let dy = pos.y - prevY;

      this.graphGraphics.position.x += dx;
      this.graphGraphics.position.y += dy;
      prevX = pos.x;
      prevY = pos.y;
    });

    stage.on('pointerup', (moveData: interaction.InteractionEvent) => {
      console.log('pointerup');
      isDragging = false;
    });
  }
}
