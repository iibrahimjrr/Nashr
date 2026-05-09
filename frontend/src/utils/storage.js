// src/utils/storage.js

const USERS_KEY  = "booksLibrary_users";
const BOOKS_KEY  = "booksLibrary_books";

/* ── Users ── */
export function getUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
}

export function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function findUserByCredentials(usernameOrEmail, password) {
  return getUsers().find(
    (u) =>
      (u.username === usernameOrEmail || u.email === usernameOrEmail) &&
      u.password === password
  );
}

export function findUserById(id) {
  return getUsers().find((u) => u.id === id) || null;
}

export function createUser(data) {
  const users = getUsers();
  const newUser = {
    id: Date.now(),
    username: data.username,
    name: data.name,
    email: data.email,
    password: data.password,
    role: "user",
    avatar: null,
    favorites: [],
    saved: [],
  };
  users.push(newUser);
  saveUsers(users);
  return newUser;
}

export function updateUser(id, changes) {
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) return null;
  users[idx] = { ...users[idx], ...changes };
  saveUsers(users);
  return users[idx];
}

export function usernameExists(username) {
  return getUsers().some((u) => u.username === username);
}

export function emailExists(email) {
  return getUsers().some((u) => u.email === email);
}

/* ── User favorites / saved ── */
export function toggleFavorite(userId, book) {
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx === -1) return { added: false, favorites: [] };

  const favs = users[idx].favorites || [];
  const exists = favs.findIndex((b) => b.id === book.id);
  let added;

  if (exists === -1) {
    favs.push(book);
    added = true;
  } else {
    favs.splice(exists, 1);
    added = false;
  }

  users[idx].favorites = favs;
  saveUsers(users);
  return { added, favorites: favs };
}

export function toggleSaved(userId, book) {
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx === -1) return { added: false, saved: [] };

  const saved = users[idx].saved || [];
  const exists = saved.findIndex((b) => b.id === book.id);
  let added;

  if (exists === -1) {
    saved.push(book);
    added = true;
  } else {
    saved.splice(exists, 1);
    added = false;
  }

  users[idx].saved = saved;
  saveUsers(users);
  return { added, saved };
}

/* ── Books (admin) ── */
export function getAdminBooks(fallback) {
  const stored = localStorage.getItem(BOOKS_KEY);
  return stored ? JSON.parse(stored) : fallback;
}

export function saveAdminBooks(books) {
  localStorage.setItem(BOOKS_KEY, JSON.stringify(books));
}

/* ── Session ── */
const SESSION_KEY = "booksLibrary_session";

export function getSession() {
  const raw = sessionStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function setSession(user) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
}

/* ── Seed admin if first run ── */
export function seedAdmin() {
  const users = getUsers();
  if (!users.find((u) => u.username === "ibrahim")) {
    users.push({
      id: 1,
      username: "ibrahim",
      name: "ibrahim",
      email: "ibrahim@books.com",
      password: "123456789",
      role: "admin",
      avatar: null,
      favorites: [],
      saved: [],
    });
    saveUsers(users);
  }
}
