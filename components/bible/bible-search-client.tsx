"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export type BibleSearchResult = {
  label: string;
  href: string;
  excerpt: string;
};

interface BibleSearchClientProps {
  results: BibleSearchResult[];
  initialQuery: string;
  basePath?: string;
}

export function BibleSearchClient({
  results,
  initialQuery,
  basePath = "/biblia",
}: BibleSearchClientProps) {
  const router = useRouter();
  const [q, setQ] = useState(initialQuery);
  const [pending, startTransition] = useTransition();

  return (
    <div className="space-y-4">
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          startTransition(() => {
            router.push(`${basePath}/busca?q=${encodeURIComponent(q.trim())}`);
          });
        }}
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="João 3:16, Salmos 91, amor..."
            className="pl-9"
          />
        </div>
        <Button type="submit" variant="gold" disabled={pending}>
          Buscar
        </Button>
      </form>

      {initialQuery && results.length === 0 && (
        <p className="text-sm text-muted-foreground">Nenhum resultado.</p>
      )}

      <ul className="space-y-2">
        {results.map((r) => (
          <li key={r.href + r.label}>
            <Link
              href={r.href}
              className="block rounded-xl border border-border bg-card px-4 py-3 transition-colors hover:border-gold/40 hover:bg-gold/5"
            >
              <p className="font-semibold text-foreground">{r.label}</p>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                {r.excerpt}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
