import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
    } & DefaultSession["user"]
    accessToken?: string 
  }

  interface User {
    id: string;
  }
}

declare module "next-auth/jwt" {
    interface JWT {
      uid: string;
      accessToken?: string;
    }
  }
  