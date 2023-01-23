import { forEach } from "../utils";
export default function transformData(data, headers, fns) {
  forEach(fns, function (fn) {
    data = fn(data, headers);
  });
  return data;
}
