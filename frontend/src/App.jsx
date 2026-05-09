// src/App.jsx
import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { BooksProvider } from "./context/BooksContext";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Footer from "./components/Footer/Footer";

import LoginPage          from "./pages/Login/LoginPage";
import RegisterPage       from "./pages/Register/RegisterPage";
import UploadPhotoPage    from "./pages/UploadPhoto/UploadPhotoPage";
import LibraryPage        from "./pages/Library/LibraryPage";
import UserDashboardPage  from "./pages/UserDashboard/UserDashboardPage";
import AdminDashboardPage from "./pages/AdminDashboard/AdminDashboardPage";

import "./styles/globals.css";
import "./styles/components.css";

export default function App() {
  useEffect(() => {
    document.documentElement.setAttribute("dir", "rtl");
    document.documentElement.setAttribute("lang", "ar");
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <BooksProvider>
          <ToastProvider>
            <div className="app-shell">
              <div className="app-routes">
                <Routes>
                  {/* Public */}
                  <Route path="/login"    element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />

                  {/* Semi-protected: must be logged in */}
                  <Route
                    path="/upload-photo"
                    element={
                      <ProtectedRoute>
                        <UploadPhotoPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Protected: users */}
                  <Route
                    path="/library"
                    element={
                      <ProtectedRoute>
                        <LibraryPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <UserDashboardPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Protected: admins only */}
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute adminOnly>
                        <AdminDashboardPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
              </div>
              <Footer />
            </div>
          </ToastProvider>
        </BooksProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
