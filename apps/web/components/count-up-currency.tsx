"use client";

import type * as React from "react";
import { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/format";

// The first mount times itself from page load, so late hydration joins the count partway instead
// of snapping back to zero. Later mounts (client navigation) start from when they mount.
let hasHydrated = false;

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

/**
 * Counts up to `amount` once. The server renders the final value, reduced-motion users never see
 * the count, and screen readers only hear the final value.
 */
export function CountUpCurrency({
  amount,
  delayMs = 0,
  durationMs = 1200,
  ...props
}: React.ComponentProps<"span"> & { amount: number; delayMs?: number; durationMs?: number }) {
  const [shown, setShown] = useState(amount);

  useEffect(() => {
    const origin = hasHydrated ? performance.now() : 0;
    hasHydrated = true;
    if (!window.matchMedia("(prefers-reduced-motion: no-preference)").matches) return;

    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - origin - delayMs) / durationMs));
      setShown(amount * easeOutCubic(t));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [amount, delayMs, durationMs]);

  return (
    <span {...props}>
      <span aria-hidden="true">{formatCurrency(shown)}</span>
      <span className="sr-only">{formatCurrency(amount)}</span>
    </span>
  );
}
