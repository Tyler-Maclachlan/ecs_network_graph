import NodeManager from './Managers/NodeManager';
import EdgeManager from './Managers/EdgeManager';
import ColorComponent from './Components/ColorComponent';

const VNetGraph = function VNetGraph(
  this: any,
  container: HTMLCanvasElement,
  nodes: [],
  edges: [],
  options: Options
): any {
  const nodeManager = new NodeManager();
  const edgeManager = new EdgeManager();

  nodeManager.bulkCreateNodes(nodes, options);
  edgeManager.bulkCreateEdges(edges, {
    color: { fillColor: '', textColor: '' },
    label: ''
  });

  return this;
};

if (!(window as any).VNetGraph) {
  (window as any).VNetGraph = VNetGraph;
}

export default VNetGraph;
