import { forEach } from "underscore";
export default function InterceptorManager() {
  this.handlers = [];
}

InterceptorManager.prototype.use = function (fulfilled, rejected) {
  this.handlers.push({
    fulfilled,
    rejected,
  });
  return this.handlers.length - 1;
};

InterceptorManager.prototype.eject = function (id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

InterceptorManager.prototype.forEach = function (fn) {
  forEach(this.handlers, function (h) {
    if (h !== null) {
      fn(h);
    }
  });
};
