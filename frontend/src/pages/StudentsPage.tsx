import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDeleteStudent, useStudentsList } from '../hooks/useStudents';
import { ApiError } from '../api/http';

const AVATAR_COLORS = ['indigo', 'teal', 'rose', 'amber', 'violet'] as const;

function getAvatarColor(name: string) {
  let hash = 0;
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) & 0xffff;
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

function Avatar({ firstName, lastName }: { firstName: string; lastName: string }) {
  const initials = `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase();
  const color = getAvatarColor(firstName + lastName);
  return <div className={`avatar avatar--${color}`}>{initials}</div>;
}

export default function StudentsPage() {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const navigate = useNavigate();

  const { data, isLoading, isError, error, isFetching } = useStudentsList({
    page,
    size: 10,
    sort: 'lastName,asc',
    search: search || undefined,
  });

  const deleteMutation = useDeleteStudent();

  const handleDelete = (id: number, name: string) => {
    if (!window.confirm(`Delete student "${name}"?`)) return;
    deleteMutation.mutate(id, {
      onError: (err) => alert(err instanceof ApiError ? err.detail ?? err.message : 'Delete failed'),
    });
  };

  const total = data?.totalElements ?? 0;

  return (
    <>
      {/* Stats row */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--indigo">👥</div>
          <div>
            <div className="stat-card__label">Total Students</div>
            <div className="stat-card__value">{isLoading ? '—' : total}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--green">📄</div>
          <div>
            <div className="stat-card__label">Current Page</div>
            <div className="stat-card__value">
              {isLoading ? '—' : `${(data?.page ?? 0) + 1} / ${Math.max(1, data?.totalPages ?? 1)}`}
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--amber">🔍</div>
          <div>
            <div className="stat-card__label">Search Filter</div>
            <div className="stat-card__value" style={{ fontSize: '1rem', paddingTop: '.25rem' }}>
              {search ? `"${search}"` : 'None'}
            </div>
          </div>
        </div>
      </div>

      {/* Main table card */}
      <div className="card">
        <div className="card__header">
          <div className="card__title">
            Student Records
            {isFetching && !isLoading && (
              <span style={{ fontSize: '.75rem', fontWeight: 400, color: 'var(--color-muted)', marginLeft: '.5rem' }}>
                refreshing…
              </span>
            )}
          </div>
          <button className="btn btn--primary" onClick={() => navigate('/students/new')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Student
          </button>
        </div>

        {/* Search */}
        <form
          className="search-bar"
          onSubmit={(e) => { e.preventDefault(); setPage(0); setSearch(searchInput.trim()); }}
        >
          <div className="search-wrap">
            <svg className="search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="Search by name or email…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <button type="submit" className="btn">Search</button>
          {search && (
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => { setSearch(''); setSearchInput(''); setPage(0); }}
            >
              Clear
            </button>
          )}
        </form>

        {/* Error */}
        {isError && (
          <div className="alert alert--error">
            <span>⚠</span>
            {error instanceof ApiError ? error.detail ?? error.message : 'Failed to load students'}
          </div>
        )}

        {/* Loading */}
        {isLoading && <div className="spinner">Loading students…</div>}

        {/* Table */}
        {data && (
          <>
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Enrollment #</th>
                    <th>Date of Birth</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.content.length === 0 && (
                    <tr>
                      <td colSpan={4}>
                        <div className="empty-state">
                          <div className="empty-state__icon">🎓</div>
                          <div className="empty-state__text">No students found</div>
                          <div style={{ fontSize: '.8rem', color: 'var(--color-muted)' }}>
                            {search ? 'Try a different search term' : 'Add your first student to get started'}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                  {data.content.map((s) => (
                    <tr key={s.id}>
                      <td>
                        <div className="student-cell">
                          <Avatar firstName={s.firstName} lastName={s.lastName} />
                          <div>
                            <div className="student-name">{s.firstName} {s.lastName}</div>
                            <div className="student-email">{s.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge--indigo">{s.enrollmentNumber}</span>
                      </td>
                      <td style={{ color: 'var(--color-muted)' }}>{s.dateOfBirth ?? '—'}</td>
                      <td>
                        <div className="actions">
                          <Link to={`/students/${s.id}/edit`} className="btn btn--sm">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                            Edit
                          </Link>
                          <button
                            className="btn btn--sm btn--danger"
                            onClick={() => handleDelete(s.id, `${s.firstName} ${s.lastName}`)}
                            disabled={deleteMutation.isPending}
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3 6 5 6 21 6"/>
                              <path d="M19 6l-1 14H6L5 6"/>
                              <path d="M10 11v6M14 11v6"/>
                              <path d="M9 6V4h6v2"/>
                            </svg>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pagination">
              <div className="pagination__info">
                Showing {data.content.length} of {total} students
              </div>
              <div className="pagination__controls">
                <button
                  className="btn btn--sm"
                  disabled={data.first}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                >
                  ← Previous
                </button>
                <span className="pagination__page">
                  {data.page + 1} / {Math.max(1, data.totalPages)}
                </span>
                <button
                  className="btn btn--sm"
                  disabled={data.last}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next →
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
