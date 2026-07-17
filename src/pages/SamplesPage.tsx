import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icon';
import type { Product } from '../data/sports';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../lib/api';

const CONTAINER = 'max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-16';

export default function SamplesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts({ featured: true, limit: 100 })
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-end overflow-hidden pt-20">
        <div className="absolute inset-0">
          <img
            src="/category-heroes/t-shirts.webp"
            alt="Samples & Retail"
            className="w-full h-full object-cover animate-hero-slide"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#07070c] via-[#07070c]/58 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07070c]/65 via-transparent to-transparent" />
        </div>

        <div className={`relative z-10 ${CONTAINER} pb-16 w-full`}>
          <div className="flex items-center gap-1.5 text-[11px] text-white/25 mb-7 animate-fade-up flex-wrap">
            <Link to="/" className="hover:text-[#c4a84f] transition-colors">Home</Link>
            <span className="text-white/15">/</span>
            <span className="text-white/60">Samples</span>
          </div>

          <div className="max-w-2xl animate-fade-up" style={{ animationDelay: '100ms' }}>
            <p className="text-[10px] tracking-[0.35em] uppercase text-[#c4a84f] font-black mb-4 flex items-center gap-2">
              <span className="w-6 h-px bg-[#c4a84f]/50"></span>
              Ready to Ship
            </p>
            <h1 className="text-5xl sm:text-7xl font-black text-white leading-[0.95] tracking-tight mb-5">
              Retail <span className="text-gold-gradient">Samples</span>
            </h1>
            <p className="text-sm sm:text-base text-white/45 leading-relaxed font-medium">
              Browse our selection of premium quality, ready-to-ship samples. 
              Experience our manufacturing quality firsthand before placing your bulk order.
            </p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-20 bg-[#07070c] relative z-10">
        <div className={CONTAINER}>
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-black text-white">Available Samples</h2>
              <span className="bg-[#c4a84f]/10 text-[#f0d080] text-[10px] font-black px-2.5 py-1 rounded-full border border-[#c4a84f]/20">
                {products.length} Items
              </span>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[4/5] bg-white/5 rounded-xl mb-4" />
                  <div className="h-4 bg-white/5 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-white/5 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <ProductCard key={product.id} product={product} delay={index * 50} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
              <Icon name="file" size="lg" className="mx-auto mb-4 text-white/20" />
              <p className="text-white/40 text-sm">No samples available at the moment.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
