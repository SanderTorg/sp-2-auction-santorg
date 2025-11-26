const apiKey = "4cace437-0d3d-41b9-95b6-d5deb6a8d9d4";
const AUTH_URL = "https://v2.api.noroff.dev/auth";

export type RegisterForm = {
  name: string;
  email: string;
  password: string;
};

export type LoginForm = {
  email: string;
  password: string;
};

export async function registerUser(body: RegisterForm) {
  return fetch(`${AUTH_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify(body),
  });
}

export async function loginUser(body: LoginForm) {
  return fetch(`${AUTH_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify(body),
  });
}
