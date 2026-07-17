import { useParams, Link, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { categoryGroups, sports } from '../data/sports';
import type { Sport } from '../data/sports';
import type { Catalogue } from '../data/catalogues';
import CatalogueCard from '../components/CatalogueCard';
import { getCatalogues, getCategories } from '../lib/api';

const CONTAINER = 'max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-16';

export default function CategoryGroupPage() {
  const { id } = useParams<{ id: string }>();
  const [categories, setCategories] = useState<Sport[]>(sports);
  const [categoryLoading, setCategoryLoading] = useState(true);
  
  const group = categoryGroups.find((g) => g.id === id);
  const [relatedCatalogues, setRelatedCatalogues] = useState<Catalogue[]>([]);
  const [cataloguesLoading, setCataloguesLoading] = useState(true);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setCategories(sports))
      .finally(() => setCategoryLoading(false));
  }, []);

  useEffect(() => {
    if (!group) return;
    setCataloguesLoading(true);
    // Fetch catalogues specifically assigned to this group id
    getCatalogues(group.id)
      .then((cats) => {
          // If the getCatalogues logic also matches subcategories, we need to strictly filter to ONLY the group's catalogue here
          const groupCats = cats.filter(c => c.categoryIds.includes(group.id));
          setRelatedCatalogues(groupCats);
      })
      .catch(() => setRelatedCatalogues([]))
      .finally(() => setCataloguesLoading(false));
  }, [group]);

  if (!id || (!group && !categoryLoading)) return <Navigate to="/sports" replace />;
  if (!group) {
    return (
      <div className="min-h-screen bg-[#07070c] pt-20 flex items-center justify-center">
        <div className="text-white/25 text-sm">Loading category division...</div>
      </div>
    );
  }

  const groupCategories = group.categoryIds
    .map(catId => categories.find(c => c.id === catId))
    .filter((c): c is Sport => Boolean(c));

  return (
    <div className="min-h-screen pt-28">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[rgba(196,168,79,0.1)] bg-[#07070c]">
        <div className="absolute inset-0 opacity-35">
          <img src="/category-heroes/t-shirts.webp" alt="" className="h-full w-full object-cover blur-[2px] scale-105 opacity-35" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#07070c] via-[#07070c]/78 to-[#07070c]/35" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07070c] via-transparent to-[#07070c]/70" />
        </div>

        <div className={`relative z-10 ${CONTAINER} py-16 sm:py-20`}>
          <div className="max-w-3xl">
            <p className="text-[10px] font-black uppercase tracking-[0.36em] text-[#c4a84f]">Division</p>
            <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-black leading-tight text-white">
              {group.name} <span className="text-gold-gradient">Collection</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/52">
              {group.description}
            </p>
          </div>
        </div>
      </section>

      {/* Catalogue */}
      {(cataloguesLoading || relatedCatalogues.length > 0) && (
        <section className="border-b border-white/8 bg-[#09090f] py-14">
          <div className={CONTAINER}>
            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.32em] text-[#c4a84f]">Buyer Resources</p>
                <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">
                  {group.name} <span className="text-gold-gradient">Catalogues</span>
                </h2>
              </div>
            </div>

            {cataloguesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {[...Array(1)].map((_, i) => (
                  <div key={i} className="glass-card h-72 rounded-xl animate-pulse border border-white/5" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {relatedCatalogues.map((catalogue, index) => (
                  <CatalogueCard key={catalogue.id} catalogue={catalogue} delay={index * 70} compact />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Child Categories */}
      <section className="py-16">
        <div className={CONTAINER}>
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-black text-white">Explore {group.name}</h2>
            <p className="text-white/45 mt-2">{group.tagline}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {groupCategories.map((sport) => (
              <Link
                key={sport.id}
                to={`/sport/${sport.slug}`}
                className="group relative flex h-64 flex-col justify-end overflow-hidden rounded-xl border border-white/10 bg-[#09090f] transition-all hover:border-[#c4a84f]/40 hover:-translate-y-1"
              >
                <div className="absolute inset-0 opacity-40 transition-opacity duration-500 group-hover:opacity-80">
                  <img
                    src={sport.heroImage}
                    alt={sport.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07070c] via-[#07070c]/50 to-transparent" />
                </div>
                
                <div className="relative z-10 p-6">
                  <h3 className="text-2xl font-black text-white group-hover:text-[#c4a84f] transition-colors">{sport.name}</h3>
                  <p className="mt-2 text-sm text-white/60 line-clamp-2">{sport.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
