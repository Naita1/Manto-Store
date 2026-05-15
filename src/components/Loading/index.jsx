import './Loading.css';

export function Loading({ message = "Carregando..." }) {
  return (
    <div class="loading-overlay">
    <div class="premium-loader-core">
        <div class="ring-layer primary"></div>
        <div class="ring-layer secondary"></div>
    </div>
        <span class="loading-label">Carregando</span>   
    </div>
  );
}