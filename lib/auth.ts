import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { authenticatePortalMembro } from "@/services/portal-auth.service";
import { authenticateAdmin } from "@/services/admin-auth.service";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "admin",
      name: "Administrador",
      credentials: {
        email: { label: "E-mail", type: "email" },
        senha: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.senha) return null;
        const admin = await authenticateAdmin(
          credentials.email,
          credentials.senha
        );
        if (!admin) return null;
        return {
          id: admin.id,
          name: admin.nome,
          email: admin.email,
          role: "admin",
          adminId: admin.id,
          perfil: admin.perfil,
          igrejaId: admin.igrejaId,
        };
      },
    }),
    CredentialsProvider({
      id: "membro-portal",
      name: "Portal do Membro",
      credentials: {
        identifier: { label: "CPF ou E-mail", type: "text" },
        senha: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.senha) return null;

        const membro = await authenticatePortalMembro(
          credentials.identifier,
          credentials.senha
        );
        if (!membro) return null;

        return {
          id: membro.id,
          name: membro.nomeCompleto,
          email: membro.email ?? undefined,
          role: "membro",
          membroId: membro.id,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7,
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        if ("role" in user && user.role === "admin") {
          token.role = "admin";
          token.adminId = user.adminId as string;
          token.perfil = user.perfil as string;
        }
        if ("membroId" in user && user.membroId) {
          token.role = "membro";
          token.membroId = user.membroId as string;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as "admin" | "membro" | undefined;
        session.user.adminId = token.adminId as string | undefined;
        session.user.membroId = token.membroId as string | undefined;
        session.user.perfil = token.perfil as string | undefined;
        session.user.igrejaId = token.igrejaId as string | null | undefined;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
