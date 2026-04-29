import { motion, AnimatePresence } from 'framer-motion';
import ThoughtInput, { type SaveData } from './ThoughtInput';

interface Props {
  visible: boolean;
  onSave: (content: string, data: SaveData) => Promise<void>;
  onClose: () => void;
}

export default function ImmersiveInput({ visible, onSave, onClose }: Props) {
  return (
    <AnimatePresence>
      {visible && (
        <>
          <motion.div
            className="fixed inset-0 z-40 immersive-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            onClick={onClose}
          />

          <motion.div
            className="fixed inset-x-4 top-[max(12vh,60px)] z-50"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 200, damping: 22 }}
          >
            <div
              className="rounded-[28px] p-5"
              style={{
                background: 'var(--color-cream-light)',
                boxShadow: '0 8px 40px var(--color-shadow-amber)',
              }}
            >
              <ThoughtInput
                onSave={async (content, data) => {
                  await onSave(content, data);
                }}
                className="amber-cursor"
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
