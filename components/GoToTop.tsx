import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FiArrowUp } from 'react-icons/fi';
import { useAppStore } from '@/store';

export default function GoToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const { language } = useAppStore();
  const positionClass = language === 'ar' ? 'right-8' : 'left-8';

  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0, y: 20 }}
          transition={{
            duration: 0.4,
            ease: [0.22, 1, 0.36, 1],
          }}
          whileHover={{
            scale: 1.12,
            boxShadow: '0 20px 40px rgba(13, 22, 21, 0.25)',
          }}
          whileTap={{ scale: 0.95 }}
          title={language === 'en' ? 'Go to top' : 'العودة للأعلى'}
          aria-label="Go to top"
          className={`fixed bottom-8 ${positionClass} z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#0D1615] to-[#A5C232] text-white shadow-lg ring-2 ring-white/20 transition-all duration-300 hover:ring-white/40 focus:outline-none focus:ring-4 focus:ring-[#A5C232]/50 group`}
        >
          <FiArrowUp className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />

          {/* Pulse Ring Animation */}
          <motion.div
            animate={{
              boxShadow: [
                '0 0 0 0 rgba(165, 194, 50, 0.5)',
                '0 0 0 12px rgba(165, 194, 50, 0)',
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeOut',
            }}
            className="absolute inset-0 rounded-full"
          />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
