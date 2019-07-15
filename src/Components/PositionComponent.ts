const PositionComponent = function PositionComponent(
  this: any,
  position: { x: number; y: number }
) {
  this.position = position || { x: Math.random() * 20, y: Math.random() * 20 };
  this.name = "position";
  return this;
};
