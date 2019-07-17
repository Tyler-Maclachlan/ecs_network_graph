const TextComponent = function(this: any, text: string, fontSize?: number) {
  this.text = text || '';
  this.fontSize = fontSize || 14;
  return this;
};

TextComponent.prototype.name = 'text';

export default TextComponent;
