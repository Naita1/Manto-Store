import { Link } from 'react-router-dom'; 
import './ProductCard.css';

export function ProductCard({ id, title, price, image }) {
  return (
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