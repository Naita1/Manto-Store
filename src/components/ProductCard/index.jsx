import { Link } from 'react-router-dom';

export function ProductCard({
  id,
  title,
  price,
  oldPrice,
  discountBadge,
  image,
  veioDeFiltro,
  filtroTimeAtivo,
  className = "w-full", 
}) {
  return (
    <Link
      to={`/produto/${id}`}
      state={{ veioDeFiltro, filtroTimeAtivo }}
      className={`group relative flex flex-col overflow-hidden rounded-xl border border-neutral-800/80 bg-neutral-900/60 hover:border-neutral-700 transition-colors duration-200 no-underline ${className}`}
    >
      <div className="relative w-full aspect-square flex items-center justify-center bg-[#f0f0f0] overflow-hidden">
        {discountBadge && (
          <div className="absolute top-2 right-2 z-10 px-1.5 py-0.5 rounded bg-[#9C2A32] text-white font-bold text-[9px] sm:text-xs tracking-wider uppercase shadow-md pointer-events-none">
            {discountBadge}
          </div>
        )}
        <img 
          src={image} 
          alt={`Foto de ${title}`}
          className="w-full h-full object-cover transform-gpu transition-transform duration-300 ease-out group-hover:scale-105"
        />
      </div>
      <div className="flex flex-col flex-1 justify-between p-2.5 sm:p-4 bg-neutral-950/90 gap-1.5 border-t border-neutral-800/40">
        <h3 className="text-[10px] sm:text-xs font-medium text-neutral-300 group-hover:text-white transition-colors duration-150 uppercase tracking-wide line-clamp-2 leading-tight min-h-8 sm:min-h-[2.2rem]">
          {title}
        </h3>

        <div className="flex items-baseline gap-1.5 flex-wrap pt-0.5">
          {oldPrice && (
            <span className="text-[9px] sm:text-xs text-neutral-500 line-through font-normal">
              {oldPrice}
            </span>
          )}
          <span className="text-xs sm:text-sm font-bold text-white tracking-tight">
            {price}
          </span>
        </div>
      </div>
    </Link>
  );
}