import { useState, useEffect, useCallback, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { deleteCatalogue, deleteCategory, deleteProduct, getAdminSession, getCatalogues, getCategories, getProducts, loginAdmin, logoutAdmin, saveCategory, uploadCatalogue } from '../lib/api';
import type { CatalogueUploadInput } from '../lib/api';
import type { Product, Sport } from '../data/sports';
import type { Catalogue } from '../data/catalogues';
import ProductForm from '../components/ProductForm';
import SaleCountdown from '../components/SaleCountdown';

// ─── Lock Screen ────────────────────────────────────────────────────────────
function LockScreen({ onUnlock }: { onUnlock: () => void }) {
  const [pass, setPass] = useState('');
  const [show, setShow] = useState(false);
  const [shake, setShake] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const attempt = async () => {
    setLoading(true);
    setError('');
    try {
      await loginAdmin(pass);
      onUnlock();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Incorrect password. Please try again.');
      setShake(true);
      setTimeout(() => setShake(false), 600);
      setPass('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07070c] flex items-center justify-center px-4">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#c4a84f]/5 rounded-full blur-[120px] pointer-events-none" />
      </div>
      <div className={`relative bg-[#0d0d18] border border-[rgba(196,168,79,0.2)] rounded-2xl p-10 w-full max-w-md shadow-2xl transition-all ${shake ? 'animate-[shake_0.5s_ease]' : ''}`}>
        <style>{`@keyframes shake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-8px)} 40%,80%{transform:translateX(8px)} }`}</style>

        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-5 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#c4a84f] to-[#f0d080] flex items-center justify-center text-[#07070c] font-black text-lg">Q</div>
            <div className="text-left">
              <div className="text-base font-black tracking-widest text-white leading-none">
                QARNI<span className="text-gold-gradient">SPORTS</span>
              </div>
              <div className="text-[8px] tracking-[0.4em] uppercase text-white/25">Admin Panel</div>
            </div>
          </Link>
          {/* Lock icon */}
          <div className="w-16 h-16 rounded-2xl bg-[rgba(196,168,79,0.08)] border border-[rgba(196,168,79,0.2)] flex items-center justify-center mx-auto mb-4">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8 text-[#c4a84f]">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h1 className="text-xl font-black text-white mb-1">Admin Access</h1>
          <p className="text-white/30 text-sm">Enter your admin password to continue</p>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <input
              type={show ? 'text' : 'password'}
              value={pass}
              onChange={(e) => { setPass(e.target.value); setError(''); }}
              onKeyDown={(e) => e.key === 'Enter' && attempt()}
              placeholder="Admin password"
              className={`form-input pr-12 ${error ? 'border-red-500/50 bg-red-500/5' : ''}`}
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors text-xs"
            >
              {show ? 'Hide' : 'Show'}
            </button>
          </div>
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <button
            onClick={attempt}
            disabled={loading}
            className="w-full btn-gold py-3.5 rounded-lg text-sm font-black tracking-wider uppercase"
          >
            {loading ? 'Checking...' : 'Unlock Admin Panel'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Stat Card ───────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, color }: { label: string; value: number; icon: string; color: string }) {
  return (
    <div className="glass-card rounded-xl p-5 border border-white/5 hover:border-[rgba(196,168,79,0.15)] transition-all">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] tracking-widest uppercase text-white/25 font-bold">{label}</span>
        <span className="text-2xl" style={{ filter: 'drop-shadow(0 0 8px ' + color + ')' }}>{icon}</span>
      </div>
      <div className="text-3xl font-black" style={{ color }}>{value}</div>
    </div>
  );
}

// ─── Admin Product Card ───────────────────────────────────────────────────────
function AdminProductCard({
  product,
  onEdit,
  onDelete,
}: {
  product: Product;
  onEdit: (p: Product) => void;
  onDelete: (p: Product) => void;
}) {
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="glass-card rounded-xl overflow-hidden border border-white/5 hover:border-[rgba(196,168,79,0.2)] transition-all group">
      {/* Image */}
      <div className="relative h-40 bg-gradient-to-br from-[#13131e] to-[#1a1a28] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
        />
        {product.isFeatured && (
          <span className="absolute top-2 left-2 px-2 py-0.5 text-[8px] font-black tracking-widest uppercase bg-[#c4a84f] text-[#07070c] rounded-sm">
            Featured
          </span>
        )}
        {discount > 0 && (
          <span className="absolute top-2 right-2 px-2 py-0.5 text-[9px] font-black bg-red-500/90 text-white rounded-sm">
            -{discount}%
          </span>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-[#07070c]/70 flex items-center justify-center">
            <span className="text-[10px] font-black tracking-widest uppercase text-white/40 border border-white/15 px-3 py-1.5 rounded-sm">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <span className="text-[9px] tracking-[0.2em] uppercase text-[#c4a84f]/50 font-bold capitalize">{product.sport}</span>
        <h3 className="text-white font-bold text-sm mt-0.5 mb-1.5 line-clamp-1">{product.name}</h3>

        <div className="flex items-center gap-2 mb-2">
          <span className="text-base font-black text-[#c4a84f]">${product.price.toLocaleString()}</span>
          {product.originalPrice && (
            <span className="text-xs text-white/25 line-through">${product.originalPrice.toLocaleString()}</span>
          )}
        </div>

        {product.saleEndTime && <div className="mb-3"><SaleCountdown endTime={product.saleEndTime} variant="badge" /></div>}

        <div className="flex gap-2 mt-3">
          <button
            onClick={() => onEdit(product)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-sm border border-[rgba(196,168,79,0.3)] text-[#c4a84f] text-[10px] font-black tracking-wider uppercase hover:bg-[rgba(196,168,79,0.08)] transition-all"
          >
            <EditIcon /> Edit
          </button>
          <button
            onClick={() => onDelete(product)}
            className="flex items-center justify-center w-9 rounded-sm border border-red-500/20 text-red-400/60 hover:border-red-500/50 hover:text-red-400 hover:bg-red-500/8 transition-all"
          >
            <TrashIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Delete Confirm ──────────────────────────────────────────────────────────
function DeleteModal({ product, onCancel, onConfirm }: { product: Product; onCancel: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-[#0d0d18] border border-red-500/20 rounded-2xl p-8 w-full max-w-sm shadow-2xl text-center">
        <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
          <TrashIcon className="text-red-400 w-6 h-6" />
        </div>
        <h3 className="text-lg font-black text-white mb-2">Delete Product?</h3>
        <p className="text-white/40 text-sm mb-6">
          "{product.name}" will be permanently deleted. This cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-3 rounded-lg border border-white/12 text-white/50 text-xs font-black uppercase hover:border-white/25 transition-all">
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 py-3 rounded-lg bg-red-500/15 border border-red-500/40 text-red-400 text-xs font-black uppercase hover:bg-red-500/25 transition-all">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Dashboard ──────────────────────────────────────────────────────────
function CategoryManager({
  categories,
  productCounts,
  onSaved,
  onDeleted,
}: {
  categories: Sport[];
  productCounts: Record<string, number>;
  onSaved: (category: Sport) => Promise<void>;
  onDeleted: (category: Sport) => Promise<void>;
}) {
  const [editing, setEditing] = useState<Partial<Sport> | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const startNew = () => setEditing({
    name: '',
    slug: '',
    emoji: '*',
    heroImage: '/hero-main.webp',
    heroTagline: '',
    heroSubline: '',
    accentColor: '#c4a84f',
    accentColorRgb: '196,168,79',
    description: '',
    sortOrder: categories.length + 1,
  });

  const update = (key: keyof Sport, value: string | number) => {
    setEditing((current) => ({ ...(current ?? {}), [key]: value }));
  };

  const submit = async () => {
    if (!editing?.name?.trim()) {
      setError('Category name is required.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await onSaved(editing as Sport);
      setEditing(null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Category save failed.');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (category: Sport) => {
    setError('');
    try {
      await onDeleted(category);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Category delete failed.');
    }
  };

  return (
    <div className="glass-card rounded-xl p-5 border border-white/5 mb-8">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-lg font-black text-white">Category Management</h2>
          <p className="text-[11px] text-white/30 mt-0.5">Add, edit, or delete product categories shown on the storefront.</p>
        </div>
        <button onClick={startNew} className="btn-gold px-4 py-2 rounded-sm text-xs font-black uppercase">
          + Add Category
        </button>
      </div>

      {error && <div className="mb-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</div>}

      {editing && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 mb-5 border border-[rgba(196,168,79,0.12)] rounded-lg p-4 bg-black/15">
          <input className="form-input" placeholder="Name" value={editing.name ?? ''} onChange={(e) => update('name', e.target.value)} />
          <input className="form-input" placeholder="Slug" value={editing.slug ?? ''} onChange={(e) => update('slug', e.target.value)} />
          <input className="form-input" placeholder="Icon" value={editing.emoji ?? ''} onChange={(e) => update('emoji', e.target.value)} />
          <input className="form-input" type="number" placeholder="Sort" value={editing.sortOrder ?? 0} onChange={(e) => update('sortOrder', Number(e.target.value))} />
          <input className="form-input lg:col-span-2" placeholder="Hero image URL" value={editing.heroImage ?? ''} onChange={(e) => update('heroImage', e.target.value)} />
          <input className="form-input" placeholder="Accent hex" value={editing.accentColor ?? ''} onChange={(e) => update('accentColor', e.target.value)} />
          <input className="form-input" placeholder="Accent RGB" value={editing.accentColorRgb ?? ''} onChange={(e) => update('accentColorRgb', e.target.value)} />
          <input className="form-input lg:col-span-2" placeholder="Hero tagline" value={editing.heroTagline ?? ''} onChange={(e) => update('heroTagline', e.target.value)} />
          <input className="form-input lg:col-span-2" placeholder="Hero subline" value={editing.heroSubline ?? ''} onChange={(e) => update('heroSubline', e.target.value)} />
          <textarea className="form-input lg:col-span-4 min-h-[76px] resize-none" placeholder="Description" value={editing.description ?? ''} onChange={(e) => update('description', e.target.value)} />
          <div className="lg:col-span-4 flex justify-end gap-2">
            <button onClick={() => setEditing(null)} className="px-4 py-2 rounded-sm border border-white/12 text-white/50 text-xs font-black uppercase">Cancel</button>
            <button onClick={submit} disabled={saving} className="btn-gold px-5 py-2 rounded-sm text-xs font-black uppercase disabled:opacity-50">
              {saving ? 'Saving...' : 'Save Category'}
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {categories.map((category) => (
          <div key={category.id} className="flex items-center gap-3 rounded-lg border border-white/8 bg-white/[0.03] p-3">
            <div className="w-10 h-10 rounded-lg border border-white/10" style={{ backgroundColor: `${category.accentColor}55` }} />
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm truncate">{category.name}</p>
              <p className="text-white/30 text-[11px] truncate">{category.id} - {productCounts[category.id] ?? 0} products</p>
            </div>
            <button onClick={() => setEditing(category)} className="text-[#c4a84f] text-[10px] font-black uppercase border border-[#c4a84f]/30 px-2 py-1 rounded-sm">Edit</button>
            <button onClick={() => remove(category)} className="text-red-400/80 text-[10px] font-black uppercase border border-red-500/25 px-2 py-1 rounded-sm">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function formatCatalogueSize(bytes?: number): string {
  if (!bytes || bytes <= 0) return 'Catalogue';
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(mb >= 10 ? 0 : 1)} MB`;
}

function catalogueMediaLabel(catalogue: Catalogue): string {
  if (catalogue.mediaType === 'images') {
    return `${catalogue.imageUrls.length || 0} images`;
  }
  return `PDF ${formatCatalogueSize(catalogue.fileSize)}`;
}

function CatalogueManager({
  catalogues,
  categories,
  loading,
  onUploaded,
  onDeleted,
}: {
  catalogues: Catalogue[];
  categories: Sport[];
  loading: boolean;
  onUploaded: (input: CatalogueUploadInput) => Promise<void>;
  onDeleted: (catalogue: Catalogue) => Promise<void>;
}) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Sportswear Catalogue');
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [description, setDescription] = useState('');
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [mediaType, setMediaType] = useState<'pdf' | 'images'>('pdf');
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const sorted = [...catalogues].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || b.year - a.year);

  const reset = () => {
    setTitle('');
    setCategory('Sportswear Catalogue');
    setYear(String(new Date().getFullYear()));
    setDescription('');
    setSelectedCategoryIds([]);
    setMediaType('pdf');
    setCoverImage(null);
    setPdfFile(null);
    setImageFiles([]);
  };

  const categoryNameMap = categories.reduce<Record<string, string>>((acc, item) => {
    acc[item.id] = item.name;
    return acc;
  }, {});

  const selectedNames = selectedCategoryIds.map((id) => categoryNameMap[id] ?? id).join(', ');

  const toggleCategory = (id: string) => {
    setSelectedCategoryIds((current) => (
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    ));
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim()) {
      setError('Catalogue title is required.');
      return;
    }
    if (selectedCategoryIds.length === 0) {
      setError('Select at least one category/subcategory for this catalogue.');
      return;
    }
    if (!coverImage) {
      setError('Featured cover image is required.');
      return;
    }
    if (mediaType === 'pdf' && !pdfFile) {
      setError('Select a PDF catalogue file.');
      return;
    }
    if (mediaType === 'images' && imageFiles.length === 0) {
      setError('Select at least one catalogue image page.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await onUploaded({
        title: title.trim(),
        category: category.trim() || 'Catalogue',
        year: Number(year) || new Date().getFullYear(),
        description: description.trim(),
        categoryIds: selectedCategoryIds,
        mediaType,
        coverImage,
        pdfFile,
        imageFiles,
        sortOrder: catalogues.length + 1,
      });
      reset();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Catalogue upload failed.');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (catalogue: Catalogue) => {
    if (!window.confirm(`Delete "${catalogue.title}"?`)) return;
    setError('');
    try {
      await onDeleted(catalogue);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Catalogue delete failed.');
    }
  };

  return (
    <div className="glass-card rounded-xl p-5 border border-white/5 mb-8">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-lg font-black text-white">Catalogue Management</h2>
          <p className="text-[11px] text-white/30 mt-0.5">Upload PDF catalogues or ordered image catalogues and attach them to categories.</p>
        </div>
        <Link to="/catalogues" className="btn-outline-gold px-4 py-2 rounded-sm text-xs">
          View Page
        </Link>
      </div>

      {error && <div className="mb-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</div>}

      <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-6 gap-3 mb-5 border border-[rgba(196,168,79,0.12)] rounded-lg p-4 bg-black/15">
        <input className="form-input lg:col-span-2" placeholder="Catalogue title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input className="form-input lg:col-span-2" placeholder="Public label, e.g. Uniform Catalogue" value={category} onChange={(e) => setCategory(e.target.value)} />
        <input className="form-input" type="number" placeholder="Year" value={year} onChange={(e) => setYear(e.target.value)} />
        <div className="flex rounded-lg border border-white/10 bg-[#11111c] p-1">
          {(['pdf', 'images'] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setMediaType(type)}
              className={`flex-1 rounded-md px-3 py-2 text-[10px] font-black uppercase tracking-[0.12em] transition-all ${
                mediaType === type ? 'bg-[#c4a84f] text-[#07070c]' : 'text-white/40 hover:text-white/70'
              }`}
            >
              {type === 'pdf' ? 'PDF' : 'Images'}
            </button>
          ))}
        </div>

        <textarea
          className="form-input lg:col-span-6 min-h-[70px] resize-none"
          placeholder="Short description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="lg:col-span-6 rounded-lg border border-white/8 bg-white/[0.025] p-3">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#c4a84f]">Show in categories</p>
              <p className="mt-1 text-[11px] text-white/32">{selectedNames || 'Select all relevant categories/subcategories'}</p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedCategoryIds(selectedCategoryIds.length === categories.length ? [] : categories.map((item) => item.id))}
              className="rounded-sm border border-white/12 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-white/45 hover:border-[#c4a84f]/35 hover:text-[#f0d080]"
            >
              {selectedCategoryIds.length === categories.length ? 'Clear' : 'All'}
            </button>
          </div>
          <div className="grid max-h-48 grid-cols-1 gap-2 overflow-y-auto pr-1 sm:grid-cols-2 xl:grid-cols-4">
            {categories.map((item) => (
              <label key={item.id} className="flex cursor-pointer items-center gap-2 rounded-md border border-white/8 bg-black/18 px-3 py-2 text-xs text-white/48 transition-all hover:border-[#c4a84f]/25 hover:text-white/72">
                <input
                  type="checkbox"
                  checked={selectedCategoryIds.includes(item.id)}
                  onChange={() => toggleCategory(item.id)}
                  className="accent-[#c4a84f]"
                />
                <span className="truncate">{item.name}</span>
              </label>
            ))}
          </div>
        </div>

        <label className="form-input lg:col-span-2 cursor-pointer flex items-center text-white/45">
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={(e) => setCoverImage(e.target.files?.[0] ?? null)}
          />
          {coverImage ? `Cover: ${coverImage.name}` : 'Choose featured cover image'}
        </label>

        {mediaType === 'pdf' ? (
          <label className="form-input lg:col-span-3 cursor-pointer flex items-center text-white/45">
            <input
              type="file"
              accept="application/pdf,.pdf"
              className="hidden"
              onChange={(e) => setPdfFile(e.target.files?.[0] ?? null)}
            />
            {pdfFile ? `PDF: ${pdfFile.name}` : 'Choose PDF catalogue'}
          </label>
        ) : (
          <label className="form-input lg:col-span-3 cursor-pointer flex items-center text-white/45">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              multiple
              className="hidden"
              onChange={(e) => setImageFiles(Array.from(e.target.files ?? []))}
            />
            {imageFiles.length ? `${imageFiles.length} catalogue image pages selected` : 'Choose catalogue image pages'}
          </label>
        )}

        <button type="submit" disabled={saving} className="btn-gold rounded-sm px-4 py-3 text-xs font-black disabled:opacity-50">
          {saving ? 'Uploading...' : '+ Upload'}
        </button>

        {imageFiles.length > 0 && (
          <div className="lg:col-span-6 rounded-lg border border-white/8 bg-black/16 p-3">
            <p className="mb-2 text-[10px] font-black uppercase tracking-[0.16em] text-white/35">Image order</p>
            <div className="flex flex-wrap gap-2">
              {imageFiles.map((item, index) => (
                <span key={`${item.name}-${index}`} className="rounded-full border border-white/10 px-3 py-1 text-[10px] text-white/48">
                  {index + 1}. {item.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </form>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[...Array(3)].map((_, index) => <div key={index} className="h-32 rounded-lg border border-white/8 bg-white/[0.03] animate-pulse" />)}
        </div>
      ) : sorted.length === 0 ? (
        <div className="rounded-lg border border-white/8 bg-white/[0.03] px-4 py-8 text-center text-sm text-white/35">
          No catalogues uploaded yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {sorted.map((catalogue) => (
            <div key={catalogue.id} className="overflow-hidden rounded-lg border border-white/8 bg-white/[0.03]">
              <div className="relative aspect-[16/9] bg-black">
                <img src={catalogue.coverImage} alt={catalogue.title} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 rounded-full border border-[#c4a84f]/30 bg-black/50 px-3 py-1 text-[9px] font-black uppercase tracking-[0.14em] text-[#f0d080]">
                  {catalogueMediaLabel(catalogue)}
                </span>
              </div>
              <div className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#c4a84f]/70">{catalogue.category} / {catalogue.year}</p>
                  <h3 className="mt-1 text-sm font-black text-white line-clamp-2">{catalogue.title}</h3>
                </div>
              </div>
              <p className="mt-3 text-xs leading-5 text-white/35 line-clamp-2">{catalogue.description}</p>
              <p className="mt-2 text-[10px] leading-5 text-white/28 line-clamp-2">
                {(catalogue.categoryIds ?? []).map((id) => categoryNameMap[id] ?? id).join(', ') || 'No category selected'}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link to={`/catalogues/${catalogue.id}`} target="_blank" rel="noopener noreferrer" className="text-[#c4a84f] text-[10px] font-black uppercase border border-[#c4a84f]/30 px-2 py-1 rounded-sm">
                  View
                </Link>
                {catalogue.fileUrl && (
                  <a href={catalogue.fileUrl} download={catalogue.fileName} className="text-white/50 text-[10px] font-black uppercase border border-white/12 px-2 py-1 rounded-sm">
                    Download
                  </a>
                )}
                <button onClick={() => remove(catalogue)} className="ml-auto text-red-400/80 text-[10px] font-black uppercase border border-red-500/25 px-2 py-1 rounded-sm">
                  Delete
                </button>
              </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AdminDashboard({ onLogout }: { onLogout: () => void | Promise<void> }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Sport[]>([]);
  const [catalogues, setCatalogues] = useState<Catalogue[]>([]);
  const [cataloguesLoading, setCataloguesLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sportFilter, setSportFilter] = useState('all');
  const [formProduct, setFormProduct] = useState<Product | null | 'new'>( null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      setProducts(await getProducts());
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    getCatalogues()
      .then(setCatalogues)
      .catch(() => setCatalogues([]))
      .finally(() => setCataloguesLoading(false));
  }, []);

  const filtered = products.filter((p) => {
    if (sportFilter !== 'all' && p.sport !== sportFilter) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const stats = {
    total: products.length,
    onSale: products.filter((p) => p.originalPrice && p.originalPrice > p.price).length,
    featured: products.filter((p) => p.isFeatured).length,
    outOfStock: products.filter((p) => !p.inStock).length,
  };

  const handleSaved = (saved: Product) => {
    setProducts((prev) => {
      const idx = prev.findIndex((p) => p.id === saved.id);
      if (idx !== -1) {
        const next = [...prev];
        next[idx] = saved;
        return next;
      }
      return [saved, ...prev];
    });
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await deleteProduct(deleteTarget.id);
      setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      setDeleteTarget(null);
    } finally {
      setDeleteLoading(false);
    }
  };

  const sports = ['all', ...categories.map((category) => category.id)];
  const productCounts = products.reduce<Record<string, number>>((acc, product) => {
    acc[product.sport] = (acc[product.sport] ?? 0) + 1;
    return acc;
  }, {});

  const handleCategorySaved = async (category: Sport) => {
    const saved = await saveCategory(category);
    setCategories((prev) => {
      const idx = prev.findIndex((item) => item.id === saved.id);
      if (idx === -1) return [...prev, saved].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
      const next = [...prev];
      next[idx] = saved;
      return next.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    });
  };

  const handleCategoryDeleted = async (category: Sport) => {
    await deleteCategory(category.id);
    setCategories((prev) => prev.filter((item) => item.id !== category.id));
  };

  const handleCatalogueUploaded = async (input: CatalogueUploadInput) => {
    const saved = await uploadCatalogue(input);
    setCatalogues((prev) => [saved, ...prev].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)));
  };

  const handleCatalogueDeleted = async (catalogue: Catalogue) => {
    await deleteCatalogue(catalogue.id);
    setCatalogues((prev) => prev.filter((item) => item.id !== catalogue.id));
  };

  return (
    <div className="flex h-screen bg-[#07070c] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-[#0a0a14] border-r border-[rgba(196,168,79,0.1)] flex flex-col">
        {/* Logo */}
        <div className="px-6 py-6 border-b border-[rgba(196,168,79,0.08)]">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#c4a84f] to-[#f0d080] flex items-center justify-center text-[#07070c] font-black">Q</div>
            <div>
              <div className="text-sm font-black tracking-widest text-white leading-none">
                QARNI<span className="text-gold-gradient">SPORTS</span>
              </div>
              <div className="text-[8px] tracking-[0.4em] uppercase text-white/20 mt-0.5">Admin Panel</div>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-1">
          <NavItem icon="📦" label="All Products" active />
          <button
            onClick={() => setFormProduct('new')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold text-white/50 hover:text-white hover:bg-white/5 transition-all"
          >
            <span>➕</span> Add Product
          </button>
          <Link
            to="/catalogues"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold text-white/50 hover:text-white hover:bg-white/5 transition-all"
          >
            <span>PDF</span> Catalogues
          </Link>
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold text-white/50 hover:text-white hover:bg-white/5 transition-all"
          >
            <span>🏪</span> View Store
          </Link>
        </nav>

        {/* Stats summary */}
        <div className="px-4 py-4 border-t border-[rgba(196,168,79,0.08)]">
          <p className="text-[9px] tracking-widest uppercase text-white/20 mb-2 font-bold">Quick Stats</p>
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-white/35">Total Products</span>
              <span className="text-white font-bold">{stats.total}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-white/35">On Sale</span>
              <span className="text-green-400 font-bold">{stats.onSale}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-white/35">Featured</span>
              <span className="text-[#c4a84f] font-bold">{stats.featured}</span>
            </div>
          </div>
        </div>

        {/* Logout */}
        <div className="px-3 pb-5">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold text-white/30 hover:text-red-400 hover:bg-red-500/5 transition-all border border-transparent hover:border-red-500/15"
          >
            <span>🔓</span> Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-[#09090f]/95 backdrop-blur-sm border-b border-[rgba(196,168,79,0.08)] px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-white">Product Management</h1>
            <p className="text-[11px] text-white/30 mt-0.5">{filtered.length} of {products.length} products shown</p>
          </div>
          <button
            onClick={() => setFormProduct('new')}
            className="btn-gold px-5 py-2.5 rounded-sm text-xs font-black tracking-wider uppercase flex items-center gap-2"
          >
            <span className="text-base leading-none">+</span> Add Product
          </button>
        </div>

        <div className="p-8">
          <CategoryManager
            categories={categories}
            productCounts={productCounts}
            onSaved={handleCategorySaved}
            onDeleted={handleCategoryDeleted}
          />
          <CatalogueManager
            catalogues={catalogues}
            categories={categories}
            loading={cataloguesLoading}
            onUploaded={handleCatalogueUploaded}
            onDeleted={handleCatalogueDeleted}
          />
          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard label="Total Products" value={stats.total} icon="📦" color="#c4a84f" />
            <StatCard label="On Sale" value={stats.onSale} icon="🏷️" color="#4ade80" />
            <StatCard label="Featured" value={stats.featured} icon="⭐" color="#f59e0b" />
            <StatCard label="Out of Stock" value={stats.outOfStock} icon="⚠️" color="#f87171" />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products…"
              className="form-input max-w-xs"
            />
            <div className="flex flex-wrap gap-2">
              {sports.map((s) => (
                <button
                  key={s}
                  onClick={() => setSportFilter(s)}
                  className={`px-3 py-1.5 rounded-full text-[10px] font-black tracking-wider uppercase border transition-all ${
                    sportFilter === s
                      ? 'bg-[#c4a84f] border-[#c4a84f] text-[#07070c]'
                      : 'border-white/10 text-white/35 hover:border-[#c4a84f]/30 hover:text-white/60'
                  }`}
                >
                  {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Product grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="glass-card rounded-xl h-64 animate-pulse border border-white/5" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24">
              <div className="text-5xl mb-4 opacity-15">📦</div>
              <p className="text-white/35 text-sm">No products found</p>
              <button
                onClick={() => setFormProduct('new')}
                className="btn-gold mt-5 px-6 py-2.5 rounded-sm text-xs font-black tracking-wider uppercase"
              >
                Add First Product
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((p) => (
                <AdminProductCard
                  key={p.id}
                  product={p}
                  onEdit={setFormProduct}
                  onDelete={setDeleteTarget}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* ProductForm modal */}
      {formProduct !== null && (
        <ProductForm
          product={formProduct === 'new' ? null : formProduct}
          categories={categories}
          onClose={() => setFormProduct(null)}
          onSaved={handleSaved}
        />
      )}

      {/* Delete confirm */}
      {deleteTarget && (
        <DeleteModal
          product={deleteTarget}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
      {deleteLoading && (
        <div className="fixed inset-0 z-[1200] bg-black/40 flex items-center justify-center">
          <div className="text-white/60 text-sm">Deleting…</div>
        </div>
      )}
    </div>
  );
}

function NavItem({ icon, label, active = false }: { icon: string; label: string; active?: boolean }) {
  return (
    <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-all ${
      active ? 'bg-[rgba(196,168,79,0.1)] text-[#c4a84f] border border-[rgba(196,168,79,0.2)]' : 'text-white/50 hover:text-white hover:bg-white/5'
    }`}>
      <span>{icon}</span> {label}
    </div>
  );
}

function EditIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
      <path d="M13.586 3.586a2 2 0 1 1 2.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
    </svg>
  );
}

function TrashIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
  );
}

// ─── Page Export ─────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    getAdminSession()
      .then(setUnlocked)
      .catch(() => setUnlocked(false))
      .finally(() => setChecking(false));
  }, []);

  const logout = async () => {
    await logoutAdmin();
    setUnlocked(false);
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-[#07070c] flex items-center justify-center">
        <div className="text-white/35 text-sm">Checking admin session...</div>
      </div>
    );
  }

  if (!unlocked) return <LockScreen onUnlock={() => setUnlocked(true)} />;
  return <AdminDashboard onLogout={logout} />;
}
