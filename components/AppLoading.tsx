import { motion, AnimatePresence } from 'motion/react';

interface AppLoadingProps {
  show: boolean;
}

export default function AppLoading({ show }: AppLoadingProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-x-0 top-0 z-[100] h-[3px] overflow-hidden bg-[#A5C232]/15"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          aria-hidden="true"
        >
          <motion.div
            className="h-full w-1/3 rounded-full bg-[#A5C232]"
            initial={{ x: '-100%' }}
            animate={{ x: '400%' }}
            transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
