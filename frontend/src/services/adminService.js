// src/services/adminService.js
import api from "./api";

export const getDashboard = () =>
  api.get("/admin/dashboard");

export const getUsers = (page = 1) =>
  api.get("/admin/users", { params: { page } });

export const deleteUser = (id) =>
  api.delete(`/admin/users/${id}`);
