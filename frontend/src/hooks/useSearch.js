// src/hooks/useSearch.js
import { useState, useMemo } from "react";

export function useSearch(books) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = useMemo(() => {
    return books.filter((b) => {
      const matchCat = category === "All" || b.category === category;
      const q = query.toLowerCase();
      const matchQuery =
        !q ||
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [books, query, category]);

  return { query, setQuery, category, setCategory, filtered };
}
