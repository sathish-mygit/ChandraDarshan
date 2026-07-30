'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { HelpCircle } from 'lucide-react';
import { ANALYTICS_EVENTS, glossaryOpenedParams, logEvent } from '@/lib/analytics';
import type { GlossaryTermId } from '@/lib/i18n/glossary';
import { getGlossaryTerm } from '@/lib/i18n/glossary';
import type { AppLanguage } from '@/lib/types';
import { cn } from '@/lib/utils';

const VIEWPORT_PADDING = 16;
const TOOLTIP_GAP = 8;

type LearnTooltipProps = {
  termId: GlossaryTermId;
  language: AppLanguage;
  className?: string;
};

function clampTooltipPosition(
  anchor: DOMRect,
  tooltip: DOMRect,
): { left: number; top: number } {
  let left = anchor.left + anchor.width / 2 - tooltip.width / 2;
  left = Math.max(
    VIEWPORT_PADDING,
    Math.min(left, window.innerWidth - tooltip.width - VIEWPORT_PADDING),
  );

  let top = anchor.bottom + TOOLTIP_GAP;
  if (top + tooltip.height > window.innerHeight - VIEWPORT_PADDING) {
    top = anchor.top - tooltip.height - TOOLTIP_GAP;
  }

  return { left, top };
}

export function LearnTooltip({ termId, language, className }: LearnTooltipProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({
    visibility: 'hidden',
  });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const text = getGlossaryTerm(termId, language);

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (!open || !buttonRef.current || !tooltipRef.current) {
      return;
    }

    const updatePosition = () => {
      const button = buttonRef.current;
      const tooltip = tooltipRef.current;
      if (!button || !tooltip) {
        return;
      }

      const { left, top } = clampTooltipPosition(
        button.getBoundingClientRect(),
        tooltip.getBoundingClientRect(),
      );

      setTooltipStyle({
        position: 'fixed',
        left,
        top,
        visibility: 'visible',
      });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [open, text]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (
        buttonRef.current?.contains(target) ||
        tooltipRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    };

    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  return (
    <span className={cn('inline-flex', className)}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => {
          setOpen((value) => {
            const nextOpen = !value;
            if (nextOpen) {
              setTooltipStyle({ visibility: 'hidden' });
              logEvent(
                ANALYTICS_EVENTS.GLOSSARY_OPENED,
                glossaryOpenedParams(termId),
              );
            }
            return nextOpen;
          });
        }}
        className="text-amber-500/70 transition hover:text-amber-300"
        aria-label="Learn more"
        aria-expanded={open}
      >
        <HelpCircle className="h-4 w-4" />
      </button>
      {open && mounted
        ? createPortal(
            <div
              ref={tooltipRef}
              role="tooltip"
              style={tooltipStyle}
              className="z-50 w-56 max-w-[calc(100vw-2rem)] rounded-xl border border-slate-700 bg-slate-900 p-3 text-left text-xs leading-relaxed text-slate-300 shadow-lg"
            >
              {text}
            </div>,
            document.body,
          )
        : null}
    </span>
  );
}
