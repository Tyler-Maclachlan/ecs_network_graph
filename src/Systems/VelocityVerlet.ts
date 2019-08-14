import NodeManager from '../Managers/NodeManager';
import { Vector2D } from '../types';
import VelocityComponent from '../Components/VelocityComponent';
import ForceComponent from '../Components/ForceComponent';
import PositionComponent from '../Components/PositionComponent';

export default function VelocityVerlet(nodeManager: NodeManager, dt: number) {
  const nodes = nodeManager.nodes;
  const nodeVelocities = nodeManager.getComponentsOfType(VelocityComponent);
  const nodePositions = nodeManager.getComponentsOfType(PositionComponent);
  const nodeForces = nodeManager.getComponentsOfType(ForceComponent);
  const nLen = nodes.length;
  let i, node, vel, force, pos;

  for (i = 0; i < nLen; i++) {
    node = nodes[i];
    pos = nodePositions[node.index];
    force = nodeForces[node.index];
    vel = nodeVelocities[node.index];

    vel.x = calculateVelocity(vel.x, force.x, 1);
    vel.y = calculateVelocity(vel.y, force.y, 1);

    pos.x += vel.x * dt;
    pos.y += vel.y * dt;

    force.x = 0;
    force.y = 0;
  }
}

function calculateVelocity(velocity: number, force: number, mass: number) {
  const dampingForce = 0.5 * velocity;
  let a = (force - dampingForce) / mass;
  velocity += a;

  if (Math.abs(velocity) > 1e9) {
    velocity = velocity < 0 ? -1e9 : 1e9;
  }

  return velocity;
}
