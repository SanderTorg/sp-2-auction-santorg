import { createHTML } from "../utils/utils";
import { loginUser } from "../services/authApi";
import { saveToken, saveUser } from "../utils/storage";
import { errorTemplate, successTemplate } from "../components/auth/Message";
import { animateSlideUp } from "../utils/animations";

export default async function LoginPage() {
  const template = loginPageTemplate();
  const html = createHTML(template);
  setTimeout(() => {
    setupLoginForm();
    animateSlideUp("#login-page > div");
  }, 0);
  return html;
}

function loginPageTemplate() {
  return `
    <section id="login-page" class="flex flex-col items-center gap-6 mx-auto my-auto max-w-md w-full px-4 justify-center">
      
      ${errorTemplate()}
      ${successTemplate()}

      <div class="w-full flex flex-col gap-6 bg-linear-to-r from-black to-gray-800 text-white rounded-2xl p-8 sm:p-12 shadow-xl">
        <h1 class="text-3xl font-bold text-center mb-2">Login</h1>
        
        <form id="js-login-form" class="flex flex-col gap-5 w-full">
          <div class="flex flex-col gap-2">
            <label for="email" class="font-semibold ml-1">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              placeholder="@stud.noroff.no" 
              class="w-full bg-white text-gray-900 border-none rounded-lg p-3.5 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-sm" 
              required 
            />
          </div>

          <div class="flex flex-col gap-2">
            <label for="password" class="font-semibold ml-1">Password</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              placeholder="Your password" 
              class="w-full bg-white text-gray-900 border-none rounded-lg p-3.5 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-sm" 
              required 
            />
          </div>

          <div class="flex flex-col items-center gap-2 mt-2">
            <button 
              type="submit" 
              class="w-full bg-red-600 text-white px-8 py-3.5 rounded-lg hover:bg-red-700 font-bold transition-all cursor-pointer shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Log In
            </button>
            
            <div class="flex gap-1 text-sm mt-2">
              <p class="text-gray-300">Don't have an account?</p>
              <a href="/register" class="text-white hover:text-red-400 font-semibold underline decoration-red-500">Register here</a>
            </div>
          </div>  
        </form>
      </div>
    </section>
  `;
}

async function handleLogin(event: Event) {
  event.preventDefault();

  const form = event.target as HTMLFormElement;
  const formData = new FormData(form);
  const submitButtonEl = form.querySelector(
    'button[type="submit"]',
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
