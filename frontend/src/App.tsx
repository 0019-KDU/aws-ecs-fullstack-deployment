import { Link, NavLink, Route, Routes } from 'react-router-dom';
import StudentsPage from './pages/StudentsPage';
import StudentFormPage from './pages/StudentFormPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <div className="app">
      <header className="app__header">
        <Link to="/" className="app__brand">Student Portal</Link>
        <nav className="app__nav">
          <NavLink to="/students" className={({ isActive }) => isActive ? 'is-active' : ''}>
            Students
          </NavLink>
          <NavLink to="/students/new" className={({ isActive }) => isActive ? 'is-active' : ''}>
            Add Student
          </NavLink>
        </nav>
      </header>

      <main className="app__main">
        <Routes>
          <Route path="/" element={<StudentsPage />} />
          <Route path="/students" element={<StudentsPage />} />
          <Route path="/students/new" element={<StudentFormPage mode="create" />} />
          <Route path="/students/:id/edit" element={<StudentFormPage mode="edit" />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <footer className="app__footer">
        <span>&copy; {new Date().getFullYear()} Student Portal</span>
      </footer>
    </div>
  );
}
