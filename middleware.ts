import { withAuth } from "next-auth/middleware";
import {
  isAdminPath,
  isPortalPath,
  isPublicPath,
} from "@/lib/admin-routes";

export default withAuth({
  callbacks: {
    authorized: ({ token, req }) => {
      const path = req.nextUrl.pathname;

      if (isPublicPath(path)) return true;

      if (path === "/login") return true;

      if (isPortalPath(path)) {
        if (path === "/portal/login") return true;
        return token?.role === "membro" && !!token?.membroId;
      }

      if (isAdminPath(path)) {
        return token?.role === "admin" && !!token?.adminId;
      }

      return true;
    },
  },
  pages: { signIn: "/login" },
});

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/igrejas",
    "/igrejas/:path*",
    "/membros",
    "/membros/:path*",
    "/ebd",
    "/ebd/:path*",
    "/biblia",
    "/biblia/:path*",
    "/harpa",
    "/harpa/:path*",
    "/cultos",
    "/cultos/:path*",
    "/central-culto",
    "/central-culto/:path*",
    "/eventos",
    "/eventos/:path*",
    "/financeiro",
    "/financeiro/:path*",
    "/patrimonio",
    "/patrimonio/:path*",
    "/carteirinhas",
    "/carteirinhas/:path*",
    "/documentos",
    "/documentos/:path*",
    "/usuarios",
    "/usuarios/:path*",
    "/permissoes",
    "/permissoes/:path*",
    "/relatorios",
    "/relatorios/:path*",
    "/configuracoes",
    "/configuracoes/:path*",
    "/busca",
    "/busca/:path*",
    "/portal",
    "/portal/:path*",
    "/login",
    "/membro/:path*",
    "/carteirinha/:path*",
  ],
};
