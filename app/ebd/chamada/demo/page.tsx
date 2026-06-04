import { redirect } from "next/navigation";

/** URL antiga de demonstração → fluxo real */
export default function ChamadaDemoRedirectPage() {
  redirect("/ebd/chamada/nova");
}
