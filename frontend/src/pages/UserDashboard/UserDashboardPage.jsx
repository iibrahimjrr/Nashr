// src/pages/UserDashboard/UserDashboardPage.jsx
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { changePassword, uploadAvatar, getFavorites, getSaved, removeFavorite, removeSaved } from "../../services/userService";
import { FALLBACK_COVER } from "../../utils/mockData";
import Navbar from "../../components/Navbar/Navbar";
import "../../styles/components.css";
import styles from "./UserDashboardPage.module.css";

export default function UserDashboardPage() {
  const { user, updateCurrentUser } = useAuth();
  const showToast = useToast();
  const fileRef   = useRef();

  const [favorites, setFavorites] = useState([]);
  const [saved, setSaved]         = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [pwdForm, setPwdForm]     = useState({ current:"", newP:"", confirm:"" });
  const [pwdError, setPwdError]   = useState("");
  const [pwdSuccess, setPwdSuccess] = useState("");

  useEffect(() => {
    Promise.all([getFavorites(), getSaved()])
      .then(([fRes, sRes]) => {
        setFavorites(fRes.data.favorites);
        setSaved(sRes.data.saved);
      })
      .catch(() => {})
      .finally(() => setLoadingData(false));
  }, []);

  async function handleChangePwd(e) {
    e.preventDefault();
    setPwdError(""); setPwdSuccess("");
    if (pwdForm.newP.length < 8) { setPwdError("كلمة المرور يجب أن تكون 8 أحرف على الأقل"); return; }
    if (pwdForm.newP !== pwdForm.confirm) { setPwdError("تأكيد كلمة المرور غير متطابق"); return; }
    try {
      await changePassword(pwdForm);
      setPwdSuccess("✅ تم تغيير كلمة المرور بنجاح");
      setPwdForm({ current:"", newP:"", confirm:"" });
    } catch(err) {
      setPwdError(err.response?.data?.message || "كلمة المرور الحالية غير صحيحة");
    }
  }

  async function handleAvatarFile(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      const res = await uploadAvatar(f);
      updateCurrentUser({ avatar: res.data.avatar_url });
      showToast("✅ تم رفع الصورة بنجاح");
    } catch { showToast("❌ فشل رفع الصورة"); }
  }

  async function handleRemoveFav(id) {
    await removeFavorite(id);
    setFavorites((p) => p.filter((b) => b.id !== id));
    showToast("🗑️ تمت الإزالة من المفضلة");
  }

  async function handleRemoveSaved(id) {
    await removeSaved(id);
    setSaved((p) => p.filter((b) => b.id !== id));
    showToast("🗑️ تمت الإزالة من المحفوظات");
  }

  return (
    <>
      <Navbar searchValue="" onSearchChange={() => {}} />
      <main className={styles.main}>
        {/* Profile */}
        <section className={styles.profileCard}>
          <div className={styles.avatarWrap}>
            {user?.avatar
              ? <img src={user.avatar} className={styles.avatar} alt="avatar" />
              : <div className={styles.avatarPlaceholder}>{user?.name?.[0]?.toUpperCase()}</div>}
            <button className={styles.avatarEdit} onClick={() => fileRef.current?.click()} title="تغيير الصورة"></button>
            <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={handleAvatarFile} />
          </div>
          <div className={styles.profileInfo}>
            <h2 className={styles.profileName}>{user?.name}</h2>
            <p className={styles.profileMeta}>@{user?.username}</p>
            <p className={styles.profileMeta}> {user?.email}</p>
            <div className={styles.profileStats}>
              <span>المفضلة: {favorites.length}</span>
              <span>المحفوظات: {saved.length}</span>
            </div>
          </div>
        </section>

        {/* Favorites */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>الكتب المفضلة</h3>
          {loadingData ? <div className="empty-state">جاري التحميل...</div>
          : favorites.length === 0 ? <div className="empty-state">لم تقم بإضافة أي كتاب إلى المفضلة بعد</div>
          : <div className={styles.booksList}>
              {favorites.map((book) => (
                <div key={book.id} className={styles.bookItem}>
                  <img src={book.cover} alt={book.title} className={styles.bookCover} onError={(e)=>{e.target.src=FALLBACK_COVER(book.title)}} />
                  <button className={styles.removeBtn} onClick={() => handleRemoveFav(book.id)}>✕</button>
                  <p className={styles.bookTitle}>{book.title}</p>
                </div>
              ))}
            </div>}
        </section>

        {/* Saved */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>الكتب المحفوظة</h3>
          {loadingData ? <div className="empty-state">جاري التحميل...</div>
          : saved.length === 0 ? <div className="empty-state">لم تقم بحفظ أي كتاب بعد</div>
          : <div className={styles.booksList}>
              {saved.map((book) => (
                <div key={book.id} className={styles.bookItem}>
                  <img src={book.cover} alt={book.title} className={styles.bookCover} onError={(e)=>{e.target.src=FALLBACK_COVER(book.title)}} />
                  <button className={styles.removeBtn} onClick={() => handleRemoveSaved(book.id)}>✕</button>
                  <p className={styles.bookTitle}>{book.title}</p>
                </div>
              ))}
            </div>}
        </section>

        {/* Change Password */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>تغيير كلمة المرور</h3>
          {pwdError   && <div className="alert alert-error">{pwdError}</div>}
          {pwdSuccess && <div className="alert alert-success">{pwdSuccess}</div>}
          <form onSubmit={handleChangePwd} className={styles.pwdForm}>
            <input className="form-input" type="password" placeholder="كلمة المرور الحالية" value={pwdForm.current} onChange={(e)=>setPwdForm({...pwdForm,current:e.target.value})} />
            <input className="form-input" type="password" placeholder="كلمة المرور الجديدة" value={pwdForm.newP} onChange={(e)=>setPwdForm({...pwdForm,newP:e.target.value})} />
            <input className="form-input" type="password" placeholder="تأكيد كلمة المرور الجديدة" value={pwdForm.confirm} onChange={(e)=>setPwdForm({...pwdForm,confirm:e.target.value})} />
            <button type="submit" className="btn btn-primary" style={{width:"fit-content"}}>حفظ كلمة المرور</button>
          </form>
        </section>
      </main>
    </>
  );
}
