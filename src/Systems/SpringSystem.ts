import EdgeManager from '../Managers/EdgeManager';
import NodeManager from '../Managers/NodeManager';
import PositionComponent from '../Components/PositionComponent';
import VelocityComponent from '../Components/VelocityComponent';
import AccelerationComponent from '../Components/AccelerationComponent';
import SpringComponent from '../Components/SpringComponent';
import { getDistanceBetweenVecs, normalizeVec, subVecs } from '../Utils/index';
import ForceComponent from '../Components/ForceComponent';

export function SpringSystem(
  edgeManager: EdgeManager,
  nodeManager: NodeManager,
  options?: {
    stiffness: number;
    damping: number;
    restDistance: number;
  }
) {
  const stiffness = (options && options.stiffness) || 20;
  const damping = (options && options.damping) || 0.003;
  const restDistance = (options && options.restDistance) || 150;

  const edges = edgeManager.getComponentsOfType(SpringComponent);
  const nodePositions = nodeManager.getComponentsOfType(PositionComponent);
  const nodeVels = nodeManager.getComponentsOfType(VelocityComponent);
  const nodeForces = nodeManager.getComponentsOfType(ForceComponent);
  const numEdges = edges.length;

  for (let i = 0; i < numEdges; i++) {
    let _edge = edges[i];

    let node1pos = nodePositions[_edge.from.index];
    let node1vel = nodeVels[_edge.from.index];
    let node1force = nodeForces[_edge.from.index];

    let node2pos = nodePositions[_edge.to.index];
    let node2vel = nodeVels[_edge.to.index];
    let node2force = nodeForces[_edge.to.index];

    let distance = getDistanceBetweenVecs(node1pos!, node2pos!);
    distance = distance >= 1 ? distance : 1;

    const norm1 = normalizeVec(subVecs(node2pos!, node1pos!));
    const norm2 = normalizeVec(subVecs(node1pos!, node2pos!));

    const v1 = subVecs(node1vel!, node2vel!);
    const v2 = subVecs(node2vel!, node1vel!);

    const stiffnessXd = stiffness * (distance - restDistance);

    const fx1 = stiffnessXd * (norm1.x / distance) - damping * v1.x;
    const fy1 = stiffnessXd * (norm1.y / distance) - damping * v1.y;

    const fx2 = stiffnessXd * (norm2.x / distance) - damping * v2.x;
    const fy2 = stiffnessXd * (norm2.y / distance) - damping * v2.y;

    node1force.x += fx1;
    node1force.y += fy1;

    node2force.x += fx2;
    node2force.y += fy2;
  }
}
