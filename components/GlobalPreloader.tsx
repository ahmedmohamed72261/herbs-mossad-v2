import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppStore } from '@/store';
import { FiCheckCircle } from 'react-icons/fi';

export default function GlobalPreloader() {
  const { language } = useAppStore();
  const isEn = language === 'en';
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Check if preloader has already run in this session
    const hasLoaded = typeof window !== 'undefined' ? sessionStorage.getItem('herbivaeg_first_load') : null;
    if (hasLoaded) {
      setLoading(false);
      return;
    }

    // Lock body scroll while preloader is active
    document.body.style.overflow = 'hidden';

    const startTime = performance.now();
    const duration = 1600; // 1.6s smooth elegant load

    let animationFrameId: number;

    const updateProgress = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const rawProgress = Math.min(elapsed / duration, 1);
      // Easing curve for a realistic, sophisticated loading progression
      const eased = Math.round((1 - Math.pow(1 - rawProgress, 2.5)) * 100);
      setProgress(eased);

      if (rawProgress < 1) {
        animationFrameId = requestAnimationFrame(updateProgress);
      } else {
        setTimeout(() => {
          setLoading(false);
          document.body.style.overflow = '';
          try {
            sessionStorage.setItem('herbivaeg_first_load', 'true');
          } catch {
            // Safe fallback if sessionStorage is restricted
          }
        }, 320);
      }
    };

    animationFrameId = requestAnimationFrame(updateProgress);

    return () => {
      cancelAnimationFrame(animationFrameId);
      document.body.style.overflow = '';
    };
  }, []);

  const getStatusText = () => {
    if (progress < 40) {
      return isEn ? 'Cultivating Egyptian Botanicals...' : 'انتقاء أجود المحاصيل المصرية...';
    }
    if (progress < 75) {
      return isEn ? 'Verifying Export Purity & Standards...' : 'فحص الجودة ومعايير التصدير...';
    }
    return isEn ? 'Welcome to Herbivaeg Global' : 'مرحباً بكم في هيربيفاج الدولية';
  };

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="global-preloader"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.03,
            transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
          }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center overflow-hidden bg-[#0D1615] text-white selection:bg-[#A5C232] selection:text-white"
          role="status"
          aria-live="polite"
          aria-label="Loading Herbivaeg"
        >
          {/* Ambient organic glows */}
          <div className="pointer-events-none absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-[#A5C232]/12 blur-[140px]" />
          <div className="pointer-events-none absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full bg-[#D1F349]/10 blur-[150px]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(165,194,50,0.08)_0%,transparent_75%)]" />

          {/* Decorative faint grid lines */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.07] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem]" />

          <div className="relative z-10 flex flex-col items-center px-6 text-center">
            {/* Animated Logo Circle with Glow */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative mb-8"
            >
              {/* Pulsing ring */}
              <div className="absolute -inset-3 rounded-full bg-gradient-to-tr from-[#A5C232]/30 to-[#D1F349]/20 blur-md animate-pulse" />
              
              <div className="relative flex h-28 w-28 items-center justify-center rounded-full border border-white/15 bg-white/5 p-4 shadow-[0_15px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl">
                <img
                  src="/images/logo-circle.png"
                  alt="Herbivaeg"
                  className="h-full w-full object-contain filter drop-shadow-[0_4px_12px_rgba(165,194,50,0.35)]"
                />
              </div>

              {/* Orbiting micro dot */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                className="absolute -inset-1.5 rounded-full"
              >
                <div className="h-2.5 w-2.5 rounded-full bg-[#D1F349] shadow-[0_0_10px_#D1F349]" />
              </motion.div>
            </motion.div>

            {/* Brand Wordmark & Tagline */}
            <motion.div
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="mb-8"
            >
              <h1 className="font-display text-[26px] font-bold tracking-[0.28em] text-white md:text-[30px]">
                HERBIVAEG
              </h1>
              <p className="mt-1 text-[13px] font-medium tracking-[0.2em] text-[#A5C232] uppercase">
                {isEn ? 'Nature, Sourced with Trust' : 'الطبيعة… بمصدر موثوق'}
              </p>
            </motion.div>

            {/* Progress Bar Container */}
            <motion.div
              initial={{ scaleX: 0.9, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="w-64 max-w-full md:w-80"
            >
              <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-white/10 ring-1 ring-white/10">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[#A5C232] via-[#D1F349] to-[#A5C232] shadow-[0_0_15px_rgba(165,194,50,0.8)]"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: 'linear' }}
                />
              </div>

              {/* Progress Numbers & Status */}
              <div className="mt-4 flex items-center justify-between text-xs">
                <span className="inline-flex items-center gap-1.5 text-white/60">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#A5C232] animate-ping" />
                  {getStatusText()}
                </span>
                <span className="font-mono text-[13px] font-semibold text-[#D1F349]">
                  {progress}%
                </span>
              </div>
            </motion.div>

            {/* Standards Micro Badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-10 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] font-medium tracking-wider text-white/50"
            >
              <FiCheckCircle className="h-3.5 w-3.5 text-[#A5C232]" />
              {isEn ? 'ISO 22000 & HACCP CERTIFIED' : 'معتمد وفق ISO 22000 و HACCP'}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
