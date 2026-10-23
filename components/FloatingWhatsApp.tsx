import { motion } from 'motion/react';
import { FaWhatsapp } from 'react-icons/fa';
import { useAppStore } from '@/store';

const WHATSAPP_PHONE = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '966582848394';

export default function FloatingWhatsApp() {
  const { language } = useAppStore();
  const WHATSAPP_MESSAGE = language === 'en'
    ? 'Hello Herbiva, I am interested in your premium herbs and spices products. Could you please share your catalog and wholesale pricing? Thank you.'
    : 'مرحباً Herbiva، أنا مهتم بمنتجاتكم الممتازة من الأعشاب والتوابل. هل يمكنكم مشاركة كتالوج المنتجات وأسعار الجملة؟ شكراً لكم.';
  const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
  const positionClass = language === 'ar' ? 'left-8' : 'right-8';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className={`fixed bottom-8 ${positionClass} z-40 flex flex-col ${language === 'ar' ? 'items-start' : 'items-end'} gap-3`}
    >
      {/* Chat Bubble Tooltip */}
      <motion.div
        initial={{ opacity: 0, x: language === 'ar' ? -12 : 12 }}
        animate={{ opacity: 0, x: language === 'ar' ? -12 : 12 }}
        whileHover={{ opacity: 1, x: language === 'ar' ? -20 : 20 }}
        transition={{ duration: 0.3 }}
        className={`hidden md:block px-4 py-2 rounded-full bg-[#25d366] text-white text-sm font-semibold shadow-lg whitespace-nowrap ${language === 'ar' ? 'mr-4' : 'ml-4'}`}
      >
        💬 {language === 'en' ? 'Message us!' : 'راسلنا!'}
      </motion.div>

      {/* Main WhatsApp Button */}
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noreferrer"
        title={language === 'en' ? 'Chat on WhatsApp' : 'اتصل عبر واتساب'}
        aria-label="Chat on WhatsApp"
        whileHover={{
          scale: 1.15,
          boxShadow: '0 25px 50px rgba(37, 211, 102, 0.35)',
        }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, y: 20, scale: 0.8 }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        transition={{
          duration: 0.5,
          delay: 0.1,
          ease: [0.22, 1, 0.36, 1],
        }}
        className={`relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#25d366] to-[#1fbd5a] text-white shadow-[0_20px_45px_rgba(37,211,102,0.3)] ring-2 ring-white/20 transition-all duration-300 hover:ring-white/40 focus:outline-none focus:ring-4 focus:ring-[#25d366]/50 group`}
      >
        <FaWhatsapp className="h-7 w-7 transition-transform duration-300 group-hover:scale-110" />

        {/* Pulse Ring Animation */}
        <motion.div
          animate={{
            boxShadow: [
              '0 0 0 0 rgba(37, 211, 102, 0.5)',
              '0 0 0 12px rgba(37, 211, 102, 0)',
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeOut',
          }}
          className="absolute inset-0 rounded-full"
        />
      </motion.a>
    </motion.div>
  );
}
