import { Vector2D } from '../types';

export default class AABB {
  public position: Vector2D;
  public size: Vector2D;

  constructor(position: Vector2D, size: Vector2D) {
    this.position = position;
    this.size = size;
  }

  public overlapsVec(vec: Vector2D): boolean {
    return (
      this.position.x - this.size.x <= vec.x &&
      vec.x <= this.position.x + this.size.x &&
      this.position.y - this.size.y <= vec.y &&
      vec.y <= this.position.y + this.size.y
    );
  }

  public overlapsAABB(aabb: AABB): boolean {
    return !(
      aabb.position.x - aabb.size.x > this.position.x + this.size.x ||
      aabb.position.x + aabb.size.x < this.position.x - this.size.x ||
      aabb.position.y - aabb.size.y > this.position.y + this.size.y ||
      aabb.position.y + aabb.size.y < this.position.y - this.size.y
    );
  }
}
