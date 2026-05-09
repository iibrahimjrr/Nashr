// src/services/bookService.js
import api from "./api";

export const getBooks = (params = {}) =>
  api.get("/books", { params });

export const getBook = (id) =>
  api.get(`/books/${id}`);

/* Admin */
export const createBook = (data) =>
  api.post("/admin/books", data);

export const updateBook = (id, data) =>
  api.put(`/admin/books/${id}`, data);

export const deleteBook = (id) =>
  api.delete(`/admin/books/${id}`);
