import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pencil } from 'lucide-react';

interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
}

interface Props {
  onRecordClick: () => void;
  onLongPress: () => void;
}

let nextRippleId = 0;

export default function BreathingFAB({ onRecordClick, onLongPress }: Props) {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLongPress = useRef(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handlePointerDown = useCallback((_e: React.PointerEvent) => {
    isLongPress.current = false;
    longPressTimer.current = setTimeout(() => {
      isLongPress.current = true;
      onLongPress();
    }, 500);
  }, [onLongPress]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    if (isLongPress.current) return;

    const rect = buttonRef.current?.getBoundingClientRect();
    if (rect) {
      const size = Math.max(rect.width, rect.height);
      const ripple: Ripple = {
        id: nextRippleId++,
        x: e.clientX - rect.left - size / 2,
        y: e.clientY - rect.top - size / 2,
        size,
      };
      setRipples((prev) => [...prev, ripple]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== ripple.id));
      }, 600);
    }
    onRecordClick();
  }, [onRecordClick]);

  return (
    <div
      className="fixed bottom-[calc(56px+env(safe-area-inset-bottom,0px))] left-1/2 -translate-x-1/2 z-50"
      style={{ touchAction: 'manipulation' }}
    >
      <motion.button
        ref={buttonRef}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        className="relative w-[72px] h-[72px] flex items-center justify-center overflow-hidden"
        style={{
          background: 'var(--color-amber)',
          borderRadius: '36% 64% 42% 58% / 56% 48% 52% 44%',
          animation: 'breathe 3s ease-in-out infinite',
          boxShadow: '0 4px 24px rgba(255, 191, 0, 0.4)',
        }}
        whileTap={{ scale: 0.9 }}
      >
        <Pencil size={28} color="#3E2723" strokeWidth={2} />

        <AnimatePresence>
          {ripples.map((r) => (
            <motion.span
              key={r.id}
              className="absolute rounded-full pointer-events-none"
              style={{
                left: r.x,
                top: r.y,
                width: r.size,
                height: r.size,
                background: 'rgba(255, 255, 255, 0.35)',
              }}
              initial={{ scale: 0, opacity: 0.5 }}
              animate={{ scale: 2, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          ))}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
