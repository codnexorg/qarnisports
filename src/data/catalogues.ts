export interface Catalogue {
  id: string;
  title: string;
  category: string;
  year: number;
  description: string;
  mediaType: 'pdf' | 'images';
  coverImage: string;
  categoryIds: string[];
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  imageUrls: string[];
  sortOrder: number;
  createdAt?: string;
}

export const catalogues: Catalogue[] = [
  {
    id: 'sportswear-2026',
    title: 'Sports Catalogue',
    category: 'Sports',
    year: 2026,
    description: 'Custom sportswear, activewear, teamwear, and performance apparel catalogue for buyers and distributors.',
    mediaType: 'pdf',
    coverImage: '/category-heroes/sports-bra.webp',
    categoryIds: ['sports', 'sports-bra', 'tank-tops'],
    fileUrl: '/catalogues/qarnisports-sportswear-catalogue-2026.pdf',
    fileName: 'qarnisports-sportswear-catalogue-2026.pdf',
    fileSize: 13998647,
    imageUrls: [],
    sortOrder: 1,
  },
  {
    id: 'uniform-2026',
    title: 'Uniform Catalogue',
    category: 'Uniforms',
    year: 2026,
    description: 'Soccer, American football, basketball, volleyball, and team uniform manufacturing catalogue.',
    mediaType: 'pdf',
    coverImage: '/category-heroes/soccer-uniform.webp',
    categoryIds: ['uniforms', 'soccer-uniform', 'american-football-uniform', 'basketball-uniform', 'volleyball-uniform'],
    fileUrl: '/catalogues/qarnisports-uniform-catalogue-2026.pdf',
    fileName: 'qarnisports-uniform-catalogue-2026.pdf',
    fileSize: 2736659,
    imageUrls: [],
    sortOrder: 2,
  },
  {
    id: 'apparel-2025',
    title: 'Apparel Catalogue',
    category: 'Apparel',
    year: 2025,
    description: 'Apparel and cut-and-sew performance products catalogue for custom orders.',
    mediaType: 'pdf',
    coverImage: '/category-heroes/t-shirts.webp',
    categoryIds: ['apparel', 't-shirts', 'hoodies', 'long-sleeve-shirts', 'leggings', 'shorts'],
    fileUrl: '/catalogues/qarnisports-apparel-accessories-catalogue-2025.pdf',
    fileName: 'qarnisports-apparel-accessories-catalogue-2025.pdf',
    fileSize: 11379704,
    imageUrls: [],
    sortOrder: 3,
  },
  {
    id: 'accessories-2026',
    title: 'Accessories Catalogue 2026',
    category: 'Accessories',
    year: 2026,
    description: 'Complete range of sports accessories including bags, bandages, hats, sports bags, and soccer balls.',
    mediaType: 'pdf',
    coverImage: '/category-heroes/accessories-catalogue.jpg.png',
    categoryIds: ['accessories', 'bags', 'bandages', 'hats', 'sports-bags', 'soccer-ball'],
    fileUrl: '/catalogues/QarniSports_Accessories_Catalogue_2026.pdf',
    fileName: 'QarniSports_Accessories_Catalogue_2026.pdf',
    fileSize: 1071465,
    imageUrls: [],
    sortOrder: 4,
  },
];
