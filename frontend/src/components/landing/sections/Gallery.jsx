import { motion } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';
import { SectionHeader } from '@/components/landing/ui/SectionHeader';
import { FadeUp }        from '@/components/landing/animations/FadeUp';

// Real generated WebP food photography assets
import thaliImg  from '@/assets/landing/thali-hero.webp';
import dalImg    from '@/assets/landing/gallery-dal.webp';
import rotiImg   from '@/assets/landing/gallery-roti.webp';
import riceImg   from '@/assets/landing/gallery-rice.webp';
import tiffinImg from '@/assets/landing/gallery-tiffin.webp';
import sabziImg  from '@/assets/landing/gallery-sabzi.webp';

/**
 * Gallery items.
 * All 6 cards now use real high-resolution WebP food photography.
 */
const GALLERY_ITEMS = [
  {
    id:      1,
    image:   thaliImg,
    alt:     'A beautiful Indian thali with dal, roti, rice and vegetables',
    label:   'Full Thali',
    span:    'row-span-2',
    aspect:  'aspect-[3/4]',
  },
  {
    id:      2,
    image:   dalImg,
    alt:     'Golden dal tadka in a copper bowl with ghee tadka on top',
    label:   'Dal Tadka',
    span:    '',
    aspect:  'aspect-square',
  },
  {
    id:      3,
    image:   rotiImg,
    alt:     'Freshly made soft rotis with green palak sabzi',
    label:   'Roti & Sabzi',
    span:    '',
    aspect:  'aspect-square',
  },
  {
    id:      4,
    image:   riceImg,
    alt:     'Fresh Indian basmati rice and yellow dal in traditional ceramic bowls',
    label:   'Rice & Dal',
    span:    'row-span-2',
    aspect:  'aspect-[3/4]',
  },
  {
    id:      5,
    image:   tiffinImg,
    alt:     'Freshly packed 3-tier stainless steel tiffin box for daily meal delivery',
    label:   'Tiffin Box',
    span:    '',
    aspect:  'aspect-square',
  },
  {
    id:      6,
    image:   sabziImg,
    alt:     'Seasonal vegetable sabzi with paneer cubes and green peas',
    label:   'Seasonal Sabzi',
    span:    '',
    aspect:  'aspect-square',
  },
];

/* ── Gallery Card ─────────────────────────────────────────────── */
function GalleryCard({ item, index }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <FadeUp delay={index * 0.07} className={`${item.span} min-w-0`}>
      <motion.div
        className={`relative overflow-hidden rounded-3xl h-full cursor-pointer group ${item.aspect}`}
        whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 350, damping: 24 }}
      >
        <motion.img
          src={item.image}
          alt={item.alt}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover"
          whileHover={prefersReducedMotion ? {} : { scale: 1.1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        />
        {/* Overlay */}
        <div className="
          absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent
          opacity-0 group-hover:opacity-100 transition-opacity duration-300
        " />

        {/* Label chip */}
        <div className="
          absolute bottom-3 left-3
          px-3.5 py-1.5 rounded-full
          bg-white/95 backdrop-blur-sm
          text-xs font-bold text-land-dark
          opacity-0 group-hover:opacity-100
          translate-y-2 group-hover:translate-y-0
          transition-all duration-300
          shadow-md
        ">
          {item.label}
        </div>

        {/* Zoom icon */}
        <div className="
          absolute top-3 right-3 w-8 h-8 rounded-full
          bg-white/95 backdrop-blur-sm
          flex items-center justify-center
          opacity-0 group-hover:opacity-100
          scale-75 group-hover:scale-100
          transition-all duration-300
          shadow-md
        ">
          <span className="text-sm" aria-hidden="true">🔍</span>
        </div>
      </motion.div>
    </FadeUp>
  );
}

/* ── Section ──────────────────────────────────────────────────── */
export default function Gallery() {
  return (
    <section
      id="gallery"
      aria-labelledby="gallery-heading"
      className="py-20 md:py-28 bg-white dark:bg-gray-900 transition-colors duration-300 scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-14">
          <SectionHeader
            badge="Our Food"
            title="Fresh, vibrant meals"
            highlight="every day."
            description="A glimpse into the meals we prepare with love — homemade quality, fresh ingredients, beautiful presentation."
          />
        </div>

        {/* Masonry-style CSS grid */}
        <div
          className="
            grid grid-cols-2 md:grid-cols-3
            grid-rows-[auto_auto_auto_auto]
            gap-4 md:gap-5
            auto-rows-[200px] md:auto-rows-[220px]
          "
          role="list"
          aria-label="Food gallery"
        >
          {GALLERY_ITEMS.map((item, i) => (
            <div key={item.id} role="listitem" className={item.span}>
              <GalleryCard item={item} index={i} />
            </div>
          ))}
        </div>

        <FadeUp delay={0.3}>
          <p className="text-center text-sm text-gray-400 mt-8">
            All meals freshly prepared daily. Menu varies by season and availability.
          </p>
        </FadeUp>
      </div>
    </section>
  );
}
