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
import ForceComponent from '../Components/ForceComponent';

export default class ForceSystem {
  public barnesHutTree: QuadTree;
  public theta: number = 0.5;
  // theta = number used for barnes hut condition (between 0 and 1) lower means more accurate but less performant and higher is less accurate but more performant
  private options = {
    gravitationalConstant: -2000
  };

  constructor(
    bounds: Bounds,
    nodeManager: NodeManager,
    theta: number,
    options: Options
  ) {
    this.theta = theta || this.theta;
    this.options.gravitationalConstant =
      options.gravitationalConstant || this.options.gravitationalConstant;
    this.constructTree(bounds, nodeManager);
  }

  public constructTree(bounds: Bounds, nodeManager: NodeManager) {
    const sizeX = bounds.right - bounds.left;
    const sizeY = bounds.bottom - bounds.top;
    const size = sizeX > sizeY ? sizeX : sizeY; // izza square now
    this.barnesHutTree = new QuadTree(
      new AABB(
        { x: bounds.left, y: bounds.top },
        {
          x: size,
          y: size
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
      const sd = s / distance;
      if (sd < this.theta) {
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
        if (!branch.elements.has(node)) {
          forces = addVecs(
            forces,
            this.calcForce(distance, dx, dy, branch.mass)
          );
        }
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
      (this.options.gravitationalConstant * mass) /
      (distance * distance * distance);

    const force = {
      x: dx * gravityForce,
      y: dy * gravityForce
    };
    return force;
  }

  public update(bounds: Bounds, nodeManager: NodeManager) {
    const nodes = nodeManager.nodes;
    const nodePositions = nodeManager.getComponentsOfType(PositionComponent);
    const nodeForces = nodeManager.getComponentsOfType(ForceComponent);
    this.constructTree(bounds, nodeManager);
    const nLen = nodes.length;
    for (let i = 0; i < nLen; i++) {
      const node = nodes[i];
      const nodePos = nodePositions[node.index];
      const nodeForce = nodeForces[node.index];

      const force = this.getForceContributions(
        node,
        nodePos,
        this.barnesHutTree
      );

      // console.log('before ', nodeForce);
      nodeForce.x += force.x;
      nodeForce.y += force.y;
      // console.log('after ', nodeForce);
    }
  }
}
