// src/components/Navbar/Navbar.jsx
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from "./Navbar.module.css";

export default function Navbar({ searchValue, onSearchChange }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const initials = user?.name?.[0]?.toUpperCase() || "U";

  return (
    <header className={styles.navbar}>
      {/* <Link to="/library" className={styles.logo}>
        
      </Link> */}

      <div className={styles.search}>
        {/* <span className={styles.searchIcon}></span> */}
        <input
          className={styles.searchInput}
          placeholder="ابحث عن كتاب أو مؤلف"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <nav className={styles.actions}>
        <Link
          to="/library"
          className={`${styles.navLink} ${pathname === "/library" ? styles.active : ""}`}
        >
          المكتبة
        </Link>

        <Link
          to="/dashboard"
          className={`${styles.navLink} ${pathname === "/dashboard" ? styles.active : ""}`}
        >
          حسابي
        </Link>

        {user?.role === "admin" && (
          <Link
            to="/admin"
            className={`${styles.navLink} ${pathname === "/admin" ? styles.active : ""}`}
          >
            إدارة المكتبة
          </Link>
        )}

        <Link to="/dashboard" className={styles.userChip}>
          {user?.avatar ? (
            <img src={user.avatar} className={styles.avatar} alt="avatar" />
          ) : (
            <div className={styles.avatarPlaceholder}>{initials}</div>
          )}
          <span className={styles.userName}>{user?.name}</span>
        </Link>

        <button className={styles.logoutBtn} onClick={handleLogout}>
          تسجيل الخروج
        </button>
      </nav>
    </header>
  );
}
