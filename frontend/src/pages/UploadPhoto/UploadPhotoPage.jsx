// src/pages/UploadPhoto/UploadPhotoPage.jsx
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { uploadAvatar } from "../../services/userService";
import "../../styles/components.css";
import styles from "./UploadPhotoPage.module.css";

export default function UploadPhotoPage() {
  const [preview, setPreview]   = useState(null);
  const [file, setFile]         = useState(null);
  const [loading, setLoading]   = useState(false);
  const fileRef                 = useRef();
  const { updateCurrentUser }   = useAuth();
  const showToast               = useToast();
  const navigate                = useNavigate();

  function handleFile(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target.result);
    reader.readAsDataURL(f);
  }

  async function handleSave() {
    if (!file) return;
    setLoading(true);
    try {
      const res = await uploadAvatar(file);
      updateCurrentUser({ avatar: res.data.avatar_url });
      showToast("Photo uploaded successfully!");
      navigate("/library");
    } catch {
      showToast(" Failed to upload the image, please try again");
    } finally { setLoading(false); }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className="auth-logo" style={{justifyContent:"center"}}>
          <div className="auth-logo-icon"><svg width="20" height="20" fill="white" viewBox="0 0 24 24"><path d="M4 4h16v16H4V4zm2 2v12h12V6H6zm2 2h8v2H8V8zm0 4h5v2H8v-2z"/></svg></div>
          <span className="auth-logo-text">Nashr</span>
        </div>
        <h1 className={styles.title}>Add your personal picture</h1>
        <p className={styles.subtitle}>Choose a picture that represents you in the community</p>
        <div className={styles.uploadArea} onClick={() => fileRef.current?.click()}>
          {preview
            ? <img src={preview} className={styles.preview} alt="preview" />
            : (<><div className={styles.uploadIcon}>📷</div><p className={styles.uploadText}>Click to select a photo</p><p className={styles.uploadHint}>PNG · JPG · WEBP</p></>)
          }
        </div>
        <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={handleFile} />
        <button className="btn btn-primary btn-full" onClick={handleSave} disabled={!file||loading}>
          {loading ? "Uploading..." : "Save Photo and Continue"}
        </button>
        <button className={styles.skipBtn} onClick={() => navigate("/library")}>Skip for now</button>
      </div>
    </div>
  );
}
