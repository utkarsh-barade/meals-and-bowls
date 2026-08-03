import { motion } from 'framer-motion';
import { FadeUp } from '@/components/landing/animations/FadeUp';

/**
 * SectionHeader — Reusable heading block used by every landing section.
 */
export function SectionHeader({
  badge,
  title,
  highlight,
  description,
  centered   = true,
  theme      = 'light',
}) {
  const textColor  = theme === 'dark'
    ? 'text-white'
    : 'text-land-dark dark:text-white';

  const mutedColor = theme === 'dark'
    ? 'text-gray-400'
    : 'text-gray-500 dark:text-gray-300';

  const badgeBg    = theme === 'dark'
    ? 'bg-white/10 border-white/20 text-orange-300'
    : 'bg-orange-100 dark:bg-orange-950/80 border-orange-200/60 dark:border-orange-500/40 text-orange-700 dark:text-orange-300';

  return (
    <FadeUp className={centered ? 'text-center' : ''}>
      {badge && (
        <span className={`
          inline-flex items-center px-4 py-1.5 rounded-full border text-sm font-semibold
          mb-4 ${badgeBg}
        `}>
          {badge}
        </span>
      )}

      <h2 className={`
        font-['Poppins'] font-bold
        text-3xl sm:text-4xl md:text-5xl
        leading-[1.1] tracking-tight mb-4
        ${textColor}
      `}>
        {title}{' '}
        {highlight && (
          <span className="text-land-primary">{highlight}</span>
        )}
      </h2>

      {description && (
        <p className={`
          text-base sm:text-lg leading-relaxed
          ${centered ? 'max-w-2xl mx-auto' : 'max-w-xl'}
          ${mutedColor}
        `}>
          {description}
        </p>
      )}
    </FadeUp>
  );
}
