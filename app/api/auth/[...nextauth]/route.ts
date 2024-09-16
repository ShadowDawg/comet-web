import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import { FirestoreAdapter } from "@next-auth/firebase-adapter";
import { firebaseAdminConfig, getFirebaseAdminApp } from "../../../../app/firebase-admin-config";
import { getAuth } from "firebase-admin/auth";

export const authOptions: NextAuthOptions = {
  providers: [
    {
      id: "firebase",
      name: "Firebase",
      type: "credentials",
      credentials: {},
      authorize: async (credentials) => {
        const { idToken } = credentials as { idToken: string };
        
        if (idToken) {
          try {
            const auth = getAuth(getFirebaseAdminApp());
            const decodedToken = await auth.verifyIdToken(idToken);
            const { uid, email, name, picture } = decodedToken;

            console.log("Decoded token:", { uid, email, name });

            return { id: uid, email, name, image: picture };
          } catch (error) {
            console.error("Error verifying Firebase ID token:", error);
            return null;
          }
        }

        console.log("No idToken provided");
        return null;
      },
    },
  ],
  adapter: FirestoreAdapter(firebaseAdminConfig),
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        token.uid = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.uid as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };