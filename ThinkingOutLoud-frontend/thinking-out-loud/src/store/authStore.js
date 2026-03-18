import { create } from "zustand";

export const useAuthStore = create((set) => ({
  token: null,
  username: null,
  role: null,

  login: (data) =>
    set({
      token: data.token,
      username: data.username,
      role: data.role
    }),

  logout: () =>
    set({
      token: null,
      username: null,
      role: null
    })
}));