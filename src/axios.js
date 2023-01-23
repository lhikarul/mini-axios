import xhrAdapter from "./adapters/xhr";
import { forEach, merge, spread } from "./utils";
import defaultConfigs from "./defaults";

export default function axios(config) {
  config = merge(
    {
      method: "get",
      transformRequest: defaultConfigs.transformRequest,
      transformResponse: defaultConfigs.transformResponse,
    },
    config
  );

  const promise = new Promise(function (resolve, reject) {
    try {
      if (typeof window !== "undefined") {
        xhrAdapter(resolve, reject, config);
      }
    } catch (e) {
      reject(e);
    }
  });

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
