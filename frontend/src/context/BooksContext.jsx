// src/context/BooksContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getBooks, createBook, deleteBook as apiDelete, updateBook as apiUpdate } from "../services/bookService";
import { MOCK_BOOKS } from "../utils/mockData";

const BooksContext = createContext(null);
const normalizeUrl = (url) => {
  const value = (url || "").trim();
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  return `https://${value}`;
};

const extractReadLink = (book = {}) => {
  const direct =
    book.read_link ||
    book.readLink ||
    book.raedLink ||
    book.read_url ||
    book.readUrl ||
    "";

  if (direct) return direct;

  const dynamicKey = Object.keys(book).find((key) => {
    const normalized = key.toLowerCase();
    return normalized.includes("read") && normalized.includes("link");
  });

  return dynamicKey ? book[dynamicKey] : "";
};

const normalizeBook = (book) => ({
  ...book,
  readLink: normalizeUrl(extractReadLink(book)),
});

export function BooksProvider({ children }) {
  const [books, setBooks]     = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBooks = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const res = await getBooks(params);
      const apiBooks = res.data?.books || res.data?.data?.books || res.data?.data || [];
      setBooks(Array.isArray(apiBooks) ? apiBooks.map(normalizeBook) : []);
    } catch {
      // Fallback to mock data if API not reachable
      setBooks(MOCK_BOOKS.map(normalizeBook));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBooks(); }, [fetchBooks]);

  async function addBook(data) {
    const res = await createBook(data);
    // Keep admin-provided read link if backend omits it in create response.
    const createdBook = normalizeBook({
      ...data,
      ...(res.data.book || res.data.data || {}),
    });
    setBooks((prev) => [createdBook, ...prev]);
    return createdBook;
  }

  async function deleteBook(id) {
    await apiDelete(id);
    setBooks((prev) => prev.filter((b) => b.id !== id));
  }

  async function updateBook(id, data) {
    const res = await apiUpdate(id, data);
    const updatedBook = normalizeBook(res.data.book);
    setBooks((prev) => prev.map((b) => (b.id === id ? updatedBook : b)));
  }

  return (
    <BooksContext.Provider value={{ books, loading, fetchBooks, addBook, deleteBook, updateBook }}>
      {children}
    </BooksContext.Provider>
  );
}

export function useBooks() {
  const ctx = useContext(BooksContext);
  if (!ctx) throw new Error("useBooks must be inside BooksProvider");
  return ctx;
}
