"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface HarpaCultoLookupProps {
  initialValue?: string;
  basePath?: string;
}

export function HarpaCultoLookup({
  initialValue = "15, 212, 304, 545",
  basePath = "/portal/harpa/culto",
}: HarpaCultoLookupProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [value, setValue] = useState(initialValue);

  return (
    <div className="grid gap-3">
      <div className="space-y-2">
        <Label>Números dos hinos</Label>
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="15, 212, 304, 545"
        />
      </div>
      <Button
        variant="gold"
        disabled={pending}
        onClick={() => {
          startTransition(() => {
            router.push(`${basePath}?nums=${encodeURIComponent(value.trim())}`);
          });
        }}
      >
        {pending ? "Carregando..." : "Ver hinos"}
      </Button>
    </div>
  );
}
