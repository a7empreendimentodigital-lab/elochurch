import { redirect } from "next/navigation";

/** /ebd/relatorio → lista de relatórios */
export default function EbdRelatorioIndexPage() {
  redirect("/ebd/relatorios");
}
