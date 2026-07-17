import { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import Icon from '../components/Icon';
import { sports, type Product, type Sport } from '../data/sports';
import ProductCard from '../components/ProductCard';
import { getCategories, getProduct, getProducts } from '../lib/api';
import SaleCountdown from '../components/SaleCountdown';

const CONTAINER = 'max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-16';

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null | undefined>(undefined);
  const [categories, setCategories] = useState<Sport[]>(sports);
  const [activeImage, setActiveImage] = useState('');
  const [related, setRelated] = useState<Product[]>([]);

  useEffect(() => {
    getCategories().then(setCategories).catch(() => setCategories(sports));
  }, []);

  useEffect(() => {
    if (!id) return;
    getProduct(id)
      .then(setProduct)
      .catch(() => setProduct(null));
  }, [id]);

  useEffect(() => {
    if (product) setActiveImage(product.image);
  }, [product]);

  useEffect(() => {
    if (!product) return;
    getProducts({ sport: product.sport, excludeId: product.id, limit: 4 })
      .then(setRelated)
      .catch(() => setRelated([]));
  }, [product]);

  if (product === undefined) {
    return (
      <div className="min-h-screen bg-[#07070c] pt-20 flex items-center justify-center">
        <div className="text-white/20 text-sm">Loading…</div>
      </div>
    );
  }

  if (!product) return <Navigate to="/sports" replace />;

  const sport = categories.find((s) => s.id === product.sport);
  const galleryImages = [product.image, ...(product.galleryImages ?? [])].filter(Boolean);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-[#07070c] pt-20">
      <div className={`${CONTAINER} py-10`}>
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-[11px] text-white/25 mb-8 flex-wrap">
          <Link to="/" className="hover:text-[#c4a84f] transition-colors">Home</Link>
          <Icon name="arrow-right" size="xs" />
          <Link to="/sports" className="hover:text-[#c4a84f] transition-colors">All Categories</Link>
          <Icon name="arrow-right" size="xs" />
          {sport && (
            <>
              <Link to={`/sport/${sport.slug}`} className="hover:text-[#c4a84f] transition-colors capitalize">{sport.name}</Link>
              <Icon name="arrow-right" size="xs" />
            </>
          )}
          <span className="text-[#c4a84f] truncate max-w-[200px]">{product.name}</span>
        </div>

        {/* Product Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Image Panel */}
          <div className="relative">
            <div className="glass-card rounded-2xl overflow-hidden border border-white/8 aspect-square flex items-center justify-center bg-gradient-to-br from-[#13131e] to-[#1a1a28]">
              {product.badge && (
                <div className="absolute top-5 left-5 z-10">
                  <span className="px-3 py-1.5 text-[10px] font-black tracking-widest uppercase bg-[#c4a84f] text-[#07070c] rounded-sm">
                    {product.badge}
                  </span>
                </div>
              )}
              {discount > 0 && (
                <div className="absolute top-5 right-5 z-10">
                  <span className="px-3 py-1.5 text-[10px] font-black bg-red-500/90 text-white rounded-sm">
                    -{discount}% OFF
                  </span>
                </div>
              )}
              <img
                src={activeImage || product.image}
                alt={product.name}
                className="w-3/4 h-3/4 object-contain animate-fade-up"
              />
            </div>

            {galleryImages.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 mt-4">
                {galleryImages.map((image) => (
                  <button
                    key={image}
                    type="button"
                    onClick={() => setActiveImage(image)}
                    className={`aspect-square rounded-lg border bg-[#10101a] p-2 transition-all ${
                      activeImage === image
                        ? 'border-[#c4a84f] shadow-[0_0_18px_rgba(196,168,79,0.25)]'
                        : 'border-white/10 hover:border-[#c4a84f]/45'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} view`}
                      className="h-full w-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* SKU / stock */}
            {product.sku && (
              <div className="flex items-center justify-between mt-4 text-[11px] text-white/25 px-1">
                <span>SKU: {product.sku}</span>
                {product.inStock !== false && (
                  <span className="flex items-center gap-1 text-green-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                    In Stock
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Info Panel */}
          <ProductInfo product={product} sport={sport} discount={discount} />
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="border-t border-[rgba(196,168,79,0.1)] pt-14">
            <div className="flex items-center justify-between mb-7">
              <h3 className="text-xl sm:text-2xl font-black text-white">
                More <span className="text-gold-gradient">{sport?.name}</span> Products
              </h3>
              {sport && (
                <Link
                  to={`/sport/${sport.slug}`}
                  className="flex items-center gap-1.5 text-xs text-white/35 hover:text-[#c4a84f] transition-colors"
                >
                  View all <Icon name="arrow-right" size="xs" />
                </Link>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} delay={i * 70} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ProductInfo({ product, sport, discount }: { product: Product; sport: Sport | undefined; discount: number }) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] ?? null);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] ?? null);

  const handleAdd = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="flex flex-col justify-center animate-fade-up-d1">
      {sport && (
        <Link
          to={`/sport/${sport.slug}`}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[rgba(196,168,79,0.3)] bg-[rgba(196,168,79,0.08)] mb-5 w-fit hover:bg-[rgba(196,168,79,0.15)] transition-colors"
        >
          <span className="text-[10px] font-black tracking-[0.25em] uppercase text-[#c4a84f]">
            {sport.name} Collection
          </span>
        </Link>
      )}

      <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-3">
        {product.name}
      </h1>

      {/* Rating */}
      <div className="flex items-center gap-2.5 mb-5">
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <span key={i} className={`text-sm ${i < Math.floor(product.rating) ? 'text-[#c4a84f]' : 'text-white/15'}`}>★</span>
          ))}
        </div>
        <span className="text-sm text-white font-bold">{product.rating}</span>
        <span className="text-sm text-white/35">({product.reviews} reviews)</span>
      </div>

      {/* Description */}
      <p className="text-white/60 text-sm leading-relaxed mb-2">{product.description}</p>
      {product.longDescription && (
        <p className="text-white/40 text-sm leading-relaxed mb-6">{product.longDescription}</p>
      )}

      {/* Price */}
      <div className="flex items-end gap-3 mb-6">
        <span className="text-4xl font-black text-gold-gradient">${product.price.toLocaleString()}</span>
        {product.originalPrice && (
          <div className="flex flex-col pb-1">
            <span className="text-white/30 text-sm line-through">${product.originalPrice.toLocaleString()}</span>
            {discount > 0 && (
              <span className="text-green-400 text-xs font-bold">Save ${(product.originalPrice - product.price).toLocaleString()}</span>
            )}
          </div>
        )}
      </div>

      {/* Sale countdown */}
      {product.saleEndTime && (
        <SaleCountdown endTime={product.saleEndTime} variant="full" />
      )}

      <div className="h-px bg-gradient-to-r from-[rgba(196,168,79,0.2)] to-transparent mb-6 mt-6" />

      {/* Color selector */}
      {product.colors && product.colors.length > 0 && (
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-2.5">
            <span className="text-[10px] tracking-widest uppercase text-white/30 font-bold">Color</span>
            {selectedColor && <span className="text-[11px] text-white/60">{selectedColor.label}</span>}
          </div>
          <div className="flex flex-wrap gap-2.5">
            {product.colors.map((color) => (
              <button
                key={color.label}
                title={color.label}
                onClick={() => setSelectedColor(color)}
                className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                  selectedColor?.label === color.label
                    ? 'border-[#c4a84f] scale-110 shadow-[0_0_10px_rgba(196,168,79,0.5)]'
                    : 'border-white/20 hover:border-white/50'
                }`}
                style={{ backgroundColor: color.hex }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Size selector */}
      {product.sizes && product.sizes.length > 0 && !(product.sizes.length === 1 && product.sizes[0] === 'One Size') && (
        <div className="mb-6">
          <span className="text-[10px] tracking-widest uppercase text-white/30 font-bold block mb-2.5">Size</span>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-3.5 py-2 text-[11px] font-bold tracking-wide rounded-sm border transition-all duration-200 ${
                  selectedSize === size
                    ? 'border-[#c4a84f] bg-[rgba(196,168,79,0.12)] text-[#c4a84f]'
                    : 'border-white/15 text-white/40 hover:border-white/35 hover:text-white/70'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity + quote */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <div className="flex items-center">
          <span className="text-[10px] tracking-widest uppercase text-white/30 mr-3">Qty</span>
          <button
            onClick={() => setQty(Math.max(1, qty - 1))}
            className="w-10 h-10 rounded-l border border-white/12 flex items-center justify-center text-white/50 hover:border-[#c4a84f] hover:text-[#c4a84f] transition-all text-lg"
          >
            −
          </button>
          <span className="w-12 h-10 border-y border-white/12 flex items-center justify-center text-white font-black text-sm">
            {qty}
          </span>
          <button
            onClick={() => setQty(qty + 1)}
            className="w-10 h-10 rounded-r border border-white/12 flex items-center justify-center text-white/50 hover:border-[#c4a84f] hover:text-[#c4a84f] transition-all text-lg"
          >
            +
          </button>
        </div>

        <button
          onClick={handleAdd}
          className={`flex-1 min-w-[180px] flex items-center justify-center gap-2 py-3.5 rounded-sm text-sm font-black tracking-wider uppercase transition-all duration-300 ${
            added
              ? 'bg-green-500/15 border-2 border-green-500/40 text-green-400'
              : 'btn-gold'
          }`}
        >
          {added ? <Icon name="check" size="sm" /> : <Icon name="arrow-right" size="sm" />}
          {added ? 'Quote Request Noted' : 'Request Quote'}
        </button>
      </div>

      {added && (
        <p className="text-[11px] text-[#c4a84f] mb-5">
          Share this product name, quantity, colors, sizes, and logo details with the QarniSports team for a custom quote.
        </p>
      )}

      {/* Features list */}
      {product.features && product.features.length > 0 && (
        <div className="mt-4 mb-5">
          <div className="h-px bg-gradient-to-r from-[rgba(196,168,79,0.15)] to-transparent mb-5" />
          <h4 className="text-[10px] tracking-[0.25em] uppercase text-white/30 font-bold mb-3">Key Features</h4>
          <ul className="space-y-2">
            {product.features.map((feat) => (
              <li key={feat} className="flex items-start gap-2.5 text-sm text-white/55">
                <span className="text-[#c4a84f] mt-0.5 flex-shrink-0">✓</span>
                {feat}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Trust badges */}
      <div className="grid grid-cols-3 gap-3 mt-3">
        {([
          ['shield', '100% Authentic'],
          ['refresh', '30-Day Returns'],
          ['truck', 'OEM ready'],
        ] as const).map(([icon, label]) => (
          <div key={label} className="flex flex-col items-center gap-1.5 p-3 glass-card rounded-lg border border-white/5 text-center">
            <span className="text-[#c4a84f]/60"><Icon name={icon} size="sm" /></span>
            <span className="text-[10px] text-white/35 leading-tight">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
