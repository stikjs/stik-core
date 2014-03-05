Function.prototype.method = function method(name, func){
  if (!this.hasOwnProperty(name)) {
    this.prototype[name] = func;
    return this;
  }
};
