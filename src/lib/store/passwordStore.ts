import { create } from "zustand";
import { PasswordStore } from "../types/forgot-password-flow-types";

export const usePasswordStore = create<PasswordStore>((set) => ({
  email: "",
  verificationCode: "",
  password: "",
  setEmail: (email) => set({ email }),
  setVerificationCode: (verificationCode) => set({ verificationCode }),
  setPassword: (password) => set({ password }),
  reset: () => set({ email: "", verificationCode: "", password: "" }),
}));
