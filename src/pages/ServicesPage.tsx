import { Link } from 'react-router-dom';
import Icon from '../components/Icon';

const services = [
  {
    title: 'Prototyping & Sampling',
    text: 'We convert your reference, sketch, or tech pack into a production-ready sample for approval.',
    icon: 'refresh',
    image: '/service-images/prototyping-sampling.png',
  },
  {
    title: 'Research & Development',
    text: 'Fabric, fit, trims, and construction details are refined before the order moves into production.',
    icon: 'search',
    image: '/service-images/research-development.png',
  },
  {
    title: 'Material & Fabric Sourcing',
    text: 'Performance fabrics, activewear blends, uniform materials, linings, and accessories are sourced to match your requirement.',
    icon: 'globe',
    image: '/service-images/material-fabric-sourcing.png',
  },
  {
    title: 'Pattern, Sizing & Grading',
    text: 'Custom sizing, team sets, private label fits, and graded size ranges are prepared for consistent output.',
    icon: 'check',
    image: '/service-images/pattern-sizing-grading.png',
  },
  {
    title: 'Printing & Embroidery',
    text: 'Logos, names, numbers, patches, labels, and brand details can be applied according to your artwork.',
    icon: 'shield',
    image: '/service-images/printing-embroidery.png',
  },
  {
    title: 'Cut, Stitch & Finish',
    text: 'Orders are cut, stitched, finished, and checked with attention to durability and presentation.',
    icon: 'heart',
    image: '/service-images/cut-stitch-finish.png',
  },
  {
    title: 'Quality Control',
    text: 'Measurements, stitching, color matching, finishing, and packing are reviewed before dispatch.',
    icon: 'shield',
    image: '/service-images/quality-control.png',
  },
  {
    title: 'Packing & Export Support',
    text: 'Bulk orders can be packed by style, size, team, or brand requirement for smoother handling.',
    icon: 'truck',
    image: '/service-images/packing-export-support.png',
  },
] as const;

const process = [
  'Share reference or tech pack',
  'Confirm material and sizing',
  'Approve sample',
  'Start bulk production',
  'Quality check and packing',
] as const;

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-[#07070c] text-white">
      <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_24%,rgba(196,168,79,0.16),transparent_32%),radial-gradient(circle_at_20%_15%,rgba(255,255,255,0.08),transparent_26%)]" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#c4a84f]/35 to-transparent" />

        <div className="relative max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-16">
          <div className="max-w-4xl">
            <div className="inline-flex items-center rounded-full border border-[#c4a84f]/35 bg-[#c4a84f]/8 px-5 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-[#f0d080]">
              Manufacturing Services
            </div>

            <h1 className="mt-8 text-5xl sm:text-6xl lg:text-7xl font-black leading-[0.95] tracking-normal">
              Custom Sportswear <span className="text-gold-gradient">Production</span>
            </h1>

            <p className="mt-7 max-w-3xl text-base sm:text-lg leading-8 text-white/58">
              QarniSports supports brands, teams, clubs, and distributors with custom sportswear, uniforms,
              activewear, and accessories from sample development to finished bulk orders.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              <Link
                to="/sports"
                className="inline-flex items-center justify-center gap-3 rounded-md bg-[#d9b957] px-7 py-4 text-xs font-black uppercase tracking-[0.14em] text-black transition-all hover:bg-[#f0d080]"
              >
                View Categories
                <Icon name="arrow-right" size="xs" />
              </Link>
              <a
                href="https://wa.me/923208524230"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 rounded-md border border-[#d9b957]/70 px-7 py-4 text-xs font-black uppercase tracking-[0.14em] text-[#f0d080] transition-all hover:bg-[#d9b957]/10"
              >
                Discuss Order
                <Icon name="arrow-right" size="xs" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-16">
          <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.34em] text-[#c4a84f]">
                What We Do
              </p>
              <h2 className="mt-3 text-3xl sm:text-4xl font-black tracking-normal">
                Services for Custom Orders
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-white/45">
              Use these services for apparel, uniforms, sportswear, and accessories. Final details can be adjusted
              according to buyer requirements and production quantity.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {services.map((service) => (
              <article
                key={service.title}
                className="group overflow-hidden rounded-lg border border-white/10 bg-white/[0.025] transition-all hover:border-[#c4a84f]/40 hover:bg-[#c4a84f]/[0.045]"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-[#0d0d14]">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07070c]/75 via-transparent to-transparent" />
                  <div className="absolute left-4 bottom-4 flex h-11 w-11 items-center justify-center rounded-full border border-[#c4a84f]/45 bg-[#07070c]/80 text-[#f0d080] backdrop-blur-sm">
                    <Icon name={service.icon} size="sm" />
                  </div>
                </div>
                <div className="p-6 pt-5">
                  <h3 className="text-lg font-black tracking-normal text-white">{service.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/45">{service.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[rgba(196,168,79,0.12)] bg-[#040408] py-16 sm:py-20">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-16">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.34em] text-[#c4a84f]">
                Process
              </p>
              <h2 className="mt-3 text-3xl sm:text-4xl font-black tracking-normal">
                From idea to finished order
              </h2>
              <p className="mt-5 text-sm leading-7 text-white/45">
                The workflow is simple for buyers: send the product reference, approve the sample, then move into
                bulk production with controlled finishing and packing.
              </p>
            </div>

            <div className="grid gap-3">
              {process.map((step, index) => (
                <div
                  key={step}
                  className="flex items-center gap-4 rounded-lg border border-white/10 bg-white/[0.025] p-4"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d9b957] text-sm font-black text-black">
                    {index + 1}
                  </span>
                  <span className="text-sm font-bold uppercase tracking-[0.12em] text-white/70">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
