const SpringComponent = function(
  this: any,
  entity1ID: string,
  entity2ID: string
) {
  if (entity1ID && entity2ID) {
    // TODO: check entity IDs exist
  } else {
    throw new Error('A spring needs two ends.');
  }

  this.entity1ID = entity1ID;
  this.entity2ID = entity2ID;

  return this;
};

SpringComponent.prototype.name = 'spring';

export default SpringComponent;
