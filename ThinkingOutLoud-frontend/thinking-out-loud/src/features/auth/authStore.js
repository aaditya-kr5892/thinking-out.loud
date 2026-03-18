import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  role: null,

  login: (user, token, role) => {
    localStorage.setItem("token", token);
    set({ user, token, role });
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null, role: null });
  }
}));