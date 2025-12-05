import { getToken, getApiKey } from "../utils/storage";

const BASE_API = "https://v2.api.noroff.dev";
interface ApiClientOptions {
  body?: any;
  headers?: Record<string, string>;
  [key: string]: any;
}

export async function apiClient(
  endpoint: string,
  options: ApiClientOptions = {}
) {
  const { body, ...customOptions } = options;

  const token = getToken();
  const apiKey = getApiKey();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (apiKey) {
    headers["X-Noroff-API-Key"] = apiKey;
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const url = endpoint.startsWith("http") ? endpoint : `${BASE_API}${endpoint}`;

  const config: RequestInit = {
    method: body ? "POST" : "GET",
    ...customOptions,
    headers: {
      ...headers,
      ...customOptions.headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.errors?.[0]?.message || "An API error occurred"
      );
    }
    if (response.status === 204) {
      return null;
    }
    return response.json();
  } catch (error) {
    console.error("API request error:", error);
    throw error;
  }
}

type Endpoint = string;

export const get = (endpoint: Endpoint) => apiClient(endpoint);
export const post = (endpoint: Endpoint, body: any) =>
  apiClient(endpoint, { body });
export const put = (endpoint: Endpoint, body: any) =>
  apiClient(endpoint, { method: "PUT", body });
export const del = (endpoint: Endpoint) =>
  apiClient(endpoint, { method: "DELETE" });
