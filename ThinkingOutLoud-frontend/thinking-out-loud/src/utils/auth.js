import { jwtDecode } from "jwt-decode";

export function isTokenExpired(token) {
  try {
    const decoded = jwtDecode(token);

    if (!decoded.exp) return true;

    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}