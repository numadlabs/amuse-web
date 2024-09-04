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
          const res = await axios.post(`${BACKEND_URL}/auth/login`, {
            email: credentials?.email,
            password: credentials?.password,
          });

          console.log("🚀 ~ authorize ~ res:", res.data.data);
          if (res.data && res.data.data && res.data.data.auth && credentials) {
            return {
              id: res.data.data.user.id,
              email: credentials.email,
              accessToken: res.data.data.auth.accessToken,
              refreshToken: res.data.data.auth.refreshToken,
              // restaurantId: res.data.data.user.restaurantId,
            };
          }
          // If the response doesn't contain the expected data
          throw new Error("Invalid credentials");
        } catch (error) {
          console.error("Authentication error:", error);

          // If it's an axios error with a response from the server
          if (axios.isAxiosError(error) && error.response) {
            // Use the error message from the API if available
            throw new Error(
              error.response.data.error || "Authentication failed"
            );
          }

          // For other types of errors
          throw new Error("An unexpected error occurred");
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
