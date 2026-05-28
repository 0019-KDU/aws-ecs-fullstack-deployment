import { NavLink, Route, Routes, useLocation } from 'react-router-dom';
import StudentsPage from './pages/StudentsPage';
import StudentFormPage from './pages/StudentFormPage';
import NotFoundPage from './pages/NotFoundPage';

const PAGE_TITLES: Record<string, { title: string; breadcrumb: string }> = {
  '/students':     { title: 'Students', breadcrumb: 'Dashboard / Students' },
  '/students/new': { title: 'Add Student', breadcrumb: 'Dashboard / Students / New' },
};

function getPageMeta(pathname: string) {
  if (pathname.includes('/edit')) return { title: 'Edit Student', breadcrumb: 'Dashboard / Students / Edit' };
  return PAGE_TITLES[pathname] ?? { title: 'Student Portal', breadcrumb: 'Dashboard' };
}

export default function App() {
  const { pathname } = useLocation();
  const { title, breadcrumb } = getPageMeta(pathname);

  return (
    <div className="layout">
      {/* ── Sidebar ── */}
      <aside className="sidebar">
        <div className="sidebar__brand">
          <div className="sidebar__icon">🎓</div>
          <div>
            <div className="sidebar__title">Student Portal</div>
            <div className="sidebar__subtitle">Management System</div>
          </div>
        </div>

        <nav className="sidebar__nav">
          <div className="sidebar__section">Main Menu</div>

          <NavLink
            to="/students"
            className={({ isActive }) => `sidebar__link${isActive ? ' is-active' : ''}`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            Students
          </NavLink>

          <NavLink
            to="/students/new"
            className={({ isActive }) => `sidebar__link${isActive ? ' is-active' : ''}`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <line x1="19" y1="8" x2="19" y2="14"/>
              <line x1="22" y1="11" x2="16" y2="11"/>
            </svg>
            Add Student
          </NavLink>
        </nav>

        <div className="sidebar__footer">
          &copy; {new Date().getFullYear()} Student Portal
        </div>
      </aside>

      {/* ── Content ── */}
      <div className="content">
        <header className="topbar">
          <div className="topbar__left">
            <div className="topbar__title">{title}</div>
            <div className="topbar__breadcrumb">{breadcrumb}</div>
          </div>
          <div className="topbar__right">
            <div className="topbar__avatar">SP</div>
          </div>
        </header>

        <main className="main">
          <Routes>
            <Route path="/" element={<StudentsPage />} />
            <Route path="/students" element={<StudentsPage />} />
            <Route path="/students/new" element={<StudentFormPage mode="create" />} />
            <Route path="/students/:id/edit" element={<StudentFormPage mode="edit" />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
