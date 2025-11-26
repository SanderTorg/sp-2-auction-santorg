const TOKEN_KEY = "token";
const USER_KEY = "user";

//---- Utility functions for CREDITS management ----//

export function getCredits(): number {
  const credits = localStorage.getItem("userCredits");
  return credits ? parseInt(credits, 10) : 0;
}

export function saveCredits(credits: number): void {
  localStorage.setItem("userCredits", credits.toString());
}

//---- Existing utility functions for AUTH and USER management ----//

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

export function getUser(): any | null {
  const user = getFromStorage(USER_KEY);
  return user ? user.name : null;
}

export function clearUser(): void {
  localStorage.removeItem(USER_KEY);
}

export function clearStorage() {
  localStorage.clear();
}

export function logout() {
  clearStorage();
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
