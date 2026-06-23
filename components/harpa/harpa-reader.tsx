"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { ChevronLeft, ChevronRight, Heart, Music2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  recordHarpaHistoryAction,
  toggleHarpaFavoriteAction,
} from "@/app/harpa/actions";
import { cn } from "@/lib/utils";

interface HarpaReaderProps {
  hymnId: string;
  numero: number;
  titulo: string;
  letra: string;
  coro?: string | null;
  tom?: string | null;
  categoria?: string | null;
  prev?: number | null;
  next?: number | null;
  basePath?: string;
  favorited?: boolean;
}

function splitStanzas(letra: string, coro?: string | null) {
  const coroText = coro?.trim() ?? "";
  const stanzas = letra
    .split(/\n\n+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .filter((s) => !coroText || s !== coroText);
  return stanzas;
}

function formatLines(text: string) {
  return text.split("\n").filter((line) => line.trim() !== "");
}

export function HarpaReader({
  hymnId,
  numero,
  titulo,
  letra,
  coro,
  tom,
  categoria,
  prev,
  next,
  basePath = "/harpa",
  favorited = false,
}: HarpaReaderProps) {
  const [, startHistory] = useTransition();
  const [favPending, startFav] = useTransition();
  const [isFavorite, setIsFavorite] = useState(favorited);

  useEffect(() => {
    startHistory(() => {
      void recordHarpaHistoryAction(hymnId);
    });
  }, [hymnId]);

  const stanzas = splitStanzas(letra, coro);
  const coroLines = coro ? formatLines(coro) : [];
  const hinoHref = (n: number) => `${basePath}/${n}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-5">
        <div className="min-w-0 space-y-1">
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Music2 className="h-4 w-4 shrink-0" />
            Hino {numero}
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {titulo}
          </h1>
          {(tom || categoria) && (
            <div className="flex flex-wrap gap-2 pt-1">
              {tom && <Badge variant="outline">Tom: {tom}</Badge>}
              {categoria && <Badge variant="outline">{categoria}</Badge>}
            </div>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          disabled={favPending}
          onClick={() => {
            startFav(async () => {
              const res = await toggleHarpaFavoriteAction(hymnId);
              if (res.success && res.data) setIsFavorite(res.data.favorited);
            });
          }}
          className={cn(isFavorite && "border-foreground/30")}
        >
          <Heart className={cn("mr-2 h-4 w-4", isFavorite && "fill-current")} />
          {isFavorite ? "Favorito" : "Favoritar"}
        </Button>
      </div>

      <div className="flex justify-between gap-2">
        {prev ? (
          <Button variant="outline" size="sm" asChild>
            <Link href={hinoHref(prev)}>
              <ChevronLeft className="mr-1 h-4 w-4" />
              Hino Anterior
            </Link>
          </Button>
        ) : (
          <div />
        )}
        {next ? (
          <Button variant="outline" size="sm" asChild>
            <Link href={hinoHref(next)}>
              Próximo Hino
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        ) : (
          <div />
        )}
      </div>

      <article className="max-w-2xl">
        <div className="space-y-8 text-left">
          {stanzas.map((stanza, i) => (
            <div key={i} className="space-y-1">
              {formatLines(stanza).map((line, j) => (
                <p
                  key={j}
                  className="text-base leading-[1.75] text-foreground sm:text-[1.0625rem]"
                >
                  {line}
                </p>
              ))}
              {i === 0 && coroLines.length > 0 && (
                <div className="mt-5 border-l-2 border-border pl-4">
                  <p className="mb-2 text-sm font-semibold text-foreground">
                    Coro
                  </p>
                  <div className="space-y-1">
                    {coroLines.map((line, j) => (
                      <p
                        key={j}
                        className="text-base leading-[1.75] text-foreground sm:text-[1.0625rem]"
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </article>
    </div>
  );
}
