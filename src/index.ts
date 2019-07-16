import uuid from './Utils/uuid';

const VNetGraph = function VNetGraph(
  container: HTMLCanvasElement,
  nodes: any[],
  edges: any[],
  options: Options
): any {
  const ECS = {
    entities: {},
    systems: {}
  };

  let entity = uuid();
};

if (!(window as any).VNetGraph) {
  (window as any).VNetGraph = VNetGraph;
}

export default VNetGraph;
