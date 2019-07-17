const GravitationalComponent = function(
  this: any,
  active: boolean,
  g_constant?: number
) {
  this.g_constant = g_constant || 9.8;
  this.active = active || true;
  return this;
};

GravitationalComponent.prototype.name = 'gravitational';

export default GravitationalComponent;
