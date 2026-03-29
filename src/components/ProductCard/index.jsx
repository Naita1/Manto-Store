// src/components/ProductCard/index.jsx
import { Link } from 'react-router-dom'; // <-- 1. Importe o Link
import './ProductCard.css';

// 2. Receba o 'id' aqui em cima junto com os outros
export function ProductCard({ id, title, price, image }) {
  return (
    // 3. Trocamos a <div> por <Link> e apontamos para a URL dinâmica
    <Link to={`/produto/${id}`} className="product-card" style={{ textDecoration: 'none' }}>
      
      <div className="product-image-container">
        <img src={image} alt={`Foto de ${title}`} />
      </div>
      
      <div className="product-info">
        <h3 className="product-title">{title}</h3>
        <span className="product-price">{price}</span>
      </div>

    </Link>
  );
}