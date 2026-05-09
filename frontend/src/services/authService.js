// src/services/authService.js
import api from "./api";

export const register = (data) =>
  api.post("/auth/register", {
    username:              data.username,
    name:                  data.name,
    email:                 data.email,
    password:              data.password,
    password_confirmation: data.confirm,
  });

export const login = (credential, password) =>
  api.post("/auth/login", { credential, password });

export const logout = () =>
  api.post("/auth/logout");

export const me = () =>
  api.get("/auth/me");
