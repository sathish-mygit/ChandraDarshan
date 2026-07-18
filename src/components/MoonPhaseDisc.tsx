'use client';

import { cn } from '@/lib/utils';

type MoonPhaseDiscProps = {
  moonFill: number;
  isWaxing: boolean;
  className?: string;
};

export function MoonPhaseDisc({
  moonFill,
  isWaxing,
  className,
}: MoonPhaseDiscProps) {
  const clampedFill = Math.min(1, Math.max(0, moonFill));
  const illumination = clampedFill * 100;

  const shadowOffset = isWaxing
    ? 100 - illumination
    : illumination - 100;

  return (
    <div
      className={cn(
        'relative flex h-40 w-40 items-center justify-center rounded-full border border-amber-500/20 bg-gradient-to-b from-slate-800 to-slate-950 shadow-[0_0_60px_rgba(245,158,11,0.15)]',
        className,
      )}
      aria-hidden
    >
      <div className="relative h-32 w-32 overflow-hidden rounded-full bg-slate-900">
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
            transition: 'transform 0.4s ease',
          }}
        />
      </div>
    </div>
  );
}
