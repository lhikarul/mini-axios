import transformData from "../transformData";

export default function xhrAdapter(resolve, reject, config) {
  const data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  );

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

  request.send(data);
}
