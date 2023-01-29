function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return "Cancel" + this.message ? ": " + this.message : "";
};

Cancel.prototype.__Cancel__ = true;

export default Cancel;
