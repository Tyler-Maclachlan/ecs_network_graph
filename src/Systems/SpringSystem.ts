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
    let _edge = edgeManager.getComponent<SpringComponent>(
      edges[i],
      SpringComponent
    );
    let node1pos = nodeManager.getComponent<PositionComponent>(
      _edge!.from,
      PositionComponent
    );
    let node1vel = nodeManager.getComponent<VelocityComponent>(
      _edge!.from,
      VelocityComponent
    );
    let node1acc = nodeManager.getComponent<AccelerationComponent>(
      _edge!.from,
      AccelerationComponent
    );
    let node2pos = nodeManager.getComponent<PositionComponent>(
      _edge!.to,
      PositionComponent
    );
    let node2vel = nodeManager.getComponent<VelocityComponent>(
      _edge!.to,
      VelocityComponent
    );
    let node2acc = nodeManager.getComponent<AccelerationComponent>(
      _edge!.to,
      AccelerationComponent
    );

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

    node1acc!.x += fx1;
    node1acc!.y += fy1;

    node2acc!.x += fx2;
    node2acc!.y += fy2;
  }
}
