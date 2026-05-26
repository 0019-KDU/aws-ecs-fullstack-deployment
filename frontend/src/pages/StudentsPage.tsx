import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDeleteStudent, useStudentsList } from '../hooks/useStudents';
import { ApiError } from '../api/http';

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

  return (
    <section className="page">
      <div className="page__header">
        <h1>Students</h1>
        <button className="btn btn--primary" onClick={() => navigate('/students/new')}>
          + Add Student
        </button>
      </div>

      <form
        className="toolbar"
        onSubmit={(e) => {
          e.preventDefault();
          setPage(0);
          setSearch(searchInput.trim());
        }}
      >
        <input
          type="text"
          placeholder="Search by name or email"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="input"
        />
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

      {isLoading && <p>Loading…</p>}
      {isError && (
        <p className="error">
          {error instanceof ApiError ? error.detail ?? error.message : 'Failed to load students'}
        </p>
      )}

      {data && (
        <>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Enrollment #</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Date of Birth</th>
                  <th className="ta-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.content.length === 0 && (
                  <tr>
                    <td colSpan={5} className="empty">No students found.</td>
                  </tr>
                )}
                {data.content.map((s) => (
                  <tr key={s.id}>
                    <td>{s.enrollmentNumber}</td>
                    <td>{s.firstName} {s.lastName}</td>
                    <td>{s.email}</td>
                    <td>{s.dateOfBirth ?? '—'}</td>
                    <td className="ta-right">
                      <Link to={`/students/${s.id}/edit`} className="btn btn--sm">Edit</Link>
                      <button
                        className="btn btn--sm btn--danger"
                        onClick={() => handleDelete(s.id, `${s.firstName} ${s.lastName}`)}
                        disabled={deleteMutation.isPending}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <button
              className="btn btn--sm"
              disabled={data.first}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
            >
              ← Prev
            </button>
            <span>Page {data.page + 1} of {Math.max(1, data.totalPages)} · {data.totalElements} total</span>
            <button
              className="btn btn--sm"
              disabled={data.last}
              onClick={() => setPage((p) => p + 1)}
            >
              Next →
            </button>
            {isFetching && <span className="muted">refreshing…</span>}
          </div>
        </>
      )}
    </section>
  );
}
