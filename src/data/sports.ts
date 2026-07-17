export interface Sport {
  id: string;
  name: string;
  slug: string;
  emoji: string;
  heroImage: string;
  heroTagline: string;
  heroSubline: string;
  accentColor: string;
  accentColorRgb: string;
  description: string;
  sortOrder?: number;
}

export interface CategoryGroup {
  id: string;
  name: string;
  tagline: string;
  description: string;
  categoryIds: string[];
}

export interface Product {
  id: string;
  slug?: string;
  name: string;
  sport: string;
  price: number;
  originalPrice?: number;
  image: string;
  galleryImages?: string[];
  badge?: string;
  rating: number;
  reviews: number;
  description: string;
  sortOrder?: number;
  longDescription?: string;
  features?: string[];
  colors?: { label: string; hex: string }[];
  sizes?: string[];
  sku?: string;
  inStock?: boolean;
  saleEndTime?: string;
  isFeatured?: boolean;
}

export const sports: Sport[] = [
  {
    id: 't-shirts',
    name: 'T-Shirts',
    slug: 't-shirts',
    emoji: '',
    heroImage: '/category-heroes/t-shirts.webp',
    heroTagline: 'Cut & Sew Apparel',
    heroSubline: 'Custom t-shirts for teams, gyms, brands, and promotional programs',
    accentColor: '#c4a84f',
    accentColorRgb: '196,168,79',
    description: 'Custom sports and lifestyle t-shirts',
    sortOrder: 1,
  },
  {
    id: 'hoodies',
    name: 'Hoodies',
    slug: 'hoodies',
    emoji: '',
    heroImage: '/category-heroes/hoodies.webp',
    heroTagline: 'Fleece & Teamwear',
    heroSubline: 'Warm, branded hoodies for clubs, schools, and retail programs',
    accentColor: '#6bc4ff',
    accentColorRgb: '107,196,255',
    description: 'Custom fleece hoodies and warm-up wear',
    sortOrder: 2,
  },
  {
    id: 'long-sleeve-shirts',
    name: 'Long Sleeve Shirts',
    slug: 'long-sleeve-shirts',
    emoji: '',
    heroImage: '/category-heroes/long-sleeve-shirts.webp',
    heroTagline: 'Training Layers',
    heroSubline: 'Long sleeve performance shirts for training, travel, and team identity',
    accentColor: '#8fd67f',
    accentColorRgb: '143,214,127',
    description: 'Long sleeve shirts and training tops',
    sortOrder: 3,
  },
  {
    id: 'leggings',
    name: 'Leggings',
    slug: 'leggings',
    emoji: '',
    heroImage: '/category-heroes/leggings.webp',
    heroTagline: 'Performance Leggings',
    heroSubline: 'Stretch activewear leggings for training, yoga, fitness, and athleisure',
    accentColor: '#d56a9f',
    accentColorRgb: '213,106,159',
    description: 'Training leggings and activewear bottoms',
    sortOrder: 4,
  },
  {
    id: 'shorts',
    name: 'Shorts',
    slug: 'shorts',
    emoji: '',
    heroImage: '/category-heroes/shorts.webp',
    heroTagline: 'Match & Training Shorts',
    heroSubline: 'Lightweight custom shorts for teams, activewear, and training kits',
    accentColor: '#f08a5d',
    accentColorRgb: '240,138,93',
    description: 'Custom athletic shorts',
    sortOrder: 5,
  },
  {
    id: 'soccer-uniform',
    name: 'Soccer Uniform',
    slug: 'soccer-uniform',
    emoji: '',
    heroImage: '/category-heroes/soccer-uniform.webp',
    heroTagline: 'Match Ready Kits',
    heroSubline: 'Complete soccer uniforms for teams, academies, and clubs',
    accentColor: '#4CAF50',
    accentColorRgb: '76,175,80',
    description: 'Complete soccer uniforms and team kits',
    sortOrder: 6,
  },
  {
    id: 'american-football-uniform',
    name: 'American Football Uniform',
    slug: 'american-football-uniform',
    emoji: '',
    heroImage: '/category-heroes/american-football-uniform.webp',
    heroTagline: 'Padded Team Uniforms',
    heroSubline: 'Custom American football uniforms built for team identity and durability',
    accentColor: '#b879ff',
    accentColorRgb: '184,121,255',
    description: 'American football uniforms and team kits',
    sortOrder: 7,
  },
  {
    id: 'basketball-uniform',
    name: 'Basketball Uniform',
    slug: 'basketball-uniform',
    emoji: '',
    heroImage: '/category-heroes/basketball-uniform.webp',
    heroTagline: 'Court Ready Kits',
    heroSubline: 'Basketball jerseys and shorts with custom colors, logos, and trims',
    accentColor: '#e4773f',
    accentColorRgb: '228,119,63',
    description: 'Basketball team uniforms',
    sortOrder: 8,
  },
  {
    id: 'volleyball-uniform',
    name: 'Volleyball Uniform',
    slug: 'volleyball-uniform',
    emoji: '',
    heroImage: '/category-heroes/volleyball-uniform.webp',
    heroTagline: 'Lightweight Team Kits',
    heroSubline: 'Custom volleyball uniforms for school, club, and professional teams',
    accentColor: '#48d1cc',
    accentColorRgb: '72,209,204',
    description: 'Volleyball team uniforms',
    sortOrder: 9,
  },
  {
    id: 'sports-bra',
    name: 'Sports Bra',
    slug: 'sports-bra',
    emoji: '',
    heroImage: '/category-heroes/sports-bra.webp',
    heroTagline: 'Supportive Activewear',
    heroSubline: 'Sports bras built for training comfort, support, and brand programs',
    accentColor: '#9C27B0',
    accentColorRgb: '156,39,176',
    description: 'Sports bras and support wear for training',
    sortOrder: 10,
  },
  {
    id: 'tank-tops',
    name: 'Tank Tops',
    slug: 'tank-tops',
    emoji: '',
    heroImage: '/category-heroes/tank-tops.webp',
    heroTagline: 'Breathable Training Tops',
    heroSubline: 'Custom tank tops for fitness, training, events, and lifestyle collections',
    accentColor: '#f0d080',
    accentColorRgb: '240,208,128',
    description: 'Custom tank tops and sleeveless activewear',
    sortOrder: 11,
  },
  {
    id: 'bags',
    name: 'Bags',
    slug: 'bags',
    emoji: '',
    heroImage: '/category-heroes/bags.webp',
    heroTagline: 'Carry Goods',
    heroSubline: 'Custom bags for teams, brands, schools, and sports programs',
    accentColor: '#7aa7ff',
    accentColorRgb: '122,167,255',
    description: 'Custom bags and carry goods',
    sortOrder: 12,
  },
  {
    id: 'bandages',
    name: 'Bandages',
    slug: 'bandages',
    emoji: '',
    heroImage: '/category-heroes/bandages.webp',
    heroTagline: 'Training Accessories',
    heroSubline: 'Sports bandages and support accessories for training and match use',
    accentColor: '#ff6f91',
    accentColorRgb: '255,111,145',
    description: 'Sports bandages and support accessories',
    sortOrder: 13,
  },
  {
    id: 'hats',
    name: 'Hats',
    slug: 'hats',
    emoji: '',
    heroImage: '/category-heroes/hats.webp',
    heroTagline: 'Headwear Programs',
    heroSubline: 'Custom caps and hats for sports teams, brands, and events',
    accentColor: '#c4a84f',
    accentColorRgb: '196,168,79',
    description: 'Custom hats and headwear',
    sortOrder: 14,
  },
  {
    id: 'sports-bags',
    name: 'Sports Bags',
    slug: 'sports-bags',
    emoji: '',
    heroImage: '/category-heroes/sports-bags.webp',
    heroTagline: 'Team Travel Gear',
    heroSubline: 'Sports bags designed for team travel, training kits, and club programs',
    accentColor: '#52c7b8',
    accentColorRgb: '82,199,184',
    description: 'Team sports bags and training bags',
    sortOrder: 15,
  },
  {
    id: 'soccer-ball',
    name: 'Soccer Ball',
    slug: 'soccer-ball',
    emoji: '',
    heroImage: '/category-heroes/soccer-ball.webp',
    heroTagline: 'Match & Training Balls',
    heroSubline: 'Custom soccer balls for clubs, academies, events, and promotions',
    accentColor: '#ffffff',
    accentColorRgb: '255,255,255',
    description: 'Custom soccer balls and training balls',
    sortOrder: 16,
  },
];

