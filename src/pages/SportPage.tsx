import { useParams, Link, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Icon from '../components/Icon';
import { sports, categoryGroups } from '../data/sports';
import type { Product, Sport } from '../data/sports';
import type { Catalogue } from '../data/catalogues';
import ProductCard from '../components/ProductCard';
import CatalogueCard from '../components/CatalogueCard';
import { getCatalogues, getCategories, getProducts } from '../lib/api';

const CONTAINER = 'max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-16';

export default function SportPage() {
  const { slug } = useParams<{ slug: string }>();
  const [categories, setCategories] = useState<Sport[]>(sports);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const sport = categories.find((s) => s.slug === slug);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [relatedCatalogues, setRelatedCatalogues] = useState<Catalogue[]>([]);
  const [cataloguesLoading, setCataloguesLoading] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setCategories(sports))
      .finally(() => setCategoryLoading(false));
  }, []);

  useEffect(() => {
    if (!sport) return;
    setLoading(true);
    getProducts({ sport: sport.id })
      .then(setAllProducts)
      .catch(() => setAllProducts([]))
      .finally(() => {
        setLoading(false);
      });
  }, [sport]);

  useEffect(() => {
    if (!sport) return;
    setCataloguesLoading(true);
    const parentGroup = categoryGroups.find(g => g.categoryIds.includes(sport.id));
    getCatalogues(sport.id, parentGroup?.id)
      .then(setRelatedCatalogues)
      .catch(() => setRelatedCatalogues([]))
      .finally(() => setCataloguesLoading(false));
  }, [sport]);

  if (!slug || (!sport && !categoryLoading)) return <Navigate to="/sports" replace />;
  if (!sport) {
    return (
      <div className="min-h-screen bg-[#07070c] pt-20 flex items-center justify-center">
        <div className="text-white/25 text-sm">Loading category...</div>
      </div>
    );
  }

  const isProductHero = sport.heroImage.includes('/product-');
  const isCategoryHero = sport.heroImage.includes('/category-');


  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-[75vh] flex items-end overflow-hidden pt-20">
        <div className="absolute inset-0">
          {isProductHero ? (
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-[#05050a] via-[#090910] to-[#13131e]" />
              <img
                src={sport.heroImage}
                alt={sport.name}
                className="absolute right-0 top-20 bottom-0 h-[calc(100%-5rem)] w-full lg:w-[58%] object-contain object-center p-8 sm:p-12 lg:p-16 opacity-90 animate-hero-slide"
              />
            </>
          ) : (
            <img
              src={sport.heroImage}
              alt={sport.name}
              className="w-full h-full object-cover animate-hero-slide"
            />
          )}
          <div className={`absolute inset-0 bg-gradient-to-r ${
            isCategoryHero ? 'from-[#07070c] via-[#07070c]/32 to-transparent' : 'from-[#07070c] via-[#07070c]/58 to-transparent'
          }`} />
          <div className={`absolute inset-0 bg-gradient-to-t ${
            isCategoryHero ? 'from-[#07070c]/20 via-transparent to-transparent' : 'from-[#07070c]/65 via-transparent to-transparent'
          }`} />
          <div
            className="absolute inset-0 opacity-20"
            style={{ background: `radial-gradient(ellipse at 70% 40%, rgba(${sport.accentColorRgb},0.45) 0%, transparent 60%)` }}
          />
        </div>

        <div className={`relative z-10 ${CONTAINER} pb-16 w-full`}>
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-[11px] text-white/25 mb-7 animate-fade-up flex-wrap">
            <Link to="/" className="hover:text-[#c4a84f] transition-colors">Home</Link>
            <Icon name="arrow-right" size="xs" />
            <Link to="/sports" className="hover:text-[#c4a84f] transition-colors">All Categories</Link>
            <Icon name="arrow-right" size="xs" />
            <span className="text-[#c4a84f]">{sport.name}</span>
          </div>

          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[rgba(196,168,79,0.3)] bg-[rgba(196,168,79,0.08)] mb-5 animate-fade-up"
          >
            <span className="text-[10px] font-black tracking-[0.25em] uppercase text-[#c4a84f]">
              {sport.name} Collection
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-none mb-3 animate-fade-up-d1">
            <span className="text-gold-gradient">{sport.name}</span>
          </h1>
          <div className="h-px w-16 bg-gradient-to-r from-[#c4a84f] to-transparent mb-4 animate-line" />
          <p className="text-base text-white/45 max-w-md mb-7 animate-fade-up-d2">{sport.heroSubline}</p>

          <div className="flex flex-wrap gap-3 animate-fade-up-d3">
            <div className="flex items-center gap-2.5 px-4 py-2.5 glass-card rounded-sm border border-white/5">
              <span className="text-[#c4a84f] font-black text-base">{allProducts.length}+</span>
              <span className="text-white/35 text-[10px] uppercase tracking-wider">Catalog Items</span>
            </div>
            <div className="flex items-center gap-2.5 px-4 py-2.5 glass-card rounded-sm border border-white/5">
              <span className="text-[#c4a84f] font-black text-base">OEM</span>
              <span className="text-white/35 text-[10px] uppercase tracking-wider">Custom Production</span>
            </div>
          </div>
        </div>
      </section>

      {/* Related Catalogues */}
      {(cataloguesLoading || relatedCatalogues.length > 0) && (
        <section className="border-b border-white/8 bg-[#09090f] py-14">
          <div className={CONTAINER}>
            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.32em] text-[#c4a84f]">Buyer Resources</p>
                <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">
                  {sport.name} <span className="text-gold-gradient">Catalogues</span>
                </h2>
              </div>
              <Link to="/catalogues" className="btn-outline-gold inline-flex items-center gap-2 rounded-sm px-5 py-2.5 text-[10px]">
                All Catalogues <Icon name="arrow-right" size="xs" />
              </Link>
            </div>

            {cataloguesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="glass-card h-72 rounded-xl animate-pulse border border-white/5" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {relatedCatalogues.slice(0, 3).map((catalogue, index) => (
                  <CatalogueCard key={catalogue.id} catalogue={catalogue} delay={index * 70} compact />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Catalog */}
      <section className="py-16">
        <div className={CONTAINER}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                {sport.name} <span className="text-gold-gradient">Catalog</span>
              </h2>
              <p className="text-white/35 text-sm mt-1">{allProducts.length} catalog items available</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {['All', 'New', 'Sale', 'Best Sellers'].map((f, i) => (
                <button
                  key={f}
                  className={`px-3.5 py-1.5 text-[10px] font-black tracking-wider uppercase border rounded-sm transition-all ${
                    i === 0
                      ? 'border-[#c4a84f] text-[#c4a84f] bg-[#c4a84f]/10'
                      : 'border-white/10 text-white/40 hover:border-[#c4a84f]/40 hover:text-white/70'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="glass-card rounded-xl h-64 animate-pulse border border-white/5" />
              ))}
            </div>
          ) : allProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {allProducts.map((product, i) => (
                <ProductCard key={product.id} product={product} delay={i * 70} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-white/35">Catalog items coming soon</p>
            </div>
          )}
        </div>
      </section>

      {/* Other Categories */}
      <section className="py-14 bg-[#09090f]">
        <div className={CONTAINER}>
          <h3 className="text-lg font-black text-white mb-5">
            Explore Other <span className="text-gold-gradient">Categories</span>
          </h3>
          <div className="flex flex-wrap gap-3">
            {categories
              .filter((s) => s.id !== sport.id)
              .map((s) => (
                <Link
                  key={s.id}
                  to={`/sport/${s.slug}`}
                  className="flex items-center gap-2 px-4 py-2.5 glass-card rounded-lg border border-white/5 hover:border-[#c4a84f]/25 transition-all hover:bg-[#c4a84f]/5 group"
                >
                  <span className="text-sm font-bold text-white/50 group-hover:text-white transition-colors">{s.name}</span>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
}
