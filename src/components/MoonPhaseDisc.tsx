'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

const REVEAL_DURATION_MS = 1200;

type MoonPhaseDiscProps = {
  moonFill: number;
  isWaxing: boolean;
  ariaLabel?: string;
  className?: string;
  onRevealComplete?: () => void;
};

export function MoonPhaseDisc({
  moonFill,
  isWaxing,
  ariaLabel,
  className,
  onRevealComplete,
}: MoonPhaseDiscProps) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    setRevealed(false);
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setRevealed(true));
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [moonFill, isWaxing]);

  useEffect(() => {
    if (!revealed) {
      return;
    }
    const id = setTimeout(() => onRevealComplete?.(), REVEAL_DURATION_MS);
    return () => clearTimeout(id);
  }, [revealed, onRevealComplete]);

  const targetFill = Math.min(1, Math.max(0, moonFill));
  const displayFill = revealed ? targetFill : 0;
  const illumination = displayFill * 100;

  const shadowOffset = isWaxing
    ? 100 - illumination
    : illumination - 100;

  return (
    <div
      className={cn(
        'relative flex h-44 w-44 items-center justify-center rounded-full border border-amber-500/20 bg-gradient-to-b from-slate-800 to-slate-950 shadow-[0_0_60px_rgba(245,158,11,0.15)] moon-reveal-glow',
        className,
      )}
      role="img"
      aria-label={ariaLabel}
    >
      <div
        className={cn(
          'relative h-36 w-36 overflow-hidden rounded-full bg-slate-900',
          !revealed && 'animate-pulse',
        )}
      >
        <div
          className="absolute inset-0 rounded-full bg-amber-100/95"
          style={{
            boxShadow: 'inset -4px -4px 12px rgba(0,0,0,0.25)',
          }}
        />
        <div
          className="absolute inset-0 rounded-full bg-slate-900"
          style={{
            transform: `translateX(${shadowOffset}%)`,
            transition: `transform ${REVEAL_DURATION_MS}ms ease-out`,
          }}
        />
      </div>
    </div>
  );
}
