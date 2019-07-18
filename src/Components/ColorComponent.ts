const ColorComponent = function(
  this: any,
  bgColor?: string,
  textColor?: string
) {
  this.bgColor = bgColor || '#fefefe';
  this.textColor = textColor || '#fefefe';
  return this;
};

ColorComponent.prototype.name = 'color';

export default ColorComponent;
