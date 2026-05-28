import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="not-found">
      <div className="not-found__code">404</div>
      <div className="not-found__title">Page not found</div>
      <div className="not-found__text">
        The page you're looking for doesn't exist or has been moved.
      </div>
      <Link to="/students" className="btn btn--primary" style={{ marginTop: '.5rem' }}>
        Back to Students
      </Link>
    </div>
  );
}
