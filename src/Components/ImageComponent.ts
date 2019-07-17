const ImageComponent = function(this: any, image: any) {
  this.image = image || ''; //TODO: create default fallback image;
  return this;
};

ImageComponent.prototype.name = 'image';

export default ImageComponent;
