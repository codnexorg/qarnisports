import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import Icon from '../components/Icon';
import { formatCatalogueSize } from '../components/CatalogueCard';
import type { Catalogue } from '../data/catalogues';
import { catalogues as seedCatalogues } from '../data/catalogues';
import { getCatalogues } from '../lib/api';

const CONTAINER = 'max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-16';

function absoluteUrl(path: string): string {
  if (typeof window === 'undefined') return path;
  return new URL(path, window.location.origin).toString();
}

export default function CatalogueDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [catalogues, setCatalogues] = useState<Catalogue[]>(seedCatalogues);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCatalogues()
      .then(setCatalogues)
      .catch(() => setCatalogues(seedCatalogues))
      .finally(() => setLoading(false));
  }, []);

  const catalogue = useMemo(
    () => catalogues.find((item) => item.id === id),
    [catalogues, id],
  );

  if (!id) return <Navigate to="/catalogues" replace />;

  if (loading) {
    return (
      <div className="min-h-screen pt-28">
        <div className={`${CONTAINER} py-20`}>
          <div className="glass-card h-[70vh] animate-pulse rounded-2xl border border-white/8" />
        </div>
      </div>
    );
  }

  if (!catalogue) return <Navigate to="/catalogues" replace />;

  const viewUrl = absoluteUrl(`/catalogues/${catalogue.id}`);
  const shareText = `View QarniSports catalogue: ${catalogue.title} ${viewUrl}`;
  const pages = catalogue.mediaType === 'images' ? catalogue.imageUrls : [];

  const shareCatalogue = async () => {
    if (navigator.share) {
      await navigator.share({
        title: `${catalogue.title} ${catalogue.year}`,
        text: `View QarniSports catalogue: ${catalogue.title}`,
        url: viewUrl,
      });
      return;
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen pt-28">
      <section className="relative overflow-hidden border-b border-white/8 bg-[#07070c]">
        <div className="absolute inset-0 opacity-40">
          <img src={catalogue.coverImage} alt="" className="h-full w-full scale-105 object-cover blur-[1px]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#07070c] via-[#07070c]/82 to-[#07070c]/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07070c] via-transparent to-[#07070c]/80" />
        </div>

        <div className={`relative z-10 ${CONTAINER} py-12 sm:py-16`}>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-5 flex items-center gap-2 text-[11px] text-white/28">
                <Link to="/" className="hover:text-[#f0d080]">Home</Link>
                <Icon name="arrow-right" size="xs" />
                <Link to="/catalogues" className="hover:text-[#f0d080]">Catalogues</Link>
                <Icon name="arrow-right" size="xs" />
                <span className="text-[#f0d080]">{catalogue.title}</span>
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.34em] text-[#c4a84f]">
                {catalogue.category} / {catalogue.year}
              </p>
              <h1 className="mt-4 text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
                {catalogue.title}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-white/52">{catalogue.description}</p>
            </div>

            <div className="grid min-w-[280px] grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => void shareCatalogue()}
                className="btn-gold inline-flex items-center justify-center gap-2 rounded-sm px-5 py-3 text-xs"
              >
                Share <Icon name="share" size="xs" />
              </button>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-sm border border-[#25D366]/30 bg-[#25D366]/10 px-5 py-3 text-xs font-black uppercase tracking-[0.12em] text-[#8ff2b3]"
              >
                WhatsApp
              </a>
              {catalogue.fileUrl && (
                <a
                  href={catalogue.fileUrl}
                  download={catalogue.fileName}
                  className="col-span-2 inline-flex items-center justify-center gap-2 rounded-sm border border-white/12 px-5 py-3 text-xs font-black uppercase tracking-[0.12em] text-white/58 hover:border-[#c4a84f]/45 hover:text-[#f0d080]"
                >
                  <Icon name="download" size="xs" /> Download PDF ({formatCatalogueSize(catalogue.fileSize)})
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-14">
        <div className={CONTAINER}>
          {catalogue.mediaType === 'pdf' && catalogue.fileUrl ? (
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b13] shadow-[0_30px_90px_rgba(0,0,0,0.35)]">
              <div className="flex items-center justify-between border-b border-white/8 px-4 py-3">
                <div className="flex items-center gap-3">
                  <Link 
                    to="/catalogues"
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-white/5 text-white/60 transition-colors hover:bg-white/10 hover:text-white" 
                    title="Close Catalogue Viewer"
                  >
                    <Icon name="close" size="xs" />
                  </Link>
                  <span className="text-[10px] font-black uppercase tracking-[0.22em] text-[#c4a84f]">PDF Viewer</span>
                </div>
                <a href={catalogue.fileUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] font-black uppercase tracking-[0.14em] text-white/45 hover:text-[#f0d080]">
                  Open Full Screen
                </a>
              </div>
              <iframe
                title={catalogue.title}
                src={catalogue.fileUrl}
                className="h-[78vh] min-h-[620px] w-full bg-white"
              />
            </div>
          ) : (
            <div className="space-y-5">
              {pages.length === 0 ? (
                <div className="rounded-2xl border border-white/8 bg-white/[0.025] px-6 py-16 text-center text-white/42">
                  No catalogue pages uploaded yet.
                </div>
              ) : (
                pages.map((page, index) => (
                  <figure key={`${page}-${index}`} className="overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b13] shadow-[0_25px_80px_rgba(0,0,0,0.28)]">
                    <div className="flex items-center justify-between border-b border-white/8 px-4 py-3">
                      <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#c4a84f]">Page {index + 1}</span>
                      <a href={page} target="_blank" rel="noopener noreferrer" className="text-[10px] font-black uppercase tracking-[0.14em] text-white/42 hover:text-[#f0d080]">Open Image</a>
                    </div>
                    <img src={page} alt={`${catalogue.title} page ${index + 1}`} className="w-full bg-white object-contain" />
                  </figure>
                ))
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
