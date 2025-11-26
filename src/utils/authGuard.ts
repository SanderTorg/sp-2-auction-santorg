import { getToken } from "./storage";

export function requireAuth() {
  const token = getToken();

  if (!token) {
    window.location.href = "/login";
    return false;
  }

  return true;
}

export function redirectIfAuthenticated() {
  const token = getToken();
  if (token) {
    window.location.href = "/";
    return true;
  }
  return false;
}
