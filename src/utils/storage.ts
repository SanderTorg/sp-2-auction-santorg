import { clearProfileCache } from "../services/userApi";

const TOKEN_KEY = "token";
const USER_KEY = "user";

export function saveToken(token: any) {
  saveToStorage(TOKEN_KEY, token);
}

export function getToken(): string | null {
  return getFromStorage(TOKEN_KEY);
}

export function clearKey(key: string) {
  localStorage.removeItem(key);
}

export function saveUser(user: any) {
  saveToStorage(USER_KEY, user);
}

export function getUsernameStorage(): any | null {
  const user = getFromStorage(USER_KEY);
  return user ? user.name : null;
}

export function clearUser(): void {
  localStorage.removeItem(USER_KEY);
}

export function remvoveToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function removeUser(): void {
  localStorage.removeItem(USER_KEY);
}

export function logout() {
  remvoveToken();
  removeUser();
  clearProfileCache();
  window.location.href = "/login";
}

export function isLoggedIn(): boolean {
  return !!getToken();
}

export function saveToStorage(key: string, value: any) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getFromStorage(key: string) {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : null;
}

export function getUserData() {
  const foo = getFromStorage(USER_KEY);
  return foo;
}

export function isOwnProfile(profileName: string): boolean {
  const username = getUsernameStorage();
  return username === profileName;
}
