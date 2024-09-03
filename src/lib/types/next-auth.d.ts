import "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    userId?: string;
  }

  interface User {
    id: string;
    email: string;
    accessToken: string;
    refreshToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    userId?: string;
  }
}
