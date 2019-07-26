import { IComponent } from "../types";

export default class ShapeComponent implements IComponent {
  public shape: 'box' | 'circle' | 'triangle' = 'box';
}
