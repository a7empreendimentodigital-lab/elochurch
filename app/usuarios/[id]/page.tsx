import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function UsuarioDetailRedirectPage({ params }: PageProps) {
  const { id } = await params;
  redirect(`/usuarios/${id}/editar`);
}
