import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { requireAuth, redirectIfAuthenticated } from "./authGuard";
import * as storage from "./storage";

vi.mock("./storage", () => ({
  getToken: vi.fn(),
}));

describe("authGuard", () => {
  const originalLocation = window.location;

  beforeEach(() => {
    delete (window as any).location;
    (window as any).location = { href: "" };
    vi.clearAllMocks();
  });

  afterEach(() => {
    originalLocation;
  });

  describe("requireAuth", () => {
    it("should return true if token exists", () => {
      vi.mocked(storage.getToken).mockReturnValue("valid-token");

      const result = requireAuth();

      expect(result).toBe(true);
      expect(window.location.href).toBe("");
    });

    it("should return false and redirect to /login if token does not exist", () => {
      vi.mocked(storage.getToken).mockReturnValue(null);

      const result = requireAuth();

      expect(result).toBe(false);
      expect(window.location.href).toBe("/login");
    });
  });

  describe("redirectIfAuthenticated", () => {
    it("should return true and redirect to / if token exists", () => {
      vi.mocked(storage.getToken).mockReturnValue("valid-token");

      const result = redirectIfAuthenticated();

      expect(result).toBe(true);
      expect(window.location.href).toBe("/");
    });

    it("should return false if token does not exist", () => {
      vi.mocked(storage.getToken).mockReturnValue(null);

      const result = redirectIfAuthenticated();

      expect(result).toBe(false);
      expect(window.location.href).toBe("");
    });
  });
});
