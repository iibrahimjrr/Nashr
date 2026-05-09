# Contributing to Nashr

Thank you for considering contributing to **Nashr**! We welcome contributions from everyone — whether it's fixing a bug, adding a new feature, improving the API, enhancing the UI, or optimizing the codebase.

---

## 📖 Table of Contents

- [How to Contribute](#how-to-contribute)
- [Development Setup](#development-setup)
- [Contribution Guidelines](#contribution-guidelines)
- [Ideas for Contribution](#ideas-for-contribution)

---

## How to Contribute

1. **Fork the repository**

2. **Create a new branch**

```bash
git checkout -b feature/your-feature-name

# Examples:
# git checkout -b feature/add-book-ratings
# git checkout -b fix/csrf-token-mismatch
# git checkout -b feature/google-oauth
```

3. **Make your changes** — whether it's a new API endpoint, a React component, a UI fix, or a database migration

4. **Commit and push**

```bash
git add .
git commit -m "feat: add book ratings to API and UI"
git push origin feature/your-feature-name
```

5. **Open a Pull Request (PR)** and describe clearly what you changed, why, and how to test it

---

## Development Setup

### Backend (Laravel 12)

```bash
cd backend

# Install dependencies
composer install

# Setup environment
cp .env.example .env
php artisan key:generate

# Configure your DB in .env then run
php artisan migrate --seed

# Create storage symlink
php artisan storage:link

# Start server
php artisan serve
# → http://localhost:8000
```

- Use **Laravel 12** and follow its conventions (Eloquent, Form Requests, Resource Controllers)
- Auth is handled via **Laravel Sanctum Bearer Tokens** — do not switch to session/cookie auth
- Keep controllers thin — move business logic to Services or Models where applicable
- All new endpoints must be added to `swagger.yaml` with proper documentation
- Validate all incoming request data using `$request->validate()` or dedicated Form Request classes
- Follow PSR-12 coding standards and existing naming conventions

### Frontend (React 18)

```bash
cd frontend

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# REACT_APP_API_URL=http://localhost:8000/api

# Start development server
npm start
# → http://localhost:3000
```

---

## Contribution Guidelines

- **Small, focused PRs** — Don't bundle unrelated changes in one PR. One feature or fix per PR keeps reviews fast and clean.

- **Commit messages** — Use clear, descriptive messages following this convention:

```
feat: add Google OAuth login support
fix: resolve CSRF token mismatch on login
style: improve mobile responsiveness on library page
refactor: extract book card logic into reusable hook
docs: update API reference in swagger.yaml
chore: upgrade axios to v2
test: add unit tests for AuthController
```

- **API changes** — Any new or modified endpoint must be reflected in `backend/swagger.yaml` before opening a PR.

- **Database changes** — Always create a new migration file — never edit existing migrations directly.

- **Code style** — Follow the existing style: indentation, naming conventions, Tailwind-free (we use CSS Modules), and consistent file naming.

- **Accessibility** — Ensure all interactive elements are keyboard-accessible and have proper `alt` / `aria` attributes.

- **Discuss first** — For large changes (new sections, architecture overhauls, new dependencies), open an issue to discuss before starting implementation — to avoid wasted effort.

- **Respect others** — Be kind, constructive, and professional in all communications.

---

## Ideas for Contribution

Here are areas where your contributions would be especially valuable:

### 🔐 Auth & Security

- **Google OAuth** — Add Sign in with Google using Laravel Socialite on the backend and a Google button flow on the frontend
- **Forgot Password** — Implement the full forgot password + reset via email flow (already has a UI placeholder)
- **Email Verification** — Send a verification email after registration
- **Token Refresh** — Implement automatic token refresh before expiry
- **2FA** — Add optional two-factor authentication

### 📚 Books & Library

- **Book Ratings** — Allow users to rate books (1–5 stars) and display average ratings
- **Book Detail Page** — Add a dedicated page `/books/:id` with full description, reviews, and related books
- **Book Search Suggestions** — Add a live search autocomplete dropdown in the Navbar
- **Book Filter by Rating** — Filter books by minimum star rating
- **Book Pagination** — Add backend pagination and infinite scroll or page navigation on the frontend
- **Book Cover Upload** — Allow admins to upload book covers directly instead of pasting a URL

### 👤 User Experience

- **Reading List** — Add a "Currently Reading" status separate from Favorites and Saved
- **Reading Progress** — Let users track their reading progress (e.g., page 45 of 320)
- **User Reviews** — Let users write and publish short reviews for books
- **Notifications** — Notify users when a new book in their favorite category is added

### 🎨 UI / Design

- **Dark Mode** — Add a light/dark theme toggle saved to localStorage
- **Skeleton Loaders** — Replace loading spinners with skeleton screens for a better UX
- **Book Card Hover Effects** — Add subtle animations when hovering over book cards
- **Empty State Illustrations** — Add friendly illustrations for empty favorites/saved lists
- **Onboarding Flow** — Add a welcome screen or category preferences step after registration

### ✨ Animations & Interactions

- **Page Transitions** — Add smooth transitions between routes using React
- **Toast Animations** — Improve the toast notification entrance/exit animations
- **Scroll to Top** — Add a floating scroll-to-top button on the Library page
- **Drag to Reorder** — Let users reorder their favorites list with drag and drop

### ⚙️ Technical Improvements

- **Testing (Backend)** — Add PHPUnit feature tests for all API endpoints
- **Testing (Frontend)** — Add React Testing Library unit tests for components
- **CI/CD** — Set up GitHub Actions for automated linting, tests, and build checks on every PR
- **Performance** — Optimize image loading, add lazy loading for book covers
- **Caching** — Add Laravel cache layer for the books listing endpoint
- **Rate Limiting** — Add API rate limiting to auth endpoints to prevent brute force
- **Docker** — Add `docker-compose.yml` to simplify local setup for new contributors

### 📝 Documentation

- Improve inline code comments for complex logic
- Add JSDoc comments to all service functions in `src/services/`
- Document all Laravel controllers with PHPDoc blocks
- Add Postman collection JSON to the repo for easy API testing

---

We're excited to see your contributions! 🚀

---

Built with ❤️ by **Ibrahim Elsayed**
