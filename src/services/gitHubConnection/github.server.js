const axios = require("axios");
const { GITHUB_API_URL, USER_AGENT } = require("../../constants/constants");
const axiosGithubServer = (data, username = "") => {
  const axiosServer = axios.create({
    baseURL: `${GITHUB_API_URL}`,
    headers: {
      Authorization: `Bearer ${data.accessToken}`,
      Accept: "application/json",
      "User-Agent": USER_AGENT,
      "Accept-Encoding": "identity",
    },
    auth: {
      username: data.username,
      password: data.accessToken,
    },
  });
  return axiosServer;
};
module.exports = axiosGithubServer;
