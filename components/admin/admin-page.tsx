import { cn } from "@/lib/utils";

type AdminPageMaxWidth = "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl" | "wide" | "full";

const maxWidthClass: Record<AdminPageMaxWidth, string> = {
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl",
  "6xl": "max-w-6xl",
  "7xl": "max-w-7xl",
  wide: "max-w-[min(100%,1600px)]",
  full: "w-full max-w-none",
};

interface AdminPageProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: AdminPageMaxWidth;
}

/** Container padrão — usa largura total do painel por defeito */
export function AdminPage({
  children,
  className,
  maxWidth = "full",
}: AdminPageProps) {
  return (
    <div
      className={cn(
        "w-full space-y-5 pb-2 sm:space-y-6 sm:pb-4",
        maxWidth !== "full" && "mx-auto",
        maxWidthClass[maxWidth],
        className
      )}
    >
      {children}
    </div>
  );
}
