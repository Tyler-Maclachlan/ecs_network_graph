const SizeComponent = function(this: any, size: any) {
  this.size = size || 20;
  return this;
};

SizeComponent.prototype.name = 'size';

export default SizeComponent;
