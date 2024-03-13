const axios = require("axios");

const instance = axios.create({
  baseURL: process.env.TEAM_API_URL || "http://localhost:3001/v1",
  timeout: 10000,
  headers: { "x-token": process.env.SECRET_CONNECT_TEAM_API },
});

exports.login = (body) => {
  return instance.post("/ticket-platform/login", body);
};

exports.loginAdmin = (body) => {
  return instance.post("/ticket-platform/login-admin", body);
};

exports.getUserById = (id) => {
  return instance.get("/ticket-platform/users/" + id);
};
