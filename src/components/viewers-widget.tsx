"use client";

import { useState, useEffect, useRef } from "react";

function randomViewers(current: number): number {
  // Drift by ±3, stay between 4 and 47
  const delta = Math.floor(Math.random() * 7) - 3;
  return Math.min(47, Math.max(4, current + delta));
}

export function ViewersWidget() {
  const [count, setCount] = useState(() => Math.floor(Math.random() * 20) + 10);
  const [bump, setBump] = useState(false);
  const prevCount = useRef(count);

  useEffect(() => {
    const id = setInterval(() => {
      setCount((c) => {
        const next = randomViewers(c);
        prevCount.current = c;
        return next;
      });
      setBump(true);
      setTimeout(() => setBump(false), 400);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  const rising = count >= prevCount.current;

  return (
    <div className="flex items-center gap-2 text-xs text-warm-gray">
      {/* Pulsing dot */}
      <span className="relative flex h-2 w-2 flex-shrink-0">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-500" />
      </span>

      <span>
        <span
          className="font-semibold text-charcoal tabular-nums"
          style={{
            display: "inline-block",
            transition: "color 0.3s",
            color: bump ? (rising ? "oklch(0.45 0.15 25)" : "oklch(0.45 0.12 220)") : undefined,
          }}
        >
          {count}
        </span>{" "}
        {count === 1 ? "person is" : "people are"} viewing this right now
      </span>
    </div>
  );
}
