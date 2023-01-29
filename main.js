import axios from "./src/axios";

function getUserAccount() {
  return axios.get("https://jsonplaceholder.typicode.com/comments?postId=1");
}

function getUserPermissions() {
  return axios.get("https://jsonplaceholder.typicode.com/comments?postId=2");
}

function getUserPermissions2() {
  return axios.get("https://jsonplaceholder.typicode.com/comments?postId=3");
}

// axios.all([getUserAccount(), getUserPermissions(), getUserPermissions2()]).then(
//   axios.spread(function (acct, perms, third) {
//     // Both requests are now complete
//     console.log("acct ", acct);
//     console.log("perms ", perms);
//     console.log("third ", third);
//   })
// );

axios.interceptors.request.use(function (config) {
  console.log("interceptors ", config);
  config.url = "https://jsonplaceholder.typicode.com/comments?postId=10";
  setTimeout(() => {
    source.cancel("Operation canceled by the user.");
  }, 0);
  return config;
});

// axios.interceptors.response.use(function (response) {
//   console.log("interceptors ", response);
//   return response;
// });

const CancelToken = axios.CancelToken;
const source = CancelToken.source();

axios
  .get("https://jsonplaceholder.typicode.com/comments?postId=1", {
    transformResponse: [
      function (data) {
        // Do whatever you want to transform the data
        data.push("Hello");
        return data;
      },
    ],
    cancelToken: source.token,
  })
  .then(function (response) {
    console.log("response ", response);
  })
  .catch(function (response) {
    console.log("catch ", response);
    if (axios.isCancel(response)) {
      console.log("request canceld ", response.message);
    }
  });

// axios
//   .post("https://jsonplaceholder.typicode.com/posts", {
//     firstName: "Fred",
//     lastName: "Flintstone",
//   })
//   .then(function (response) {
//     console.log(response);
//   })
//   .catch(function (response) {
//     console.log(response);
//   });
