import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icon';
import { categoryGroups, sports } from '../data/sports';
import type { Product, Sport } from '../data/sports';
import ProductCard from '../components/ProductCard';
import { getCategories, getProducts } from '../lib/api';

const CONTAINER = 'max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-16';

const TRUST_POINTS = [
  { value: 'OEM', label: 'Private Label Manufacturing' },
  { value: 'Cut', label: 'Cut, Stitch & Finish' },
  { value: 'QC', label: 'Quality Control Checks' },
  { value: 'Bulk', label: 'Team & Brand Orders' },
];

const SERVICES = [
  {
    title: 'Prototyping & Sampling',
    desc: 'We convert your reference, sketch, or tech pack into a production-ready sample for approval.',
    image: '/service-images/prototyping-sampling.png',
  },
  {
    title: 'Research & Development',
    desc: 'Fabric, fit, trims, and construction details are refined before the order moves into production.',
    image: '/service-images/research-development.png',
  },
  {
    title: 'Material & Fabric Sourcing',
    desc: 'Performance fabrics, activewear blends, uniform materials, linings, and accessories are sourced to match your requirement.',
    image: '/service-images/material-fabric-sourcing.png',
  },
  {
    title: 'Pattern, Sizing & Grading',
    desc: 'Custom sizing, team sets, private label fits, and graded size ranges are prepared for consistent output.',
    image: '/service-images/pattern-sizing-grading.png',
  },
];
const CUSTOMIZATION_METHODS = [
  {
    title: 'Sublimation Printing',
    desc: 'High-definition all-over prints that never crack or fade.',
    icon: (
      <svg className="w-7 h-7 text-[#c4a84f]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    )
  },
  {
    title: 'Custom Embroidery',
    desc: 'Premium stitched logos, 3D puff, and woven badges.',
    icon: (
      <svg className="w-7 h-7 text-[#c4a84f]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
      </svg>
    )
  },
  {
    title: 'Screen Printing',
    desc: 'Durable and vibrant printing for bulk apparel production.',
    icon: (
      <svg className="w-7 h-7 text-[#c4a84f]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.813-6.843m-11.618 11.617a16.002 16.002 0 01-5.34-11.23M17.15 4.85l-1.085-1.085A3 3 0 0013.94 3H10.06a3 3 0 00-2.125.88l-1.085 1.085M17.15 4.85a3 3 0 01.88 2.125V17a3 3 0 01-3 3h-6a3 3 0 01-3-3V7c0-.795.318-1.558.88-2.125" />
      </svg>
    )
  },
  {
    title: 'Heat Transfer / DTF',
    desc: 'Crisp detailing for player names, numbers, and graphics.',
    icon: (
      <svg className="w-7 h-7 text-[#c4a84f]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
      </svg>
    )
  },
];

export default function HomePage() {
  const [categories, setCategories] = useState<Sport[]>(sports);
  const [activeSport, setActiveSport] = useState<Sport>(sports[0]);
  const [heroVisible, setHeroVisible] = useState(true);
  const [heroKey, setHeroKey] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    getCategories()
      .then((items) => {
        setCategories(items);
        setActiveSport((current) => items.find((item) => item.id === current.id) ?? items[0] ?? current);
      })
      .catch(() => setCategories(sports));
  }, []);

  useEffect(() => {
    getProducts({ featured: true, limit: 4 })
      .then(setFeaturedProducts)
      .catch(() => setFeaturedProducts([]));
  }, []);

  const switchSport = (sport: Sport) => {
    if (sport.id === activeSport.id) return;
    setHeroVisible(false);
    setTimeout(() => {
      setActiveSport(sport);
      setHeroKey((k) => k + 1);
      setHeroVisible(true);
    }, 350);
  };

  const groupedCategories = categoryGroups.map((group) => ({
    ...group,
    categories: group.categoryIds
      .map((id) => categories.find((category) => category.id === id))
      .filter((category): category is Sport => Boolean(category)),
  }));

  const activeHeroIsProductImage = activeSport.heroImage.includes('/product-');
  const activeHeroIsCategoryImage = activeSport.heroImage.includes('/category-');

  useEffect(() => {
    if (categories.length === 0) return;

    const interval = setInterval(() => {
      const currentIdx = categories.findIndex((s) => s.id === activeSport.id);
      const next = categories[(currentIdx + 1) % categories.length] ?? categories[0];
      setHeroVisible(false);
      setTimeout(() => {
        setActiveSport(next);
        setHeroKey((k) => k + 1);
        setHeroVisible(true);
      }, 350);
    }, 5500);

    return () => clearInterval(interval);
  }, [activeSport, categories]);

  return (
    <div className="min-h-screen">
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className={`absolute inset-0 hero-bg-transition ${heroVisible ? 'opacity-100' : 'opacity-0'}`}>
          {activeHeroIsProductImage ? (
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-[#05050a] via-[#090910] to-[#13131e]" />
              <img
                key={heroKey}
                src={activeSport.heroImage}
                alt={activeSport.name}
                className="absolute right-0 top-20 bottom-0 h-[calc(100%-5rem)] w-full lg:w-[56%] object-contain object-center p-8 sm:p-12 lg:p-16 opacity-35 animate-hero-slide"
              />
            </>
          ) : (
            <img
              key={heroKey}
              src={activeSport.heroImage}
              alt={activeSport.name}
              className="absolute inset-0 w-full h-full object-cover opacity-[0.24] blur-[1px] scale-105 animate-hero-slide"
            />
          )}
          <div className={`absolute inset-0 bg-gradient-to-r ${
            activeHeroIsCategoryImage ? 'from-[#07070c] via-[#07070c]/34 to-transparent' : 'from-[#07070c] via-[#07070c]/72 to-[#07070c]/12'
          }`} />
          <div className={`absolute inset-0 bg-gradient-to-t ${
            activeHeroIsCategoryImage ? 'from-[#07070c]/22 via-transparent to-[#07070c]/16' : 'from-[#07070c]/68 via-transparent to-[#07070c]/28'
          }`} />
          <div
            className="absolute inset-0 opacity-18 transition-all duration-700"
            style={{ background: `radial-gradient(ellipse at 72% 48%, rgba(${activeSport.accentColorRgb},0.42) 0%, transparent 58%)` }}
          />
        </div>

        <div className={`relative z-10 ${CONTAINER} w-full pt-28 pb-20`}>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(360px,0.78fr)] lg:items-center">
            <div className="max-w-2xl">
              <div
                key={`badge-${heroKey}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(196,168,79,0.35)] bg-[rgba(196,168,79,0.08)] mb-6 animate-fade-up"
              >
                <span className="text-[10px] font-black tracking-[0.28em] uppercase text-[#c4a84f]">
                  Custom Sportswear Manufacturer
                </span>
              </div>

              <div key={`h1-${heroKey}`} className="animate-fade-up-d1">
                <p className="text-sm font-medium tracking-[0.3em] uppercase text-white/50 mb-2">QarniSports</p>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[0.95] mb-3">
                  <span className="text-white block">Build Custom</span>
                  <span className="text-gold-gradient block">{activeSport.name}</span>
                </h1>
              </div>

              <div
                key={`line-${heroKey}`}
                className="h-px bg-gradient-to-r from-[#c4a84f] via-[#f0d080] to-transparent mb-5 animate-line"
              />

              <p key={`sub-${heroKey}`} className="text-base text-white/52 leading-relaxed mb-8 animate-fade-up-d2">
                OEM sportswear, uniforms, activewear, and accessories made for brands, teams, clubs, and distributors.
                Share your reference, logo, sizes, colors, and material requirements. We help turn it into a production-ready item.
              </p>

              <div key={`cta-${heroKey}`} className="flex flex-wrap gap-3 animate-fade-up-d3">
                <Link
                  to={`/sport/${activeSport.slug}`}
                  className="btn-gold px-7 py-3.5 rounded-sm text-xs font-black tracking-widest inline-flex items-center gap-2"
                >
                  Explore {activeSport.name}
                  <Icon name="arrow-right" size="xs" />
                </Link>
                <button
                  onClick={() => document.getElementById('capabilities')?.scrollIntoView({ behavior: 'smooth' })}
                  className="btn-outline-gold px-7 py-3.5 rounded-sm text-xs inline-flex items-center gap-2"
                >
                  View Capabilities
                </button>
              </div>
            </div>

            <div key={`visual-${heroKey}`} className="hidden lg:block animate-fade-up-d2">
              <div className="relative ml-auto max-w-[560px]">
                <div
                  className="absolute -inset-8 rounded-[2rem] opacity-45 blur-3xl"
                  style={{ background: `radial-gradient(circle, rgba(${activeSport.accentColorRgb},0.42), transparent 64%)` }}
                />
                <div className="relative overflow-hidden rounded-2xl border border-[rgba(196,168,79,0.22)] bg-[#09090f]/76 shadow-[0_28px_95px_rgba(0,0,0,0.48)] backdrop-blur-sm">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#f0d080]/65 to-transparent" />
                  <div className="relative aspect-[5/4] overflow-hidden bg-[#05050a]">
                    <img
                      src={activeSport.heroImage}
                      alt={activeSport.name}
                      className="h-full w-full object-cover transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#07070c]/82 via-transparent to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-6">
                      <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#f0d080]">
                        {activeSport.heroTagline}
                      </p>
                      <h2 className="mt-2 text-2xl font-black text-white">{activeSport.name}</h2>
                      <p className="mt-2 max-w-sm text-sm leading-6 text-white/55">{activeSport.heroSubline}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-14 animate-fade-up-d4">
            {categories.slice(0, 8).map((sport) => (
              <button
                key={sport.id}
                onClick={() => switchSport(sport)}
                className={`px-3.5 py-1.5 rounded-full text-[10px] font-black tracking-wider uppercase transition-all duration-300 border ${
                  activeSport.id === sport.id
                    ? 'border-[#c4a84f] bg-[#c4a84f] text-[#07070c] shadow-[0_0_20px_rgba(196,168,79,0.4)]'
                    : 'border-white/12 text-white/35 hover:border-[#c4a84f]/40 hover:text-white/70'
                }`}
              >
                {sport.name}
              </button>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
          <span className="text-[9px] tracking-[0.4em] uppercase text-white/20">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-[#c4a84f]/40 to-transparent" />
        </div>
      </section>

      <section className="py-12 border-y border-[rgba(196,168,79,0.08)] bg-[#09090f]">
        <div className={`${CONTAINER} grid grid-cols-2 md:grid-cols-4 gap-4`}>
          {TRUST_POINTS.map((point) => (
            <div key={point.label} className="text-center rounded-lg border border-white/6 bg-white/[0.025] px-4 py-6">
              <div className="text-2xl sm:text-3xl font-black stat-number mb-1">{point.value}</div>
              <div className="text-[10px] text-white/40 uppercase tracking-widest leading-relaxed">{point.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20">
        <div className={CONTAINER}>
          <div className="max-w-3xl mx-auto text-center mb-12">
            <p className="text-[10px] tracking-[0.35em] uppercase text-[#c4a84f] font-black mb-2">About QarniSports</p>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
              Custom <span className="text-gold-gradient">Manufacturing</span> for Sportswear Brands
            </h2>
            <p className="text-white/45 text-sm sm:text-base leading-relaxed">
              We manufacture sports apparel, team uniforms, activewear, and accessories for buyers who need reliable
              production, clean finishing, and flexible customization. From samples to bulk orders, our process is built
              around material selection, fit, print/embroidery, quality control, and dispatch-ready packing.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {groupedCategories.map((group, index) => {
              const image = group.categories[0]?.heroImage ?? '/hero-main.webp';
              return (
                <a
                  key={group.id}
                  href={`#${group.id}`}
                  className="relative overflow-hidden rounded-xl border border-white/8 bg-white/[0.03] min-h-[280px] group animate-fade-up"
                  style={{ animationDelay: `${index * 90}ms` }}
                >
                  <img src={image} alt={group.name} className="absolute inset-0 w-full h-full object-cover opacity-65 transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07070c] via-[#07070c]/45 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-[#c4a84f] font-black mb-2">{group.tagline}</p>
                    <h3 className="text-2xl font-black text-white mb-2">{group.name}</h3>
                    <p className="text-white/55 text-xs leading-relaxed">{group.description}</p>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#09090f]">
        <div className={CONTAINER}>
          <div className="text-center mb-10">
            <p className="text-[10px] tracking-[0.35em] uppercase text-[#c4a84f] font-black mb-2">Our Services</p>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              From Idea to <span className="text-gold-gradient">Finished Goods</span>
            </h2>
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-[#c4a84f] to-transparent mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {SERVICES.map((service, index) => (
              <div key={service.title} className="glass-card rounded-xl overflow-hidden border border-white/6 animate-fade-up" style={{ animationDelay: `${index * 90}ms` }}>
                <div className="h-36 overflow-hidden">
                  <img src={service.image} alt={service.title} className="w-full h-full object-cover opacity-80" />
                </div>
                <div className="p-5">
                  <h3 className="text-white font-black text-sm mb-2">{service.title}</h3>
                  <p className="text-white/40 text-xs leading-relaxed">{service.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 border-t border-[rgba(196,168,79,0.08)] bg-[#07070c]">
        <div className={CONTAINER}>
          <div className="text-center mb-12">
            <p className="text-[10px] tracking-[0.35em] uppercase text-[#c4a84f] font-black mb-2">Printing & Branding</p>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Customization <span className="text-gold-gradient">Techniques</span>
            </h2>
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-[#c4a84f] to-transparent mx-auto mt-4" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {CUSTOMIZATION_METHODS.map((method, index) => (
              <div key={method.title} className="glass-card p-6 rounded-xl border border-white/6 hover:border-[#c4a84f]/30 transition-all group animate-fade-up" style={{ animationDelay: `${index * 90}ms` }}>
                <div className="w-14 h-14 rounded-full bg-[#c4a84f]/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  {method.icon}
                </div>
                <h3 className="text-white font-black text-base mb-2">{method.title}</h3>
                <p className="text-white/45 text-xs leading-relaxed">{method.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#09090f]">
        <div className={CONTAINER}>
          <div className="text-center mb-10">
            <p className="text-[10px] tracking-[0.35em] uppercase text-[#c4a84f] font-black mb-2">Product Capabilities</p>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Categories & <span className="text-gold-gradient">Subcategories</span>
            </h2>
          </div>

          <div className="space-y-12">
            {groupedCategories.map((group) => (
              <div key={group.id} id={group.id} className="scroll-mt-28">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.28em] text-[#c4a84f] font-black mb-1">{group.tagline}</p>
                    <h3 className="text-2xl sm:text-3xl font-black text-white">{group.name}</h3>
                  </div>
                  <p className="text-white/40 text-sm max-w-xl">{group.description}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {group.categories.map((category) => (
                    <Link
                      key={category.id}
                      to={`/sport/${category.slug}`}
                      className="sport-cat-card relative overflow-hidden rounded-xl group cursor-pointer min-h-[230px] border border-white/6"
                    >
                      <img
                        src={category.heroImage}
                        alt={category.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#07070c]/92 via-[#07070c]/28 to-transparent" />
                      <div
                        className="cat-overlay absolute inset-0"
                        style={{ background: `linear-gradient(to top, rgba(${category.accentColorRgb},0.56), rgba(${category.accentColorRgb},0.05) 60%, transparent)` }}
                      />
                      <div className="absolute inset-x-0 bottom-0 p-4 z-10">
                        <h4 className="text-white font-black text-base tracking-wide">{category.name}</h4>
                        <p className="text-white/55 text-xs mt-1 line-clamp-2">{category.description}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="capabilities" className="py-20 border-y border-[rgba(196,168,79,0.08)] bg-[#09090f]">
        <div className={CONTAINER}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[10px] tracking-[0.35em] uppercase text-[#c4a84f] font-black mb-2">Why Choose Us</p>
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-6">
                Your Reliable <span className="text-gold-gradient">Manufacturing Partner</span>
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#c4a84f]/10 flex items-center justify-center flex-shrink-0 mt-1 text-[#c4a84f]">
                    <Icon name="check" size="md" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm mb-1">Low Minimum Order Quantity (MOQ)</h4>
                    <p className="text-white/45 text-xs leading-relaxed">Start small to test the market, or go big for bulk savings. We accommodate start-up brands and large retailers equally.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#c4a84f]/10 flex items-center justify-center flex-shrink-0 mt-1 text-[#c4a84f]">
                    <Icon name="check" size="md" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm mb-1">In-house Production & QC</h4>
                    <p className="text-white/45 text-xs leading-relaxed">From fabric sourcing to final stitch, everything is handled in-house to ensure strict quality control at every step.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#c4a84f]/10 flex items-center justify-center flex-shrink-0 mt-1 text-[#c4a84f]">
                    <Icon name="refresh" size="md" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm mb-1">Fast Turnaround Time</h4>
                    <p className="text-white/45 text-xs leading-relaxed">Rapid sampling and efficient bulk production cycles ensure you meet your launch deadlines consistently.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="glass-card p-8 sm:p-10 rounded-2xl border border-[rgba(196,168,79,0.15)] bg-gradient-to-br from-[#09090f] to-[#13131e] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Icon name="globe" size="lg" className="w-32 h-32 text-white" />
              </div>
              <div className="relative z-10">
                <p className="text-[10px] tracking-[0.3em] uppercase text-[#c4a84f] font-black mb-3">Global Logistics</p>
                <h3 className="text-2xl font-black text-white mb-4">Worldwide Delivery</h3>
                <p className="text-white/50 text-sm leading-relaxed mb-6">
                  Based in Sialkot, Pakistan, we export premium custom sportswear globally. We partner with world-class couriers to ensure your shipments arrive safely and on time, anywhere in the world.
                </p>
                <div className="flex items-center gap-4 border-t border-white/10 pt-6">
                  <div className="flex items-center gap-2 text-white/70 font-bold tracking-widest text-xs uppercase">
                    <Icon name="truck" size="md" className="text-[#c4a84f]" />
                    DHL / FedEx / UPS
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {featuredProducts.length > 0 && (
        <section className="py-20 bg-[#09090f]">
          <div className={CONTAINER}>
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
              <div>
                <p className="text-[10px] tracking-[0.35em] uppercase text-[#c4a84f] font-black mb-2">Latest Samples</p>
                <h2 className="text-3xl sm:text-4xl font-black text-white">
                  Featured <span className="text-gold-gradient">Catalog Items</span>
                </h2>
              </div>
              <Link to="/catalogues" className="btn-outline-gold px-5 py-2.5 rounded-sm text-[10px] inline-flex items-center gap-1.5 flex-shrink-0">
                View Catalog <Icon name="arrow-right" size="xs" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {featuredProducts.map((product, i) => (
                <ProductCard key={product.id} product={product} delay={i * 70} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-20 relative overflow-hidden bg-[#07070c]">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[rgba(196,168,79,0.15)] to-transparent" />
        <div className={CONTAINER}>
          <div className="max-w-4xl mx-auto glass-card rounded-2xl border border-[rgba(196,168,79,0.12)] p-6 sm:p-10 lg:p-14">
            <div className="text-center mb-10">
              <p className="text-[10px] tracking-[0.35em] uppercase text-[#c4a84f] font-black mb-2">Start Your Project</p>
              <h2 className="text-3xl sm:text-4xl font-black text-white">
                Request a <span className="text-gold-gradient">Free Quote</span>
              </h2>
              <p className="text-white/45 text-sm mt-4">
                Share your requirements, mockups, or tech packs, and our team will get back to you with a comprehensive quote.
              </p>
            </div>
            <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); alert("Inquiry sent successfully! Our team will contact you soon."); }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] font-black tracking-widest text-white/50 uppercase mb-2">Your Name</label>
                  <input type="text" className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-[#c4a84f] focus:outline-none transition-colors" placeholder="John Doe" required />
                </div>
                <div>
                  <label className="block text-[10px] font-black tracking-widest text-white/50 uppercase mb-2">Email Address</label>
                  <input type="email" className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-[#c4a84f] focus:outline-none transition-colors" placeholder="john@example.com" required />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] font-black tracking-widest text-white/50 uppercase mb-2">Company / Brand</label>
                  <input type="text" className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-[#c4a84f] focus:outline-none transition-colors" placeholder="Optional" />
                </div>
                <div>
                  <label className="block text-[10px] font-black tracking-widest text-white/50 uppercase mb-2">Estimated Quantity</label>
                  <input type="text" className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-[#c4a84f] focus:outline-none transition-colors" placeholder="e.g. 50 - 100 pcs" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black tracking-widest text-white/50 uppercase mb-2">Project Details</label>
                <textarea rows={4} className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-[#c4a84f] focus:outline-none transition-colors resize-none" placeholder="Tell us about your fabric, color, and customization requirements..." required></textarea>
              </div>
              <div className="text-center pt-2">
                <button type="submit" className="btn-gold px-10 py-4 rounded-sm text-xs font-black tracking-widest uppercase shadow-[0_0_20px_rgba(196,168,79,0.3)]">
                  Submit Inquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
