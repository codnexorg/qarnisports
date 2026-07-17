import type { Product, Sport } from '../data/sports';
import { products as seedProducts, sports as seedSports } from '../data/sports';
import type { Catalogue } from '../data/catalogues';
import { catalogues as seedCatalogues } from '../data/catalogues';

const API_BASE = import.meta.env.VITE_API_BASE ?? '/api';

let csrfToken: string | null = null;

interface ApiEnvelope<T> {
  data?: T;
  error?: string;
  csrfToken?: string | null;
  authenticated?: boolean;
}

interface ProductQuery {
  sport?: string;
  featured?: boolean;
  limit?: number;
  excludeId?: string;
}

export interface CatalogueUploadInput {
  title: string;
  category: string;
  year: number;
  description: string;
  categoryIds: string[];
  mediaType: 'pdf' | 'images';
  coverImage: File;
  pdfFile?: File | null;
  imageFiles?: File[];
  sortOrder?: number;
}

function normalizeProduct(product: Product): Product {
  return {
    ...product,
    slug: product.slug || undefined,
    galleryImages: product.galleryImages ?? [],
    originalPrice: product.originalPrice ?? undefined,
    badge: product.badge ?? undefined,
    longDescription: product.longDescription ?? undefined,
    features: product.features ?? [],
    colors: product.colors ?? [],
    sizes: product.sizes ?? [],
    sku: product.sku ?? undefined,
    inStock: product.inStock ?? true,
    saleEndTime: product.saleEndTime ?? undefined,
    isFeatured: product.isFeatured ?? ['p1', 'p2', 'p3', 'p4'].includes(product.id),
  };
}

function normalizeCategory(category: Sport): Sport {
  return {
    ...category,
    slug: category.slug || category.id,
    emoji: category.emoji || '',
    heroImage: category.heroImage || '/hero-main.webp',
    heroTagline: category.heroTagline || category.name,
    heroSubline: category.heroSubline || `Premium ${category.name} equipment`,
    accentColor: category.accentColor || '#c4a84f',
    accentColorRgb: category.accentColorRgb || '196,168,79',
    description: category.description || '',
    sortOrder: category.sortOrder ?? 0,
  };
}

function normalizeCatalogue(catalogue: Catalogue): Catalogue {
  const fileName = catalogue.fileName || catalogue.fileUrl?.split('/').pop() || 'catalogue.pdf';
  return {
    ...catalogue,
    id: catalogue.id || catalogue.fileName || catalogue.title,
    category: catalogue.category || 'Catalogue',
    year: Number(catalogue.year || new Date().getFullYear()),
    description: catalogue.description || '',
    mediaType: catalogue.mediaType || (catalogue.imageUrls?.length ? 'images' : 'pdf'),
    coverImage: catalogue.coverImage || catalogue.imageUrls?.[0] || '/category-heroes/t-shirts.webp',
    categoryIds: catalogue.categoryIds ?? [],
    fileName,
    fileSize: catalogue.fileSize ?? undefined,
    imageUrls: catalogue.imageUrls ?? [],
    sortOrder: catalogue.sortOrder ?? 0,
  };
}

function localProducts(): Product[] {
  return seedProducts.map(normalizeProduct);
}

function localCategories(): Sport[] {
  return seedSports.map((category, index) => normalizeCategory({ ...category, sortOrder: index + 1 }));
}

function localCatalogues(): Catalogue[] {
  return seedCatalogues.map(normalizeCatalogue);
}

async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set('Accept', 'application/json');

  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (csrfToken && init.method && init.method !== 'GET') {
    headers.set('X-CSRF-Token', csrfToken);
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers,
    credentials: 'same-origin',
  });

  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    throw new Error('API did not return JSON.');
  }

  const payload = (await response.json()) as ApiEnvelope<T>;
  if (!response.ok) {
    throw new Error(payload.error ?? 'API request failed.');
  }

  if (payload.csrfToken) {
    csrfToken = payload.csrfToken;
  }

  return payload.data as T;
}

export async function getCategories(): Promise<Sport[]> {
  try {
    const data = await apiRequest<Sport[]>('/categories.php');
    return data.map(normalizeCategory);
  } catch (error) {
    if (!import.meta.env.DEV) throw error;
    return localCategories();
  }
}

export async function saveCategory(category: Partial<Sport>): Promise<Sport> {
  const method = category.id ? 'PUT' : 'POST';
  const data = await apiRequest<Sport>('/categories.php', {
    method,
    body: JSON.stringify(category),
  });
  return normalizeCategory(data);
}

export async function deleteCategory(id: string): Promise<void> {
  await apiRequest('/categories.php', {
    method: 'DELETE',
    body: JSON.stringify({ id }),
  });
}

export async function getCatalogues(categoryId?: string, parentCategoryId?: string): Promise<Catalogue[]> {
  try {
    const data = await apiRequest<Catalogue[]>('/catalogues.php');
    let items = data.map(normalizeCatalogue);
    if (categoryId) {
        let filtered = items.filter(c => c.categoryIds.includes(categoryId));
        if (filtered.length === 0 && parentCategoryId) {
            filtered = items.filter(c => c.categoryIds.includes(parentCategoryId));
        }
        items = filtered;
    }
    return items;
  } catch {
    const items = localCatalogues();
    if (!categoryId) return items;
    let filtered = items.filter((catalogue) => catalogue.categoryIds.includes(categoryId));
    if (filtered.length === 0 && parentCategoryId) {
        filtered = items.filter((catalogue) => catalogue.categoryIds.includes(parentCategoryId));
    }
    return filtered;
  }
}

