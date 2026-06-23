"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Side = "front" | "back";

interface MemberCardMobileNavProps {
  children: React.ReactNode;
  className?: string;
}

export function MemberCardMobileNav({ children, className }: MemberCardMobileNavProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<Side>("front");

  const syncFromScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const mid = el.scrollLeft + el.clientWidth / 2;
    const cards = el.querySelectorAll<HTMLElement>("[data-card-side]");
    if (cards.length < 2) return;
    const backStart = cards[1].offsetLeft;
    setActive(mid >= backStart ? "back" : "front");
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    syncFromScroll();
    el.addEventListener("scroll", syncFromScroll, { passive: true });
    return () => el.removeEventListener("scroll", syncFromScroll);
  }, [syncFromScroll]);

  const scrollTo = (side: Side) => {
    const el = scrollRef.current;
    if (!el) return;
    const target = el.querySelector<HTMLElement>(
      `[data-card-side="${side}"]`
    );
    target?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    setActive(side);
  };

  return (
    <div className={cn("w-full md:contents", className)}>
      <div className="mb-3 flex items-center justify-between gap-2 md:hidden">
        <p className="text-xs text-muted-foreground">
          Carteirinha em formato horizontal — deslize ou toque:
        </p>
        <div className="flex shrink-0 rounded-full border border-border bg-muted/50 p-0.5">
          <button
            type="button"
            onClick={() => scrollTo("front")}
            className={cn(
              "rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wide transition-colors",
              active === "front"
                ? "bg-[#0B2D5C] text-white"
                : "text-muted-foreground"
            )}
          >
            Frente
          </button>
          <button
            type="button"
            onClick={() => scrollTo("back")}
            className={cn(
              "rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wide transition-colors",
              active === "back"
                ? "bg-[#0B2D5C] text-white"
                : "text-muted-foreground"
            )}
          >
            Verso
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className={cn(
          "flex w-full snap-x snap-mandatory gap-4 overflow-x-auto pb-2 elo-scrollbar",
          "touch-pan-x [-webkit-overflow-scrolling:touch]",
          "md:flex-col md:items-start md:gap-10 md:overflow-visible md:snap-none md:pb-0"
        )}
      >
        {children}
      </div>
    </div>
  );
}
