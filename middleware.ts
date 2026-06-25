import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { AdminPerfil } from "@prisma/client";
import {
  isAdminPath,
  isPortalPath,
  isPublicPath,
} from "@/lib/admin-routes";
import {
  adminPerfilCanAccessPath,
  getAdminHomeRoute,
  isAdminPerfil,
} from "@/lib/admin-permissions";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    if (
      token?.role === "admin" &&
      token.perfil &&
      isAdminPerfil(token.perfil) &&
      isAdminPath(path) &&
      !adminPerfilCanAccessPath(token.perfil, path)
    ) {
      const home = getAdminHomeRoute(token.perfil as AdminPerfil);
      if (path !== home && !path.startsWith(`${home}/`)) {
        return NextResponse.redirect(new URL(home, req.url));
      }
    }

    return NextResponse.next();
  },
  {
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
  }
);

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