export async function uploadCatalogue(input: CatalogueUploadInput): Promise<Catalogue> {
  const body = new FormData();
  body.append('title', input.title);
  body.append('category', input.category);
  body.append('year', String(input.year));
  body.append('description', input.description);
  body.append('sortOrder', String(input.sortOrder ?? 0));
  body.append('mediaType', input.mediaType);
  body.append('categoryIds', JSON.stringify(input.categoryIds));
  body.append('coverImage', input.coverImage);

  if (input.mediaType === 'pdf' && input.pdfFile) {
    body.append('catalogue', input.pdfFile);
  }

  if (input.mediaType === 'images') {
    for (const file of input.imageFiles ?? []) {
      body.append('images[]', file);
    }
  }

  const headers = new Headers();
  headers.set('Accept', 'application/json');
  if (csrfToken) {
    headers.set('X-CSRF-Token', csrfToken);
  }

  const response = await fetch(`${API_BASE}/catalogues.php`, {
    method: 'POST',
    body,
    headers,
    credentials: 'same-origin',
  });

  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    throw new Error('Catalogue API did not return JSON.');
  }

  const payload = (await response.json()) as ApiEnvelope<Catalogue>;
  if (!response.ok || !payload.data) {
    throw new Error(payload.error ?? 'Catalogue upload failed.');
  }

  return normalizeCatalogue(payload.data);
}

export async function deleteCatalogue(id: string): Promise<void> {
  await apiRequest('/catalogues.php', {
    method: 'DELETE',
    body: JSON.stringify({ id }),
  });
}

export async function getProducts(query: ProductQuery = {}): Promise<Product[]> {
  const params = new URLSearchParams();
  if (query.sport) params.set('sport', query.sport);
  if (query.featured) params.set('featured', '1');
  if (query.limit) params.set('limit', String(query.limit));
  if (query.excludeId) params.set('exclude_id', query.excludeId);

  try {
    const data = await apiRequest<Product[]>(`/products.php?${params.toString()}`);
    return data.map(normalizeProduct);
  } catch (error) {
    if (!import.meta.env.DEV) throw error;
    let data = localProducts();
    if (query.sport) data = data.filter((p) => p.sport === query.sport);
    if (query.featured) data = data.filter((p) => p.isFeatured);
    if (query.excludeId) data = data.filter((p) => p.id !== query.excludeId);
    return data.slice(0, query.limit ?? data.length);
  }
}

export async function getProduct(id: string): Promise<Product | null> {
  try {
    const data = await apiRequest<Product | null>(`/products.php?id=${encodeURIComponent(id)}`);
    return data ? normalizeProduct(data) : null;
  } catch (error) {
    if (!import.meta.env.DEV) throw error;
    return localProducts().find((p) => p.id === id || p.slug === id) ?? null;
  }
}

export async function saveProduct(product: Partial<Product>): Promise<Product> {
  const method = product.id ? 'PUT' : 'POST';
  const data = await apiRequest<Product>('/products.php', {
    method,
    body: JSON.stringify(product),
  });
  return normalizeProduct(data);
}

export async function deleteProduct(id: string): Promise<void> {
  await apiRequest('/products.php', {
    method: 'DELETE',
    body: JSON.stringify({ id }),
  });
}

export async function uploadProductImage(file: File): Promise<string> {
  const body = new FormData();
  body.append('image', file);

  const headers = new Headers();
  headers.set('Accept', 'application/json');
  if (csrfToken) {
    headers.set('X-CSRF-Token', csrfToken);
  }

  const response = await fetch(`${API_BASE}/upload.php`, {
    method: 'POST',
    body,
    headers,
    credentials: 'same-origin',
  });

  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    throw new Error('Upload API did not return JSON.');
  }

  const payload = (await response.json()) as ApiEnvelope<{ url: string }>;
  if (!response.ok || !payload.data?.url) {
    throw new Error(payload.error ?? 'Image upload failed.');
  }

  return payload.data.url;
}

export async function getAdminSession(): Promise<boolean> {
  const response = await fetch(`${API_BASE}/auth.php`, {
    credentials: 'same-origin',
    headers: { Accept: 'application/json' },
  });
  const payload = (await response.json()) as ApiEnvelope<never>;
  csrfToken = payload.csrfToken ?? null;
  return Boolean(payload.authenticated);
}

export async function loginAdmin(password: string): Promise<void> {
  const response = await fetch(`${API_BASE}/auth.php`, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ action: 'login', password }),
  });
  const payload = (await response.json()) as ApiEnvelope<never>;
  if (!response.ok || !payload.authenticated) {
    throw new Error(payload.error ?? 'Login failed.');
  }
  csrfToken = payload.csrfToken ?? null;
}

export async function logoutAdmin(): Promise<void> {
  await fetch(`${API_BASE}/auth.php`, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(csrfToken ? { 'X-CSRF-Token': csrfToken } : {}),
    },
    body: JSON.stringify({ action: 'logout' }),
  });
  csrfToken = null;
}
