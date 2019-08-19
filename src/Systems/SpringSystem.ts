import EdgeManager from '../Managers/EdgeManager';
import NodeManager from '../Managers/NodeManager';
import PositionComponent from '../Components/PositionComponent';
import VelocityComponent from '../Components/VelocityComponent';
import SpringComponent from '../Components/SpringComponent';
import {
  getDistanceBetweenVecs,
  normalizeVec,
  subVecs,
  deepExtend
} from '../Utils/index';
import ForceComponent from '../Components/ForceComponent';
import { Options } from '../types';

export default class SpringSystem {
  private _edgeManager: EdgeManager;
  private _nodeManager: NodeManager;
  private _options = {
    stiffness: 0.08,
    restDistance: 150,
    damping: 0.003
  };

  constructor(
    nodeManager: NodeManager,
    edgeManager: EdgeManager,
    options?: Options
  ) {
    this._edgeManager = edgeManager;
    this._nodeManager = nodeManager;
    if (options) {
      this._options = deepExtend(this._options, options);
    }
  }

  public update() {
    const edges = this._edgeManager.getComponentsOfType(SpringComponent);
    const nodePositions = this._nodeManager.getComponentsOfType(
      PositionComponent
    );
    const nodeVels = this._nodeManager.getComponentsOfType(VelocityComponent);
    const nodeForces = this._nodeManager.getComponentsOfType(ForceComponent);
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

      const stiffnessXd =
        this._options.stiffness * (distance - this._options.restDistance);

      const fx1 =
        stiffnessXd * (norm1.x / distance) - this._options.damping * v1.x;
      const fy1 =
        stiffnessXd * (norm1.y / distance) - this._options.damping * v1.y;

      const fx2 =
        stiffnessXd * (norm2.x / distance) - this._options.damping * v2.x;
      const fy2 =
        stiffnessXd * (norm2.y / distance) - this._options.damping * v2.y;

      node1force.x += fx1;
      node1force.y += fy1;

      node2force.x += fx2;
      node2force.y += fy2;
    }
  }
}
