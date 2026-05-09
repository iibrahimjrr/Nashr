// src/components/CategoryBar/CategoryBar.jsx
import { CATEGORIES } from "../../utils/mockData";
import styles from "./CategoryBar.module.css";

export default function CategoryBar({ active, onChange }) {
  const labels = {
    All: "الكل",
    Fantasy: "خيال",
    Drama: "دراما",
    Detective: "تحقيق",
    Education: "تعليم",
    Psychology: "علم نفس",
    Business: "أعمال",
    Astrology: "فلك",
  };

  return (
    <div className={styles.bar}>
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          className={`${styles.catBtn} ${active === cat ? styles.active : ""}`}
          onClick={() => onChange(cat)}
        >
          {labels[cat] || cat}
        </button>
      ))}
    </div>
  );
}
