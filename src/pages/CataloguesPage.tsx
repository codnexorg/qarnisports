import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import CatalogueCard from '../components/CatalogueCard';
import Icon from '../components/Icon';
import type { Catalogue } from '../data/catalogues';
import { catalogues as seedCatalogues } from '../data/catalogues';
import { getCatalogues } from '../lib/api';

const CONTAINER = 'max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-16';

export default function CataloguesPage() {
  const [catalogues, setCatalogues] = useState<Catalogue[]>(seedCatalogues);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCatalogues()
      .then(setCatalogues)
      .catch(() => setCatalogues(seedCatalogues))
      .finally(() => setLoading(false));
  }, []);

  const sortedCatalogues = useMemo(
    () => [...catalogues].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || b.year - a.year),
    [catalogues],
  );

  return (
    <div className="min-h-screen pt-28">
      <section className="relative overflow-hidden border-b border-[rgba(196,168,79,0.1)] bg-[#07070c]">
        <div className="absolute inset-0 opacity-35">
          <img src="/category-heroes/t-shirts.webp" alt="" className="h-full w-full object-cover blur-[2px] scale-105 opacity-35" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#07070c] via-[#07070c]/78 to-[#07070c]/35" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07070c] via-transparent to-[#07070c]/70" />
        </div>

        <div className={`relative z-10 ${CONTAINER} py-16 sm:py-20`}>
          <div className="max-w-3xl">
            <p className="text-[10px] font-black uppercase tracking-[0.36em] text-[#c4a84f]">Buyer Resources</p>
            <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-black leading-tight text-white">
              QarniSports <span className="text-gold-gradient">Catalogues</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/52">
              View, download, or share our latest sportswear, uniform, apparel, and accessories catalogues with buyers,
              teams, and distributors.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/sports" className="btn-gold px-6 py-3 rounded-sm text-xs inline-flex items-center gap-2">
                View Categories <Icon name="arrow-right" size="xs" />
              </Link>
              <Link to="/services" className="btn-outline-gold px-6 py-3 rounded-sm text-xs inline-flex items-center gap-2">
                Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className={CONTAINER}>
          <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.32em] text-[#c4a84f]">Catalogue Library</p>
              <h2 className="mt-2 text-3xl font-black text-white">Digital Catalogues</h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-white/42">
              Each catalogue opens in a clean viewer and can be shared by WhatsApp or the browser share menu.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="glass-card h-72 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : sortedCatalogues.length === 0 ? (
            <div className="rounded-xl border border-white/8 bg-white/[0.025] px-6 py-16 text-center">
              <p className="text-white/45">No catalogues available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {sortedCatalogues.map((catalogue, index) => (
                <CatalogueCard key={catalogue.id} catalogue={catalogue} delay={index * 80} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
