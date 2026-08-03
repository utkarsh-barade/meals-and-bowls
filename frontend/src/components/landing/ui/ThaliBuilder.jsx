import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { RotateCcw, Sparkles, CheckCircle2 } from 'lucide-react';

// Real katori food bowl WebP photography assets
import rotiImg   from '@/assets/landing/item-roti.webp';
import sabjiImg  from '@/assets/landing/item-sabji.webp';
import dalImg    from '@/assets/landing/item-dal.webp';
import riceImg   from '@/assets/landing/item-rice.webp';
import raitaImg  from '@/assets/landing/item-raita.webp';
import saladImg  from '@/assets/landing/item-salad.webp';
import pickleImg from '@/assets/landing/item-pickle.webp';

/* ── 7 Thali Items with Real Photos & Platter Coordinates ─────── */
const THALI_STEPS = [
  {
    id:       'roti',
    name:     'Roti',
    detail:   'Soft, freshly made Wheat Rotis',
    image:    rotiImg,
    position: 'top-[42%] left-[40%] -translate-x-1/2 -translate-y-1/2',
    size:     'w-24 h-24 sm:w-32 sm:h-32',
    delay:    0.2,
  },
  {
    id:       'sabji',
    name:     'Seasonal Sabji',
    detail:   'Freshly cooked seasonal vegetable curry',
    image:    sabjiImg,
    position: 'top-[22%] left-[26%] -translate-x-1/2 -translate-y-1/2',
    size:     'w-20 h-20 sm:w-28 sm:h-28',
    delay:    0.5,
  },
  {
    id:       'dal',
    name:     'Dal Tadka',
    detail:   'Rich golden lentil curry with ghee tadka',
    image:    dalImg,
    position: 'top-[54%] left-[22%] -translate-x-1/2 -translate-y-1/2',
    size:     'w-20 h-20 sm:w-28 sm:h-28',
    delay:    0.8,
  },
  {
    id:       'rice',
    name:     'Basmati Rice',
    detail:   'Steamed aromatic white rice',
    image:    riceImg,
    position: 'top-[17%] left-[50%] -translate-x-1/2 -translate-y-1/2',
    size:     'w-22 h-22 sm:w-28 sm:h-28',
    delay:    1.1,
  },
  {
    id:       'raita',
    name:     'Raita',
    detail:   'Cool spiced curd with vegetable boondi',
    image:    raitaImg,
    position: 'top-[22%] left-[74%] -translate-x-1/2 -translate-y-1/2',
    size:     'w-20 h-20 sm:w-28 sm:h-28',
    delay:    1.4,
  },
  {
    id:       'salad',
    name:     'Fresh Salad',
    detail:   'Crispy cucumber, tomato & onion salad',
    image:    saladImg,
    position: 'top-[52%] left-[78%] -translate-x-1/2 -translate-y-1/2',
    size:     'w-20 h-20 sm:w-28 sm:h-28',
    delay:    1.7,
  },
  {
    id:       'pickle',
    name:     'Home-Style Pickle',
    detail:   'Tangy spicy traditional pickle',
    image:    pickleImg,
    position: 'top-[73%] left-[50%] -translate-x-1/2 -translate-y-1/2',
    size:     'w-16 h-16 sm:w-24 sm:h-24',
    delay:    2.0,
  },
];

