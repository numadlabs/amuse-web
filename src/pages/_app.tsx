import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { AuthProvider } from "../lib/context/auth-context";
import AmuseWebAppSEO from "@/components/layout/seo-head";
import { SessionProvider } from "next-auth/react";
import { Analytics } from "@vercel/analytics/react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        if (error?.response?.status === 401) {
          return false; // Don't retry on 401 errors
        }
        return failureCount < 3;
      },
    },
  },
});

export default function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <AmuseWebAppSEO />
        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
      </QueryClientProvider>
      <Analytics />
    </SessionProvider>
  );
}
