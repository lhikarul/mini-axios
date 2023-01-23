export function isObject(val) {
  return val !== null && typeof val === "object";
}

export function isFile(val) {
  return toString.call(val) === "[object File]";
}

export function isBlob(val) {
  return toString.call(val) === "[object Blob]";
}

export function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === "undefined") {
    return;
  }

  // Check if obj is array-like
  //   var isArray = obj.constructor === Array || typeof obj.callee === "function";
  var isArray = Array.isArray(obj);

  // Force an array if not already something iterable
  if (typeof obj !== "object" && !isArray) {
    obj = [obj];
  }

  // Iterate over array values
  if (isArray) {
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  }
  // Iterate over object keys
  else {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

export function merge() {
  const result = {};
  forEach(arguments, function (obj) {
    forEach(obj, function (val, key) {
      result[key] = val;
    });
  });
  return result;
}

export function spread(callback) {
  return function (arr) {
    callback.apply(null, arr);
  };
}
