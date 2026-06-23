import { cn } from "@/lib/utils";

const DEVELOPER_URL = "https://alexmarinho.com/";

interface DeveloperCreditProps {
  className?: string;
  linkClassName?: string;
}

export function DeveloperCredit({ className, linkClassName }: DeveloperCreditProps) {
  return (
    <p className={cn("text-xs", className)}>
      Desenvolvedor:{" "}
      <a
        href={DEVELOPER_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={cn("font-medium text-gold transition-colors hover:underline", linkClassName)}
      >
        A7 Empreendimento Digital
      </a>
    </p>
  );
}
