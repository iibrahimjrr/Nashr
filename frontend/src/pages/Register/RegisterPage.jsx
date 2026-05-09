// src/pages/Register/RegisterPage.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { register as apiRegister } from "../../services/authService";
import "../../styles/components.css";

export default function RegisterPage() {
  const [form, setForm]       = useState({ username:"", name:"", email:"", password:"", confirm:"" });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const { login }             = useAuth();
  const navigate              = useNavigate();

  function handleChange(e) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.username||!form.name||!form.email||!form.password||!form.confirm){setError("من فضلك املأ كل الحقول");return;}
    if (form.password.length<6){setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل");return;}
    if (form.password!==form.confirm){setError("كلمتا المرور غير متطابقتين");return;}
    setLoading(true);
    try {
      const res = await apiRegister(form);
      login(res.data.user, res.data.token);
      navigate("/upload-photo");
    } catch(err) {
      const errs = err.response?.data?.errors;
      if (errs) {
        const first = Object.values(errs)[0];
        setError(Array.isArray(first) ? first[0] : first);
      } else {
        setError(err.response?.data?.message || "حدث خطأ، حاول مرة أخرى");
      }
    } finally { setLoading(false); }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon"><svg width="20" height="20" fill="white" viewBox="0 0 24 24"><path d="M4 4h16v16H4V4zm2 2v12h12V6H6zm2 2h8v2H8V8zm0 4h5v2H8v-2z"/></svg></div>
          <span className="auth-logo-text">Nashr</span>
        </div>
        <h1 className="auth-title">إنشاء حساب جديد</h1>
        <p className="auth-subtitle">انضم لمجتمع القراءة وابدأ رحلتك</p>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group"><label className="form-label">اسم المستخدم *</label><input className="form-input" name="username" placeholder="مثال: قارئ_كتب99" value={form.username} onChange={handleChange} /></div>
          <div className="form-group"><label className="form-label">الاسم بالكامل *</label><input className="form-input" name="name" placeholder="اكتب اسمك الحقيقي" value={form.name} onChange={handleChange} /></div>
          <div className="form-group"><label className="form-label">البريد الإلكتروني *</label><input className="form-input" name="email" type="email" placeholder="example@email.com" value={form.email} onChange={handleChange} /></div>
          <div className="form-group"><label className="form-label">كلمة المرور *</label><input className="form-input" name="password" type="password" placeholder="6 أحرف على الأقل" value={form.password} onChange={handleChange} /></div>
          <div className="form-group"><label className="form-label">تأكيد كلمة المرور *</label><input className="form-input" name="confirm" type="password" placeholder="أعد كتابة كلمة المرور" value={form.confirm} onChange={handleChange} /></div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>{loading?"جاري إنشاء الحساب...":"إنشاء حساب"}</button>
        </form>
        <div className="auth-footer">لديك حساب بالفعل؟ <Link to="/login">تسجيل الدخول</Link></div>
      </div>
    </div>
  );
}