export const categoryGroups: CategoryGroup[] = [
  {
    id: 'apparel',
    name: 'Apparel',
    tagline: 'Cut, stitch, print, and finish',
    description: 'Performance apparel programs for teams, activewear brands, schools, and events.',
    categoryIds: ['t-shirts', 'hoodies', 'long-sleeve-shirts', 'leggings', 'shorts'],
  },
  {
    id: 'uniforms',
    name: 'Uniforms',
    tagline: 'Team kits built to specification',
    description: 'Custom uniform manufacturing with colors, trims, logos, sizing, and packaging handled end to end.',
    categoryIds: ['soccer-uniform', 'american-football-uniform', 'basketball-uniform', 'volleyball-uniform'],
  },
  {
    id: 'sports',
    name: 'Sports',
    tagline: 'Training and fitness essentials',
    description: 'Activewear essentials for gyms, clubs, private labels, and performance collections.',
    categoryIds: ['sports-bra', 'tank-tops'],
  },
  {
    id: 'accessories',
    name: 'Accessories',
    tagline: 'Finishing goods and team add-ons',
    description: 'Custom sports accessories that complete teamwear, retail, and promotional programs.',
    categoryIds: ['bags', 'bandages', 'hats', 'sports-bags', 'soccer-ball'],
  },
];

export const products: Product[] = [];
