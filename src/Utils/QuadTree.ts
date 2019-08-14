import { Vector2D } from '../types';
import { GenerationalIndex as Entity, AABB } from '.';

export default class QuadTree {
  static MaxElements = 4;
  static MaxDepth = 100;

  public bounds: AABB;
  public depth: number;
  public divided: boolean;
  public elements: Map<Entity, Vector2D>;
  public mass: number;
  public centerOfMass: Vector2D;

  // Top Left, Top Right, Bottom Left, Botttom Right
  public TL: QuadTree;
  public TR: QuadTree;
  public BL: QuadTree;
  public BR: QuadTree;

  constructor(bounds: AABB, depth: number = 0) {
    this.bounds = bounds;
    this.depth = depth;
    this.divided = false;
    this.elements = new Map();
    this.mass = 0;
    this.centerOfMass = { x: 0, y: 0 };
  }

  public insert(node: Entity, position: Vector2D): boolean {
    if (!this.bounds.overlapsVec(position)) {
      return false;
    } else if (
      this.depth === QuadTree.MaxDepth ||
      (!this.divided && this.elements.size === 0)
    ) {
      this.elements.set(node, position);
      this.updateMass(position, 1);
      return true;
    } else {
      if (!this.divided) {
        this.divide();
      }

      return (
        this.TL.insert(node, position) ||
        this.TR.insert(node, position) ||
        this.BL.insert(node, position) ||
        this.BR.insert(node, position)
      );
    }
  }

  public updateMass(pos: Vector2D, mass: number) {
    let com = this.centerOfMass;
    let totalMass = this.mass + mass;
    let totalMassInv = 1 / totalMass;

    com.x = com.x * this.mass + pos.x * mass;
    com.x *= totalMassInv;

    com.y = com.y * this.mass + pos.y * mass;
    com.y *= totalMassInv;

    this.mass = totalMass;
  }

  // divide tree into 4 branches and recursively insert current elements into branches
  public divide() {
    const hw = this.bounds.halfWidth;
    const hh = this.bounds.halfHeight;
    const newDepth = this.depth + 1;
    const { x, y } = this.bounds.position;

    this.TL = new QuadTree(new AABB({ x, y }, { x: hw, y: hh }), newDepth);
    this.TR = new QuadTree(
      new AABB({ x: x + hw, y }, { x: hw, y: hh }),
      newDepth
    );
    this.BL = new QuadTree(
      new AABB({ x, y: y + hh }, { x: hw, y: hh }),
      newDepth
    );
    this.BR = new QuadTree(
      new AABB({ x: x + hw, y: y + hh }, { x: hw, y: hh }),
      newDepth
    );

    this.elements.forEach((pos, node) => {
      this.TL.insert(node, pos) ||
        this.TR.insert(node, pos) ||
        this.BL.insert(node, pos) ||
        this.BR.insert(node, pos);
    });

    this.elements.clear();
    this.divided = true;
  }

  public query(
    area: AABB,
    out: Map<Entity, Vector2D> = new Map()
  ): Map<Entity, Vector2D> {
    if (!this.bounds.overlapsAABB(area)) {
      return out;
    } else {
      if (!this.divided) {
        this.elements.forEach((pos, node) => {
          if (area.overlapsVec(pos)) {
            out.set(node, pos);
          }
        });
      } else {
        this.TL.query(area, out);
        this.TR.query(area, out);
        this.BL.query(area, out);
        this.BR.query(area, out);
      }

      return out;
    }
  }
}
