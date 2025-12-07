import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  saveToStorage,
  getFromStorage,
  saveToken,
  getToken,
  saveUser,
  getUsernameStorage,
  clearUser,
  removeToken,
} from "./storage";

describe("storage utilities", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("should save and retrieve data from localStorage", () => {
    const key = "testKey";
    const value = { foo: "bar" };

    saveToStorage(key, value);
    const retrieved = getFromStorage(key);

    expect(retrieved).toEqual(value);
  });

  it("should return null for non-existent key", () => {
    const retrieved = getFromStorage("nonExistentKey");
    expect(retrieved).toBeNull();
  });

  it("should save and retrieve token", () => {
    const token = "test-token-123";
    saveToken(token);
    expect(getToken()).toBe(token);
  });

  it("should save and retrieve user", () => {
    const user = { name: "John Doe", email: "john@example.com" };
    saveUser(user);

    const retrievedUser = getFromStorage("user");
    expect(retrievedUser).toEqual(user);
  });

  it("should get username from storage", () => {
    const user = { name: "Jane Doe" };
    saveUser(user);
    expect(getUsernameStorage()).toBe("Jane Doe");
  });

  it("should return null username if no user in storage", () => {
    expect(getUsernameStorage()).toBeNull();
  });

  it("should remove token", () => {
    saveToken("token-to-remove");
    removeToken();
    expect(getToken()).toBeNull();
  });

  it("should remove user", () => {
    saveUser({ name: "User to remove" });
    clearUser();
    expect(getFromStorage("user")).toBeNull();
  });
});
