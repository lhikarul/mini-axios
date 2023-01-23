import { isObject, isFile, isBlob } from "../utils";
const JSON_START = /^\s*(\[|\{[^\{])/;
const JSON_END = /[\}\]]\s*$/;
const PROTECTION_PREFIX = /^\)\]\}',?\n/;
const CONTENT_TYPE_APPLICATION_JSON = {
  "Content-Type": "application/json;charset=utf-8",
};

const defaultConfigs = {
  transformRequest: [
    function (data) {
      return isObject(data) && !isFile(data) && !isBlob(data)
        ? JSON.stringify(data)
        : null;
    },
  ],

  transformResponse: [
    function (data) {
      if (typeof data === "string") {
        data = data.replace(PROTECTION_PREFIX, "");
        if (JSON_START.test(data) && JSON_END.test(data)) {
          data = JSON.parse(data);
        }
      }
      return data;
    },
  ],
};

export default defaultConfigs;
