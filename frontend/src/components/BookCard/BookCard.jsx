// src/components/BookCard/BookCard.jsx
import { FALLBACK_COVER } from "../../utils/mockData";
import styles from "./BookCard.module.css";

export default function BookCard({ book, isFavorited, isSaved, onToggleFav, onToggleSave }) {
  const readUrl = (
    book.readLink ||
    book.read_link ||
    book.read_url ||
    book.readUrl ||
    book.raedLink ||
    ""
  ).trim();
  const canRead = Boolean(readUrl);

  return (
    <article className={styles.card}>
      <div className={styles.coverWrap}>
        <img
          src={book.cover}
          alt={book.title}
          className={styles.cover}
          onError={(e) => { e.target.src = FALLBACK_COVER(book.title); }}
        />
        <div className={styles.actions}>
          <button
            className={`${styles.actionBtn} ${isFavorited ? styles.favActive : ""}`}
            title= "إضافة إلى المفضلة"
            onClick={() => onToggleFav(book)}
            aria-label="المفضلة"
          >
            {isFavorited ? "❤️" : "🤍"}
          </button>
          <button
            className={`${styles.actionBtn} ${isSaved ? styles.saveActive : ""}`}
            title="حفظ الكتاب"
            onClick={() => onToggleSave(book)}
            aria-label="حفظ"
          >
            {isSaved ? "🔖" : "📌"}
          </button>
          <button
            className={styles.actionBtn}
            title={canRead ? "قراءة الكتاب" : "لا يوجد رابط قراءة"}
            onClick={() => {
              if (canRead) window.open(readUrl, "_blank", "noopener,noreferrer");
            }}
            aria-label="قراءة الكتاب"
            disabled={!canRead}
          >
            👁️
          </button>
        </div>
      </div>
      <div className={styles.info}>
        <p className={styles.title}>{book.title}</p>
        <p className={styles.author}>{book.author}</p>
      </div>
    </article>
  );
}
