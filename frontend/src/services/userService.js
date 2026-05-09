// src/services/userService.js
import api from "./api";

export const getProfile = () =>
  api.get("/user/profile");

export const updateProfile = (data) =>
  api.put("/user/profile", data);

export const changePassword = (data) =>
  api.put("/user/password", {
    current_password:      data.current,
    password:              data.newP,
    password_confirmation: data.confirm,
  });

export const uploadAvatar = (file) => {
  const form = new FormData();
  form.append("avatar", file);
  return api.post("/user/avatar", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

/* Favorites */
export const getFavorites  = ()     => api.get("/user/favorites");
export const addFavorite   = (id)   => api.post(`/user/favorites/${id}`);
export const removeFavorite = (id)  => api.delete(`/user/favorites/${id}`);

/* Saved */
export const getSaved      = ()     => api.get("/user/saved");
export const addSaved      = (id)   => api.post(`/user/saved/${id}`);
export const removeSaved   = (id)   => api.delete(`/user/saved/${id}`);
