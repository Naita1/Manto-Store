import { Link } from 'react-router-dom';
import './ProductCard.css';

export function ProductCard({
  id,
  title,
  price,
  oldPrice,
  discountBadge,
  image,
  veioDeFiltro,
  filtroTimeAtivo,
}) {
  return (
    <Link
      to={`/produto/${id}`}
      state={{ veioDeFiltro, filtroTimeAtivo }}
      className="product-card"
      style={{ textDecoration: 'none' }}
    >
      <div className="product-image-container">
        {discountBadge && (
          <div className="product-discount-badge">
            {discountBadge}
          </div>
        )}
        <img src={image} alt={`Foto de ${title}`} />
      </div>

      <div className="product-info">
        <h3 className="product-title">{title}</h3>

        <div className="price-wrapper">
          {oldPrice && (
            <span className="product-price-old">{oldPrice}</span>
          )}
          <span className="product-price">{price}</span>
        </div>
      </div>
    </Link>
  );
}