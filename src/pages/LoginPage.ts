import { createHTML } from "../utils/utils";
import { loginUser } from "../services/authApi";
import { saveToken, saveUser } from "../utils/storage";
import { errorTemplate, successTemplate } from "../components/auth/Message";

export default async function LoginPage() {
  const template = loginPageTemplate();
  const html = createHTML(template);
  setTimeout(() => setupLoginForm(), 0);
  return html;
}

function loginPageTemplate() {
  return `
    <section id="login-page" class="flex flex-col items-center gap-3 mx-auto my-auto max-w-md w-full">
      <h1 class="text-2xl font-bold flex text-center">Login to Your Account</h1>
      
      ${errorTemplate()}
      ${successTemplate()}

      <form id="js-login-form" class="flex flex-col gap-4 border p-6 rounded-lg shadow-md w-full ">
        <div class="flex flex-col relative">
          <label for="email" aria-label="Email" class="flex absolute -top-3 left-5 bg-white px-1 dark:bg-[#242424]">Email</label>
          <input type="email" id="email" name="email" placeholder="@stud.noroff.no" class="flex border pl-2 py-3 rounded-xl" required />
        </div>


        <div class="flex flex-col relative">
          <label for="password" aria-label="Password" class="flex absolute -top-3 left-5 bg-white px-1 dark:bg-[#242424]">Password</label>

          <input type="password" id="password" name="password" placeholder="Your password" class="flex border pl-2 py-3 rounded-xl" required />
        </div>

        <div class="flex flex-col items-center gap-1 min-[350px]:flex-row justify-center">
          <p class="text-center font-semibold">Don't have an account? </p>
          <a href="/register" class="hover:underline font-semibold">Register here</a>
        </div>  
        <button type="submit" class="flex p-4 justify-center items-center font-semibold text-white text-xl bg-[#101828]  border rounded-2xl cursor-pointer hover:bg-gray-800">LogIn</button>
      </form>
    </section>
  `;
}

async function handleLogin(event: Event) {
  event.preventDefault();

  const form = event.target as HTMLFormElement;
  const formData = new FormData(form);
  const submitButtonEl = form.querySelector(
    'button[type="submit"]'
  ) as HTMLButtonElement;

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    showError("Please fill in all required fields.");
    return;
  }

  if (submitButtonEl) {
    submitButtonEl.disabled = true;
    submitButtonEl.textContent = "Logging in...";
  }

  const loginData = {
    email,
    password,
  };

  try {
    const response = await loginUser(loginData);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.[0] || "Login failed");
    }

    if (data.data.accessToken) {
      saveToken(data.data.accessToken);
    }

    if (data.data) {
      saveUser(data.data);
      showSuccess("Login successful!");
    }

    if (data.data) {
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    }
  } catch (error) {
    showError("Login failed. Please check your credentials and try again.");
  } finally {
    if (submitButtonEl) {
      submitButtonEl.disabled = false;
      submitButtonEl.textContent = "LogIn";
    }
  }
}

export function showError(message: string) {
  const errorDiv = document.getElementById("js-show-error");
  if (errorDiv) {
    errorDiv.textContent = message;
    errorDiv.classList.remove("hidden");
  }
}

export function showSuccess(message: string) {
  const successDiv = document.getElementById("js-show-success");
  if (successDiv) {
    successDiv.textContent = message;
    successDiv.classList.remove("hidden");
  }
}

function setupLoginForm() {
  const loginFormEl = document.getElementById("js-login-form");
  if (loginFormEl) {
    loginFormEl.addEventListener("submit", handleLogin);
  }
}
