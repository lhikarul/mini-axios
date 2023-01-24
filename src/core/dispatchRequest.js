import xhrAdapter from "../adapters/xhr";

export default function dispatchRequest(config) {
  return new Promise(function (resolve, reject) {
    try {
      if (typeof window !== "undefined") {
        xhrAdapter(resolve, reject, config);
      }
    } catch (e) {
      reject(e);
    }
  });
}
