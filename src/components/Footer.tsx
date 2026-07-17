import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Icon from './Icon';
import { sports } from '../data/sports';
import { getCategories } from '../lib/api';

const visitorMarkets = [
  { code: 'US', country: 'United States', visits: '2.4k', fill: 'w-[82%]', colors: 'from-[#b22234] via-white to-[#3c3b6e]' },
  { code: 'GB', country: 'United Kingdom', visits: '1.8k', fill: 'w-[68%]', colors: 'from-[#012169] via-white to-[#c8102e]' },
  { code: 'AE', country: 'UAE', visits: '1.2k', fill: 'w-[54%]', colors: 'from-[#00732f] via-white to-[#ff0000]' },
  { code: 'DE', country: 'Germany', visits: '960', fill: 'w-[46%]', colors: 'from-black via-[#dd0000] to-[#ffce00]' },
  { code: 'AU', country: 'Australia', visits: '740', fill: 'w-[38%]', colors: 'from-[#00008b] via-white to-[#e4002b]' },
  { code: 'PK', country: 'Pakistan', visits: '520', fill: 'w-[32%]', colors: 'from-[#01411c] via-white to-[#01411c]' },
] as const;

export default function Footer() {
  const [categories, setCategories] = useState(sports);

  useEffect(() => {
    getCategories().then(setCategories).catch(() => setCategories(sports));
  }, []);

  return (
    <footer className="bg-[#040408] border-t border-[rgba(196,168,79,0.12)] mt-auto">
      {/* Stats */}
      <div className="border-b border-[rgba(196,168,79,0.08)]">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-16 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: 'OEM', label: 'Private Label Ready' },
            { value: '16+', label: 'Product Categories' },
            { value: 'QC', label: 'Controlled Finishing' },
            { value: 'Bulk', label: 'Team & Brand Orders' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-black stat-number mb-1">{stat.value}</div>
              <div className="text-[10px] text-white/35 uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Global Visitor Counter */}
      <div className="border-b border-[rgba(196,168,79,0.08)]">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-16 py-10">
          <div className="relative overflow-hidden rounded-lg border border-[rgba(196,168,79,0.18)] bg-[linear-gradient(135deg,rgba(255,255,255,0.045),rgba(196,168,79,0.035),rgba(255,255,255,0.015))] shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#f0d080]/60 to-transparent" />
            <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.34em] text-[#c4a84f]">
                  Flag Counter
                </p>
                <h4 className="mt-3 text-2xl sm:text-3xl font-black tracking-normal text-white">
                  Global Buyer Reach
                </h4>
                <p className="mt-3 max-w-md text-sm leading-7 text-white/42">
                  Premium visitor snapshot for international buyers, clubs, brands, and distributors exploring
                  QarniSports manufacturing categories.
                </p>
                <div className="mt-6 grid grid-cols-3 gap-3">
                  {[
                    { value: '42+', label: 'Markets' },
                    { value: '8.1k', label: 'Visits' },
                    { value: '24/7', label: 'Online' },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-md border border-white/10 bg-black/20 px-3 py-3 text-center">
                      <div className="text-lg font-black text-gold-gradient">{stat.value}</div>
                      <div className="mt-1 text-[9px] font-bold uppercase tracking-[0.16em] text-white/35">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {visitorMarkets.map((market) => (
                  <div
                    key={market.code}
                    className="group rounded-lg border border-white/10 bg-[#07070c]/62 p-4 transition-all hover:border-[#c4a84f]/40 hover:bg-[#c4a84f]/[0.055]"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`h-9 w-12 overflow-hidden rounded-sm bg-gradient-to-br ${market.colors} shadow-[0_0_0_1px_rgba(255,255,255,0.18)_inset]`}>
                          <span className="flex h-full w-full items-center justify-center bg-black/10 text-[10px] font-black tracking-[0.12em] text-white drop-shadow">
                            {market.code}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <div className="truncate text-sm font-black text-white">{market.country}</div>
                          <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/30">Visitors</div>
                        </div>
                      </div>
                      <span className="text-sm font-black text-[#f0d080]">{market.visits}</span>
                    </div>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/8">
                      <div className={`h-full rounded-full bg-gradient-to-r from-[#c4a84f] to-[#f0d080] ${market.fill}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-16 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="relative w-9 h-9 flex items-center justify-center flex-shrink-0">
              <div className="absolute inset-0 rounded-full border-2 border-[#c4a84f] opacity-40" />
              <span className="text-lg font-black text-gold-gradient">Q</span>
            </div>
            <span className="text-lg font-black tracking-widest text-white uppercase">
              Qarni<span className="text-gold-gradient">Sports</span>
            </span>
          </div>
          <p className="text-white/35 text-sm leading-relaxed mb-5">
            Custom sportswear, uniforms, activewear, and accessories manufacturer for brands, teams, and distributors.
          </p>
          <div className="flex gap-2.5">
            {([ ['instagram', 'Instagram'], ['facebook', 'Facebook'], ['twitter', 'Twitter X'], ['youtube', 'YouTube'] ] as const).map(([icon, label]) => (
              <button
                key={icon}
                aria-label={label}
                className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center hover:border-[#c4a84f]/50 hover:bg-[#c4a84f]/10 transition-all text-white/40 hover:text-white"
              >
                <Icon name={icon} size="xs" />
              </button>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div>
          <h4 className="text-[10px] font-black tracking-[0.3em] uppercase text-[#c4a84f] mb-5">Categories</h4>
          <ul className="space-y-2">
            {categories.map((sport) => (
              <li key={sport.id}>
                <Link
                  to={`/sport/${sport.slug}`}
                  className="text-sm text-white/45 hover:text-[#f0d080] transition-colors flex items-center gap-2"
                >
                  {sport.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-[10px] font-black tracking-[0.3em] uppercase text-[#c4a84f] mb-5">Quick Links</h4>
          <ul className="space-y-2">
            {[
              { label: 'All Products', path: '/sports' },
              { label: 'Services', path: '/services' },
              { label: 'Catalogues', path: '/catalogues' },
              { label: 'Apparel', path: '/sports#apparel' },
              { label: 'Uniforms', path: '/sports#uniforms' },
              { label: 'Sports', path: '/sports#sports' },
              { label: 'Accessories', path: '/sports#accessories' },
            ].map((link) => (
              <li key={link.label}>
                <Link to={link.path} className="text-sm text-white/45 hover:text-[#f0d080] transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-[10px] font-black tracking-[0.3em] uppercase text-[#c4a84f] mb-5">Contact</h4>
          <div className="space-y-3">
            {([
              ['globe', 'www.qarnisports.com'],
              ['email', 'qarnisportskt@gmail.com'],
              ['phone', 'Contact: +92 345 6760763'],
              ['phone', 'WhatsApp: +92 305 2243875'],
              ['map', 'Lahore, Pakistan'],
            ] as const).map(([icon, text]) => (
              <div key={text} className="flex items-center gap-3">
                <span className="text-[#c4a84f]/50 flex-shrink-0"><Icon name={icon} size="xs" /></span>
                <span className="text-sm text-white/45">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[rgba(196,168,79,0.08)]">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-16 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/25">© 2026 QarniSports. All rights reserved.</p>
          <div className="flex gap-5">
            {['Privacy Policy', 'Terms of Service', 'Returns'].map((t) => (
              <button key={t} className="text-xs text-white/25 hover:text-[#c4a84f] transition-colors">{t}</button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
