import { GenerationalIndex as Entity } from '../Utils/index';
import { IComponent } from '../types';

export default class SpringComponent implements IComponent {
  public from: Entity;
  public to: Entity;

  constructor(from: Entity, to: Entity) {
    this.from = from;
    this.to = to;
  }
}
