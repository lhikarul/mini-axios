import Cancel from "./cancel/Cancel";
import CancelToken from "./cancel/CancelToken";
import isCancel from "./cancel/isCancel";
import { bind, extend, forEach } from "underscore";
import defaults from "./defaults";
import InterceptorManager from "./core/interceptorManager";
import dispatchRequest from "./core/dispatchRequest";

function Axios(defaultConfig) {
  this.defaults = Object.assign(defaults, defaultConfig);
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager(),
  };
}

Axios.prototype.request = function request(config) {
  config = Object.assign(defaults, this.defaults, { method: "get" }, config);

  const chain = [dispatchRequest, undefined];

  let promise = Promise.resolve(config);

  this.interceptors.request.forEach(function (interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function (interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  promise.onsuccess = function success(fn) {
    promise.then(function (response) {
      fn(response);
      return promise;
    });
  };

  promise.onerror = function error(fn) {
    promise.then(null, function (response) {
      fn(response);
    });
    return promise;
  };

  return promise;
};

forEach(["delete", "get", "head"], function (method) {
  Axios.prototype[method] = function (url, config) {
    return this.request(
      Object.assign(config || {}, {
        method,
        url,
      })
    );
  };
});

forEach(["post", "put", "patch"], function (method) {
  Axios.prototype[method] = function (url, data, config) {
    return this.request(
      Object.assign(config || {}, {
        method,
        url,
        data,
      })
    );
  };
});

function createInstance(defaultConfig) {
  const context = new Axios(defaultConfig);
  const instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  extend(instance, Axios.prototype, context);

  // Copy context to instance
  extend(instance, context);

  return instance;
}

const axios = createInstance();

axios.Axios = Axios;

axios.create = function create(defaultConfig) {
  return createInstance(defaultConfig);
};

axios.all = function all(promises) {
  return Promise.all(promises);
};

axios.Cancel = Cancel;
axios.isCancel = isCancel;
axios.CancelToken = CancelToken;
// axios.spread = spread;

export default axios;
