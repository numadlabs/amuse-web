// pages/api/auth/[...nextauth].ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import SERVER_SETTINGS from "@/lib/serverSettings";
// import SERVER_SETTINGS from "../../../serverSettings"

const BACKEND_URL = SERVER_SETTINGS.BACKEND_URL;

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await axios.post(`${BACKEND_URL}/api/login`, {
            email: credentials?.email,
            password: credentials?.password,
          });

          if (res.data && res.data.data && res.data.data.auth && credentials) {
            return {
              id: res.data.data.user.id,
              email: credentials.email,
              accessToken: res.data.data.auth.accessToken,
              refreshToken: res.data.data.auth.refreshToken,
              // restaurantId: res.data.data.user.restaurantId,
            };

          }
          return null;
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.userId = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.userId = token.userId;
      return session;
    },
  },
  pages: {
    signIn: "/",
    signOut: "/",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
});
