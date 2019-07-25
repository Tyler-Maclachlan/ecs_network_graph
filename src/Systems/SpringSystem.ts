import EdgeManager from '../Managers/EdgeManager';
import NodeManager from '../Managers/NodeManager';
import PositionComponent from '../Components/PositionComponent';
import VelocityComponent from '../Components/VelocityComponent';
import AccelerationComponent from '../Components/AccelerationComponent';
import SpringComponent from '../Components/SpringComponent';
import { getDistanceBetweenVecs, normalizeVec, subVecs } from '../Utils/index';

export function SpringSystem(
  edgeManager: EdgeManager,
  nodeManager: NodeManager
) {
  const stiffness = 10;
  const damping = 0.03;
  const restDistance = 200;

  const edges = edgeManager.edges;
  const numEdges = edges.length;

  for (let i = 0; i < numEdges; i++) {
    let _edge: SpringComponent = edgeManager.getEdgeComponentData(
      edges[i],
      'spring'
    );
    let node1pos: PositionComponent = nodeManager.getNodeComponentData(
      _edge.from,
      'position'
    );
    let node1vel: VelocityComponent = nodeManager.getNodeComponentData(
      _edge.from,
      'velocity'
    );
    let node1acc: AccelerationComponent = nodeManager.getNodeComponentData(
      _edge.from,
      'acceleration'
    );
    let node2pos: PositionComponent = nodeManager.getNodeComponentData(
      _edge.to,
      'position'
    );
    let node2vel: VelocityComponent = nodeManager.getNodeComponentData(
      _edge.to,
      'velocity'
    );
    let node2acc: AccelerationComponent = nodeManager.getNodeComponentData(
      _edge.to,
      'acceleration'
    );

    let distance = getDistanceBetweenVecs(node1pos, node2pos);
    distance = Math.max(1, distance);

    const norm1 = normalizeVec(subVecs(node2pos, node1pos));
    const norm2 = normalizeVec(subVecs(node2pos, node1pos));

    const v1 = subVecs(node1vel, node2vel);
    const v2 = subVecs(node2vel, node1vel);

    const stiffnessXd = stiffness * (distance - restDistance);

    const fx1 = stiffnessXd * (norm1.x / distance) - damping * v1.x;
    const fy1 = stiffnessXd * (norm1.y / distance) - damping * v1.y;

    const fx2 = stiffnessXd * (norm2.x / distance) - damping * v2.x;
    const fy2 = stiffnessXd * (norm2.y / distance) - damping * v2.y;

    node1acc.x += fx1;
    node1acc.y += fy1;

    node2acc.x += fx2;
    node2acc.y += fy2;
  }
}
