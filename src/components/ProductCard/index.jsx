import './ProductCard.css';

export function ProductCard({ image, title, price }) {
  return (
    <div className="product-card">
      <div className="product-image-container">
        <img src={image || "https://placehold.co/200x250/1E1E1E/333?text=Foto"} alt={title} />
      </div>
      <div className="product-info">
        <h3 className="product-title">{title}</h3>
        <span className="product-price">{price}</span>
      </div>
    </div>
  );
}