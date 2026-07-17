import { useState, useEffect } from 'react';
import type { Product, Sport } from '../data/sports';
import { saveProduct, uploadProductImage } from '../lib/api';


const EMPTY: Partial<Product> = {
  name: '', sport: '', price: 0, originalPrice: undefined,
  image: '/product-football.webp', galleryImages: [], badge: '', rating: 4.5, reviews: 0,
  description: '', longDescription: '', features: [], colors: [], sizes: [],
  sku: '', inStock: true, saleEndTime: undefined, isFeatured: false,
};

interface Props {
  product: Product | null;
  categories: Sport[];
  onClose: () => void;
  onSaved: (product: Product) => void;
}

function toLocalDatetime(iso?: string) {
  if (!iso) return '';
  const d = new Date(iso);
  const off = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - off).toISOString().slice(0, 16);
}

export default function ProductForm({ product, categories, onClose, onSaved }: Props) {
  const [form, setForm] = useState<Partial<Product>>(product ?? EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newFeature, setNewFeature] = useState('');
  const [newSize, setNewSize] = useState('');
  const [newColorLabel, setNewColorLabel] = useState('');
  const [newColorHex, setNewColorHex] = useState('#c4a84f');
  const [newGalleryImage, setNewGalleryImage] = useState('');
  const [uploadingFeatured, setUploadingFeatured] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  useEffect(() => {
    setForm(product ?? { ...EMPTY, sport: categories[0]?.id ?? '' });
    setError(null);
  }, [product, categories]);

  const set = (key: keyof Product, value: unknown) =>
    setForm((f) => ({ ...f, [key]: value }));

  const addFeature = () => {
    const t = newFeature.trim();
    if (!t) return;
    set('features', [...(form.features ?? []), t]);
    setNewFeature('');
  };
  const removeFeature = (i: number) =>
    set('features', (form.features ?? []).filter((_, idx) => idx !== i));

  const addSize = () => {
    const t = newSize.trim();
    if (!t) return;
    set('sizes', [...(form.sizes ?? []), t]);
    setNewSize('');
  };
  const removeSize = (i: number) =>
    set('sizes', (form.sizes ?? []).filter((_, idx) => idx !== i));

  const addColor = () => {
    const label = newColorLabel.trim();
    if (!label) return;
    set('colors', [...(form.colors ?? []), { label, hex: newColorHex }]);
    setNewColorLabel('');
    setNewColorHex('#c4a84f');
  };
  const removeColor = (i: number) =>
    set('colors', (form.colors ?? []).filter((_, idx) => idx !== i));
  const addGalleryImage = () => {
    const t = newGalleryImage.trim();
    if (!t) return;
    set('galleryImages', [...(form.galleryImages ?? []), t]);
    setNewGalleryImage('');
  };
  const removeGalleryImage = (i: number) =>
    set('galleryImages', (form.galleryImages ?? []).filter((_, idx) => idx !== i));

  const uploadFeaturedImage = async (file: File | undefined) => {
    if (!file) return;
    setUploadingFeatured(true);
    setError(null);
    try {
      const url = await uploadProductImage(file);
      set('image', url);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Featured image upload failed.');
    } finally {
      setUploadingFeatured(false);
    }
  };

  const uploadGalleryImages = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadingGallery(true);
    setError(null);
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        urls.push(await uploadProductImage(file));
      }
      set('galleryImages', [...(form.galleryImages ?? []), ...urls]);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Gallery image upload failed.');
    } finally {
      setUploadingGallery(false);
    }
  };

  const handleSave = async () => {
    if (!form.name?.trim() || !form.sport || !form.price) {
      setError('Name, sport, and price are required.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const saved = await saveProduct(product ? { ...form, id: product.id } : form);
      onSaved(saved);
      onClose();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Slide-over panel */}
      <div className="relative ml-auto w-full max-w-2xl bg-[#0d0d18] border-l border-[rgba(196,168,79,0.15)] flex flex-col h-full overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-[rgba(196,168,79,0.12)] flex-shrink-0 bg-[#0d0d18]">
          <div>
            <h2 className="text-lg font-black text-white">
              {product ? 'Edit Product' : 'Add New Product'}
            </h2>
            <p className="text-[11px] text-white/30 mt-0.5">
              {product ? `Editing: ${product.name}` : 'Fill in all product details below'}
            </p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:border-[#c4a84f]/40 hover:text-[#c4a84f] transition-all text-lg">
            ×
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-7 py-6 space-y-7">

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Basic Info */}
          <Section title="Basic Information">
            <Field label="Product Name *">
              <input
                className="form-input"
                value={form.name ?? ''}
                onChange={(e) => set('name', e.target.value)}
                placeholder="e.g. Pro Strike Football"
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Sport *">
                <select className="form-input" value={form.sport ?? categories[0]?.id ?? ''} onChange={(e) => set('sport', e.target.value)}>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </Field>
              <Field label="Badge">
                <input
                  className="form-input"
                  value={form.badge ?? ''}
                  onChange={(e) => set('badge', e.target.value)}
                  placeholder="Best Seller, New Arrival…"
                />
              </Field>
            </div>
            <Field label="Short Description *">
              <input
                className="form-input"
                value={form.description ?? ''}
                onChange={(e) => set('description', e.target.value)}
                placeholder="One-line product summary"
              />
            </Field>
            <Field label="Full Description">
              <textarea
                className="form-input min-h-[90px] resize-none"
                value={form.longDescription ?? ''}
                onChange={(e) => set('longDescription', e.target.value)}
                placeholder="Detailed description of materials, technology, and benefits…"
              />
            </Field>
            <Field label="SKU">
              <input
                className="form-input"
                value={form.sku ?? ''}
                onChange={(e) => set('sku', e.target.value)}
                placeholder="e.g. FB-PRO-001"
              />
            </Field>
          </Section>

          {/* Media */}
          <Section title="Product Images">
            <Field label="Featured Image URL">
              <input
                className="form-input"
                value={form.image ?? ''}
                onChange={(e) => set('image', e.target.value)}
                placeholder="/product-football.webp or https://..."
              />
              <label className="mt-2 inline-flex cursor-pointer items-center justify-center rounded-sm border border-[rgba(196,168,79,0.35)] px-4 py-2 text-[11px] font-black uppercase tracking-wider text-[#c4a84f] transition-all hover:bg-[rgba(196,168,79,0.08)]">
                {uploadingFeatured ? 'Uploading...' : 'Upload Featured Image'}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  disabled={uploadingFeatured}
                  onChange={(e) => {
                    void uploadFeaturedImage(e.target.files?.[0]);
                    e.currentTarget.value = '';
                  }}
                />
              </label>
            </Field>
            {form.image && (
              <div className="mt-2 w-28 h-28 rounded-lg overflow-hidden border border-white/10 bg-[#13131e] flex items-center justify-center">
                <img src={form.image} alt="Preview" className="w-full h-full object-contain p-2" />
              </div>
            )}
            <Field label="Detail Gallery Images">
              <div className="grid grid-cols-2 gap-2 mb-3">
                {(form.galleryImages ?? []).map((img, i) => (
                  <div key={`${img}-${i}`} className="relative h-24 rounded-lg overflow-hidden border border-white/10 bg-[#13131e]">
                    <img src={img} alt="Gallery preview" className="w-full h-full object-contain p-2" />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(i)}
                      className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500/80 text-white text-xs"
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  className="form-input flex-1"
                  value={newGalleryImage}
                  onChange={(e) => setNewGalleryImage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addGalleryImage()}
                  placeholder="/product-detail-2.webp or https://..."
                />
                <button type="button" onClick={addGalleryImage} className="btn-gold px-4 py-2 rounded-sm text-xs font-black flex-shrink-0">
                  + Add
                </button>
              </div>
              <label className="mt-2 inline-flex cursor-pointer items-center justify-center rounded-sm border border-[rgba(196,168,79,0.35)] px-4 py-2 text-[11px] font-black uppercase tracking-wider text-[#c4a84f] transition-all hover:bg-[rgba(196,168,79,0.08)]">
                {uploadingGallery ? 'Uploading...' : 'Upload Gallery Images'}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  multiple
                  className="hidden"
                  disabled={uploadingGallery}
                  onChange={(e) => {
                    void uploadGalleryImages(e.target.files);
                    e.currentTarget.value = '';
                  }}
                />
              </label>
            </Field>
          </Section>

          {/* Pricing */}
          <Section title="Pricing & Sale">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Sale Price (USD) *">
                <input
                  type="number"
                  className="form-input"
                  value={form.price ?? ''}
                  onChange={(e) => set('price', Number(e.target.value))}
                  placeholder="4999"
                />
              </Field>
              <Field label="Original Price (USD)">
                <input
                  type="number"
                  className="form-input"
                  value={form.originalPrice ?? ''}
                  onChange={(e) => set('originalPrice', e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="Leave blank if no discount"
                />
              </Field>
            </div>
            {form.originalPrice && form.price && form.originalPrice > form.price && (
              <p className="text-green-400 text-xs mt-1">
                Discount: {Math.round(((form.originalPrice - form.price) / form.originalPrice) * 100)}% off - Save ${(form.originalPrice - form.price).toLocaleString()}
              </p>
            )}
            <Field label="Sale End Time (Countdown Timer)">
              <input
                type="datetime-local"
                className="form-input"
                value={toLocalDatetime(form.saleEndTime)}
                onChange={(e) => set('saleEndTime', e.target.value ? new Date(e.target.value).toISOString() : undefined)}
              />
              <p className="text-white/25 text-[10px] mt-1">
                Set a date/time to show a live countdown on the product page and card.
              </p>
            </Field>
          </Section>

          {/* Inventory & Stats */}
          <Section title="Inventory & Display">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Rating (1–5)">
                <input
                  type="number"
                  className="form-input"
                  value={form.rating ?? 4.5}
                  min={1} max={5} step={0.1}
                  onChange={(e) => set('rating', Number(e.target.value))}
                />
              </Field>
              <Field label="Review Count">
                <input
                  type="number"
                  className="form-input"
                  value={form.reviews ?? 0}
                  onChange={(e) => set('reviews', Number(e.target.value))}
                />
              </Field>
            </div>
            <div className="flex gap-5 mt-1">
              <ToggleField
                label="In Stock"
                checked={form.inStock ?? true}
                onChange={(v) => set('inStock', v)}
              />
              <ToggleField
                label="Featured on Homepage"
                checked={form.isFeatured ?? false}
                onChange={(v) => set('isFeatured', v)}
              />
            </div>
          </Section>

          {/* Colors */}
          <Section title="Available Colors">
            <div className="flex flex-wrap gap-2 mb-3">
              {(form.colors ?? []).map((c, i) => (
                <div key={i} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white/5 border border-white/10 rounded-full text-[11px] text-white/70">
                  <span className="w-3.5 h-3.5 rounded-full border border-white/20 flex-shrink-0" style={{ background: c.hex }} />
                  {c.label}
                  <button onClick={() => removeColor(i)} className="text-white/30 hover:text-red-400 ml-1 leading-none">×</button>
                </div>
              ))}
            </div>
            <div className="flex items-end gap-2">
              <Field label="Color Name" className="flex-1">
                <input
                  className="form-input"
                  value={newColorLabel}
                  onChange={(e) => setNewColorLabel(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addColor()}
                  placeholder="e.g. Navy Blue"
                />
              </Field>
              <div className="mb-0.5">
                <p className="text-[10px] text-white/30 mb-1.5 uppercase tracking-wider font-bold">Hex</p>
                <input
                  type="color"
                  value={newColorHex}
                  onChange={(e) => setNewColorHex(e.target.value)}
                  className="w-10 h-10 rounded border border-white/15 cursor-pointer bg-transparent p-0.5"
                />
              </div>
              <button onClick={addColor} className="btn-gold px-4 py-2.5 rounded-sm text-xs font-black mb-0.5">
                + Add
              </button>
            </div>
          </Section>

          {/* Sizes */}
          <Section title="Available Sizes">
            <div className="flex flex-wrap gap-2 mb-3">
              {(form.sizes ?? []).map((s, i) => (
                <div key={i} className="flex items-center gap-1 px-3 py-1.5 bg-white/5 border border-white/12 rounded-sm text-xs text-white/70 font-bold">
                  {s}
                  <button onClick={() => removeSize(i)} className="text-white/30 hover:text-red-400 ml-1 leading-none">×</button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                className="form-input flex-1"
                value={newSize}
                onChange={(e) => setNewSize(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addSize()}
                placeholder="e.g. M, L, XL, Size 5, UK 9…"
              />
              <button onClick={addSize} className="btn-gold px-4 py-2 rounded-sm text-xs font-black flex-shrink-0">
                + Add
              </button>
            </div>
          </Section>

          {/* Features */}
          <Section title="Key Features">
            <ul className="space-y-1.5 mb-3">
              {(form.features ?? []).map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-white/60">
                  <span className="text-[#c4a84f] mt-0.5 flex-shrink-0">✓</span>
                  <span className="flex-1">{f}</span>
                  <button onClick={() => removeFeature(i)} className="text-white/20 hover:text-red-400 flex-shrink-0 text-xs">×</button>
                </li>
              ))}
            </ul>
            <div className="flex gap-2">
              <input
                className="form-input flex-1"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addFeature()}
                placeholder="e.g. FIFA Quality Pro certified"
              />
              <button onClick={addFeature} className="btn-gold px-4 py-2 rounded-sm text-xs font-black flex-shrink-0">
                + Add
              </button>
            </div>
          </Section>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-7 py-5 border-t border-[rgba(196,168,79,0.12)] flex-shrink-0 bg-[#0d0d18]">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-sm border border-white/12 text-white/50 text-xs font-black tracking-wider uppercase hover:border-white/25 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-gold px-8 py-3 rounded-sm text-xs font-black tracking-wider uppercase disabled:opacity-50"
          >
            {saving ? 'Saving…' : product ? 'Save Changes' : 'Add Product'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <h3 className="text-[10px] tracking-[0.25em] uppercase font-black text-[#c4a84f]">{title}</h3>
        <div className="flex-1 h-px bg-[rgba(196,168,79,0.12)]" />
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, children, className = '' }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <p className="text-[10px] text-white/30 mb-1.5 uppercase tracking-wider font-bold">{label}</p>
      {children}
    </div>
  );
}

function ToggleField({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center gap-2.5 group"
    >
      <div className={`relative w-10 h-5 rounded-full transition-all duration-300 ${checked ? 'bg-[#c4a84f]' : 'bg-white/10 border border-white/15'}`}>
        <div className={`absolute top-0.5 w-4 h-4 rounded-full transition-all duration-300 ${checked ? 'left-5 bg-[#07070c]' : 'left-0.5 bg-white/30'}`} />
      </div>
      <span className="text-xs font-bold text-white/50 group-hover:text-white/80 transition-colors">{label}</span>
    </button>
  );
}
