// src/pages/Library/LibraryPage.jsx
import { useState, useEffect } from "react";
import { useToast } from "../../context/ToastContext";
import { useBooks } from "../../context/BooksContext";
import { useSearch } from "../../hooks/useSearch";
import { getFavorites, getSaved, addFavorite, removeFavorite, addSaved, removeSaved } from "../../services/userService";
import { FALLBACK_COVER } from "../../utils/mockData";
import Navbar from "../../components/Navbar/Navbar";
import CategoryBar from "../../components/CategoryBar/CategoryBar";
import BookCard from "../../components/BookCard/BookCard";
import "../../styles/components.css";
import styles from "./LibraryPage.module.css";

export default function LibraryPage() {
  const { books, loading: booksLoading } = useBooks();
  const showToast = useToast();
  const { query, setQuery, category, setCategory, filtered } = useSearch(books);
  const categoryLabels = {
    All: "الكل",
    Fantasy: "خيال",
    Drama: "دراما",
    Detective: "تحقيق",
    Education: "تعليم",
    Psychology: "علم نفس",
    Business: "أعمال",
    Astrology: "فلك",
  };

  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [savedIds, setSavedIds]       = useState(new Set());
  const [busy, setBusy]               = useState(new Set());

  useEffect(() => {
    Promise.all([getFavorites(), getSaved()])
      .then(([favRes, savedRes]) => {
        setFavoriteIds(new Set(favRes.data.favorites.map((b) => b.id)));
        setSavedIds(new Set(savedRes.data.saved.map((b) => b.id)));
      })
      .catch(() => {});
  }, []);

  async function handleToggleFav(book) {
    if (busy.has(book.id)) return;
    setBusy((p) => new Set(p).add(book.id));
    try {
      if (favoriteIds.has(book.id)) {
        await removeFavorite(book.id);
        setFavoriteIds((p) => { const s = new Set(p); s.delete(book.id); return s; });
        showToast("💔 تمت الإزالة من المفضلة");
      } else {
        await addFavorite(book.id);
        setFavoriteIds((p) => new Set(p).add(book.id));
        showToast("❤️ تمت الإضافة إلى المفضلة");
      }
    } catch { showToast("❌ حدث خطأ"); }
    finally { setBusy((p) => { const s = new Set(p); s.delete(book.id); return s; }); }
  }

  async function handleToggleSave(book) {
    if (busy.has(book.id)) return;
    setBusy((p) => new Set(p).add(book.id));
    try {
      if (savedIds.has(book.id)) {
        await removeSaved(book.id);
        setSavedIds((p) => { const s = new Set(p); s.delete(book.id); return s; });
        showToast("🗑️ تمت الإزالة من المحفوظات");
      } else {
        await addSaved(book.id);
        setSavedIds((p) => new Set(p).add(book.id));
        showToast("🔖 تمت الإضافة إلى المحفوظات");
      }
    } catch { showToast("❌ حدث خطأ"); }
    finally { setBusy((p) => { const s = new Set(p); s.delete(book.id); return s; }); }
  }

  const popular = books.slice(0, 3);

  return (
    <>
      <Navbar searchValue={query} onSearchChange={setQuery} />
      <CategoryBar active={category} onChange={setCategory} />
      <main className={styles.main}>
        {/* Hero */}
        <section className={styles.hero}>
          <div className={styles.heroText}>
            <h2 className={styles.heroTitle}>الأكثر رواجًا<br/>بين القرّاء</h2>
            <p className={styles.heroDesc}>اخترنا لك أشهر الكتب بناءً على ذوقك. اكتشفها الآن!</p>
            <button className={styles.heroBtn}>عرض القائمة الكاملة</button>
          </div>
          <div className={styles.heroBooks}>
            {popular.map((book, i) => (
              <img key={book.id} src={book.cover} alt={book.title} className={styles.heroBook}
                style={{ width: i===1?110:85, height: i===1?165:130, zIndex: i===1?2:1 }}
                onError={(e) => { e.target.src = FALLBACK_COVER(book.title); }} />
            ))}
          </div>
        </section>
        <h3 className="section-title">{category==="All" ? "كتب قد تهمك وتناسب اهتماماتك 📖": (categoryLabels[category] || category)}</h3>
        {booksLoading ? (
          <div className="empty-state">جاري تحميل الكتب...</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">لا توجد كتب في هذا القسم</div>
        ) : (
          <div className={styles.grid}>
            {filtered.map((book) => (
              <BookCard key={book.id} book={book}
                isFavorited={favoriteIds.has(book.id)}
                isSaved={savedIds.has(book.id)}
                onToggleFav={handleToggleFav}
                onToggleSave={handleToggleSave} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
