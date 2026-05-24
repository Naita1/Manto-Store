import './Loading.css';

export function Loading({ message = 'Carregando...' }) {
  return (
    <div className="loading-overlay" role="status" aria-label={message}>
      <div className="premium-loader-core">
        <div className="ring-layer primary" />
        <div className="ring-layer secondary" />
      </div>
      <span className="loading-label" aria-hidden="true">{message}</span>
    </div>
  );
}