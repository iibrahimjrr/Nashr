import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import api from "../../services/api";
import "../../styles/components.css";
import styles from "./LoginPage.module.css";

export default function LoginPage() {
  const [form, setForm]     = useState({ credential: "", password: "" });
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);
  const { login }           = useAuth();
  const showToast           = useToast();
  const navigate            = useNavigate();

  function handleChange(e) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.credential || !form.password) { setError("من فضلك املأ كل الحقول"); return; }
    setLoading(true);
    try {
      const res = await api.post("/auth/login", {
        credential: form.credential,
        password: form.password,
      });

      login(res.data.user, res.data.token);
      showToast(`أهلاً بعودتك يا ${res.data.user.name}!`);
      navigate("/library");

    } catch (err) {
      const msg = err.response?.data?.errors?.credential?.[0]
               || err.response?.data?.message
               || "حدث خطأ، حاول مرة أخرى";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">
            <svg width="20" height="20" fill="white" viewBox="0 0 24 24"><path d="M4 4h16v16H4V4zm2 2v12h12V6H6zm2 2h8v2H8V8zm0 4h5v2H8v-2z"/></svg>
          </div>
          <span className="auth-logo-text">Nashr</span>
        </div>
        <p className="auth-subtitle">سجّل الدخول للوصول إلى مكتبتك الشخصية</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">اسم المستخدم أو البريد الإلكتروني</label>
            <input className="form-input" name="credential" placeholder="اسم المستخدم أو البريد الإلكتروني" value={form.credential} onChange={handleChange} autoComplete="username" />
          </div>

          <div className="form-group">
            <label className="form-label">كلمة المرور</label>
            <input className="form-input" name="password" type="password" placeholder="كلمة المرور" value={form.password} onChange={handleChange} autoComplete="current-password" />
          </div>

          <div className="auth-forgot"><Link to="/forgot-password">نسيت كلمة المرور؟</Link></div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? "جاري التحقق..." : "تسجيل الدخول"}
          </button>
        </form>

        <div className="auth-divider">
          <div className="auth-divider-line" />
          <span className="auth-divider-text">أو</span>
          <div className="auth-divider-line" />
        </div>

        <button className="btn-google">
          تسجيل الدخول بحساب Google
        </button>

        <div className="auth-footer">
          ليس لديك حساب؟ <Link to="/register">إنشاء حساب جديد</Link>
        </div>
      </div>
    </div>
  );
}