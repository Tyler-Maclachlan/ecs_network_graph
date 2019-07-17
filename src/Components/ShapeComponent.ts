const ShapeComponent = function(this: any, shape?: Shape) {
  this.shape = shape || 'circle';
  return this;
};

ShapeComponent.prototype.name = 'shape';

export default ShapeComponent;
