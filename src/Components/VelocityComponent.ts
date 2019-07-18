const VelocityComponent = function(
  this: any,
  velocity?: { x: number; y: number }
) {
  this.velocity = velocity || { x: 0, y: 0 };
  return this;
};

VelocityComponent.prototype.name = 'velocity';

export default VelocityComponent;
