"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { FormField } from "@/components/elo/form-field";
import { Button } from "@/components/ui/button";

interface FinPeriodoFilterProps {
  de: string;
  ate: string;
}

export function FinPeriodoFilter({ de, ate }: FinPeriodoFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const apply = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const params = new URLSearchParams(searchParams.toString());
    params.set("de", String(fd.get("de")));
    params.set("ate", String(fd.get("ate")));
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <form onSubmit={apply} className="flex flex-wrap items-end gap-3">
      <FormField
        label="De"
        name="de"
        type="date"
        defaultValue={de}
        className="w-40"
      />
      <FormField
        label="Até"
        name="ate"
        type="date"
        defaultValue={ate}
        className="w-40"
      />
      <Button type="submit" variant="outline" size="sm">
        Filtrar
      </Button>
    </form>
  );
}
