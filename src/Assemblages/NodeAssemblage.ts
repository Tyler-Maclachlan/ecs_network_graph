import { uuid } from '../Utils/index';
import ColorComponent from '../Components/ColorComponent';
import PositionComponent from '../Components/PositionComponent';
import GravitationalComponent from '../Components/GravitationalComponent';
import ShapeComponent from '../Components/ShapeComponent';
import SizeComponent from '../Components/SizeComponent';
import VelocityComponent from '../Components/VelocityComponent';

export default function NodeAssemblage() {
  const entity = uuid();

  const colorComponent = ColorComponent();
  const positionComponent = PositionComponent();
  const gravitationalComponent = GravitationalComponent(true);
  const shapeComponent = ShapeComponent();
  const sizeComponent = SizeComponent();
  const velocityComponent = VelocityComponent();

  const Node = {
    entityID: entity,
    color: colorComponent,
    position: positionComponent,
    shape: shapeComponent,
    gravity: gravitationalComponent,
    size: sizeComponent,
    velocity: velocityComponent
  };

  console.log(Node);

  return Node;
}
