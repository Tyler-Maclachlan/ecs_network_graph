import { Vector2D } from '../types';

export function addVecs(vec1: Vector2D, vec2: Vector2D): Vector2D {
  return {
    x: vec1.x + vec2.x,
    y: vec1.y + vec2.y
  };
}

export function getMidpointBetweenVecs(
  vec1: Vector2D,
  vec2: Vector2D
): Vector2D {
  return divideVecByScalar(addVecs(vec1, vec2), 2);
}

export function subVecs(vec1: Vector2D, vec2: Vector2D): Vector2D {
  return {
    x: vec1.x - vec2.x,
    y: vec1.y - vec2.y
  };
}

export function subVecByScalar(vec: Vector2D, scalar: number): Vector2D {
  return {
    x: vec.x - scalar,
    y: vec.y - scalar
  };
}

export function divideVecByVec(vec1: Vector2D, vec2: Vector2D): Vector2D {
  return {
    x: vec1.x / vec2.x,
    y: vec1.y / vec2.y
  };
}

export function multiplyVecByScalar(vec: Vector2D, scalar: number): Vector2D {
  return {
    x: vec.x * scalar,
    y: vec.y * scalar
  };
}

export function invertVec(vec: Vector2D): Vector2D {
  return multiplyVecByScalar(vec, -1);
}

export function divideVecByScalar(vec: Vector2D, scalar: number): Vector2D {
  if (scalar) {
    return {
      x: vec.x / scalar,
      y: vec.y / scalar
    };
  } else {
    return {
      x: vec.x,
      y: vec.y
    };
  }
}

export function getVecLength(vec: Vector2D): number {
  return Math.sqrt(vec.x * vec.x + vec.y * vec.y);
}

export function normalizeVec(vec: Vector2D): Vector2D {
  return divideVecByScalar(vec, getVecLength(vec));
}

export function getDistanceBetweenVecs(vec1: Vector2D, vec2: Vector2D) {
  const dx = vec2.x - vec1.x;
  const dy = vec2.y - vec1.y;

  return Math.sqrt(dx * dx + dy * dy);
}

export function dotVecs(vec1: Vector2D, vec2: Vector2D): number {
  return vec1.x * vec2.x + vec1.y * vec2.y;
}

export function crossVecs(vec1: Vector2D, vec2: Vector2D): number {
  return vec1.x * vec2.y - vec1.y * vec2.x;
}

export function getAngleBetweenVecs(vec1: Vector2D, vec2: Vector2D) {
  return Math.atan2(vec1.y - vec2.y, vec1.x - vec2.x);
}

export function absVec(vec1: Vector2D): Vector2D {
  return {
    x: vec1.x > 0 ? vec1.x : -vec1.x,
    y: vec1.y > 0 ? vec1.y : -vec1.y
  };
}

export function radsToDegrees(rads: number) {
  return (rads * 180) / Math.PI;
}
