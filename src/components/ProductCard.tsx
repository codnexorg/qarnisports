import { Link } from 'react-router-dom';
import Icon from './Icon';
import type { Product } from '../data/sports';
import SaleCountdown from './SaleCountdown';

interface Props {
  product: Product;
  delay?: number;
}

export default function ProductCard({ product, delay = 0 }: Props) {
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Link
      to={`/product/${product.slug ?? product.id}`}
      className="product-card-hover glass-card rounded-xl overflow-hidden group relative block"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}
    >
      {product.badge && (
        <div className="absolute top-3 left-3 z-10">
          <span className="px-2.5 py-1 text-[9px] font-black tracking-widest uppercase bg-[#c4a84f] text-[#07070c] rounded-sm">
            {product.badge}
          </span>
        </div>
      )}
      {discount > 0 && (
        <div className="absolute top-3 right-3 z-10">
          <span className="px-2 py-1 text-[9px] font-black tracking-wide bg-red-500/90 text-white rounded-sm">
            -{discount}%
          </span>
        </div>
      )}

      {/* Image */}
      <div className="relative h-52 bg-gradient-to-br from-[#13131e] to-[#1a1a28] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain p-5 transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07070c]/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="bg-[#07070c]/70 backdrop-blur-sm text-[#c4a84f] text-[10px] font-black tracking-widest uppercase px-4 py-2 rounded-sm border border-[#c4a84f]/30">
            View Details
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-[9px] tracking-[0.25em] uppercase text-[#c4a84f]/60 font-bold capitalize mb-1">{product.sport}</p>
        <h3 className="text-white font-bold text-sm leading-snug mb-1.5 group-hover:text-[#f0d080] transition-colors line-clamp-1">
          {product.name}
        </h3>
        <p className="text-white/35 text-xs leading-relaxed mb-2 line-clamp-2">{product.description}</p>

        {/* Sale countdown badge */}
        {product.saleEndTime && (
          <div className="mb-2">
            <SaleCountdown endTime={product.saleEndTime} variant="badge" />
          </div>
        )}

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={`text-[11px] ${i < Math.floor(product.rating) ? 'text-[#c4a84f]' : 'text-white/15'}`}>★</span>
            ))}
          </div>
          <span className="text-[10px] text-white/35">{product.rating} ({product.reviews})</span>
        </div>

        {/* Price + Details */}
        <div className="flex items-end justify-between gap-2">
          <div>
            <div className="text-[9px] text-white/30 uppercase tracking-widest mb-1">Guide Price</div>
            <div className="text-lg font-black text-gold-gradient leading-none">
              ${product.price.toLocaleString()}
            </div>
            {product.originalPrice && (
              <div className="text-[11px] text-white/25 line-through mt-0.5">
                ${product.originalPrice.toLocaleString()}
              </div>
            )}
          </div>
          <span className="btn-gold inline-flex items-center gap-1.5 px-3 py-2 rounded-sm text-[11px] font-black tracking-wider uppercase flex-shrink-0">
            Details
            <Icon name="arrow-right" size="xs" />
          </span>
        </div>
      </div>
    </Link>
  );
}
