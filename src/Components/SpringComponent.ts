const SpringComponent = function SpringComponent(
  this: any,
  entity1: any,
  entity2: any
) {
  if (!entity1 || !entity2) {
    throw new Error("A spring needs two ends.");
  }

  this.e1 = entity1;
  this.e2 = entity2;

  return this;
};
