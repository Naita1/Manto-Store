import './Loading.css';

export function Loading({ message = "Carregando..." }) {
  return (
    <div className="loading-overlay">
    <div className="premium-loader-core">
        <div className="ring-layer primary"></div>
        <div className="ring-layer secondary"></div>
    </div>
        <span className="loading-label">Carregando</span>   
    </div>
  );
}