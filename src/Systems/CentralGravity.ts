import NodeManager from '../Managers/NodeManager';
import { Vector2D } from '../types';
import PositionComponent from '../Components/PositionComponent';
import ForceComponent from '../Components/ForceComponent';
import { deepExtend } from '../Utils';

export default class CentralGravity {
  private _nodeManager: NodeManager;
  private _options = {
    centralGravity: 0.2,
    center: {
      x: 0,
      y: 0
    }
  };

  constructor(nodeManager: NodeManager, options?: any) {
    this._nodeManager = nodeManager;
    if (options) {
      this._options = deepExtend(this._options, options);
    }
  }

  public update(center: Vector2D) {
    const nodes = this._nodeManager.nodes;
    const nodePositions = this._nodeManager.getComponentsOfType(
      PositionComponent
    );
    const nodeForces = this._nodeManager.getComponentsOfType(ForceComponent);
    const nLen = nodes.length;
    let node, pos, dx, dy, distance, force, nodeForce;

    for (let i = 0; i < nLen; i++) {
      node = nodes[i];
      pos = nodePositions[node.index];
      nodeForce = nodeForces[node.index];

      dx = center.x - pos.x;
      dy = center.y - pos.y;
      distance = Math.sqrt(dx * dx + dy * dy);

      force = this._calcForce(distance, dx, dy, 1);
      nodeForce.x += force.x;
      nodeForce.y += force.y;
    }
  }

  private _calcForce(distance: number, dx: number, dy: number, mass: number) {
    if (distance < 0.1) {
      distance = 0.1;
      dx = distance;
    }
    const gravityForce = (this._options.centralGravity * mass) / distance;
    return {
      x: gravityForce * dx,
      y: gravityForce * dy
    };
  }
}
