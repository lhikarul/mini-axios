import transformData from "../transformData";

export default function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    const requestData = config.data;

    let request = new (XMLHttpRequest || ActiveXObject)("Microsoft.XMLHTTP");

    request.open(config.method, config.url, true);

    request.onreadystatechange = function () {
      if (request && request.readyState === 4) {
        const headers = {};
        const response = {
          data: transformData(
            JSON.parse(request.responseText),
            headers,
            config.transformResponse
          ),
          status: request.status,
          headers: headers,
          config: config,
        };
        (request.status >= 200 && request.status < 300 ? resolve : reject)({
          data: response.data,
          status: response.status,
          headers: response.headers,
          config: response.config,
        });

        request = null;
      }
    };

    request.ontimeout = function handleTimeout() {
      reject("timeout of " + config.timeout + "ms exceeded");
    };

    // Handle progress if needed
    if (typeof config.onDownloadProgress === "function") {
      request.addEventListener("progress", config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === "function" && request.upload) {
      request.upload.addEventListener("progress", config.onUploadProgress);
    }

    if (config.cancelToken) {
      config.cancelToken.promise.then(function onCanceled(cancel) {
        request.abort();
        reject(cancel);
        request = null;
      });
    }

    if (requestData === undefined) {
      request = null;
    }

    request.send(requestData);
  });
}