export default function ThaliBuilder() {
  const prefersReducedMotion = useReducedMotion();
  const [activeItems, setActiveItems] = useState([]);
  const [isBuilding, setIsBuilding] = useState(false);
  const [highlightedItem, setHighlightedItem] = useState(null);

  // Auto-build thali on mount
  useEffect(() => {
    startBuildingSequence();
  }, []);

  const startBuildingSequence = () => {
    setActiveItems([]);
    setIsBuilding(true);
    setHighlightedItem(null);

    THALI_STEPS.forEach((step, idx) => {
      setTimeout(() => {
        setActiveItems((prev) => [...prev, step.id]);
        setHighlightedItem(step);

        if (idx === THALI_STEPS.length - 1) {
          setIsBuilding(false);
        }
      }, step.delay * 1000);
    });
  };

  return (
    <div className="w-full bg-gradient-to-br from-gray-900 via-land-dark to-gray-950 text-white rounded-[36px] p-6 sm:p-10 lg:p-12 shadow-2xl border border-white/10 relative overflow-hidden">

      {/* Glow aura background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 relative z-10 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/20 border border-orange-400/30 text-orange-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles size={14} className="text-orange-400" />
            Realistic Thali Assembly
          </div>
          <h3 className="font-['Poppins'] font-extrabold text-2xl sm:text-3xl text-white">
            Watch Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-land-primary via-amber-300 to-orange-400">7 Real Food Bowls</span> Drop Into Place
          </h3>
        </div>

        {/* Replay Control Button */}
        <button
          type="button"
          onClick={startBuildingSequence}
          disabled={isBuilding}
          className="
            inline-flex items-center gap-2 px-5 py-2.5 rounded-full
            bg-land-primary text-white font-bold text-xs uppercase tracking-wider
            hover:bg-orange-500 hover:scale-105 active:scale-95
            disabled:opacity-50 disabled:pointer-events-none
            transition-all duration-200 shadow-lg shadow-orange-500/30
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-land-primary
          "
        >
          {isBuilding ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Assembling Thali...
            </>
          ) : (
            <>
              <RotateCcw size={14} />
              Replay Thali Build
            </>
          )}
        </button>
      </div>

      {/* Main Container: Left Stainless Steel Thali Platter | Right Item List */}
      <div className="grid lg:grid-cols-12 gap-8 items-center relative z-10">

        {/* LEFT 7 COLS: Real Food Katori Bowls Dropping into Stainless Steel Platter */}
        <div className="lg:col-span-7 flex justify-center items-center py-4">
          <div className="relative w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] md:w-[460px] md:h-[460px]">

            {/* Stainless Steel Plate Rim */}
            <div className="
              absolute inset-0 rounded-full
              border-[14px] sm:border-[18px] border-gray-300/90
              bg-gradient-to-br from-gray-200 via-gray-100 to-gray-300
              shadow-[0_25px_60px_rgba(0,0,0,0.7),inset_0_4px_16px_rgba(0,0,0,0.4)]
              flex items-center justify-center
            ">
              {/* Inner Stainless Steel Surface */}
              <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-100 via-white to-gray-200 shadow-inner relative overflow-hidden">
                <div className="absolute inset-0 bg-radial from-transparent via-gray-200/20 to-gray-400/40 pointer-events-none" />
              </div>
            </div>

            {/* 7 Real Katori Bowls Dropping in One by One */}
            {THALI_STEPS.map((step) => {
              const isAdded = activeItems.includes(step.id);
              const isSelected = highlightedItem?.id === step.id;

              return (
                <div
                  key={step.id}
                  className={`absolute z-20 ${step.position}`}
                  onMouseEnter={() => setHighlightedItem(step)}
                >
                  <AnimatePresence>
                    {isAdded && (
                      <motion.div
                        initial={prefersReducedMotion ? { opacity: 0 } : { scale: 2.2, y: -90, opacity: 0 }}
                        animate={{ scale: isSelected ? 1.15 : 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{
                          type: 'spring',
                          stiffness: 360,
                          damping: 18,
                        }}
                        className={`
                          relative cursor-pointer rounded-full p-1
                          shadow-[0_12px_28px_rgba(0,0,0,0.5)]
                          ${step.size}
                          ${isSelected ? 'ring-4 ring-orange-400 ring-offset-2 ring-offset-gray-900 z-30' : ''}
                          transition-all duration-200
                        `}
                      >
                        <img
                          src={step.image}
                          alt={step.name}
                          className="w-full h-full object-cover rounded-full shadow-inner ring-2 ring-gray-300"
                        />
                        {/* Label Badge */}
                        <div className="
                          absolute -bottom-2 left-1/2 -translate-x-1/2
                          px-2 py-0.5 rounded-full
                          bg-gray-950/90 backdrop-blur-md border border-white/20
                          text-[9px] sm:text-[11px] font-extrabold text-white uppercase tracking-tighter whitespace-nowrap
                          shadow-md
                        ">
                          {step.name}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT 5 COLS: Interactive Item List */}
        <div className="lg:col-span-5 space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-orange-400 mb-2">
            7 Real Food Items Included
          </p>

          <div className="space-y-2">
            {THALI_STEPS.map((step, idx) => {
              const isAdded = activeItems.includes(step.id);
              const isSelected = highlightedItem?.id === step.id;

              return (
                <motion.div
                  key={step.id}
                  onClick={() => {
                    if (isAdded) setHighlightedItem(step);
                  }}
                  whileHover={{ x: 4 }}
                  className={`
                    p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer
                    flex items-center justify-between gap-3
                    ${isAdded
                      ? isSelected
                        ? 'bg-orange-500/20 border-orange-400 text-white shadow-lg'
                        : 'bg-white/5 border-white/10 text-gray-200 hover:bg-white/10'
                      : 'bg-white/2 border-white/5 text-gray-600 opacity-40'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={step.image}
                      alt={step.name}
                      className="w-10 h-10 rounded-full object-cover ring-1 ring-white/30 flex-shrink-0"
                    />
                    <div>
                      <p className="font-['Poppins'] font-bold text-sm leading-none text-white">
                        {step.name}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {step.detail}
                      </p>
                    </div>
                  </div>

                  {isAdded ? (
                    <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0" />
                  ) : (
                    <span className="text-xs font-mono text-gray-500">Step {idx + 1}</span>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
