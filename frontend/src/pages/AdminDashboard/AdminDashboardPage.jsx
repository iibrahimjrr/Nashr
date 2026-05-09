// src/pages/AdminDashboard/AdminDashboardPage.jsx
import { useState, useEffect } from "react";
import { useBooks } from "../../context/BooksContext";
import { useToast } from "../../context/ToastContext";
import { getDashboard, getUsers, deleteUser } from "../../services/adminService";
import { CATEGORIES } from "../../utils/mockData";
import Navbar from "../../components/Navbar/Navbar";
import "../../styles/components.css";
import styles from "./AdminDashboardPage.module.css";

const EMPTY_FORM = {
  title: "", author: "", category: "Drama",
  cover: "", description: "", read_link: "",
};

function getBadgeClass(cat) {
  const map = { Fantasy:"badge-fantasy", Drama:"badge-drama", Detective:"badge-detective", Business:"badge-business" };
  return map[cat] || "badge-default";
}

function getCategoryLabel(cat) {
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
  return labels[cat] || cat;
}

export default function AdminDashboardPage() {
  const { books, addBook, deleteBook } = useBooks();
  const showToast = useToast();
  const getReadLink = (book) =>
    (book.readLink || book.read_link || book.read_url || book.readUrl || "").trim();

  const [form, setForm]           = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [stats, setStats]         = useState(null);
  const [users, setUsers]         = useState([]);
  const [activeTab, setActiveTab] = useState("books");

  useEffect(() => {
    getDashboard()
      .then((res) => setStats(res.data.stats))
      .catch(() => {});
    getUsers()
      .then((res) => setUsers(res.data.data || res.data))
      .catch(() => {});
  }, []);

  function handleChange(e) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setFormError("");
  }

  async function handleAdd(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.author.trim()) {
      setFormError("العنوان والمؤلف مطلوبان");
      return;
    }
    if (form.read_link && !isValidUrl(form.read_link)) {
      setFormError("رابط القراءة يجب أن يكون رابطًا صحيحًا (يبدأ بـ http)");
      return;
    }
    try {
      await addBook(form);
      setForm(EMPTY_FORM);
      showToast("✅ تمت إضافة الكتاب بنجاح");
    } catch (err) {
      setFormError(err.response?.data?.message || "فشل إضافة الكتاب");
    }
  }

  function isValidUrl(str) {
    try { return Boolean(new URL(str)); } catch { return false; }
  }

  async function handleDeleteBook(id) {
    if (!window.confirm("هل أنت متأكد من حذف هذا الكتاب؟")) return;
    try {
      await deleteBook(id);
      showToast("🗑️ تم حذف الكتاب بنجاح");
    } catch { showToast("❌ فشل حذف الكتاب"); }
  }

  async function handleDeleteUser(id) {
    if (!window.confirm("هل أنت متأكد من حذف هذا المستخدم؟")) return;
    try {
      await deleteUser(id);
      setUsers((p) => p.filter((u) => u.id !== id));
      showToast("🗑️ تم حذف المستخدم بنجاح");
    } catch (err) {
      showToast(err.response?.data?.message || "❌ فشل حذف المستخدم");
    }
  }

  const displayStats = stats || {
    total_books: books.length,
    total_users: users.length,
    total_categories: [...new Set(books.map((b) => b.category))].length,
  };

  return (
    <>
      <Navbar searchValue="" onSearchChange={() => {}} />
      <main className={styles.main}>

        <h1 className={styles.title}>لوحة تحكم الأدمن</h1>
        <p className={styles.subtitle}>إدارة كتب المكتبة والمستخدمين</p>

        {/* ── Stats ── */}
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <div className={styles.statNum}>{displayStats.total_books}</div>
            <div className={styles.statLabel}>إجمالي الكتب</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNum}>{displayStats.total_users}</div>
            <div className={styles.statLabel}>المستخدمون</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNum}>{displayStats.total_categories}</div>
            <div className={styles.statLabel}>التصنيفات</div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className={styles.tabs}>
          <button className={`${styles.tab} ${activeTab === "books"   ? styles.tabActive : ""}`} onClick={() => setActiveTab("books")}>📚 إدارة الكتب</button>
          <button className={`${styles.tab} ${activeTab === "addbook" ? styles.tabActive : ""}`} onClick={() => setActiveTab("addbook")}>➕ إضافة كتاب</button>
          <button className={`${styles.tab} ${activeTab === "users"   ? styles.tabActive : ""}`} onClick={() => setActiveTab("users")}>👥 إدارة المستخدمين</button>
        </div>

        {/* ── Add Book Form ── */}
        {activeTab === "addbook" && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>➕ إضافة كتاب جديد</h2>
            {formError && <div className="alert alert-error">{formError}</div>}

            <form onSubmit={handleAdd}>
              <div className={styles.formGrid}>

                <div className="form-group">
                  <label className="form-label">عنوان الكتاب *</label>
                  <input className="form-input" name="title" placeholder="عنوان الكتاب" value={form.title} onChange={handleChange} />
                </div>

                <div className="form-group">
                  <label className="form-label">المؤلف *</label>
                  <input className="form-input" name="author" placeholder="اسم المؤلف" value={form.author} onChange={handleChange} />
                </div>

                <div className="form-group">
                  <label className="form-label">التصنيف</label>
                  <select className="form-select" name="category" value={form.category} onChange={handleChange}>
                    {CATEGORIES.filter((c) => c !== "All").map((c) => <option key={c} value={c}>{getCategoryLabel(c)}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">رابط الغلاف</label>
                  <input className="form-input" name="cover" placeholder="https://..." value={form.cover} onChange={handleChange} />
                </div>

              </div>

              {/* ── Read Link — full width with eye icon ── */}
              <div className="form-group">
                <label className="form-label">
                  <span className={styles.readLabelIcon}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  </span>
                  رابط القراءة
                  <span className={styles.labelHint}>(زر 👁️ لن يظهر بدون هذا الرابط)</span>
                </label>
                <div className={styles.readLinkWrap}>
                  <span className={styles.readLinkPrefix}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#E8A020" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  </span>
                  <input
                    className={`form-input ${styles.readLinkInput}`}
                    name="read_link"
                    placeholder="https://example.com/read/book"
                    value={form.read_link}
                    onChange={handleChange}
                  />
                  {form.read_link && isValidUrl(form.read_link) && (
                    <a
                      href={form.read_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.readLinkPreview}
                      title="معاينة الرابط"
                    >
                      معاينة ↗
                    </a>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">وصف الكتاب</label>
                <textarea className="form-textarea" name="description" placeholder="وصف مختصر للكتاب..." value={form.description} onChange={handleChange} />
              </div>

              <button type="submit" className="btn btn-primary">
                إضافة الكتاب
              </button>
            </form>
          </section>
        )}

        {/* ── Books Table ── */}
        {activeTab === "books" && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>📚 الكتب ({books.length})</h2>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>الغلاف</th>
                    <th>العنوان</th>
                    <th>المؤلف</th>
                    <th>التصنيف</th>
                    <th>رابط القراءة</th>
                    <th>الإجراء</th>
                  </tr>
                </thead>
                <tbody>
                  {books.map((book) => (
                    <tr key={book.id}>
                      <td>
                        <img
                          src={book.cover}
                          alt=""
                          className={styles.miniCover}
                          onError={(e) => { e.target.src = "https://via.placeholder.com/36x48/F5EFE3/9B8B7A?text=📖"; }}
                        />
                      </td>
                      <td className={styles.bookTitle}>{book.title}</td>
                      <td>{book.author}</td>
                      <td>
                        <span className={`badge ${getBadgeClass(book.category)}`}>{getCategoryLabel(book.category)}</span>
                      </td>
                      <td>
                        {getReadLink(book) ? (
                          <a
                            href={getReadLink(book)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.tableReadLink}
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                              <circle cx="12" cy="12" r="3"/>
                            </svg>
                            عرض
                          </a>
                        ) : (
                          <span className={styles.noLink}>—</span>
                        )}
                      </td>
                      <td>
                        <button className="btn btn-danger" onClick={() => handleDeleteBook(book.id)}>
                          🗑️ حذف
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ── Users Table ── */}
        {activeTab === "users" && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>👥 المستخدمون ({users.length})</h2>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>الصورة</th>
                    <th>الاسم</th>
                    <th>اسم المستخدم</th>
                    <th>البريد الإلكتروني</th>
                    <th>الدور</th>
                    <th>الإجراء</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                                            <td>
                        {u.avatar ? (
                          <img
                            src={`http://localhost:8000/storage/${u.avatar}`}
                            alt={u.name}
                            className={styles.userAvatar}
                          />
                        ) : (
                          <div className={styles.userAvatarPlaceholder}>
                            {u.name?.[0]?.toUpperCase()}
                          </div>
                        )}
                      </td>
                      <td className={styles.bookTitle}>{u.name}</td>
                      <td>@{u.username}</td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`badge ${u.role === "admin" ? "badge-fantasy" : "badge-default"}`}>
                          {u.role === "admin" ? "أدمن" : "مستخدم"}
                        </span>
                      </td>
                      <td>
                        {u.role !== "admin" && (
                          <button className="btn btn-danger" onClick={() => handleDeleteUser(u.id)}>
                            🗑️ حذف
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

      </main>
    </>
  );
}
