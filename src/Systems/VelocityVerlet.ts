import NodeManager from '../Managers/NodeManager';
import { Vector2D, Bounds, Options } from '../types';
import VelocityComponent from '../Components/VelocityComponent';
import ForceComponent from '../Components/ForceComponent';
import PositionComponent from '../Components/PositionComponent';
import UserControlledComponent from '../Components/UserControlledComponent';
import { deepExtend } from '../Utils';

export default class VelocityVerlet {
  private _nodeManager: NodeManager;
  private _options = {
    damping: 0.9,
    maxVelocity: 100,
    minVelocity: -100
  };

  constructor(nodeManager: NodeManager, options?: Options) {
    this._nodeManager = nodeManager;
    if (options) {
      this._options = deepExtend(this._options, options);
    }
  }

  public update(dt: number, worldBounds: Bounds) {
    const nodes = this._nodeManager.nodes;
    const nodeVelocities = this._nodeManager.getComponentsOfType(
      VelocityComponent
    );
    const nodePositions = this._nodeManager.getComponentsOfType(
      PositionComponent
    );
    const userControlledNodes = this._nodeManager.getComponentsOfType(
      UserControlledComponent
    );
    const nodeForces = this._nodeManager.getComponentsOfType(ForceComponent);
    const nLen = nodes.length;
    let i, node, vel, force, pos;

    for (i = 0; i < nLen; i++) {
      node = nodes[i];
      pos = nodePositions[node.index];
      force = nodeForces[node.index];
      vel = nodeVelocities[node.index];

      vel.x = this._calculateVelocity(vel.x, force.x, 1);
      vel.y = this._calculateVelocity(vel.y, force.y, 1);
      if (userControlledNodes[node.index].isControlled === false) {
        pos.x += vel.x * dt;
        pos.y += vel.y * dt;
      }

      if (pos.x > worldBounds.right) {
        worldBounds.right = pos.x;
      } else if (pos.x < worldBounds.left) {
        worldBounds.left = pos.x;
      }

      if (pos.y > worldBounds.bottom) {
        worldBounds.bottom = pos.y;
      } else if (pos.y < worldBounds.top) {
        worldBounds.top = pos.y;
      }

      force.x = 0;
      force.y = 0;
    }
  }

  private _calculateVelocity(velocity: number, force: number, mass: number) {
    const dampingForce = 0.9 * velocity;
    let a = (force - dampingForce) / mass;
    velocity += a;

    if (Math.abs(velocity) > 100) {
      velocity = velocity < 0 ? -100 : 100;
    }

    return velocity;
  }
}
