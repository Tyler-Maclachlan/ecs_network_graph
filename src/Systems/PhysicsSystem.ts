import ForceSystem from './ForceSystem';
import SpringSystem from './SpringSystem';
import CentralGravity from './CentralGravity';
import VelocityVerlet from './VelocityVerlet';
import { Options, Bounds } from '../types';
import NodeManager from '../Managers/NodeManager';
import EdgeManager from '../Managers/EdgeManager';
import { deepExtend, TypedEventEmitter, Event, absVec } from '../Utils';

export default class PhysicsSystem {
  public forceSystem: ForceSystem;
  public springSystem: SpringSystem;
  public centralGravity: CentralGravity;
  public velocityVerlet: VelocityVerlet;

  private _nodeManager: NodeManager;
  private _edgeManager: EdgeManager;
  private _eventEmitter: TypedEventEmitter;

  private _worldBounds: Bounds;
  private _canvas: HTMLCanvasElement;
  private _options = {
    force: {
      gravitationalConstant: -80000,
      theta: 0.5
    },
    spring: {
      stiffness: 5,
      restDistance: 200,
      damping: 0.003
    },
    centralGravity: {
      centralGravity: 0.2,
      center: {
        x: 0,
        y: 0
      }
    },
    velocityVerlet: {
      damping: 0.9,
      maxVelocity: 1000,
      minVelocity: -1000
    },
    stabilization: {
      maxIterations: 10000
    }
  };
  private _iterations = 0;
  private _stabilized = false;
  private _running = true;

  constructor(
    nodeManager: NodeManager,
    edgeManager: EdgeManager,
    worldBounds: Bounds,
    canvas: HTMLCanvasElement,
    eventEmitter: TypedEventEmitter,
    options?: Options
  ) {
    if (options) {
      this._options = deepExtend(this._options, options);
    }
    this._nodeManager = nodeManager;
    this._edgeManager = edgeManager;
    this._worldBounds = worldBounds;
    this.forceSystem = new ForceSystem(
      worldBounds,
      nodeManager,
      this._options.force
    );
    this.springSystem = new SpringSystem(
      nodeManager,
      edgeManager,
      this._options.spring
    );
    this.centralGravity = new CentralGravity(
      nodeManager,
      this._options.centralGravity
    );
    this.velocityVerlet = new VelocityVerlet(
      nodeManager,
      this._options.velocityVerlet
    );
    this._canvas = canvas;
    this._eventEmitter = eventEmitter;

    this._bindListeners();
  }

  public update(dt: number) {
    if (!this._stabilized) {
      this.centralGravity.update({
        x: this._canvas.width / 2,
        y: this._canvas.height / 2
      });
      this.forceSystem.update(this._worldBounds);
      this.springSystem.update();
      const avgVelocity = this.velocityVerlet.update(dt, this._worldBounds);

      this._iterations++;
      if (
        (avgVelocity.x < 0.003 && avgVelocity.y < 0.003) ||
        this._iterations > this._options.stabilization.maxIterations
      ) {
        this._stabilized = true;
        this._running = false;
        this._eventEmitter.emit(Event.STABILIZATION_END, 'stabilized');
      }
    }
  }

  private _bindListeners() {
    this._eventEmitter.on(
      Event.DRAG_START,
      this._resetStabilization.bind(this)
    );
    this._eventEmitter.on(Event.DRAG_END, this._resetStabilization.bind(this));
    this._eventEmitter.on(Event.DRAGGING, this._resetStabilization.bind(this));
  }

  private _resetStabilization() {
    this._eventEmitter.emit(Event.STABILIZATION_START, '');
    this._stabilized = false;
    this._running = true;
    this._iterations = 0;
  }
}
