import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    membroId?: string;
    adminId?: string;
    role?: "admin" | "membro";
    perfil?: string;
  }

  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: "admin" | "membro";
      adminId?: string;
      membroId?: string;
      perfil?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    membroId?: string;
    adminId?: string;
    role?: "admin" | "membro";
    perfil?: string;
  }
}
