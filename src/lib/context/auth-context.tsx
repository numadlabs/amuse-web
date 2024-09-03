import { createContext, useContext } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";

interface AuthContextType {
  session: any;
  status: "loading" | "authenticated" | "unauthenticated";
  onLogin: (email: string, password: string) => Promise<any>;
  onLogout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const onLogin = async (email: string, password: string) => {
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        return { error: true, msg: result.error };
      }

      router.push("/dashboard");
      return { error: false };
    } catch (error) {
      console.error("Login error:", error);
      return {
        error: true,
        msg: "An unexpected error occurred. Please try again.",
      };
    }
  };

  const onLogout = async () => {
    await signOut({ redirect: false });
    router.replace("/");
  };

  return (
    <AuthContext.Provider value={{ session, status, onLogin, onLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
