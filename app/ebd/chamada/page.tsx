import { redirect } from "next/navigation";

/** /ebd/chamada → nova chamada */
export default function EbdChamadaIndexPage() {
  redirect("/ebd/chamada/nova");
}
