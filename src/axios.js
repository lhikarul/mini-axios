import { forEach, merge, spread } from "./utils";
import defaultConfigs from "./defaults";
import InterceptorManager from "./core/interceptorManager";
import dispatchRequest from "./core/dispatchRequest";
export default function axios(config) {
  config = merge(
    {
      method: "get",
      transformRequest: defaultConfigs.transformRequest,
      transformResponse: defaultConfigs.transformResponse,
    },
    config
  );

  const chain = [dispatchRequest, undefined];

  let promise = Promise.resolve(config);

  axios.interceptors.request.forEach(function (interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  axios.interceptors.response.forEach(function (interceptor) {
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
}

axios.all = (requests) => {
  return Promise.all([...requests]);
};

axios.spread = spread;

axios.interceptors = {
  request: new InterceptorManager(),
  response: new InterceptorManager(),
};

createShortMethods("delete", "get", "head");

function createShortMethods() {
  forEach(arguments, function (method) {
    axios[method] = function (url, config) {
      return axios(
        Object.assign(config || {}, {
          method,
          url,
        })
      );
    };
  });
}

createShortMethodsWithData("post", "put", "patch");

function createShortMethodsWithData() {
  forEach(arguments, function (method) {
    axios[method] = function (url, data, config) {
      return axios(
        merge(config || {}, {
          method: method,
          url: url,
          data: data,
        })
      );
    };
  });
}
