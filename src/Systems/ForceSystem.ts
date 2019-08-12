import {
  QuadTree,
  AABB,
  GenerationalIndex as Entity,
  addVecs,
  multiplyVecByScalar
} from '../Utils';
import NodeManager from '../Managers/NodeManager';
import { Bounds, Vector2D, Options } from '../types';
import PositionComponent from '../Components/PositionComponent';
import AccelerationComponent from '../Components/AccelerationComponent';
import VelocityComponent from '../Components/VelocityComponent';

export default class ForceSystem {
  public barnesHutTree: QuadTree;
  public theta: number;
  // theta = number used for barnes hut condition (between 0 and 1) lower means more accurate but less performant and higher is less accurate but more performant
  private options: {
    gravitationalConstant: number;
  };

  constructor(
    bounds: Bounds,
    nodeManager: NodeManager,
    theta: number,
    options: Options
  ) {
    this.theta = theta;
    this.options.gravitationalConstant = options.gravitationalConstant;
    this.constructTree(bounds, nodeManager);
  }

  public constructTree(bounds: Bounds, nodeManager: NodeManager) {
    this.barnesHutTree = new QuadTree(
      new AABB(
        { x: 0, y: 0 },
        {
          x: Math.abs(bounds.right - bounds.left),
          y: Math.abs(bounds.top - bounds.bottom)
        }
      )
    );
    const nodes = nodeManager.nodes;
    const nodePositions = nodeManager.getComponentsOfType(PositionComponent);
    const nLen = nodes.length;

    for (let i = 0; i < nLen; i++) {
      const node = nodes[i];
      const pos = nodePositions[node.index];
      this.barnesHutTree.insert(node, pos);
    }
  }

  private getForceContributions(
    node: Entity,
    pos: PositionComponent,
    branch: QuadTree
  ): Vector2D {
    let forces: Vector2D = { x: 0, y: 0 };
    if (branch.divided || branch.elements.size) {
      const dx = branch.centerOfMass.x - pos.x;
      const dy = branch.centerOfMass.y - pos.y;

      const distance = Math.sqrt(dx * dx + dy * dy);
      const s =
        branch.bounds.size.x > branch.bounds.size.y
          ? branch.bounds.size.x
          : branch.bounds.size.y;
      if (s / distance < this.theta) {
        forces = addVecs(forces, this.calcForce(distance, dx, dy, branch.mass));
      } else if (branch.divided) {
        forces = addVecs(
          forces,
          this.getForceContributions(node, pos, branch.TL)
        );
        forces = addVecs(
          forces,
          this.getForceContributions(node, pos, branch.TR)
        );
        forces = addVecs(
          forces,
          this.getForceContributions(node, pos, branch.BL)
        );
        forces = addVecs(
          forces,
          this.getForceContributions(node, pos, branch.BR)
        );
      } else {
        branch.elements.forEach((_pos, _n) => {
          if (_n.index !== node.index && _n.generation !== node.generation) {
            const _dx = _pos.x - pos.x;
            const _dy = _pos.y - pos.y;
            const d = Math.sqrt(_dx * _dx + _dy * _dy);
            forces = addVecs(forces, this.calcForce(d, _dx, _dy, 1));
          }
        });
      }
    }

    return forces;
  }

  private calcForce(
    distance: number,
    dx: number,
    dy: number,
    mass: number
  ): Vector2D {
    if (distance < 0.1) {
      distance = 0.1;
      dx = distance;
    }

    const gravityForce =
      (this.options.gravitationalConstant * mass) / Math.pow(distance, 3);
    return {
      x: dx * gravityForce,
      y: dy * gravityForce
    };
  }

  public update(bounds: Bounds, nodeManager: NodeManager) {
    const nodes = nodeManager.nodes;
    const nodePositions = nodeManager.getComponentsOfType(PositionComponent);
    const nodeVelocities = nodeManager.getComponentsOfType(VelocityComponent);
    const nodeAccelerations = nodeManager.getComponentsOfType(
      AccelerationComponent
    );
    this.constructTree(bounds, nodeManager);
    const nLen = nodes.length;
    for (let i = 0; i < nLen; i++) {
      const node = nodes[i];
      const nodeAcc = nodeAccelerations[node.index];
      const nodeVel = nodeVelocities[node.index];
      const nodePos = nodePositions[node.index];

      const force = this.getForceContributions(
        node,
        nodePos,
        this.barnesHutTree
      );
      let acc = addVecs(nodeAcc, force);

      let vel = addVecs(nodeVel, acc);
      nodePos.x += vel.x;
      nodePos.y += vel.y;

      vel = multiplyVecByScalar(vel, 0.7);
      acc = multiplyVecByScalar(acc, 0.3);

      nodeVel.x = vel.x;
      nodeVel.y = vel.y;

      if (Math.abs(acc.x) < 0.001) {
        acc.x = 0;
      }
      if (Math.abs(acc.y) < 0.001) {
        acc.y = 0;
      }

      nodeAcc.x = acc.x;
      nodeAcc.y = acc.y;
    }
  }
}
