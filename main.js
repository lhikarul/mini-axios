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
  config.url = "https://jsonplaceholder.typicode.com/comments?postId=10";
  return config;
});

axios.interceptors.response.use(function (response) {
  return response;
});

axios
  .get("https://jsonplaceholder.typicode.com/comments?postId=1", {
    transformResponse: [
      function (data) {
        // Do whatever you want to transform the data
        data.push("Hello");
        return data;
      },
    ],
  })
  .then(function (response) {
    console.log("response ", response);
  })
  .catch(function (response) {
    console.log("catch ");
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
