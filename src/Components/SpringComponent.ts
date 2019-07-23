import { GenerationalIndex as Entity } from '../Utils/index';

export default class SpringComponent {
  public from: Entity;
  public to: Entity;

  constructor(from: Entity, to: Entity) {
    this.from = from;
    this.to = to;
  }
}
