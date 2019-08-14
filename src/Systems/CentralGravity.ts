import NodeManager from '../Managers/NodeManager';
import { Vector2D } from '../types';
import PositionComponent from '../Components/PositionComponent';
import ForceComponent from '../Components/ForceComponent';

export default function CentralGravity(
  nodeManager: NodeManager,
  center: Vector2D
) {
  const nodes = nodeManager.nodes;
  const nodePositions = nodeManager.getComponentsOfType(PositionComponent);
  const nodeForces = nodeManager.getComponentsOfType(ForceComponent);
  const nLen = nodes.length;
  let node, pos, dx, dy, distance, force, nodeForce;

  for (let i = 0; i < nLen; i++) {
    node = nodes[i];
    pos = nodePositions[node.index];
    nodeForce = nodeForces[node.index];

    dx = center.x - pos.x;
    dy = center.y - pos.y;
    distance = Math.sqrt(dx * dx + dy * dy);

    force = calcForce(distance, dx, dy, 1);
    nodeForce.x += force.x;
    nodeForce.y += force.y;
  }
}

function calcForce(distance: number, dx: number, dy: number, mass: number) {
  if (distance < 0.1) {
    distance = 0.1;
    dx = distance;
  }
  const gravityForce = 0.3 / distance;
  return {
    x: gravityForce * dx,
    y: gravityForce * dy
  };
}
