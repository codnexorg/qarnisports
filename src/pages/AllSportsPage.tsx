import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoryGroups, sports } from '../data/sports';
import type { Product, Sport } from '../data/sports';
import ProductCard from '../components/ProductCard';
import { getCategories, getProducts } from '../lib/api';

const CONTAINER = 'max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-16';

export default function AllSportsPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [categories, setCategories] = useState<Sport[]>(sports);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories().then(setCategories).catch(() => setCategories(sports));
    getProducts()
      .then(setAllProducts)
      .catch(() => setAllProducts([]))
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filtered = activeFilter === 'all' ? allProducts : allProducts.filter((p) => p.sport === activeFilter);
  const groupedCategories = categoryGroups.map((group) => ({
    ...group,
    categories: group.categoryIds
      .map((id) => categories.find((category) => category.id === id))
      .filter((category): category is Sport => Boolean(category)),
  }));

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className={CONTAINER}>
        {/* Header */}
        <div className="py-12 text-center">
          <p className="text-[10px] tracking-[0.35em] uppercase text-[#c4a84f] font-black mb-2 animate-fade-up">
            Product Capabilities
          </p>
          <h1 className="text-3xl sm:text-5xl font-black text-white animate-fade-up-d1">
            Categories & <span className="text-gold-gradient">Subcategories</span>
          </h1>
          <div className="w-12 h-px bg-gradient-to-r from-transparent via-[#c4a84f] to-transparent mx-auto mt-4 animate-line" />
          <p className="text-white/35 mt-3 text-sm animate-fade-up-d2">
            {categories.length} manufacturing categories across {categoryGroups.length} divisions
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-full text-[10px] font-black tracking-wider uppercase transition-all border ${
              activeFilter === 'all'
                ? 'bg-[#c4a84f] border-[#c4a84f] text-[#07070c] shadow-[0_0_20px_rgba(196,168,79,0.3)]'
                : 'border-white/12 text-white/45 hover:border-[#c4a84f]/40 hover:text-white/70'
            }`}
          >
            All ({allProducts.length})
          </button>
          {categories.map((sport) => {
            const cnt = allProducts.filter((p) => p.sport === sport.id).length;
            return (
              <button
                key={sport.id}
                onClick={() => setActiveFilter(sport.id)}
                className={`px-4 py-2 rounded-full text-[10px] font-black tracking-wider uppercase transition-all border ${
                  activeFilter === sport.id
                    ? 'bg-[#c4a84f] border-[#c4a84f] text-[#07070c] shadow-[0_0_20px_rgba(196,168,79,0.3)]'
                    : 'border-white/12 text-white/45 hover:border-[#c4a84f]/40 hover:text-white/70'
                }`}
              >
                {sport.name} {cnt > 0 && `(${cnt})`}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between mb-6">
          <p className="text-white/35 text-xs">
            Showing <span className="text-white font-bold">{filtered.length}</span> catalog items
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="glass-card rounded-xl h-64 animate-pulse border border-white/5" />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filtered.map((product, i) => (
              <ProductCard key={product.id} product={product} delay={i * 55} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-white/35 text-sm">No catalog items in this category yet</p>
            <button
              onClick={() => setActiveFilter('all')}
              className="mt-5 btn-outline-gold px-5 py-2.5 text-xs rounded-sm"
            >
              View All
            </button>
          </div>
        )}

        <div className="mt-20 pt-12 border-t border-[rgba(196,168,79,0.1)]">
          <h3 className="text-xl sm:text-2xl font-black text-white mb-7 text-center">
            Browse by <span className="text-gold-gradient">Division</span>
          </h3>
          <div className="space-y-12">
            {groupedCategories.map((group) => (
              <section key={group.id} id={group.id} className="scroll-mt-28">
                <div className="text-center max-w-2xl mx-auto mb-5">
                  <p className="text-[10px] uppercase tracking-[0.28em] text-[#c4a84f] font-black mb-1">{group.tagline}</p>
                  <h4 className="text-2xl font-black text-white">{group.name}</h4>
                  <p className="text-white/40 text-sm mt-2">{group.description}</p>
                </div>
                <div className="flex flex-wrap justify-center gap-3">
                  {group.categories.map((sport) => (
                    <Link
                      key={sport.id}
                      to={`/sport/${sport.slug}`}
                      className="sport-cat-card relative overflow-hidden rounded-xl group cursor-pointer w-[47%] sm:w-[170px]"
                      style={{ aspectRatio: '1' }}
                    >
                      <img
                        src={sport.heroImage}
                        alt={sport.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#07070c]/90 to-transparent" />
                      <div
                        className="cat-overlay absolute inset-0"
                        style={{ background: `linear-gradient(to top, rgba(${sport.accentColorRgb},0.6), transparent)` }}
                      />
                      <div className="absolute inset-x-0 bottom-0 p-3 z-10 text-center">
                        <div className="text-white font-black text-xs mt-0.5">{sport.name}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
