import Icon from './Icon';
import type { Catalogue } from '../data/catalogues';

interface CatalogueCardProps {
  catalogue: Catalogue;
  delay?: number;
  compact?: boolean;
}

export function formatCatalogueSize(bytes?: number): string {
  if (!bytes || bytes <= 0) return 'Catalogue';
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(mb >= 10 ? 0 : 1)} MB`;
}

export function catalogueViewPath(catalogue: Catalogue): string {
  return `/catalogues/${encodeURIComponent(catalogue.id)}`;
}

function absoluteUrl(path: string): string {
  if (typeof window === 'undefined') return path;
  return new URL(path, window.location.origin).toString();
}

export default function CatalogueCard({ catalogue, delay = 0, compact = false }: CatalogueCardProps) {
  const viewPath = catalogueViewPath(catalogue);
  const shareUrl = absoluteUrl(viewPath);
  const shareText = `View QarniSports catalogue: ${catalogue.title} ${shareUrl}`;
  const mediaLabel = catalogue.mediaType === 'images'
    ? `${catalogue.imageUrls.length || 1} Images`
    : formatCatalogueSize(catalogue.fileSize);

  const shareCatalogue = async () => {
    const title = `${catalogue.title} ${catalogue.year}`;
    const text = `View QarniSports catalogue: ${catalogue.title}`;

    if (navigator.share) {
      await navigator.share({ title, text, url: shareUrl });
      return;
    }

    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <article
      className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-white/8 bg-[#0b0b13] shadow-[0_20px_70px_rgba(0,0,0,0.24)] transition-all hover:-translate-y-1 hover:border-[#c4a84f]/35"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[#05050a]">
        <img
          src={catalogue.coverImage}
          alt={catalogue.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07070c]/88 via-[#07070c]/18 to-transparent" />
        <div className="absolute left-4 top-4 rounded-full border border-[#c4a84f]/30 bg-[#07070c]/72 px-3 py-1 text-[9px] font-black uppercase tracking-[0.16em] text-[#f0d080] backdrop-blur">
          {catalogue.mediaType === 'pdf' ? 'PDF' : 'Image Catalogue'}
        </div>
        <div className="absolute bottom-4 right-4 rounded-full border border-white/10 bg-black/45 px-3 py-1 text-[9px] font-black uppercase tracking-[0.14em] text-white/68">
          {mediaLabel}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#c4a84f]">
          {catalogue.category} / {catalogue.year}
        </p>
        <h3 className={`${compact ? 'text-xl' : 'text-2xl'} mt-3 font-black leading-tight text-white`}>
          {catalogue.title}
        </h3>
        <p className="mt-4 flex-1 text-sm leading-7 text-white/45">{catalogue.description}</p>

        <div className="mt-7 grid grid-cols-3 gap-2">
          <a
            href={viewPath}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold inline-flex items-center justify-center gap-2 rounded-sm px-4 py-3 text-[10px]"
          >
            View <Icon name="arrow-right" size="xs" />
          </a>
          <button
            type="button"
            onClick={() => void shareCatalogue()}
            className="inline-flex items-center justify-center gap-2 rounded-sm border border-white/12 px-4 py-3 text-[10px] font-black uppercase tracking-[0.12em] text-white/55 transition-all hover:border-[#c4a84f]/45 hover:text-[#f0d080]"
          >
            <Icon name="share" size="xs" /> Share
          </button>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-sm border border-[#25D366]/25 bg-[#25D366]/8 px-4 py-3 text-[10px] font-black uppercase tracking-[0.12em] text-[#8ff2b3] transition-all hover:bg-[#25D366]/14"
          >
            WhatsApp
          </a>
          {catalogue.fileUrl && (
            <a
              href={catalogue.fileUrl}
              download={catalogue.fileName}
              className="col-span-3 inline-flex items-center justify-center gap-2 rounded-sm border border-white/12 px-4 py-3 text-[10px] font-black uppercase tracking-[0.12em] text-white/55 transition-all hover:border-[#c4a84f]/45 hover:text-[#f0d080]"
            >
              <Icon name="download" size="xs" /> Download PDF
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
