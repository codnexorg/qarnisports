import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from './Icon';
import { categoryGroups, sports, type Sport } from '../data/sports';
import { getCategories } from '../lib/api';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categories, setCategories] = useState<Sport[]>(sports);
  const location = useLocation();

  const groupedCategories = categoryGroups.map((group) => ({
    ...group,
    categories: group.categoryIds
      .map((id) => categories.find((category) => category.id === id))
      .filter((category): category is Sport => Boolean(category)),
  }));

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    getCategories().then(setCategories).catch(() => setCategories(sports));
  }, []);

  useEffect(() => setMobileOpen(false), [location.pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#07070c]/95 backdrop-blur-xl border-b border-[rgba(196,168,79,0.15)] shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-16 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
          <div className="relative w-9 h-9 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-[#c4a84f] animate-spin-slow opacity-40" />
            <span className="text-lg font-black text-gold-gradient">Q</span>
          </div>
          <div>
            <span className="text-lg font-black tracking-widest text-white uppercase">
              Qarni<span className="text-gold-gradient">Sports</span>
            </span>
            <div className="hidden sm:block text-[9px] tracking-[0.3em] text-[#c4a84f]/60 uppercase font-medium -mt-0.5">
              Custom Sportswear Manufacturing
            </div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-6">
          <Link
            to="/"
            className={`nav-link text-xs font-bold tracking-[0.12em] uppercase transition-colors ${
              location.pathname === '/' ? 'text-[#f0d080]' : 'text-white/60'
            }`}
          >
            Home
          </Link>

          <Link
            to="/services"
            className={`nav-link text-xs font-bold tracking-[0.12em] uppercase transition-colors ${
              location.pathname === '/services' ? 'text-[#f0d080]' : 'text-white/60'
            }`}
          >
            Services
          </Link>

          <Link
            to="/catalogues"
            className={`nav-link text-xs font-bold tracking-[0.12em] uppercase transition-colors ${
              location.pathname === '/catalogues' ? 'text-[#f0d080]' : 'text-white/60'
            }`}
          >
            Catalogues
          </Link>

          {groupedCategories.map((group) => (
            <div key={group.id} className="relative group py-7">
              <Link
                to={`/group/${group.id}`}
                className="nav-link text-xs font-bold tracking-[0.12em] uppercase transition-colors text-white/60 group-hover:text-[#f0d080] inline-flex items-center gap-1.5"
              >
                {group.name}
                <Icon name="arrow-down" size="xs" />
              </Link>

              <div className="pointer-events-none absolute left-1/2 top-full z-50 w-64 -translate-x-1/2 translate-y-3 rounded-lg border border-[rgba(196,168,79,0.18)] bg-[#07070c]/98 p-2 opacity-0 shadow-[0_18px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl transition-all duration-200 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
                <div className="px-3 py-2 border-b border-white/8">
                  <p className="text-[9px] font-black uppercase tracking-[0.28em] text-[#c4a84f]">{group.name}</p>
                  <p className="mt-1 text-[11px] leading-relaxed text-white/35">{group.tagline}</p>
                </div>
                <div className="py-1.5">
                  {group.categories.map((category) => (
                    <Link
                      key={category.id}
                      to={`/sport/${category.slug}`}
                      className="flex items-center justify-between rounded-md px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] text-white/50 transition-all hover:bg-[#c4a84f]/8 hover:text-[#f0d080]"
                    >
                      <span>{category.name}</span>
                      <Icon name="arrow-right" size="xs" className="opacity-45" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}

          <Link
            to="/samples"
            className={`nav-link text-xs font-bold tracking-[0.12em] uppercase transition-colors ${
              location.pathname === '/samples' ? 'text-[#f0d080]' : 'text-white/60'
            }`}
          >
            Samples
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <button className="hidden sm:flex w-9 h-9 items-center justify-center rounded-full border border-white/10 hover:border-[#c4a84f]/50 transition-all hover:bg-[#c4a84f]/10 text-white/50 hover:text-white">
            <Icon name="search" size="sm" />
          </button>

          <button
            className="lg:hidden flex flex-col gap-[5px] p-2 text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <span className={`block w-5 h-0.5 bg-current transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
            <span className={`block w-5 h-0.5 bg-current transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-current transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
          </button>
        </div>
      </div>

      <div
        className={`lg:hidden transition-all duration-400 overflow-y-auto ${
          mobileOpen ? 'max-h-[calc(100vh-5rem)] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="bg-[#07070c]/98 border-t border-[rgba(196,168,79,0.12)] px-5 py-3 flex flex-col gap-3">
          <Link
            to="/"
            className={`py-3 px-4 text-xs font-bold tracking-[0.15em] uppercase border-l-2 transition-all ${
              location.pathname === '/'
                ? 'text-[#f0d080] border-[#c4a84f] bg-[#c4a84f]/5'
                : 'text-white/50 border-transparent hover:text-white hover:border-[#c4a84f]/30'
            }`}
          >
            Home
          </Link>

          <Link
            to="/services"
            className={`py-3 px-4 text-xs font-bold tracking-[0.15em] uppercase border-l-2 transition-all ${
              location.pathname === '/services'
                ? 'text-[#f0d080] border-[#c4a84f] bg-[#c4a84f]/5'
                : 'text-white/50 border-transparent hover:text-white hover:border-[#c4a84f]/30'
            }`}
          >
            Services
          </Link>

          <Link
            to="/catalogues"
            className={`py-3 px-4 text-xs font-bold tracking-[0.15em] uppercase border-l-2 transition-all ${
              location.pathname === '/catalogues'
                ? 'text-[#f0d080] border-[#c4a84f] bg-[#c4a84f]/5'
                : 'text-white/50 border-transparent hover:text-white hover:border-[#c4a84f]/30'
            }`}
          >
            Catalogues
          </Link>

          {groupedCategories.map((group) => (
            <div key={group.id} className="border-l-2 border-[#c4a84f]/25 bg-white/[0.02]">
              <Link
                to={`/group/${group.id}`}
                className="block px-4 py-3 text-xs font-black uppercase tracking-[0.16em] text-[#f0d080]"
              >
                {group.name}
              </Link>
              <div className="grid grid-cols-1 gap-0.5 pb-2">
                {group.categories.map((category) => (
                  <Link
                    key={category.id}
                    to={`/sport/${category.slug}`}
                    className="px-6 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-white/45 transition-colors hover:text-white"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}

          <Link
            to="/samples"
            className={`py-3 px-4 text-xs font-bold tracking-[0.15em] uppercase border-l-2 transition-all ${
              location.pathname === '/samples'
                ? 'text-[#f0d080] border-[#c4a84f] bg-[#c4a84f]/5'
                : 'text-white/50 border-transparent hover:text-white hover:border-[#c4a84f]/30'
            }`}
          >
            Samples
          </Link>
        </nav>
      </div>
    </header>
  );
}
