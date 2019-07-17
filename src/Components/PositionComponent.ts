const PositionComponent = function(
  this: any,
  position?: { x: number; y: number }
) {
  this.position = position || { x: Math.random() * 20, y: Math.random() * 20 };
  return this;
};

PositionComponent.prototype.name = 'position';

export default PositionComponent;
